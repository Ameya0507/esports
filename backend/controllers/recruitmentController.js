const Recruitment = require('../models/Recruitment');
const Team = require('../models/Team');

// @desc    Create a recruitment post
// @route   POST /api/recruitment
// @access  Private
exports.createRecruitment = async (req, res) => {
  try {
    const { teamId, title, description, rolesNeeded, requirements } = req.body;

    // Check if team exists and user is owner
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    if (team.owner.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to create recruitment for this team' });
    }

    const recruitment = await Recruitment.create({
      team: teamId,
      title,
      description,
      rolesNeeded,
      requirements
    });

    res.status(201).json({ success: true, data: recruitment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all recruitment posts
// @route   GET /api/recruitment
// @access  Public
exports.getRecruitments = async (req, res) => {
  try {
    const recruitments = await Recruitment.find({ status: 'Open' }).populate({
      path: 'team',
      select: 'name game region competitiveLevel logo'
    });
    res.status(200).json({ success: true, count: recruitments.length, data: recruitments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply to a recruitment post
// @route   POST /api/recruitment/:id/apply
// @access  Private
exports.applyToRecruitment = async (req, res) => {
  try {
    const { roleApplied, message } = req.body;
    const recruitment = await Recruitment.findById(req.params.id);

    if (!recruitment) {
      return res.status(404).json({ success: false, message: 'Recruitment post not found' });
    }

    // Check if already applied
    const alreadyApplied = recruitment.applications.find(
      app => app.player.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'You have already applied to this post' });
    }

    recruitment.applications.push({
      player: req.user.id,
      roleApplied,
      message
    });

    await recruitment.save();
    res.status(200).json({ success: true, data: recruitment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
