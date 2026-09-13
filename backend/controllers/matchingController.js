const Team = require('../models/Team');
const PlayerProfile = require('../models/PlayerProfile');

// @desc    Get recommendations for a team based on missing roles
// @route   GET /api/matching/teams/:id/recommendations
// @access  Private
exports.getTeamRecommendations = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    // 1. Identify missing roles (requested roles that are not filled in roster)
    const rosterRoles = team.roster.map(member => member.role);
    const missingRoles = team.requiredRoles
      .filter(req => !rosterRoles.includes(req.role))
      .map(req => req.role);

    if (missingRoles.length === 0) {
      return res.status(200).json({ success: true, data: [], message: 'Team has no missing roles' });
    }

    // 2. Find players who play the required game and have AT LEAST ONE of the missing roles
    const candidates = await PlayerProfile.find({
      game: team.game,
      roles: { $in: missingRoles }
    }).populate('user', ['name', 'gamerTag']);

    // 3. Score the candidates
    const scoredCandidates = candidates.map(candidate => {
      let score = 0;
      let scoreBreakdown = {
        role: 0, rank: 0, playstyle: 0, availability: 0, region: 0, experience: 0
      };

      // Role Compatibility: 30%
      const matchRole = candidate.roles.some(r => missingRoles.includes(r));
      if (matchRole) {
        score += 30;
        scoreBreakdown.role = 30;
      }

      // Rank Compatibility: 20% (Simple substring/exact match for MVP)
      // Example: 'Immortal' matches 'Immortal'
      if (candidate.rank && team.competitiveLevel) {
        // In a real app we'd map ranks to numbers, but for MVP we give score if competitive levels align vaguely
        // or just give partial credit. Let's give 20 if they have a rank.
        score += 20;
        scoreBreakdown.rank = 20;
      }

      // Playstyle Compatibility: 15% (Skills matching team playstyle preference)
      let playstyleMatches = 0;
      if (team.playstylePreferences && team.playstylePreferences.length > 0) {
        team.playstylePreferences.forEach(pref => {
          if (candidate.skills.includes(pref)) playstyleMatches++;
        });
        const playstyleScore = Math.min((playstyleMatches / team.playstylePreferences.length) * 15, 15);
        score += playstyleScore;
        scoreBreakdown.playstyle = Math.round(playstyleScore);
      } else {
        // Default give half if team has no prefs
        score += 7;
        scoreBreakdown.playstyle = 7;
      }

      // Availability: 15%
      if (candidate.availability) {
        score += 15; // Placeholder logic: Assume available
        scoreBreakdown.availability = 15;
      }

      // Region: 10%
      if (candidate.region.toLowerCase() === team.region.toLowerCase()) {
        score += 10;
        scoreBreakdown.region = 10;
      } else {
        score += 5; // Close region
        scoreBreakdown.region = 5;
      }

      // Experience: 10%
      if (candidate.experience === team.competitiveLevel) {
        score += 10;
        scoreBreakdown.experience = 10;
      } else {
        score += 5;
        scoreBreakdown.experience = 5;
      }

      // Remove candidate from pool if they are already in the team
      const isInTeam = team.roster.some(member => member.player.toString() === candidate.user._id.toString());
      if (isInTeam) return null;

      return {
        profile: candidate,
        totalScore: Math.round(score),
        scoreBreakdown,
        bestRoleMatch: candidate.roles.find(r => missingRoles.includes(r))
      };
    }).filter(c => c !== null); // Remove nulls

    // Sort by total score descending
    scoredCandidates.sort((a, b) => b.totalScore - a.totalScore);

    res.status(200).json({
      success: true,
      missingRoles,
      data: scoredCandidates.slice(0, 10) // Top 10 recommendations
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
