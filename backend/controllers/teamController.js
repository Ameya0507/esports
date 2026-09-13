const Team = require('../models/Team');

// @desc    Create a team
// @route   POST /api/teams
// @access  Private
exports.createTeam = async (req, res) => {
  try {
    const { name, game, region, competitiveLevel, about, requiredRoles, playstylePreferences } = req.body;

    const team = await Team.create({
      name,
      game,
      region,
      competitiveLevel,
      about,
      owner: req.user.id,
      roster: [{ player: req.user.id, role: 'Captain', isCaptain: true }],
      requiredRoles: requiredRoles || [],
      playstylePreferences: playstylePreferences || []
    });

    res.status(201).json({ success: true, data: team });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Team name already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all teams
// @route   GET /api/teams
// @access  Public
exports.getTeams = async (req, res) => {
  try {
    let queryStr = JSON.stringify(req.query);
    const teams = await Team.find(JSON.parse(queryStr)).populate('owner', ['name', 'gamerTag']);
    res.status(200).json({ success: true, count: teams.length, data: teams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Public
exports.getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('owner', ['name', 'gamerTag'])
      .populate('roster.player', ['name', 'gamerTag', 'email']);

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    res.status(200).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private
exports.updateTeam = async (req, res) => {
  try {
    let team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Make sure user is team owner
    if (team.owner.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this team' });
    }

    team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
