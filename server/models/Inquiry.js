const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'WasteListing', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  industry: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);