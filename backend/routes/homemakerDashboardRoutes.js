// routes/homemakerDashboardRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Homemaker = require('../models/Homemaker');

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Protected route for homemaker dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const homemaker = await Homemaker.findById(req.user.id);
    if (!homemaker) {
      return res.status(404).json({ message: "Homemaker not found" });
    }
    res.json({
      token: token, // jwt token
      homemaker: homemaker, // full homemaker object containing _id
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching homemaker data" });
  }
});

module.exports = router;
