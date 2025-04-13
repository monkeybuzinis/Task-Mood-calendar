const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  description: String,
  emoji: String,
  color: String
});

module.exports = mongoose.model('Mood', moodSchema);
