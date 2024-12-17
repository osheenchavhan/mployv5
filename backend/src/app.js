/**
 * Main Application File
 * 
 * This is the heart of our backend server. It:
 * 1. Sets up our Express server
 * 2. Connects all our routes
 * 3. Handles errors
 * 4. Starts listening for requests
 * 
 * Think of this as the main control center where everything comes together.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Initialize Firebase
const { initializeFirebase } = require('./config/firebase');
initializeFirebase();

// Import routes
const jobsRouter = require('./routes/jobs');
const profilesRouter = require('./routes/profiles');

// Initialize express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/jobs', jobsRouter); // Job-related routes
app.use('/api/profile', profilesRouter); // Profile-related routes

// Basic route for testing
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ 
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
