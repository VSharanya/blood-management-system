const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Add feedback
router.post('/feedback', async (req, res) => {
  const { userId, feedback, rating } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.feedback.push({ feedback, rating });
  await user.save();
  res.json({ message: 'Feedback added successfully' });
});

// Get feedback for a user
router.get('/feedback/:userId', async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user.feedback);
});

module.exports = router;