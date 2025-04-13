import React from 'react';
import './WeeklyView.css';

const WeeklyView = ({ selectedDate, tasks, onTaskClick }) => {
  const getWeekDays = (date) => {
    const currentDate = new Date(date || new Date());
    const dayOfWeek = currentDate.getDay();
    const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(currentDate.setDate(diff));
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      return day;
    });
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getDayNumber = (date) => {
    return date.getDate();
  };

  const getTasksForDay = (date) => {
    const dateStr = formatDate(date);
    const dayTasks = tasks[dateStr] || [];
    
    // Sort tasks by start time
    return dayTasks.sort((a, b) => {
      const timeA = a.timeRange.split(' - ')[0]; // Get start time of task A
      const timeB = b.timeRange.split(' - ')[0]; // Get start time of task B
      
      // Convert time strings to comparable values (minutes since midnight)
      const [hoursA, minutesA] = timeA.split(':').map(Number);
      const [hoursB, minutesB] = timeB.split(':').map(Number);
      
      const totalMinutesA = hoursA * 60 + minutesA;
      const totalMinutesB = hoursB * 60 + minutesB;
      
      return totalMinutesA - totalMinutesB;
    });
  };

  const formatTimeDisplay = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="weekly-view">
      {getWeekDays(selectedDate).map((day, index) => (
        <div key={index} className="day-column">
          <div className="header-cell">
            <span className="day-name">{getDayName(day)}</span>
            <span className="date-number">{getDayNumber(day)}</span>
          </div>
          
          <div className="tasks-container">
            {getTasksForDay(day).map((task, taskIndex) => (
              <div 
                key={`${task._id}-${task.title}`}
                className="task-wrapper"
                onClick={() => onTaskClick(task)}
                style={{ cursor: 'pointer' }}
              >
                <div className="task-time">
                  {task.timeRange}
                </div>
                <div className={`task-item ${task.completed ? 'completed' : ''}`}>
                  {task.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeeklyView; 