const express = require('express');
const { getTeamRecommendations } = require('../controllers/matchingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/teams/:id/recommendations', protect, getTeamRecommendations);

module.exports = router;
