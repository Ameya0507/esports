const mongoose = require('mongoose');

const PlayerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  game: {
    type: String,
    enum: ['Valorant', 'BGMI'],
    required: true
  },
  roles: {
    type: [String],
    required: true
  },
  rank: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    enum: ['Casual', 'Amateur', 'Semi-Pro', 'Professional'],
    default: 'Amateur'
  },
  availability: {
    type: String,
    default: 'Evenings / Weekends'
  },
  skills: {
    type: [String],
    default: []
  },
  about: {
    type: String,
    maxlength: 500,
    default: ''
  },
  socialLinks: {
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
    twitch: { type: String, default: '' }
  },
  completenessScore: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate profile completeness score before saving
PlayerProfileSchema.pre('save', function(next) {
  let score = 20; // Base score for having a profile
  if (this.game) score += 10;
  if (this.roles && this.roles.length > 0) score += 15;
  if (this.rank) score += 15;
  if (this.region) score += 10;
  if (this.experience) score += 10;
  if (this.skills && this.skills.length > 0) score += 10;
  if (this.about && this.about.length > 10) score += 5;
  
  if (this.socialLinks) {
    if (this.socialLinks.twitter) score += 2;
    if (this.socialLinks.youtube) score += 2;
    if (this.socialLinks.twitch) score += 1;
  }
  
  this.completenessScore = Math.min(score, 100);
  next();
});

module.exports = mongoose.model('PlayerProfile', PlayerProfileSchema);
