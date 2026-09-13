const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  roleApplied: {
    type: String,
    required: true
  },
  message: {
    type: String,
    maxlength: 300
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

const RecruitmentSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rolesNeeded: {
    type: [String],
    required: true
  },
  requirements: {
    minRank: String,
    region: String,
    experience: String
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open'
  },
  applications: [ApplicationSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recruitment', RecruitmentSchema);
