const Homemaker = require('../models/Homemaker');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { name, email, password, location, phone } = req.body;

  try {
    const existing = await Homemaker.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const homemaker = await Homemaker.create({ name, email, password: hashedPassword, location, phone });

    res.status(201).json({ message: "Signup successful", homemaker });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const homemaker = await Homemaker.findOne({ email });
    if (!homemaker) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, homemaker.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: homemaker._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: "Login successful", token, homemaker });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
