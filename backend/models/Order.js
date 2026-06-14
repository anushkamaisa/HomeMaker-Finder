const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  homemakerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Homemaker"
  },
  items: Array,
  total: Number,
  userDetails: {
    name: String,
    phone: String,
    address: String,
    instructions: String,
    paymentMethod: String
  },
  status: {
    type: String,
    enum: ["Placed", "Pending", "Preparing", "Delivered"],
    default: "Placed"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
