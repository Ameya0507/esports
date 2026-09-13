const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  game: {
    type: String,
    enum: ['Valorant', 'BGMI'],
    required: true
  },
  region: {
    type: String,
    required: true
  },
  competitiveLevel: {
    type: String,
    enum: ['Casual', 'Amateur', 'Semi-Pro', 'Professional'],
    default: 'Amateur'
  },
  about: {
    type: String,
    maxlength: 500,
    default: ''
  },
  roster: [
    {
      player: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      role: {
        type: String,
        required: true
      },
      isCaptain: {
        type: Boolean,
        default: false
      }
    }
  ],
  requiredRoles: [
    {
      role: { type: String, required: true },
      priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'High' }
    }
  ],
  playstylePreferences: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Team', TeamSchema);
