import React from 'react';
import './TaskInputStyles.css'; // Import custom styles

const TaskInput = ({ title, setTitle, onAddTask }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (title) {
            onAddTask(); // Call addTask function
            setTitle(''); // Clear the input
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-input-form"> {/* Add class for styling */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)} // Update title state
                placeholder="Enter your task"
                className="task-input" // Add class for styling
            />
            <button type="submit" className="add-task-button">Add Task</button> {/* Add class for styling */}
        </form>
    );
};

export default TaskInput; 