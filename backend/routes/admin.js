const express = require('express');
const User = require('../models/User');
const BloodBank = require('../models/BloodBank');

const router = express.Router();

// Approve donor registration
router.put('/approve-donor/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.approved = true;
  await user.save();
  res.json({ message: 'Donor approved successfully' });
});

// Add or update blood bank details
router.post('/blood-bank', async (req, res) => {
  const { id, name, contactNumber, email, address, location } = req.body;
  let bloodBank;
  if (id) {
    bloodBank = await BloodBank.findById(id);
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank not found' });
    }
    Object.assign(bloodBank, { name, contactNumber, email, address, location });
  } else {
    bloodBank = new BloodBank({ name, contactNumber, email, address, location });
  }
  await bloodBank.save();
  res.json({ message: 'Blood bank details saved successfully' });
});

// Get all users
router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get all blood banks
router.get('/blood-banks', async (req, res) => {
  const bloodBanks = await BloodBank.find();
  res.json(bloodBanks);
});

// Generate reports
router.get('/reports', async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalDonors = await User.countDocuments({ role: 'Donor' });
  const totalRecipients = await User.countDocuments({ role: 'Recipient' });
  const totalBloodBanks = await BloodBank.countDocuments();
  const totalDonations = await User.aggregate([{ $group: { _id: null, total: { $sum: "$donations" } } }]);

  res.json({
    totalUsers,
    totalDonors,
    totalRecipients,
    totalBloodBanks,
    totalDonations: totalDonations[0] ? totalDonations[0].total : 0
  });
});

module.exports = router;