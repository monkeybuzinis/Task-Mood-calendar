import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = ({ onDateSelect, tasks, selectedDate, moods }) => {
  const tileClassName = ({ date }) => {
    const dateKey = date.toISOString().split('T')[0];
    const hasTasks = tasks[dateKey] && tasks[dateKey].length > 0;
    const isToday = date.toDateString() === new Date().toDateString();
    
    let className = '';
    if (isToday) {
      className += 'current-date ';
    }
    if (hasTasks) {
      className += 'has-tasks ';
    }
    return className;
  };

  const tileContent = ({ date }) => {
    const dateKey = date.toISOString().split('T')[0];
    const mood = moods[dateKey];
    
    return mood ? (
      <div 
        className="calendar-mood-indicator"
        style={{ 
          backgroundColor: mood.color,
          opacity: 0.5
        }}
      />
    ) : null;
  };

  const formatDay = (locale, date) => {
    const dateKey = date.toISOString().split('T')[0];
    const hasTasks = tasks[dateKey] && tasks[dateKey].length > 0;
    
    return (
      <span className={hasTasks ? 'date-with-tasks' : ''}>
        {date.getDate()}
      </span>
    );
  };

  return (
    <Calendar
      onChange={onDateSelect}
      value={selectedDate}
      tileClassName={tileClassName}
      tileContent={tileContent}
      formatDay={formatDay}
    />
  );
};

export default CalendarComponent; 