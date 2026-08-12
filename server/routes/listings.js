const express = require('express');
const router = express.Router();
const WasteListing = require('../models/WasteListing');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'industry') {
      return res.status(403).json({ message: 'Only industry accounts can post waste listings' });
    }

    const { title, description, wasteType, quantity, unit, pricePerUnit, location } = req.body;

    const newListing = new WasteListing({
      title, description, wasteType, quantity, unit, pricePerUnit, location,
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

    if (wasteType) {
      filter.wasteType = wasteType;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' }; // case-insensitive partial match
    }

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


module.exports = router;