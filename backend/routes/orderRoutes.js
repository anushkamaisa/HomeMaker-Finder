const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// ✅ Create Order
router.post('/', async (req, res) => {
  try {
    const { homemakerId, items, total, userDetails } = req.body;

    if (!homemakerId || !items || items.length === 0 || !total || !userDetails) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = new Order({
      homemakerId,
      items,
      total,
      userDetails,
      status: "Placed",
      createdAt: new Date()
    });

    await order.save();

    res.status(201).json({ message: 'Order created', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Get All Orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Get Homemaker Orders
router.get('/homemaker/:id', async (req, res) => {
  try {
    const orders = await Order.find({ homemakerId: req.params.id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Update Order Status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Placed", "Pending", "Preparing", "Delivered"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;