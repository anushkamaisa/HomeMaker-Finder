const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const { OAuth2Client } = require('google-auth-library');

// Models
const User = require('./models/User');
const Customer = require('./models/Customer');
const Homemaker = require('./models/Homemaker');
const Product = require('./models/Product');

// Routes
const homemakerDashboardRoutes = require('./routes/homemakerDashboardRoutes');
const homemakerRoutes = require('./routes/homemakerRoutes');
const adminRoutes = require('./routes/adminRoutes');   // ✅ keep this
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes');
const viewHomemakersRoute = require('./routes/viewHomemakersRoute');
const aiRoutes = require('./routes/aiRoutes.js');
const customerAuthRoutes = require('./routes/customerGoogleAuth');
const calorieSuggestionRoute = require('./routes/calorieSuggestionRoute');

dotenv.config();

const app = express();   // ✅ MUST come before app.use

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Static folders
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set("Access-Control-Allow-Origin", "*");
  }
}));

// Debug logging
app.use((req, res, next) => {
  console.log(`${req.method} request made to: ${req.path}`);
  next();
});

// ✅ ROUTES (Correct Order)
app.use('/api/auth', homemakerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/homemaker', homemakerDashboardRoutes);
app.use('/api/customer-auth', customerRoutes);
app.use('/api/view-homemakers', viewHomemakersRoute);
app.use('/api/admin', adminRoutes);   // ✅ FIXED POSITION
app.use('/api/ai', aiRoutes);
app.use('/api/customer-auth/google', customerAuthRoutes);
app.use('/api', calorieSuggestionRoute);



// Google Auth
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/customer-auth/google-signup', async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    let customer = await User.findOne({ email: payload.email });

    if (customer) {
      return res.status(400).json({ message: 'User already exists' });
    }

    customer = new User({
      name: payload.name,
      email: payload.email,
      password: Math.random().toString(36).slice(-8) + 'A1!',
      phone: '',
      googleId: payload.sub,
      picture: payload.picture
    });

    await customer.save();

    res.status(201).json({
      message: 'Google signup successful',
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Google auth failed' });
  }
});

// Forgot Password
app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "No account found" });

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset",
      text: resetLink,
    });

    res.json({ message: "Reset link sent" });

  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

// Reset Password
app.post("/api/auth/reset-password/:token", async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password updated" });

  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log("🚀 Server running");
    });

  } catch (err) {
    console.error(err);
  }
};

connectDB();