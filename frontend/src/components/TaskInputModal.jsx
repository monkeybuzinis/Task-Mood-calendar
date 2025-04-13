import React, { useState, useEffect } from 'react';
import './TaskInputModal.css';

const TaskInputModal = ({ isOpen, onClose, onAddTask, selectedDate }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setStartTime('09:00');
      setEndTime('10:00');
      setError('');
    }
  }, [isOpen]);

  const validateTimes = () => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    if (end <= start) {
      setError('End time must be after start time');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted'); // Debug log
    
    if (!validateTimes()) {
      return;
    }

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      // Create task data
      const taskDate = new Date(selectedDate);
      
      // Create startTime
      const [startHour, startMinute] = startTime.split(':');
      const taskStartTime = new Date(taskDate);
      taskStartTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

      // Create endTime
      const [endHour, endMinute] = endTime.split(':');
      const taskEndTime = new Date(taskDate);
      taskEndTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      const taskData = {
        title: title.trim(),
        date: taskDate.toISOString(),
        startTime: taskStartTime.toISOString(),
        endTime: taskEndTime.toISOString(),
        timeRange: `${startTime} - ${endTime}`
      };

      console.log('Submitting task data:', taskData); // Debug log
      onAddTask(taskData);
    } catch (error) {
      console.error('Error creating task data:', error);
      setError('Failed to create task. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              placeholder="Enter task title"
            />
          </div>
          
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setError('');
              }}
              required
            />
          </div>

          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                setError('');
              }}
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskInputModal;
