const Food = require('../models/Food');

// Controller function to add a new food item
const addFood = async (req, res) => {
  const { name, img, desc, price, homemakerId } = req.body;

  try {
    const newFood = new Food({
      name,
      img,
      desc,
      price,
      homemakerId,  // Store homemaker's id
    });

    await newFood.save();
    res.json({ success: true, foodItem: newFood });
  } catch (err) {
    console.error("Error adding food item:", err);
    res.status(500).json({ success: false, message: "Failed to add food item." });
  }
};

// Controller function to get all food items for a specific homemaker
const getFoodsByHomemaker = async (req, res) => {
  const { homemakerId } = req.params;

  try {
    const foods = await Food.find({ homemakerId });
    res.json(foods);
  } catch (err) {
    console.error("Error fetching foods:", err);
    res.status(500).json({ success: false, message: "Failed to fetch foods." });
  }
};

module.exports = { addFood, getFoodsByHomemaker };
