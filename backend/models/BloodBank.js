const mongoose = require('mongoose');

const bloodBankSchema = new mongoose.Schema({
  name: String,
  contactNumber: String,
  email: String,
  address: String,
  /*location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  }*/
});

//bloodBankSchema.index({ location: '2dsphere' });

const BloodBank = mongoose.model('BloodBank', bloodBankSchema);

module.exports = BloodBank;