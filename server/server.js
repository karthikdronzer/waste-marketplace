const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const listingRoutes = require('./routes/listings');
app.use('/api/listings', listingRoutes);
const inquiryRoutes = require('./routes/inquiries');
app.use('/api/inquiries', inquiryRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Waste Marketplace API is running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});