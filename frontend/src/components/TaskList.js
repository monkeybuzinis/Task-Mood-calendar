import React from 'react';
import Task from './Task';
import './TaskListStyles.css';

const TaskList = ({ tasks, onToggle, onDelete }) => (
  <ul className="task-list">
    {tasks.map(task => (
      <Task
        key={task._id}
        task={task}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    ))}
  </ul>
);

const renderDates = (tasks) => {
  const dates = Object.keys(tasks); // Assuming tasks is an object with dates as keys
  return dates.map(date => {
    const hasTasks = tasks[date] && tasks[date].length > 0; // Check if there are tasks for the date
    return (
      <div key={date} style={{ backgroundColor: hasTasks ? 'lightgreen' : 'transparent' }}>
        {date}
      </div>
    );
  });
};

export default TaskList;
