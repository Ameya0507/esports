const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load models
const User = require('./models/User');
const PlayerProfile = require('./models/PlayerProfile');
const Team = require('./models/Team');
const Recruitment = require('./models/Recruitment');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/esportsconnect');

const importData = async () => {
  try {
    await User.deleteMany();
    await PlayerProfile.deleteMany();
    await Team.deleteMany();
    await Recruitment.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // Create Demo Users
    const users = await User.insertMany([
      { name: 'Ameya Palamwar', gamerTag: 'AMEX', email: 'ameya@test.com', password, role: 'player' },
      { name: 'Rahul Sharma', gamerTag: 'ShadowX', email: 'rahul@test.com', password, role: 'player' },
      { name: 'Arjun Singh', gamerTag: 'Viper', email: 'arjun@test.com', password, role: 'player' },
      { name: 'Priya Desai', gamerTag: 'Nova', email: 'priya@test.com', password, role: 'player' },
      { name: 'Vikram Mehta', gamerTag: 'Karthik', email: 'vikram@test.com', password, role: 'player' },
      { name: 'Rohan Gupta', gamerTag: 'Beast', email: 'rohan@test.com', password, role: 'player' },
    ]);

    // Create Profiles
    const profiles = await PlayerProfile.insertMany([
      {
        user: users[0]._id, game: 'Valorant', roles: ['Duelist'], rank: 'Immortal 1', region: 'India',
        experience: 'Semi-Pro', availability: 'Evenings', skills: ['Aim', 'Entry Fragging'],
        about: 'Aggressive Jett/Reyna main looking for a serious team.'
      },
      {
        user: users[1]._id, game: 'Valorant', roles: ['Controller'], rank: 'Ascendant 3', region: 'India',
        experience: 'Amateur', availability: 'Weekends', skills: ['Map Knowledge', 'Utility Usage'],
        about: 'Omen/Viper player focused on tactical setups.'
      },
      {
        user: users[2]._id, game: 'Valorant', roles: ['Initiator'], rank: 'Immortal 2', region: 'India',
        experience: 'Semi-Pro', availability: 'Anytime', skills: ['Communication', 'Game Sense'],
        about: 'Sova main with lineup knowledge for every map.'
      },
      {
        user: users[3]._id, game: 'BGMI', roles: ['IGL', 'Assaulter'], rank: 'Conqueror', region: 'India',
        experience: 'Professional', availability: 'Evenings', skills: ['IGL', 'Rotations', 'Aim'],
        about: 'Experienced IGL looking to lead a Tier 1 team.'
      },
      {
        user: users[4]._id, game: 'BGMI', roles: ['Sniper'], rank: 'Ace Dominator', region: 'India',
        experience: 'Amateur', availability: 'Afternoons', skills: ['Long-range Combat', 'Clutching'],
        about: 'Dedicated sniper. M24/AWM specialist.'
      }
    ]);

    // Create Team
    const team1 = await Team.create({
      name: 'Phoenix Esports',
      owner: users[0]._id,
      game: 'Valorant',
      region: 'India',
      competitiveLevel: 'Semi-Pro',
      about: 'A dedicated team aiming for VCT Challengers next year.',
      roster: [
        { player: users[0]._id, role: 'Duelist', isCaptain: true },
        { player: users[2]._id, role: 'Initiator', isCaptain: false }
      ],
      requiredRoles: [
        { role: 'Controller', priority: 'High' },
        { role: 'Sentinel', priority: 'Medium' }
      ]
    });

    // Create Recruitment Post
    await Recruitment.create({
      team: team1._id,
      title: 'Phoenix Esports LFP - Controller',
      description: 'We are looking for a dedicated Controller main who has great map knowledge and can coordinate with our Initiator for executes.',
      rolesNeeded: ['Controller'],
      requirements: {
        minRank: 'Ascendant',
        region: 'India',
        experience: 'Amateur+'
      }
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
