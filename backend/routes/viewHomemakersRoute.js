const express = require('express');
const router = express.Router();
const Homemaker = require('../models/Homemaker');

// GET all homemakers
router.get('/', async (req, res) => {
  try {
    const homemakers = await Homemaker.find();
    res.status(200).json(homemakers);
  } catch (error) {
    console.error("Error fetching homemakers:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST new homemaker (for testing/demo)
router.post('/', async (req, res) => {
  try {
    const { name, email, location, specialties } = req.body;

    const homemaker = new Homemaker({ name, email, location, specialties });
    await homemaker.save();

    res.status(201).json({ message: 'Homemaker added successfully', homemaker });
  } catch (error) {
    console.error("Error adding homemaker:", error);
    res.status(500).json({ message: 'Failed to add homemaker' });
  }
});

module.exports = router;
