const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protectHomemaker } = require('../middleware/authMiddleware'); // ✅ import middleware

// ✅ Create order (only if homemaker is logged in)
router.post('/create', protectHomemaker, async (req, res) => {
  try {
    const { customerName, customerEmail, items, totalAmount } = req.body;
    const homemakerId = req.homemakerId; // ✅ Extracted from token

    if (!homemakerId) {
      return res.status(400).json({ message: 'Homemaker ID is missing. Please log in first.' });
    }

    const order = new Order({
      customerName,
      customerEmail,
      homemakerId,
      items,
      totalAmount
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
