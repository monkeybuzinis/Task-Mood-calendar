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

export default TaskList;
