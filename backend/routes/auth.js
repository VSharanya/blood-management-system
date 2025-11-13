const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const router = express.Router();
const client = new OAuth2Client('REMOVED_SECRET');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, bloodGroup, contactNumber, city, location } = req.body;

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create and save new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      bloodGroup,
      contactNumber,
      city,
      location,
    });

    await user.save();
    console.log('✅ Registered user:', email);

    // ✅ Send proper JSON response
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to register user' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    res.json({ success: true, token });
  } else {
    res.json({ success: false });
  }
});

router.post('/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: 'REMOVED_SECRET'
    });
    const { name, email } = ticket.getPayload();
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, role: 'Recipient' });
      await user.save();
    }
    const jwtToken = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    res.json({ success: true, token: jwtToken });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.json({ success: false });
  }
});

module.exports = router;