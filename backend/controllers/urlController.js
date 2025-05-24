const Url = require('../models/Url');
const generateCode = require('../utils/generateShortCode');

exports.shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;
  const shortId = generateCode();

  try {
    const newUrl = await Url.create({
      originalUrl,
      shortId,
      userId: req.user.id,  // assuming req.user.id comes from your auth middleware
    });

    // Send back the full shortened URL
    res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortId}` });
  } catch (err) {
    console.error('Error in shortenUrl:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.redirect = async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.code });
    if (!url) return res.status(404).json({ msg: 'URL not found' });

    // Optionally: track clicks or analytics here if needed

    res.redirect(url.originalUrl);
  } catch (err) {
    console.error('Error in redirect:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getUserUrls = async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user.id });
    res.json(urls);
  } catch (err) {
    console.error('Error in getUserUrls:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
