import React from 'react';
import './index.css';
import 'react-calendar/dist/Calendar.css';
import Calendar from './Calendar';

function Events() {
  return (
    <div className='events'>
      <h1>
        Events
      </h1>

      <div className='events-content'>
        <Calendar />
      </div>
    </div>
  );
}

export default Events;
