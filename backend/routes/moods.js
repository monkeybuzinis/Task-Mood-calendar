const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');

// Get moods
router.get('/', async (req, res) => {
  try {
    const moods = await Mood.find();
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add mood
router.post('/', async (req, res) => {
  const mood = new Mood({
    date: req.body.date,
    level: req.body.level,
    description: req.body.description,
    emoji: req.body.emoji,
    color: req.body.color
  });

  try {
    const newMood = await mood.save();
    res.status(201).json(newMood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 