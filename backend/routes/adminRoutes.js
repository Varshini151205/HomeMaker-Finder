const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@gmail.com" && password === "admin123") {
    
    const token = jwt.sign(
      { role: "admin", email: email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Admin login success",
      token: token
    });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

module.exports = router;