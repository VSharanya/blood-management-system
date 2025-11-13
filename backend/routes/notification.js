const express = require('express');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const User = require('../models/User');
const BloodBank = require('../models/BloodBank');

const router = express.Router();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'REMOVED_EMAIL',
    pass: 'REMOVED_SECRET' // Use an App Password if you have 2-Step Verification enabled
  }
});

// Configure Twilio
const twilioClient = twilio('REMOVED_SECRET', 'REMOVED_SECRET');

router.post('/notify', async (req, res) => {
  const { bloodGroup, lat, lng, city, address, radius } = req.body;
  let donors;
  let bloodBanks;

  if (lat && lng) {
    donors = await User.find({
      bloodGroup,
      availability: true,
      approved: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // radius in km
        }
      }
    });

    bloodBanks = await BloodBank.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // radius in km
        }
      }
    });
  } else if (city && address) {
    donors = await User.find({
      bloodGroup,
      availability: true,
      approved: true,
      city: new RegExp(city, 'i')
    });

    bloodBanks = await BloodBank.find({
      address: new RegExp(address, 'i')
    });
  }

  // Send email notifications
  donors.forEach(donor => {
    const mailOptions = {
      from: 'REMOVED_EMAIL',
      to: donor.email,
      subject: 'Emergency Blood Request',
      text: `Dear ${donor.name},\n\nWe have an urgent need for blood of your group (${donor.bloodGroup}). Please contact us if you are available to donate.\n\nThank you!`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  });

  // Send SMS notifications
  donors.forEach(donor => {
    twilioClient.messages.create({
      body: `Emergency Blood Request: We need blood of your group (${donor.bloodGroup}). Please contact us if you are available to donate.`,
      from: 'REMOVED_PHONE', // Replace with your Twilio phone number in E.164 format
      to: `+${donor.contactNumber}` // Ensure the phone number includes the country code in E.164 format
    }).then(message => console.log(message.sid)).catch(error => console.log(error));
  });

  res.json({ message: 'Notifications sent successfully' });
});

module.exports = router;