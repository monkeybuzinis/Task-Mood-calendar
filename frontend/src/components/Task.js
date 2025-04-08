import React from 'react';

const Task = ({ task, onToggle, onDelete }) => (
  <li className="task-item">
    <input
      type="checkbox"
      className="task-checkbox"
      checked={task.completed}
      onChange={() => onToggle(task)}
    />
    <span className="task-title">{task.title}</span>
    <button className="delete-button" onClick={() => onDelete(task._id)}>Delete</button>
  </li>
);

export default Task; 