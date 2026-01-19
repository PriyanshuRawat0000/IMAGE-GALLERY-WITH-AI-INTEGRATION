const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({

  imageId: {
    type: String,
    required: true,
    unique: true
  },

  cloudinaryId: {
    type: String,
    required: true
  },

  url: {
    type: String,
    required: true
  },

  title: {
    type: String,
    default: ''
  },

  dateCreated: {
    type: Date,
    default: Date.now
  },

  type: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free'
  },

  price: {
    type: Number,
    default: 0
  },

  downloadCount: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Image', imageSchema);
