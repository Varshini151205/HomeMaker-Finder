const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const Homemaker = require('../models/Homemaker');

// Ensure public/images folder exists
const uploadPath = path.join(__dirname, '../public/images');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer config for profile pic upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, GIF images are allowed.'));
    }
    cb(null, true);
  },
});

// =================== SIGNUP ===================
router.post('/signup', upload.single('profilePic'), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      cuisines,
      customCuisine,
      experience,
      dietaryPreferences,
    } = req.body;

    // Input validation
    if (!name || !validator.isEmail(email) || !validator.isMobilePhone(phone) || !password || !address) {
      return res.status(400).json({ message: 'Invalid input data.' });
    }

    const profilePic = req.file?.filename || null;

    // Check if homemaker already exists
    const existing = await Homemaker.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newHomemaker = new Homemaker({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      address,
      cuisines: Array.isArray(cuisines) ? cuisines : [cuisines],
      customCuisine,
      experience,
      dietaryPreferences: Array.isArray(dietaryPreferences) ? dietaryPreferences : [dietaryPreferences],
      profilePic,
    });

    await newHomemaker.save();
    res.status(201).json({ message: "Homemaker registered successfully" });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error during signup", error: err.message });
  }
});

// =================== LOGIN ===================
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts max
  message: 'Too many login attempts. Please try again later.',
});

router.post('/homemaker-login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!validator.isEmail(email) || !password) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const homemaker = await Homemaker.findOne({ email: email.toLowerCase() });

    if (!homemaker) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, homemaker.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: homemaker._id }, process.env.JWT_SECRET, {
      expiresIn: '1d', // 1 day
    });

    // ✅ Send token + homemaker info (with _id)
    res.status(200).json({
      token,
      homemaker: {
        _id: homemaker._id,
        name: homemaker.name,
        email: homemaker.email,
        phone: homemaker.phone,
        address: homemaker.address,
        profilePic: homemaker.profilePic,
        // you can send other fields too if needed
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
});

module.exports = router;
