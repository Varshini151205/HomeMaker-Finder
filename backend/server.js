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
const User = require('./models/User');  // Assuming you have a User model for your database
const { OAuth2Client } = require('google-auth-library');  // Google OAuth library

// Import routes
const homemakerDashboardRoutes = require('./routes/homemakerDashboardRoutes'); 
const homemakerRoutes = require('./routes/homemakerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes');
const viewHomemakersRoute = require('./routes/viewHomemakersRoute');
const customerAuthRoutes = require('./routes/customerGoogleAuth');

dotenv.config();

const app = express();
const listEndpoints = require('express-list-endpoints');

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());  // Adds security-related HTTP headers

// Serve static profile pictures (e.g., for homemakers)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Optional: Log incoming requests for debugging purposes
app.use((req, res, next) => {
  console.log(`${req.method} request made to: ${req.path}`);
  next();
});

// Import Routes and set up API prefixes
app.use('/api/auth', homemakerRoutes);    // Homemaker signup/login
app.use('/api/orders', orderRoutes);      // Orders-related routes
app.use('/api/products', productRoutes);  // Product/menu routes
app.use('/api/homemaker', homemakerDashboardRoutes); // Homemaker dashboard routes
app.use('/api/customer-auth', customerRoutes); // Customer signup/login routes
app.use('/api/view-homemakers', viewHomemakersRoute);
app.use('/api/customer-auth/google', customerAuthRoutes);

// Google Sign-In Route for Signup
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/customer-auth/google-signup', async (req, res) => {
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
    let customer = await User.findOne({ email: payload.email });

    if (customer) {
      return res.status(400).json({ message: 'User already exists. Please login instead.' });
    }

    // Create a new customer from Google data
    customer = new User({
      name: payload.name,
      email: payload.email,
      password: Math.random().toString(36).slice(-8) + 'A1!',  // Random password
      phone: '', // Phone is required in your model, you can handle it differently
      googleId: payload.sub,
      picture: payload.picture  // Optional: Store Google profile picture
    });

    // Save customer to the database
    await customer.save();

    // Return success response
    res.status(201).json({
      message: 'Google signup successful',
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

// Forgot password route
app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No account found with that email." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry time
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
      subject: "Password Reset Request",
      text: `Click on the following link to reset your password: ${resetLink}`,
    });

    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error during forgot-password:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

// Reset password route
app.post("/api/auth/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password successfully updated." });
  } catch (error) {
    console.error("Error during reset-password:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB & Start Server
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();
