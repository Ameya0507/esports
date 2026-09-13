const express = require('express');
const { getMyProfile, upsertProfile, getProfiles, getProfileByUserId } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', protect, getMyProfile);
router.post('/', protect, upsertProfile);
router.get('/', getProfiles);
router.get('/user/:user_id', getProfileByUserId);

module.exports = router;
