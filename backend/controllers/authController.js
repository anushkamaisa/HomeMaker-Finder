const Homemaker = require('../models/Homemaker');

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      cuisines,
      customCuisine,
      experience,
      dietaryPreferences,
    } = req.body;

    // ✅ Check for existing user
    const existingUser = await Homemaker.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered. Please use another email." });
    }

    // ✅ Get uploaded file name
    const profilePic = req.file?.filename || null;

    // ✅ Create new homemaker
    const newHomemaker = new Homemaker({
      name,
      email,
      password,
      phone,
      address,
      cuisines: Array.isArray(cuisines) ? cuisines : [cuisines],
      customCuisine,
      experience,
      dietaryPreferences: Array.isArray(dietaryPreferences) ? dietaryPreferences : [dietaryPreferences],
      profilePic,
    });

    await newHomemaker.save();
    res.status(201).json({ message: "Homemaker registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during signup", error: err.message });
  }
};

const loginUser = async (req, res) => {
  // login logic here
};

module.exports = { registerUser, loginUser };
