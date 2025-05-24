const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    shortId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    clickData: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        userAgent: {
          type: String,
          default: '',
        },
        ip: {
          type: String,
          default: '',
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Url', urlSchema);
