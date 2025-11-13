const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const donorRoutes = require('./routes/donor');
const notificationRoutes = require('./routes/notification');
const adminRoutes = require('./routes/admin');
const feedbackRoutes = require('./routes/feedback');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// ✅ Use environment variable for MongoDB URL (set in docker-compose)
const MONGO_URL = process.env.MONGO_URL || 'mongodb://admin:qwerty@mongodb:27017/blood_management?authSource=admin';


mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/auth', authRoutes);
app.use('/api', donorRoutes);
app.use('/api', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', feedbackRoutes);



// ✅ Listen on port 5000 and bind to 0.0.0.0 for Docker
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
