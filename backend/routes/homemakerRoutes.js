const express = require("express");
const Homemaker = require("../models/Homemaker");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const validator = require("validator");
const rateLimit = require("express-rate-limit");
const router = express.Router();

// Ensure public/images folder exists
const uploadPath = path.join(__dirname, "../public/images");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer config for profile pic upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, GIF images are allowed."));
    }
    cb(null, true);
  },
});

// =================== SIGNUP ===================
router.post("/signup", upload.single("profilePic"), async (req, res) => {
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
    if (
      !name ||
      !validator.isEmail(email) ||
      !validator.isMobilePhone(phone) ||
      !password ||
      !address
    ) {
      return res.status(400).json({ message: "Invalid input data." });
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
      dietaryPreferences: Array.isArray(dietaryPreferences)
        ? dietaryPreferences
        : [dietaryPreferences],
      profilePic,
    });
    console.log("Homemaker saved:", newHomemaker);
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
  max: 100, // 5 attempts max
  message: "Too many login attempts. Please try again later.",
});

router.post("/homemaker-login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!validator.isEmail(email) || !password) {
      return res.status(400).json({ message: "Invalid credentials." });
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
      expiresIn: "1d", // 1 day
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
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
});

// =================== VIEW HOMEMAKERS ===================
router.get("/", async (req, res) => {
  const { city, cuisine } = req.query;

  try {
    const query = {};
    if (city) query.address = { $regex: city, $options: "i" }; // case-insensitive search for city
    if (cuisine) query.cuisines = { $in: [cuisine] };

    // Fetch homemakers based on query parameters
    const homemakers = await Homemaker.find(query);

    if (!homemakers.length) {
      console.log("No homemakers found");
      return res.status(404).json({ message: "No homemakers found matching your criteria." });
    }

    console.log("Homemakers found:", homemakers);
    res.json(homemakers);
  } catch (error) {
    console.error("Error fetching homemakers:", error);
    res.status(500).json({ message: "Error fetching homemakers", error: error.message });
  }
});

// =================== VIEW SPECIFIC HOMEMAKER ===================
router.get("/:id", async (req, res) => {
  try {
    const homemaker = await Homemaker.findById(req.params.id);
    if (!homemaker) {
      return res.status(404).json({ message: "Homemaker not found" });
    }
    res.json(homemaker);
  } catch (error) {
    console.error("Error fetching homemaker profile:", error);
    res.status(500).json({ message: "Server error fetching homemaker" });
  }
});

// =================== UPDATE BIO / PROFILE ===================
const auth = require("../middleware/auth");
router.put("/profile/:id", auth, async (req, res) => {
  try {
    const homemaker = await Homemaker.findById(req.params.id);
    if (!homemaker) {
      return res.status(404).json({ message: "Homemaker not found" });
    }

    if (req.body.bio !== undefined) {
      homemaker.bio = req.body.bio;
    }

    await homemaker.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating homemaker bio:", error);
    res.status(500).json({ message: "Server error updating bio" });
  }
});

module.exports = router;
