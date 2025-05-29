const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

const userRoutes = require('./routes/auth');
const urlRoutes = require('./routes/urlRoutes');

// Import the URL model for redirecting
const Url = require('./models/Url'); // Make sure this path is correct

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

// Handle short URL redirects like /abc123 - MUST BE LAST SPECIFIC ROUTE
app.get('/:shortId', async (req, res, next) => {
  try {
    const shortId = req.params.shortId;
    
    // Skip if it's a known route or static file
    if (['api', 'main', 'favicon.ico', 'css', 'js', 'images'].includes(shortId)) {
      return next(); // Pass to next handler instead of 404
    }
    
    console.log('Looking for shortId:', shortId); // Debug log
    
    // Check if shortId exists in database
    const entry = await Url.findOne({ shortId: shortId });

    if (!entry) {
      console.log('Short URL not found in database:', shortId); // Debug log
      console.log('Available URLs in DB:'); // Debug - show what's in DB
      const allUrls = await Url.find({}, 'shortId originalUrl');
      console.log(allUrls);
      return res.status(404).send(`Short URL "${shortId}" not found`);
    }

    console.log('Found entry:', entry); // Debug log
    console.log('Redirecting to:', entry.originalUrl); // Debug log
    
    // Ensure URL has protocol
    let redirectUrl = entry.originalUrl;
    if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
      redirectUrl = 'https://' + redirectUrl;
    }
    
    res.redirect(redirectUrl);
  } catch (err) {
    console.error('Error during redirect:', err);
    console.error('Error details:', err.message);
    res.status(500).send('Server error: ' + err.message);
  }
});

// 404 for unknown routes - MOVED TO END
app.use((req, res) => {
  console.log('404 handler reached for:', req.url); // Debug log
  res.status(404).json({ message: 'URL not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});