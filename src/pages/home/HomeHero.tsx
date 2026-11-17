import React from 'react';
import { Link } from 'react-router-dom';
import { isBefore, parseISO, startOfDay } from 'date-fns';
import { formatEventDate, latestEvents } from '../events/articlesData';
import './HomeHero.css';

// Homepage hero: who we are, where to go next, and the newest event.
function HomeHero() {
  const [event] = latestEvents(1);
  const isUpcoming = event?.endDatetime
    ? !isBefore(startOfDay(parseISO(event.endDatetime)), startOfDay(new Date()))
    : false;

  return (
    <section className='home-hero'>
      <div className='home-hero-copy'>
        <h2>NUS Students&#39;</h2>
        <h1>Computing Club</h1>
        <p>
          We aim to be the <span>voice</span> of the students, ensuring
          their <span>holistic</span> well-being, and <span>bridging</span> the
          gaps between them and the school.
        </p>

        <div className='home-hero-actions'>
          <Link to='/events' className='home-hero-button home-hero-button--primary'>
            Upcoming events
          </Link>
          <Link to='/about' className='home-hero-button'>
            About us
          </Link>
        </div>

        {event && (
          <p className='home-hero-latest'>
            {isUpcoming ? 'Next up' : 'Latest'}:{' '}
            <Link to={`/events/${event.link}`}>{event.title}</Link>
            {', '}
            {formatEventDate(event)}
          </p>
        )}
      </div>

      <img src='/hero_graphic.svg' className='home-hero-graphic' alt=''></img>
    </section>
  );
}

export default HomeHero;
