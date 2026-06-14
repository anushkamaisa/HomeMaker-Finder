const mongoose = require("mongoose");

const homemakerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  address: String,
  cuisines: [String],
  customCuisine: String,
  experience: String,
  dietaryPreferences: [String],
  profilePic: String,
  bio: String,
});

module.exports = mongoose.model("Homemaker", homemakerSchema);
