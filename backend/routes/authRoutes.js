const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const multer = require('multer');

// 🔸 Import your User model
const User = require('../models/User'); // make sure this file exists

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

// 🔸 Routes
router.post('/register', upload.single("profilePic"), registerUser);
router.post('/login', loginUser);

// ✅ NEW ROUTE: Get all homemakers
router.get('/all', async (req, res) => {
  try {
    const homemakers = await User.find();

    res.status(200).json(homemakers);
  } catch (error) {
    console.error("Error fetching homemakers:", error);
    res.status(500).json({ message: "Server error fetching homemakers" });
  }
});

module.exports = router;