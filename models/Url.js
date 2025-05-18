const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalUrl: { type: String, required: true },
  shortId: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Url', urlSchema);
