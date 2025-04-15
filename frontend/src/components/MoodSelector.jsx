import React, { useState, useEffect } from 'react';
import './MoodSelector.css';
import api from '../api';

const MoodSelector = ({ selectedMood, onMoodSelect, date }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moods, setMoods] = useState([
    { emoji: '😄', level: 'Very Happy', description: 'Vibrant, energetic, joyful', color: '#FFD700' },
    { emoji: '🙂', level: 'Happy', description: 'Warm and cheerful', color: '#FFA500' },
    { emoji: '😐', level: 'Neutral', description: 'Balanced, calm, impartial', color: '#C0C0C0' },
    { emoji: '😕', level: 'Sad', description: 'Heavy, empty, somber', color: '#000000' },
    { emoji: '😠', level: 'Angry', description: 'Intense, passionate, strong emotion', color: '#B22222' }
  ]);

  const handleMoodSelect = async (mood) => {
    try {
      if (date) {
        // Format the date to ISO string and remove time component
        const formattedDate = new Date(date);
        formattedDate.setHours(0, 0, 0, 0);

        console.log('Selected mood:', mood);
        console.log('Mood level:', mood.level);
        console.log('Mood level type:', typeof mood.level);

        // Ensure mood level is properly formatted
        const formattedMood = {
          ...mood,
          level: mood.level // Use the exact level from the mood object
        };

        console.log('Formatted mood:', formattedMood);

        const moodData = {
          date: formattedDate.toISOString(),
          level: formattedMood.level,
          description: formattedMood.description,
          emoji: formattedMood.emoji,
          color: formattedMood.color
        };

        console.log('Sending mood data:', moodData);

        // Check if mood exists for this date
        const response = await api.get(`/moods?date=${formattedDate.toISOString()}`);
        const existingMood = response.data.find(m => new Date(m.date).toDateString() === date.toDateString());

        if (existingMood) {
          // Update existing mood
          console.log('Updating existing mood:', existingMood._id);
          const updateResponse = await api.put(`/moods/${existingMood._id}`, moodData);
          console.log('Update response:', updateResponse.data);
        } else {
          // Create new mood
          console.log('Creating new mood');
          const createResponse = await api.post('/moods', moodData);
          console.log('Create response:', createResponse.data);
        }

        onMoodSelect(formattedMood);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving mood:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      alert('Failed to save mood. Please try again.');
    }
  };

  const handleClearMood = async () => {
    try {
      if (date) {
        // Format the date to ISO string and remove time component
        const formattedDate = new Date(date);
        formattedDate.setHours(0, 0, 0, 0);

        // Check if mood exists for this date
        const response = await api.get(`/moods?date=${formattedDate.toISOString()}`);
        const existingMood = response.data.find(m => new Date(m.date).toDateString() === date.toDateString());

        if (existingMood) {
          // Delete existing mood
          await api.delete(`/moods/${existingMood._id}`);
        }

        onMoodSelect(null);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error clearing mood:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to clear mood. Please try again.');
    }
  };

  return (
    <>
      <button 
        className="mood-trigger-button"
        onClick={() => setIsModalOpen(true)}
        style={{
          backgroundColor: selectedMood ? selectedMood.color : 'white',
          color: selectedMood ? 'white' : 'inherit',
          transition: 'all 0.3s ease'
        }}
      >
        {selectedMood ? (
          <div className="selected-mood">
            <span className="mood-emoji">{selectedMood.emoji}</span>
            <span className="mood-text">
              {selectedMood.level} - {selectedMood.description}
            </span>
          </div>
        ) : (
          "How are you feeling today?"
        )}
      </button>

      {isModalOpen && (
        <div className="mood-modal-overlay">
          <div className="mood-modal">
            <div className="mood-modal-header">
              <h3>Select Your Mood</h3>
              <button 
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="mood-grid">
              {moods.map((mood) => (
                <button
                  key={mood.level}
                  className={`mood-button ${selectedMood?.level === mood.level ? 'selected' : ''}`}
                  onClick={() => handleMoodSelect(mood)}
                  style={{
                    '--mood-color': mood.color,
                    borderColor: mood.color
                  }}
                >
                  <span className="mood-emoji">{mood.emoji}</span>
                  <div className="mood-info">
                    <span className="mood-level">{mood.level}</span>
                    <span className="mood-description">{mood.description}</span>
                  </div>
                </button>
              ))}
              {selectedMood && (
                <button
                  className="mood-button clear-mood"
                  onClick={handleClearMood}
                  style={{
                    backgroundColor: '#ff4444',
                    color: 'white',
                    borderColor: '#ff4444'
                  }}
                >
                  Clear Mood
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MoodSelector;
