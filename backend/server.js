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

  // API status route for the backend service root
  app.get('/', (req, res) => {
    res.json({ service: 'InternTrack API', status: 'ok' });
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
