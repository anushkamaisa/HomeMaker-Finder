const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  homemakerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Homemaker',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  category: String,
  imageUrl: String, // For storing image URLs
  img: String      // Keeping the original field for backward compatibility
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);