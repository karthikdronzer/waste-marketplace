const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const WasteListing = require('../models/WasteListing');
const authMiddleware = require('../middleware/auth');

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

router.get('/received', authMiddleware, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ industry: req.user.id })
      .populate('listing', 'title')
      .populate('buyer', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/sent', authMiddleware, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ buyer: req.user.id })
      .populate('listing', 'title')
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Industry accepts or declines an inquiry they received
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or declined' });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

    if (inquiry.industry.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only respond to your own inquiries' });
    }

    inquiry.status = status;
    await inquiry.save();
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;