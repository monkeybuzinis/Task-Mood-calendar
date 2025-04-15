const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');

// Get all moods
router.get('/', async (req, res) => {
  try {
    const moods = await Mood.find();
    res.json(moods);
  } catch (error) {
    console.error('Error fetching moods:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new mood
router.post('/', async (req, res) => {
  console.log('POST /moods - Received request body:', req.body);
  
  try {
    // Validate required fields
    const requiredFields = ['date', 'level', 'description', 'emoji', 'color'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields,
        receivedData: req.body
      });
    }

    // Parse and validate date
    const date = new Date(req.body.date);
    console.log('Parsed date:', date);
    
    if (isNaN(date.getTime())) {
      console.log('Invalid date format:', req.body.date);
      return res.status(400).json({
        message: 'Invalid date format',
        receivedDate: req.body.date
      });
    }

    // Log the mood level being received
    console.log('Received mood level:', req.body.level);
    console.log('Mood level type:', typeof req.body.level);
    console.log('Mood level length:', req.body.level.length);
    console.log('Mood level characters:', Array.from(req.body.level).map(c => c.charCodeAt(0)));

    // Create new mood
    const mood = new Mood({
      date,
      level: req.body.level,
      description: req.body.description,
      emoji: req.body.emoji,
      color: req.body.color
    });

    console.log('Created mood object:', mood);

    // Validate the mood object
    const validationError = mood.validateSync();
    if (validationError) {
      console.log('Validation error:', validationError);
      return res.status(400).json({
        message: 'Validation error',
        error: validationError.message,
        details: validationError.errors
      });
    }

    const savedMood = await mood.save();
    console.log('Successfully saved mood:', savedMood);
    res.status(201).json(savedMood);
  } catch (error) {
    console.error('Error creating mood:', error);
    res.status(400).json({
      message: 'Error creating mood',
      error: error.message,
      details: error.errors || error
    });
  }
});

// Update a mood
router.put('/:id', async (req, res) => {
  try {
    console.log('Updating mood with data:', req.body);
    
    const mood = await Mood.findById(req.params.id);
    if (!mood) {
      return res.status(404).json({ message: 'Mood not found' });
    }

    // Update all fields from the request body
    mood.date = new Date(req.body.date);
    mood.level = req.body.level;
    mood.description = req.body.description;
    mood.emoji = req.body.emoji;
    mood.color = req.body.color;

    console.log('Updated mood data:', mood);

    const updatedMood = await mood.save();
    console.log('Successfully updated mood:', updatedMood);
    res.json(updatedMood);
  } catch (error) {
    console.error('Error updating mood:', error);
    res.status(400).json({ 
      message: error.message,
      error: error,
      receivedData: req.body
    });
  }
});

// Delete a mood
router.delete('/:id', async (req, res) => {
  try {
    console.log('Attempting to delete mood with ID:', req.params.id);
    
    const mood = await Mood.findById(req.params.id);
    if (!mood) {
      console.log('Mood not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Mood not found' });
    }

    console.log('Found mood to delete:', mood);
    await Mood.findByIdAndDelete(req.params.id);
    console.log('Successfully deleted mood');
    res.json({ message: 'Mood deleted successfully' });
  } catch (error) {
    console.error('Error deleting mood:', error);
    res.status(500).json({ 
      message: 'Error deleting mood',
      error: error.message
    });
  }
});

module.exports = router; 