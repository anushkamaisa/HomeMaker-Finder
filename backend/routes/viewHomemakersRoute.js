const express = require('express');
const router = express.Router();
const Homemaker = require('../models/Homemaker');

// GET all homemakers
router.get('/', async (req, res) => {
  try {
    const homemakers = await Homemaker.find();
    res.status(200).json(homemakers);
  } catch (error) {
    console.error("Error fetching homemakers:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST new homemaker (for testing/demo)
router.post('/', async (req, res) => {
  try {
    const { name, email, location, specialties } = req.body;

    const homemaker = new Homemaker({ name, email, location, specialties });
    await homemaker.save();

    res.status(201).json({ message: 'Homemaker added successfully', homemaker });
  } catch (error) {
    console.error("Error adding homemaker:", error);
    res.status(500).json({ message: 'Failed to add homemaker' });
  }
});

// Add these routes to your backend Express app

// Get homemaker by ID
router.get('/api/homemaker/:id', async (req, res) => {
  try {
    const homemaker = await Homemaker.findById(req.params.id);
    if (!homemaker) {
      return res.status(404).json({ message: 'Homemaker not found' });
    }
    res.json(homemaker);
  } catch (error) {
    console.error('Error fetching homemaker:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get products by homemaker ID
router.get('/api/homemaker/:id/products', async (req, res) => {
  try {
    const products = await Product.find({ homemakerId: req.params.id });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
