const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profiles', require('./routes/profileRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/recruitment', require('./routes/recruitmentRoutes'));
app.use('/api/matching', require('./routes/matchingRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
