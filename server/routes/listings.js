const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const WasteListing = require('../models/WasteListing');
const authMiddleware = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');

const upload = multer({ storage: multer.memoryStorage() });

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'waste-marketplace' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'industry') {
      return res.status(403).json({ message: 'Only industry accounts can post waste listings' });
    }

    const { title, description, wasteType, quantity, unit, pricePerUnit, location } = req.body;

    let imageUrl = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const newListing = new WasteListing({
      title, description, wasteType, quantity, unit, pricePerUnit, location,
      imageUrl,
      postedBy: req.user.id,
    });

    await newListing.save();
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { wasteType, location, minPrice, maxPrice } = req.query;
    const filter = { status: 'available' };
    if (wasteType) filter.wasteType = wasteType;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.pricePerUnit = {};
      if (minPrice) filter.pricePerUnit.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerUnit.$lte = Number(maxPrice);
    }
    const listings = await WasteListing.find(filter).populate('postedBy', 'name email');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const listing = await WasteListing.findById(req.params.id).populate('postedBy', 'name email');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const listing = await WasteListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own listings' });
    }
    Object.assign(listing, req.body);
    await listing.save();
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const listing = await WasteListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own listings' });
    }
    await listing.deleteOne();
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;