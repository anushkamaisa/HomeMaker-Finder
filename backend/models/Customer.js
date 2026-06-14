// In models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true }, // Consider making this optional
  googleId: { type: String }, // Add this field
  picture: { type: String } // Add this field
});

module.exports = mongoose.model('Customer', customerSchema);