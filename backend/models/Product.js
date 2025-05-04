const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  homemakerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Homemaker',
    required: true,
  },
  img: { type: String }, // optional if you add image support later
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
