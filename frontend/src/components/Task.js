import React from 'react';



const Task = ({ task, onToggle, onDelete }) => (
  <li className="task-item">
    {/* Removed checkbox */}
    <span className="task-title" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
      {task.title}
    </span>
    <button className="complete-button" onClick={() => onToggle(task)}>
      {task.completed ? 'Completed' : 'Complete'}
    </button>
    <button className="delete-button" onClick={() => onDelete(task._id)}>Delete</button>
  </li>
);

export default Task; 