const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();


const userRoutes = require('./routes/auth');
const urlRoutes = require('./routes/urlRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', userRoutes);  // Register/Login APIs
app.use('/api/url', urlRoutes);    // URL shortener APIs

// Serve all static frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login/login.html'));
});

app.get('/main', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/main/urlshortener.html'));
});

// 404 for unknown API routes
app.use((req, res) => {
  res.status(404).json({ message: 'URL not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});