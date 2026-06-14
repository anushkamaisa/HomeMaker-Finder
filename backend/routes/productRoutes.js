const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");
const auth = require("../middleware/auth"); // Assuming you have auth middleware

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

// GET /api/products - Get all products for universal menu
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("homemakerId", "name profilePic address");
    res.json({ products });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ message: "Failed to fetch all products" });
  }
});

// POST /api/products - Add a new product
router.post("/", auth, upload.single("img"), async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const homemakerId = req.user.id; // Get ID from authenticated user
    const imgPath = req.file ? `/uploads/${req.file.filename}` : "";

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const newProduct = new Product({
      name,
      price,
      category,
      homemakerId,
      imgPath,
      img: imgPath,
      description
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/products/homemaker - Get all products for logged-in homemaker 
router.get("/homemaker", auth, async (req, res) => {
  try {
    const homemakerId = req.user.id;
    const products = await Product.find({ homemakerId });
    res.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// GET /api/products/homemaker/:id - Get all products for specific homemaker
router.get("/homemaker/:id", async (req, res) => {
  try {
    const homemakerId = req.params.id;
    const products = await Product.find({ homemakerId });
    res.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// PUT /api/products/:id - Update a product
router.put("/:id", auth, upload.single("img"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.price = req.body.price;
    product.name = req.body.name;
    product.category = req.body.category;

    if (req.file) {
      product.img = `/uploads/${req.file.filename}`;
    }

    await product.save();

    console.log("Successfully updated"); // This will now execute
    return res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Update failed:", error);
    return res.status(500).json({ message: "Server error while updating product" });
  }
});



// DELETE /api/products/:id - Delete a product
router.delete("/:id", auth, async (req, res) => {
  try {
    const productId = req.params.id;
    const homemakerId = req.user.id;
    
    // Find and delete the product only if it belongs to this homemaker
    const deletedProduct = await Product.findOneAndDelete({ 
      _id: productId, 
      homemakerId 
    });
    
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found or you don't have permission to delete" });
    }
    
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;