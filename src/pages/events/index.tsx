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

      <section className='md:items-start'>
        <Calendar />
      </section>
    </div>
  );
}

export default Events;
