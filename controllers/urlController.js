const Url = require('../models/Url');
const generateCode = require('../utils/generateShortCode');

exports.shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;
  const shortCode = generateCode();

  try {
    const newUrl = await Url.create({
      originalUrl,
      shortCode,
      owner: req.user.id,
    });

    res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}` });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.redirect = async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    if (!url) return res.status(404).json({ msg: 'URL not found' });

    // Update click count and log basic analytics
    url.clicks++;
    url.clickData.push({
      timestamp: new Date(),
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });
    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getUserUrls = async (req, res) => {
  const urls = await Url.find({ owner: req.user.id });
  res.json(urls);
};
