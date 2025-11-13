const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Add feedback
router.post('/feedback', async (req, res) => {
  const { userId, feedback, rating } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.feedback.push({ feedback, rating });
    await user.save();
    res.json({ message: 'Feedback added successfully' });
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ message: 'Failed to add feedback' });
  }
});

// Get feedback for a user
router.get('/feedback/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Failed to fetch feedback' });
  }
});

module.exports = router;