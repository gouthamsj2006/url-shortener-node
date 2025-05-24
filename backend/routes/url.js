const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const Url = require('../models/Url.js');
const auth = require('../middlewares/authMiddleware.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

// Create short URL
router.post('/shorten', authMiddleware, async (req, res) => {
  const { originalUrl } = req.body;

  try {
    const shortId = shortid.generate();

    const newUrl = new Url({
      userId: req.user.id,
      originalUrl,
      shortId
    });

    await newUrl.save();

    res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Redirect short URL to original URL
router.get('/:shortId', async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId });
    if (!url) return res.status(404).json({ message: 'URL not found' });

    return res.redirect(url.originalUrl);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get all URLs for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user.id });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
