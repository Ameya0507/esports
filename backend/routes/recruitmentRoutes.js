const express = require('express');
const { createRecruitment, getRecruitments, applyToRecruitment } = require('../controllers/recruitmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getRecruitments)
  .post(protect, createRecruitment);

router.post('/:id/apply', protect, applyToRecruitment);

module.exports = router;
