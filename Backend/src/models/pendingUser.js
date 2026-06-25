const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  verificationString: {
    type: String,
    required: true
  },

  attempts: {
    type: Number,
    default: 0
  },

  resendCount: {
    type: Number,
    default: 0
  },

  verificationStringUpdatedAt: {
    type: Date,
    default: Date.now,
    expires:360
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);