const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: Array,
  total: Number,
  userDetails: {
    name: String,
    phone: String,
    address: String,
    instructions: String,
    paymentMethod: String
  },
  status: {
    type: String,
    default: "Placed"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
