import React, { useState, useEffect } from 'react';
import './TaskForm.css';

function TaskForm({ onAddTask, selectedDate, selectedTask, onUpdateTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description);
      // Format time to HH:MM
      const taskDate = new Date(selectedTask.date);
      const hours = taskDate.getHours().toString().padStart(2, '0');
      const minutes = taskDate.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    } else {
      setTitle('');
      setDescription('');
      setTime('');
    }
    setError(null);
  }, [selectedTask, selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề');
      return;
    }

    if (!time) {
      setError('Vui lòng chọn thời gian');
      return;
    }

    // Create new date object with selected time
    const [hours, minutes] = time.split(':');
    const taskDate = new Date(selectedDate);
    taskDate.setHours(parseInt(hours, 10));
    taskDate.setMinutes(parseInt(minutes, 10));

    if (selectedTask) {
      // Update existing task
      const updatedTask = {
        ...selectedTask,
        title: title.trim(),
        description: description.trim(),
        date: taskDate
      };
      onUpdateTask(updatedTask);
    } else {
      // Create new task
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        date: taskDate,
        completed: false
      };
      onAddTask(newTask);
    }
    
    // Reset form
    setTitle('');
    setDescription('');
    setTime('');
    setError(null);
  };

  return (
    <div className="task-form">
      <h2>{selectedTask ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Tiêu đề:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề công việc"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Mô tả:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả công việc"
          />
        </div>
        <div className="form-group">
          <label htmlFor="time">Thời gian:</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">{selectedTask ? 'Lưu thay đổi' : 'Thêm công việc'}</button>
      </form>
    </div>
  );
}

export default TaskForm; 