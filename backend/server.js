const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const startServer = async () => {
  await connectDB();

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // API routes
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/applications', require('./routes/applications'));
  app.use('/api/ai', require('./routes/ai'));

  // Serve frontend build in production from the same port
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
  }

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ message: 'InternTrack API is running' });
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();