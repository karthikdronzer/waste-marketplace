const mongoose = require('mongoose');

const wasteListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  wasteType: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  pricePerUnit: { type: Number, required: true },
  location: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['available', 'sold'], default: 'available' },
}, { timestamps: true });

module.exports = mongoose.model('WasteListing', wasteListingSchema);