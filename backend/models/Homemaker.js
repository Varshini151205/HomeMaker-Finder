const mongoose = require('mongoose');

const homemakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // ✅ This is necessary
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: String,
  cuisines: [String],
  customCuisine: String,
  experience: String,
  dietaryPreferences: [String],
  profilePic: String,
});

module.exports = mongoose.model('Homemaker', homemakerSchema);
