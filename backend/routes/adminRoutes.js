const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Homemaker = require("../models/Homemaker");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

// Admin Login
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

// Admin Stats
router.post("/stats", async (req, res) => {
  try {
    const totalUsers = await Customer.countDocuments();
    const totalHomemakers = await Homemaker.countDocuments();
    const totalFoodItems = await Product.countDocuments();

    res.json({
      totalUsers,
      totalHomemakers,
      totalFoodItems
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// Get all Homemakers with dish count
router.get("/homemakers", async (req, res) => {
  try {
    const homemakers = await Homemaker.find().select("-password");
    
    // Enrich with product count
    const enrichedHomemakers = await Promise.all(
      homemakers.map(async (hm) => {
        const dishCount = await Product.countDocuments({ homemakerId: hm._id });
        return {
          ...hm.toObject(),
          dishCount
        };
      })
    );

    res.json(enrichedHomemakers);
  } catch (error) {
    console.error("Error fetching homemakers:", error);
    res.status(500).json({ message: "Error fetching homemakers" });
  }
});

// Delete Homemaker and their products
router.delete("/homemaker/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete Homemaker
    const deletedHomemaker = await Homemaker.findByIdAndDelete(id);
    if (!deletedHomemaker) {
      return res.status(404).json({ message: "Homemaker not found" });
    }

    // Delete associated products
    await Product.deleteMany({ homemakerId: id });

    res.json({ message: "Homemaker and their dishes deleted successfully" });
  } catch (error) {
    console.error("Error deleting homemaker:", error);
    res.status(500).json({ message: "Error deleting homemaker" });
  }
});

module.exports = router;