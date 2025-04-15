const mongoose = require('mongoose');

// Define mood levels as a constant
const MOOD_LEVELS = {
  VERY_HAPPY: 'Very Happy',
  HAPPY: 'Happy',
  NEUTRAL: 'Neutral',
  SAD: 'Sad',
  ANGRY: 'Angry'
};

const moodSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: Object.values(MOOD_LEVELS),
    validate: {
      validator: function(value) {
        return Object.values(MOOD_LEVELS).includes(value);
      },
      message: props => `Invalid mood level: ${props.value}. Must be one of: ${Object.values(MOOD_LEVELS).join(', ')}`
    }
  },
  description: {
    type: String,
    required: true
  },
  emoji: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
});

// Add pre-save middleware to log the mood level
moodSchema.pre('save', function(next) {
  console.log('Pre-save mood level:', this.level);
  console.log('Pre-save mood level type:', typeof this.level);
  console.log('Pre-save mood level length:', this.level.length);
  next();
});

module.exports = mongoose.model('Mood', moodSchema);
