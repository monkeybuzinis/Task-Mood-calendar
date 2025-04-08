import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles
import './CalendarStyles.css'; // Import custom styles

const CalendarComponent = ({ onDateSelect, tasks }) => {
    const [date, setDate] = useState(new Date());

    const handleDateChange = (newDate) => {
        setDate(newDate);
        onDateSelect(newDate); // Call the function passed as a prop
    };

    const tileClassName = ({ date }) => {
        const dateKey = date.toISOString().split('T')[0];
        return tasks[dateKey] ? 'has-tasks' : null; // Apply class if tasks exist for the date
    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={handleDateChange}
                value={date}
                tileClassName={tileClassName} // Add custom class for tiles
            />
        </div>
    );
};

export default CalendarComponent;
