const Post = require('../models/Post');

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
      author: req.user.id,
      content: req.body.content
    });

    const populatedPost = await Post.findById(post._id).populate('author', ['name', 'gamerTag']);
    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('author', ['name', 'gamerTag']);
    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like or Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    // Check if post has already been liked
    const index = post.likes.findIndex(like => like.user.toString() === req.user.id);

    if (index === -1) {
      post.likes.push({ user: req.user.id }); // Like
    } else {
      post.likes.splice(index, 1); // Unlike
    }

    await post.save();
    res.status(200).json({ success: true, data: post.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
