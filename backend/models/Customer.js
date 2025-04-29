const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,  // This ensures that email must be unique
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
