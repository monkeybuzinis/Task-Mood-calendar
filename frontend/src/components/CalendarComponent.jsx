const CalendarComponent = ({ onDateSelect, tasks, selectedDate, moods }) => {
  const tileClassName = ({ date }) => {
    const dateKey = date.toISOString().split('T')[0];
    const mood = moods[dateKey];
    return mood ? 'mood-' + mood.level.toLowerCase().replace(' ', '-') : '';
  };

  const tileContent = ({ date }) => {
    const dateKey = date.toISOString().split('T')[0];
    const mood = moods[dateKey];
    
    return mood ? (
      <div 
        className="calendar-mood-indicator"
        style={{ 
          backgroundColor: mood.color,
          opacity: 0.7
        }}
      />
    ) : null;
  };

  return (
    <Calendar
      onChange={onDateSelect}
      value={selectedDate}
      tileClassName={tileClassName}
      tileContent={tileContent}
    />
  );
}; 