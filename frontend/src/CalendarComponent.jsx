import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css';

const CalendarComponent = ({ onDateSelect, tasks }) => {
    const [date, setDate] = useState(new Date());

    const handleDateChange = (newDate) => {
        setDate(newDate);
        onDateSelect(newDate);
    };

    const tileClassName = ({ date }) => {
        const dateKey = date.toISOString().split('T')[0];
        return tasks[dateKey] ? 'has-tasks' : null;
    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={handleDateChange}
                value={date}
                tileClassName={tileClassName}
            />
        </div>
    );
};

export default CalendarComponent; 