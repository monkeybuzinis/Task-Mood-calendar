import React, { useEffect, useState } from 'react';
import api from './api';
import TaskList from './components/TaskList.jsx';
import CalendarComponent from './components/CalendarComponent.jsx';
import WeeklyView from './components/WeeklyView.jsx';
import TaskInput from './TaskInput.jsx';
import TaskInputModal from './components/TaskInputModal.jsx';
import TaskDetails from './components/TaskDetails';
import MoodSelector from './components/MoodSelector';
import './CalendarStyles.css';
import './GlobalStyles.css';

function App() {
  const [tasks, setTasks] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [completionStatus, setCompletionStatus] = useState({ percentage: 0, date: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moods, setMoods] = useState({});
  const [selectedMood, setSelectedMood] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await api.get('/tasks');
      console.log('Fetched tasks:', res.data);
      
      if (!res.data) {
        throw new Error('No data received from server');
      }

      const tasksByDate = res.data.reduce((acc, task) => {
      if (task.date) {
          const dateKey = new Date(task.date).toISOString().split('T')[0];
        return {
          ...acc,
            [dateKey]: [...(acc[dateKey] || []), {
              ...task,
              timeRange: task.timeRange || `${new Date(task.startTime).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })} - ${new Date(task.endTime).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })}`
            }]
        };
      }
      return acc;
      }, {});

      setTasks(tasksByDate);
      updateCompletionStatus();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoods = async () => {
    try {
      const response = await api.get('/moods');
      const moodsData = {};
      response.data.forEach(mood => {
        const dateKey = new Date(mood.date).toISOString().split('T')[0];
        moodsData[dateKey] = {
          level: mood.level,
          description: mood.description,
          emoji: mood.emoji,
          color: mood.color
        };
      });
      setMoods(moodsData);
    } catch (error) {
      console.error('Error fetching moods:', error);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      console.log('Attempting to add task:', taskData); // Debug log

      const res = await api.post('/tasks', taskData);
      console.log('Server response:', res); // Debug log

      if (res.status === 200 || res.status === 201) {
        const dateKey = new Date(taskData.date).toISOString().split('T')[0];
        
        setTasks(prevTasks => {
          console.log('Previous tasks:', prevTasks); // Debug log
          const existingTasks = prevTasks[dateKey] || [];
          const newTask = {
            ...res.data,
            timeRange: taskData.timeRange
          };
          
          console.log('New task to add:', newTask); // Debug log
          
          const updatedTasks = [...existingTasks, newTask].sort((a, b) => {
            const timeA = a.timeRange.split(' - ')[0];
            const timeB = b.timeRange.split(' - ')[0];
            
            const [hoursA, minutesA] = timeA.split(':').map(Number);
            const [hoursB, minutesB] = timeB.split(':').map(Number);
            
            return (hoursA * 60 + minutesA) - (hoursB * 60 + minutesB);
          });

          console.log('Updated tasks:', updatedTasks); // Debug log

          return {
            ...prevTasks,
            [dateKey]: updatedTasks
          };
        });

        // Close modal
        setIsModalOpen(false);
        
        // Update completion status
        updateCompletionStatus();
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please check the console for details.');
    }
  };

  const handleTimeChange = async (taskId, newStartTime, newEndTime) => {
    try {
      // Validate time range
      const start = new Date(`2000-01-01T${newStartTime}`);
      const end = new Date(`2000-01-01T${newEndTime}`);
      
      if (end <= start) {
        console.error("End time must be after start time");
        return;
      }

      const dateKey = selectedDate.toISOString().split('T')[0];
      const task = tasks[dateKey].find(t => t._id === taskId);
      
      if (!task) {
        console.error("Task not found");
        return;
      }

      const updatedTask = {
        ...task,
        timeRange: `${newStartTime} - ${newEndTime}`,
        startTime: new Date(`${dateKey}T${newStartTime}`),
        endTime: new Date(`${dateKey}T${newEndTime}`)
      };

      const res = await api.put(`/tasks/${taskId}`, updatedTask);
      
      if (res.status === 200) {
        // Update tasks state
        setTasks(prevTasks => {
          const updatedTasks = prevTasks[dateKey]
            .map(t => t._id === taskId ? { ...res.data, timeRange: updatedTask.timeRange } : t)
            .sort((a, b) => {
              const timeA = a.timeRange.split(' - ')[0];
              const timeB = b.timeRange.split(' - ')[0];
              
              const [hoursA, minutesA] = timeA.split(':').map(Number);
              const [hoursB, minutesB] = timeB.split(':').map(Number);
              
              const totalMinutesA = hoursA * 60 + minutesA;
              const totalMinutesB = hoursB * 60 + minutesB;
              
              return totalMinutesA - totalMinutesB;
            });

          return {
            ...prevTasks,
            [dateKey]: updatedTasks
          };
        });

        // Update selectedTask state immediately
        if (selectedTask && selectedTask._id === taskId) {
          setSelectedTask(prev => ({
            ...prev,
            timeRange: updatedTask.timeRange,
            startTime: updatedTask.startTime,
            endTime: updatedTask.endTime
          }));
        }

        updateCompletionStatus();
      }
    } catch (error) {
      console.error("Error updating task time:", error);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      let taskToUpdate = null;
      let taskDateKey = null;

      Object.entries(tasks).forEach(([dateKey, dateTasks]) => {
        const found = dateTasks.find(t => t._id === taskId);
        if (found) {
          taskToUpdate = found;
          taskDateKey = dateKey;
        }
      });

      if (!taskToUpdate) {
        console.error("Task not found");
        return;
      }

      const updatedTask = {
        ...taskToUpdate,
        completed: !taskToUpdate.completed
      };

      const res = await api.put(`/tasks/${taskId}`, updatedTask);
      
      if (res.status === 200) {
        setTasks(prevTasks => {
          const newTasks = { ...prevTasks };
          newTasks[taskDateKey] = prevTasks[taskDateKey].map(t => 
            t._id === taskId ? { 
              ...res.data, 
              timeRange: t.timeRange 
            } : t
          );
          return newTasks;
        });

        if (selectedTask && selectedTask._id === taskId) {
          setSelectedTask(prev => ({
            ...prev,
            completed: !prev.completed
          }));
        }

        // Force update of completion status
        updateCompletionStatus();
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prevTasks => {
        const newTasks = { ...prevTasks };
        Object.keys(newTasks).forEach(dateKey => {
          newTasks[dateKey] = newTasks[dateKey].filter(t => t._id !== taskId);
          if (newTasks[dateKey].length === 0) {
            delete newTasks[dateKey];
          }
        });
        return newTasks;
      });
      setSelectedTask(null);
      updateCompletionStatus();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    
    // Convert selected date to dateKey format
    const newDateKey = date.toISOString().split('T')[0];
    
    // If there's a selected task, check if it belongs to the newly selected date
    if (selectedTask) {
      const taskDate = new Date(selectedTask.date).toISOString().split('T')[0];
      
      // If the task is not from the newly selected date, clear it
      if (taskDate !== newDateKey) {
        setSelectedTask(null);
      }
    }

    // Update completion status
    updateCompletionStatus(date);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    
    // If the task's date is different from the currently selected date,
    // update the selected date to match the task's date
    const taskDate = new Date(task.date);
    if (taskDate.toISOString().split('T')[0] !== selectedDate.toISOString().split('T')[0]) {
      setSelectedDate(taskDate);
    }
  };

  const handleContentChange = async (taskId, newContent) => {
    try {
      let taskToUpdate = null;
      let taskDateKey = null;

      // Find the task and its date
      Object.entries(tasks).forEach(([dateKey, dateTasks]) => {
        const found = dateTasks.find(t => t._id === taskId);
        if (found) {
          taskToUpdate = found;
          taskDateKey = dateKey;
        }
      });

      if (!taskToUpdate) {
        console.error("Task not found");
        return;
      }

      const updatedTask = {
        ...taskToUpdate,
        title: newContent
      };

      const res = await api.put(`/tasks/${taskId}`, updatedTask);
      
      if (res.status === 200) {
        // Update all instances of the task in the tasks state
        setTasks(prevTasks => {
          const newTasks = { ...prevTasks };
          
          // Update the task in its specific date
          if (newTasks[taskDateKey]) {
            newTasks[taskDateKey] = newTasks[taskDateKey].map(t => 
              t._id === taskId ? { 
                ...res.data, 
                timeRange: t.timeRange,
                title: newContent // Explicitly set the new content
              } : t
            );
          }
          
          return newTasks;
        });

        // Update selectedTask if it's the current task
        if (selectedTask && selectedTask._id === taskId) {
          setSelectedTask(prev => ({
            ...prev,
            title: newContent
          }));
        }

        // Force a re-render of the WeeklyView
        setTasks(prev => ({ ...prev }));
      }
    } catch (error) {
      console.error("Error updating task content:", error);
    }
  };

  const handleMoodSelect = (mood) => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    
    // Update moods state
    setMoods(prevMoods => {
      const newMoods = {
        ...prevMoods,
        [dateKey]: mood
      };
      return newMoods;
    });

    setSelectedMood(mood);
  };

  const getSelectedDateMood = () => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    return moods[dateKey];
  };

  // Load moods from API on app initialization
  useEffect(() => {
    fetchMoods();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    // Load mood for selected date
    const dateKey = selectedDate.toISOString().split('T')[0];
    setSelectedMood(moods[dateKey] || null);

    // Calculate completion percentage for selected date
    const dateTasks = tasks[dateKey] || [];
    const completedTasks = dateTasks.filter(task => task.completed).length;
    const totalTasks = dateTasks.length;
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    setCompletionPercentage(percentage);
  }, [selectedDate, tasks, moods]);

  const getUncompletedTaskCount = () => {
    const dateKey = selectedDate?.toISOString().split('T')[0];
    if (dateKey && tasks[dateKey]) {
      return tasks[dateKey].filter(task => !task.completed).length;
    }
    return 0;
  };

  const uncompletedTaskCount = getUncompletedTaskCount();

  const getCompletionStatus = () => {
    if (!selectedDate) return null;

    const dateKey = selectedDate.toISOString().split('T')[0];
    const dayTasks = tasks[dateKey] || [];
    
    if (dayTasks.length === 0) return null;

    // Count completed tasks for the selected date
    const totalTasks = dayTasks.length;
    const completedTasks = dayTasks.filter(task => task.completed).length;
    
    // Calculate percentage and round to nearest integer
    const percentage = Math.round((completedTasks / totalTasks) * 100);

    return {
      percentage,
      completedTasks,
      totalTasks,
      date: selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  // Update the completion status display
  const renderCompletionStatus = () => {
    const status = getCompletionStatus();
    if (!status) return null;

    return (
      <div 
        style={{
          padding: '12px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          color: '#333'
        }}
      >
        <div style={{ marginBottom: '4px', color: '#666' }}>
          {status.date}
        </div>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px' 
        }}>
          <div>
            You have completed {status.percentage}% of your plan
            <br />
            <span style={{ fontSize: '0.8rem', color: '#666' }}>
              ({status.completedTasks} of {status.totalTasks} tasks)
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#e9ecef',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${status.percentage}%`,
              height: '100%',
              backgroundColor: status.percentage === 100 ? '#28a745' : '#007bff',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>
    );
  };

  const updateCompletionStatus = (date = selectedDate) => {
    if (!date) return;

    const dateKey = date.toISOString().split('T')[0];
    const dayTasks = tasks[dateKey] || [];
    
    if (dayTasks.length === 0) {
      setCompletionStatus({ percentage: 0, date: null });
      return;
    }

    const completedTasks = dayTasks.filter(task => task.completed).length;
    const totalTasks = dayTasks.length;
    const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

    setCompletionStatus({
      percentage: completionPercentage,
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Task-Mood Calendar</h1>
      
      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#fee',
          color: '#c00',
          borderRadius: '4px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#666'
        }}>
          Loading tasks...
        </div>
      ) : (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '20px',
        }}>
          {/* Left sidebar - Calendar and Add Task button */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px',
            position: 'sticky',
            top: '20px',
            alignSelf: 'start'
          }}>
            <CalendarComponent 
              onDateSelect={handleDateSelect} 
              tasks={tasks} 
              selectedDate={selectedDate}
              moods={moods}
            />
            
            {/* Render completion status */}
            {renderCompletionStatus()}
            
            {/* Add Mood Selector */}
            <MoodSelector
              selectedMood={selectedMood}
              onMoodSelect={handleMoodSelect}
              date={selectedDate}
            />
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="add-task-button"
            >
              Add Task
            </button>
          </div>

          {/* Right side - Weekly View and Task Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Weekly View */}
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <WeeklyView 
                selectedDate={selectedDate} 
                tasks={tasks}
                onTaskClick={handleTaskClick}
              />
            </div>

            {/* Task Details Section - Only below weekly view */}
            {selectedTask && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                padding: '20px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '15px' 
                }}>
                  <h3>Selected Task Details</h3>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: '#666' 
                  }}>
                    {new Date(selectedTask.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <TaskDetails
                  task={selectedTask}
                  onTimeChange={handleTimeChange}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                  onContentChange={handleContentChange}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <TaskInputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
        selectedDate={selectedDate}
      />
    </div>
  );
}

export default App; 
