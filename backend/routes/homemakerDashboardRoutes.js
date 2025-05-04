const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth"); // JWT middleware
const HomemakerController = require("../controllers/homemakerController");

// All routes below require homemaker authentication
router.use(authenticate);

// Product Management
router.get("/products", HomemakerController.getProductsByHomemaker);
router.post("/products", HomemakerController.addProduct);
router.put("/products/:id", HomemakerController.updateProduct);
router.delete("/products/:id", HomemakerController.deleteProduct);

// Homemaker Profile
router.get("/profile", HomemakerController.getHomemakerProfile);

module.exports = router;
