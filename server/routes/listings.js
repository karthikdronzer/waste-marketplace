const express = require('express');
const router = express.Router();
const WasteListing = require('../models/WasteListing');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  try {
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
    const listings = await WasteListing.find({ status: 'available' }).populate('postedBy', 'name email');
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