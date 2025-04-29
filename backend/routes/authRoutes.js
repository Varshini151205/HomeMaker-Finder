const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const multer = require('multer');

// 🔸 Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// 🔸 Apply multer middleware only to /register
router.post('/register', upload.single("profilePic"), registerUser);
router.post('/login', loginUser);

module.exports = router;
