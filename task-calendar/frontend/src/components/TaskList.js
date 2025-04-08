import React from 'react';

const TaskList = ({ tasks, onToggle, onDelete }) => (
  <ul>
    {tasks.map(task => (
      <li key={task._id}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
        />
        {task.title}
        <button onClick={() => onDelete(task._id)}>Delete</button>
      </li>
    ))}
  </ul>
);

export default TaskList;
