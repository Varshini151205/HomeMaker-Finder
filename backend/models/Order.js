const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: String,
  homemakerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Homemaker'
  },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  status: {
    type: String,
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
