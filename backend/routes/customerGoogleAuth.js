const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcrypt'); // To hash passwords
const router = express.Router();
const Customer = require('../models/Customer'); // Your customer model

// Initialize the Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Sign-In route
router.post('/google-signup', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    // Get user payload from the token
    const payload = ticket.getPayload();
    
    // Check if user already exists
    let customer = await Customer.findOne({ email: payload.email });
    
    if (customer) {
      // User already exists, handle this case
      return res.status(400).json({ message: 'User already exists. Please login instead.' });
    }
    
    // Generate a random password or handle this differently
    const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8) + 'A1!', 10);

    // Create new customer from Google data
    customer = new Customer({
      name: payload.name,
      email: payload.email,
      password: hashedPassword, // Store hashed password
      phone: '', // You can leave this blank or ask the user to provide it
      googleId: payload.sub, // Store Google ID for future reference
      picture: payload.picture, // Optional: store profile picture URL
    });
    
    // Save the customer to the database
    await customer.save();
    
    // Return success response
    res.status(201).json({ 
      message: 'Google signup successful',
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
      }
    });
    
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

module.exports = router;
