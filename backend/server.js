const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const startServer = async () => {
  await connectDB();

  const app = express();
  const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');

  // Middleware
  app.use(cors());
  app.use(express.json());

  // API routes
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/applications', require('./routes/applications'));
  app.use('/api/ai', require('./routes/ai'));

  // API status route for the backend service root
  app.get('/', (req, res, next) => {
    if (process.env.NODE_ENV === 'production' && fs.existsSync(frontendDist)) {
      return next();
    }

    res.json({ service: 'InternTrack API', status: 'ok' });
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', (req, res) => {
    res.status(404).json({ message: `API route not found: ${req.originalUrl}` });
  });

  if (process.env.NODE_ENV === 'production' && fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));

    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
