const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BloodBank = require('../models/BloodBank');

const router = express.Router();

router.get('/donor', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, 'secret');
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching donor data:', err);
    res.sendStatus(401);
  }
});

router.get('/search/donors', async (req, res) => {
  const { bloodGroup, lat, lng, city } = req.query;
  let donors;
  if (lat && lng) {
    donors = await User.find({
      bloodGroup,
      availability: true,
      approved: true, // Only include approved donors
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 10000 // 10 km radius
        }
      }
    });
  } else if (city) {
    donors = await User.find({
      bloodGroup,
      availability: true,
      approved: true, // Only include approved donors
      city: new RegExp(city, 'i')
    });
  }
  res.json(donors);
});

router.get('/search/bloodbanks', async (req, res) => {
  const { city, lat, lng } = req.query;
  let bloodBanks;
  if (lat && lng) {
    bloodBanks = await BloodBank.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 10000 // 10 km radius
        }
      }
    });
  } else if (city) {
    bloodBanks = await BloodBank.find({
      city: new RegExp(city, 'i')
    });
  }
  res.json(bloodBanks);
});

module.exports = router;