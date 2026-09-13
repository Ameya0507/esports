const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    
    if (receiverId === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot send a message to yourself' });
    }

    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get messages between current user and another user
// @route   GET /api/messages/:userId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    // Mark received messages as read
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user.id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
