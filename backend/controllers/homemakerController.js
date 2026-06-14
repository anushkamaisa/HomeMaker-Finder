const Product = require("../models/Product");
const Homemaker = require("../models/Homemaker");

// Fetch all products added by this homemaker
exports.getProductsByHomemaker = async (req, res) => {
  try {
    const products = await Product.find({ homemaker: req.user.id });
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  const { name, description, price, category, image } = req.body;

  try {
    const product = new Product({
      homemaker: req.user.id,
      name,
      description,
      price,
      category,
      image,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Could not add product" });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image } = req.body;

  try {
    const updated = await Product.findOneAndUpdate(
      { _id: id, homemaker: req.user.id },
      { name, description, price, category, image },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Could not update product" });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Product.findOneAndDelete({
      _id: id,
      homemaker: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Could not delete product" });
  }
};

// Get Homemaker Profile
exports.getHomemakerProfile = async (req, res) => {
  try {
    const homemaker = await Homemaker.findById(req.user.id).select("-password");
    if (!homemaker) {
      return res.status(404).json({ message: "Homemaker not found" });
    }

    res.status(200).json(homemaker);
  } catch (err) {
    console.error("Error fetching homemaker profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};
