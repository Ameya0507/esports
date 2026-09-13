const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    }
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      text: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);
