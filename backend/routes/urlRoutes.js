const express = require('express');
const router = express.Router();
const { shortenUrl, getUserUrls } = require('../controllers/urlController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/shorten', authMiddleware, shortenUrl);
router.get('/my-urls', authMiddleware, getUserUrls);

module.exports = router;