const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');

// Get all moods
router.get('/', async (req, res) => {
  try {
    const moods = await Mood.find();
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new mood
router.post('/', async (req, res) => {
  const mood = new Mood({
    date: req.body.date,
    level: req.body.level,
    color: req.body.color
  });

  try {
    const newMood = await mood.save();
    res.status(201).json(newMood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a mood
router.put('/:id', async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);
    if (mood) {
      mood.date = req.body.date || mood.date;
      mood.level = req.body.level || mood.level;
      mood.color = req.body.color || mood.color;
      
      const updatedMood = await mood.save();
      res.json(updatedMood);
    } else {
      res.status(404).json({ message: 'Mood not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a mood
router.delete('/:id', async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);
    if (mood) {
      await mood.remove();
      res.json({ message: 'Mood deleted' });
    } else {
      res.status(404).json({ message: 'Mood not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 