const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({

  

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
