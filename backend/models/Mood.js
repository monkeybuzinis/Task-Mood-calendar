const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['Great', 'Good', 'Neutral', 'Bad', 'Terrible']
  },
  description: String,
  emoji: String,
  color: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Mood', moodSchema);
