const express = require('express');
const axios = require('axios');
require('dotenv').config();  // Load environment variables from .env file
const router = express.Router();

// Retrieve the OpenAI API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Route to get calorie suggestion
router.post('/api/suggest-calories', async (req, res) => {
    const { foodItem } = req.body;  // Get the food item from frontend request body

    // If food item is not provided, return an error
    if (!foodItem) {
        return res.status(400).json({ error: 'Food item is required.' });
    }

    try {
        // Request calorie information from OpenAI API
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: 'text-davinci-003',  // Use the appropriate OpenAI model
                prompt: `Provide the approximate calorie count for the food item: ${foodItem}`,
                max_tokens: 50,
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Extract calorie info from the response
        const calories = response.data.choices[0].text.trim();
        res.json({ calories });  // Send the calorie information back to the frontend
    } catch (error) {
        // If an error occurs during the API request, log it and send an error response
        console.error('Error fetching calories:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch calorie information.' });
    }
});

module.exports = router;
