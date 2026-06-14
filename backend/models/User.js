const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['customer', 'homemaker'], default: 'customer' },
  location: String,
  homemakerProfile: {
    cuisine: String,
    bio: String,
    availability: Boolean,
    rating: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('User', userSchema);
