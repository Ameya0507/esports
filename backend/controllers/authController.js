const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'placeholder');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, gamerTag, email, password, role, primaryGame } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { gamerTag }] });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with that email or gamer tag' });
    }

    // Create user
    const user = await User.create({
      name,
      gamerTag,
      email,
      password,
      role,
      primaryGame: primaryGame || 'Valorant'
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Log user out / clear cookie (if we were using cookies)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.status(200).json({ success: true, data: {} });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d' // Hardcoded to prevent Render parsing errors
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      gamerTag: user.gamerTag,
      email: user.email,
      role: user.role
    }
  });
};
// @desc    Google Auth Login / Register
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res) => {
  try {
    const { token, gamerTag, primaryGame, role } = req.body;
    
    // Verify the Google JWT token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || 'placeholder'
    });
    
    const { email, name } = ticket.getPayload();
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      // User exists, log them in
      return sendTokenResponse(user, 200, res);
    }
    
    // User doesn't exist, we must create them.
    // They must provide gamerTag, primaryGame, and role from the frontend popup.
    if (!gamerTag || !primaryGame) {
      return res.status(400).json({ success: false, message: 'Please provide Gamer Tag and Primary Game' });
    }

    // Ensure gamer tag isn't taken
    const gamerTagExists = await User.findOne({ gamerTag });
    if (gamerTagExists) {
      return res.status(400).json({ success: false, message: 'Gamer Tag is already taken' });
    }

    user = await User.create({
      name,
      email,
      gamerTag,
      primaryGame,
      role: role || 'player',
      password: Math.random().toString(36).slice(-10) + 'A1!' // Random secure password since they login via Google
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Google authentication failed' });
  }
};
