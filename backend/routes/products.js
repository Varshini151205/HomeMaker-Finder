// routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const { name, img, price, category, homemakerId } = req.body;

    const newProduct = new Product({
      name,
      img,
      price,
      category,
      homemakerId,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
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

module.exports = router; // ✅ must export router
