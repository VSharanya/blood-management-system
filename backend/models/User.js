const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  feedback: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Donor', 'Recipient'], required: true },
  bloodGroup: { type: String }, // Only required for Donors
  contactNumber: { type: String }, // Only required for Donors
  city: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
  },
  availability: { type: Boolean, default: true }, // For Donors
  donations: { type: Number, default: 0 }, // For Donors
  upcomingDonations: { type: Date }, // For Donors
  approved: { type: Boolean, default: false }, // For Donors
  feedback: [feedbackSchema],
  
  // New fields for Donors
  age: { type: Number, min: 18 }, // Donors must be adults
  height: { type: Number }, // Height in cm
  weight: { type: Number }, // Weight in kg
  medicalHistory: { type: String }, // Details of past medical conditions
});

userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);

module.exports = User;
