import React, { useEffect, useState } from 'react';
import api from './api';
import TaskList from './components/TaskList';
import CalendarComponent from './CalendarComponent';
import TaskInput from './TaskInput';
import './CalendarStyles.css'; // Import custom styles

function App() {
  const [tasks, setTasks] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [title, setTitle] = useState('');

  const fetchTasks = async () => {
    const res = await api.get('/tasks');
    setTasks(res.data.reduce((acc, task) => {
      const date = task.date.split('T')[0];
      return {
        ...acc,
        [date]: [...(acc[date] || []), task]
      };
    }, {}));
  };

  const addTask = async () => {
    if (!title.trim() || !selectedDate) {
      console.log("Title or date is missing.");
      return;
    }
    try {
      const res = await api.post('/tasks', { title: title, date: selectedDate.toISOString() });
      console.log("API Response:", res);
      if (res.status === 200 || res.status === 201) {
        const dateKey = selectedDate.toISOString().split('T')[0];
        setTasks((prevTasks) => ({
          ...prevTasks,
          [dateKey]: [
            ...(prevTasks[dateKey] || []),
            res.data
          ]
        }));
        setTitle('');
      } else {
        console.error("Failed to add task:", res.data);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTask = async (task) => {
    const res = await api.put(`/tasks/${task._id}`, { ...task, completed: !task.completed });
    setTasks(prevTasks => ({
      ...prevTasks,
      [selectedDate.toISOString().split('T')[0]]: prevTasks[selectedDate.toISOString().split('T')[0]].map(t => (t._id === task._id ? res.data : t))
    }));
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks(prevTasks => ({
      ...prevTasks,
      [selectedDate.toISOString().split('T')[0]]: prevTasks[selectedDate.toISOString().split('T')[0]].filter(t => t._id !== id)
    }));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleAddTask = (task) => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    setTasks(prevTasks => ({
      ...prevTasks,
      [dateKey]: [...(prevTasks[dateKey] || []), task]
    }));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '5px' }}>Task Calendar</h1>
      <CalendarComponent onDateSelect={handleDateSelect} tasks={tasks} />
      {selectedDate && (
        <div style={{ marginTop: '5px' }}>
          <h2>Tasks for {selectedDate.toDateString()}</h2>
          <TaskInput title={title} setTitle={setTitle} onAddTask={addTask} />
          <TaskList tasks={tasks[selectedDate.toISOString().split('T')[0]] || []} onToggle={toggleTask} onDelete={deleteTask} />
        </div>
      )}
    </div>
  );
}

export default App;
