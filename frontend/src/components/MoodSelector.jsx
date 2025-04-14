import React, { useState, useEffect } from 'react';
import './MoodSelector.css';

const MoodSelector = ({ selectedMood, onMoodSelect, date }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moods, setMoods] = useState([
    { emoji: '😄', level: 'Very Happy', description: 'Vibrant, energetic, joyful', color: '#FFD700' },
    { emoji: '🙂', level: 'Happy', description: 'Warm and cheerful', color: '#FFA500' },
    { emoji: '😐', level: 'Neutral', description: 'Balanced, calm, impartial', color: '#C0C0C0' },
    { emoji: '😕', level: 'Sad', description: 'Heavy, empty, somber', color: '#000000' },
    { emoji: '😠', level: 'Angry', description: 'Intense, passionate, strong emotion', color: '#B22222' }
  ]);

  useEffect(() => {
    // Load moods from localStorage on component mount
    const savedMoods = localStorage.getItem('moods');
    if (savedMoods) {
      setMoods(JSON.parse(savedMoods));
    } else {
      // Save default moods to localStorage if not exists
      localStorage.setItem('moods', JSON.stringify(moods));
    }
  }, []);

  const handleMoodSelect = (mood) => {
    onMoodSelect(mood);
    setIsModalOpen(false);
    
    // Save mood data to localStorage
    if (date) {
      const dateKey = date.toISOString().split('T')[0];
      const savedMoods = JSON.parse(localStorage.getItem('moodData') || '{}');
      savedMoods[dateKey] = mood;
      localStorage.setItem('moodData', JSON.stringify(savedMoods));
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
                    backgroundColor: selectedMood?.level === mood.level ? mood.color : 'transparent',
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
                  onClick={() => handleMoodSelect(null)}
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
