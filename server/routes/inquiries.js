const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const WasteListing = require('../models/wastelisting');
const authMiddleware = require('../middleware/auth');

// Buyer sends interest on a listing
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can send inquiries' });
    }

    const { listingId, message } = req.body;
    const listing = await WasteListing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const inquiry = new Inquiry({
      listing: listing._id,
      buyer: req.user.id,
      industry: listing.postedBy,
      message,
    });

    await inquiry.save();
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Industry views inquiries they've received
router.get('/received', authMiddleware, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ industry: req.user.id })
      .populate('listing', 'title')
      .populate('buyer', 'name email phone');
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Buyer views inquiries they've sent
router.get('/sent', authMiddleware, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ buyer: req.user.id })
      .populate('listing', 'title');
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;