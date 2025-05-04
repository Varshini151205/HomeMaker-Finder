const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure 'uploads/' folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST /api/products
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { name, price, category, homemakerId } = req.body;
    const imgPath = req.file ? `/uploads/${req.file.filename}` : "";

    if (!name || !price || !category || !homemakerId || !imgPath) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({
      name,
      price,
      category,
      homemakerId,
      imgPath,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added", product: newProduct });
  } catch (error) {
    console.error("Error in adding product:", error);
    res.status(500).json({ message: "Server error" });
  }

});
// GET /api/products/homemaker/:id
router.get("/homemaker/:id", async (req, res) => {
  try {
    const homemakerId = req.params.id;
    const products = await Product.find({ homemakerId });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

module.exports = router;
