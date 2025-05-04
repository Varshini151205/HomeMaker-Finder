const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product'); // Adjust based on where your Product model is located

// Create uploads directory if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Save files in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp as filename
  },
});

// File upload handling (Multer)
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, JPG, and PNG files are allowed.'));
  },
});

// POST route to handle food data submission
router.post("/", upload.single('img'), async (req, res) => {
  try {
    // Log received data for debugging
    console.log("Received food data:", req.body);
    console.log("Received file data:", req.file);

    // Extract data from the body and file
    const { name, price, category, homemakerId } = req.body;
    const img = req.file ? req.file.path : null; // Handle the image file path

    // Check if all required fields are provided
    if (!name || !price || !category || !homemakerId) {
      return res.status(400).json({ error: "Missing required fields: name, price, category, homemakerId." });
    }

    // Validate category
    const validCategories = ['Vegetarian', 'Non-Vegetarian', 'Seafood', 'Snacks', 'Sweets', 'Sambar', 'Roti'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category. Please choose from Vegetarian, Non-Vegetarian, Seafood, Snacks, Sweets, Sambar, Roti." });
    }

    // Validate price (ensure it's a number and greater than 0)
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ error: "Invalid price. Price must be a positive number." });
    }

    // Create a new product and save it to the database
    const newProduct = new Product({
      name,
      img,
      price,
      category,
      homemakerId,
    });

    const savedProduct = await newProduct.save(); // Save the product to DB

    console.log("Product saved:", savedProduct);  // Log saved product for verification

    // Send a successful response
    res.status(201).json({
      message: "Product added successfully!",
      product: savedProduct,
    });
  } catch (err) {
    console.error("Error adding product:", err);

    // Handle file upload or general errors
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to add product. Please try again later." });
  }
});

module.exports = router;
