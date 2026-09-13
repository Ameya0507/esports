const PlayerProfile = require('../models/PlayerProfile');

// @desc    Get current user profile
// @route   GET /api/profiles/me
// @access  Private
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await PlayerProfile.findOne({ user: req.user.id }).populate('user', ['name', 'gamerTag']);

    if (!profile) {
      return res.status(404).json({ success: false, message: 'There is no profile for this user' });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or update user profile
// @route   POST /api/profiles
// @access  Private
exports.upsertProfile = async (req, res) => {
  try {
    const {
      game, roles, rank, region, experience, availability, skills, about, socialLinks
    } = req.body;

    // Build profile object
    const profileFields = {
      user: req.user.id,
      game, roles, rank, region, experience, availability, skills, about, socialLinks
    };

    let profile = await PlayerProfile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await PlayerProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.status(200).json({ success: true, data: profile });
    }

    // Create
    profile = new PlayerProfile(profileFields);
    await profile.save();

    res.status(201).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all profiles
// @route   GET /api/profiles
// @access  Public
exports.getProfiles = async (req, res) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Finding resource
    query = PlayerProfile.find(JSON.parse(queryStr)).populate('user', ['name', 'gamerTag']);

    // Execute query
    const profiles = await query;

    res.status(200).json({ success: true, count: profiles.length, data: profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get profile by user ID
// @route   GET /api/profiles/user/:user_id
// @access  Public
exports.getProfileByUserId = async (req, res) => {
  try {
    const profile = await PlayerProfile.findOne({ user: req.params.user_id }).populate('user', ['name', 'gamerTag']);

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
