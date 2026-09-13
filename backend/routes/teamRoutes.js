const express = require('express');
const { createTeam, getTeams, getTeam, updateTeam } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getTeams)
  .post(protect, createTeam);

router.route('/:id')
  .get(getTeam)
  .put(protect, updateTeam);

module.exports = router;
