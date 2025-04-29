const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  homemakerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Homemaker',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  category: String,
  imageUrl: String // optional if you add image support later
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
