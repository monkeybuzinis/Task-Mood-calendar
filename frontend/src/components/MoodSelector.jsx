import React, { useState } from 'react';
import './MoodSelector.css';

const MOODS = [
  { emoji: '😞', level: 'Very Low', description: 'Depressed, Exhausted', color: '#4B4B4B' },
  { emoji: '😕', level: 'Low', description: 'Sad, Anxious', color: '#5C6BC0' },
  { emoji: '😐', level: 'Neutral', description: 'Okay, Meh', color: '#B0BEC5' },
  { emoji: '🙂', level: 'Medium', description: 'Content, Calm', color: '#81C784' },
  { emoji: '😄', level: 'High', description: 'Happy, Motivated', color: '#AED581' },
  { emoji: '🤩', level: 'Very High', description: 'Excited, Euphoric', color: '#FFF176' },
  { emoji: '🧠', level: 'Focused', description: 'Productive, Clear', color: '#4FC3F7' },
  { emoji: '🧘', level: 'Peaceful', description: 'Serene, Relaxed', color: '#CE93D8' }
];

const MoodSelector = ({ selectedMood, onMoodSelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMoodSelect = (mood) => {
    onMoodSelect(mood);
    setIsModalOpen(false);
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
              {MOODS.map((mood) => (
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MoodSelector;
