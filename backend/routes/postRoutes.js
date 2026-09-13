const express = require('express');
const { createPost, getPosts, likePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.put('/:id/like', protect, likePost);

module.exports = router;
