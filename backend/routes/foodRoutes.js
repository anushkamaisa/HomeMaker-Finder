const express = require('express');
const { addFood, getFoodsByHomemaker } = require('../controllers/foodController');
const router = express.Router();

// Route for adding a new food item
router.post('/foods', addFood);

// Route for fetching all food items for a specific homemaker
router.get('/foods/homemaker/:homemakerId', getFoodsByHomemaker);

module.exports = router;
