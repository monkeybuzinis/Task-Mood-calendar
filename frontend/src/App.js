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
    console.log('Fetched tasks:', res.data); // Log the fetched tasks
    setTasks(res.data.reduce((acc, task) => {
      if (task.date) { // Check if task.date is defined
        const date = task.date.split('T')[0];
        return {
          ...acc,
          [date]: [...(acc[date] || []), task]
        };
      }
      return acc; // If date is undefined, return the accumulator unchanged
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
    try {
      await api.delete(`/tasks/${id}`);
      
      // Update the state after deletion
      setTasks(prevTasks => {
        const updatedTasks = {
          ...prevTasks,
          [selectedDate.toISOString().split('T')[0]]: prevTasks[selectedDate.toISOString().split('T')[0]].filter(t => t._id !== id)
        };

        // Check if there are any tasks left for the selected date
        if (updatedTasks[selectedDate.toISOString().split('T')[0]].length === 0) {
          // If no tasks left, remove the date from the tasks object
          delete updatedTasks[selectedDate.toISOString().split('T')[0]];
        }

        return updatedTasks;
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Calculate the number of uncompleted tasks for the selected date
  const getUncompletedTaskCount = () => {
    const dateKey = selectedDate?.toISOString().split('T')[0];
    if (dateKey && tasks[dateKey]) {
      return tasks[dateKey].filter(task => !task.completed).length;
    }
    return 0;
  };

  const uncompletedTaskCount = getUncompletedTaskCount();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '5px' }}>Task Calendar</h1>
      <CalendarComponent onDateSelect={handleDateSelect} tasks={tasks} />
      {selectedDate && (
        <div style={{ marginTop: '5px' }}>
          <h2>
            {`You have ${uncompletedTaskCount} tasks for ${selectedDate.toDateString()}`}
          </h2>
          <TaskInput title={title} setTitle={setTitle} onAddTask={addTask} />
          <TaskList tasks={tasks[selectedDate.toISOString().split('T')[0]] || []} onToggle={toggleTask} onDelete={deleteTask} />
        </div>
      )}
    </div>
  );
}

export default App;
