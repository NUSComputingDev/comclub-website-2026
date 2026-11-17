import React from 'react';
import { Link } from 'react-router-dom';
import { isBefore, parseISO, startOfDay } from 'date-fns';
import { formatEventDate, latestEvents } from '../events/articlesData';
import './HomeHero.css';

const STATS = [
  { value: '6,600+', label: 'members' },
  { value: '4', label: 'wings' },
  { value: '1998', label: 'founded' },
];

// Homepage hero: who we are on the left, the monitor graphic with a little terminal and the next event on the right.
function HomeHero() {
  const [event] = latestEvents(1);
  const isUpcoming = event?.endDatetime
    ? !isBefore(startOfDay(parseISO(event.endDatetime)), startOfDay(new Date()))
    : false;

  return (
    <section className='home-hero'>
      <span className='home-hero-grid' aria-hidden='true'></span>

      <div className='home-hero-copy'>
        <span className='home-hero-kicker'>
          <span className='home-hero-kicker-dot' aria-hidden='true'></span>
          NUS School of Computing
        </span>
        <h1>
          <span className='home-hero-pre'>NUS Students&#39;</span>
          Computing Club
        </h1>
        <p>
          We aim to be the <span>voice</span> of the students, ensuring
          their <span>holistic</span> well-being, and <span>bridging</span> the
          gaps between them and the school.
        </p>

        <div className='home-hero-actions'>
          <Link to='/events' className='home-hero-cta home-hero-cta--primary'>
            See what&#39;s on
            <span className='home-hero-arrow' aria-hidden='true'>&#8594;</span>
          </Link>
          <Link to='/about' className='home-hero-cta'>
            Meet the club
          </Link>
        </div>

        <dl className='home-hero-stats'>
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className='home-hero-art'>
        <span className='home-hero-blob' aria-hidden='true'></span>
        <img src='/hero_graphic.svg' className='home-hero-graphic' alt=''></img>

        <div className='home-hero-terminal' aria-hidden='true'>
          <div className='home-hero-terminal-bar'>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className='home-hero-terminal-body'>
            <p><b>~/soc $</b> whoami</p>
            <p className='home-hero-terminal-out'>computing student</p>
            <p><b>~/soc $</b> ./join --club</p>
            <p className='home-hero-terminal-ok'>
              &#10003; welcome home<span className='home-hero-caret'>&#9608;</span>
            </p>
          </div>
        </div>

        {event && (
          <Link to={`/events/${event.link}`} className='home-hero-event'>
            <span className='home-hero-event-label'>{isUpcoming ? 'Next up' : 'Latest event'}</span>
            <span className='home-hero-event-title'>{event.title}</span>
            <span className='home-hero-event-date'>{formatEventDate(event)}</span>
          </Link>
        )}
      </div>
    </section>
  );
}

export default HomeHero;
