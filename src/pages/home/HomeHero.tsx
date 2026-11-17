import React from 'react';
import { Link } from 'react-router-dom';
import { GoArrowRight } from 'react-icons/go';
import { isBefore, parseISO, startOfDay } from 'date-fns';
import { formatEventDate, latestEvents } from '../events/articlesData';
import './HomeHero.css';

// Homepage hero: the club's name, big, in one large window (the site's window motif),
// with the mission and links underneath and the newest event in the status bar.
function HomeHero() {
  const [event] = latestEvents(1);
  const isUpcoming = event?.endDatetime
    ? !isBefore(startOfDay(parseISO(event.endDatetime)), startOfDay(new Date()))
    : false;

  return (
    <section className='home-hero'>
      <div className='home-hero-window'>
        <div className='home-hero-bar'>
          <span className='home-hero-dots' aria-hidden='true'>
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span className='home-hero-bar-title'>nuscomputing.com</span>
        </div>

        <div className='home-hero-body'>
          <h2>NUS Students&#39;</h2>
          <h1>Computing Club</h1>

          <div className='home-hero-foot'>
            <p>
              We aim to be the <span>voice</span> of the students, ensuring
              their <span>holistic</span> well-being, and <span>bridging</span> the
              gaps between them and the school.
            </p>
            <div className='home-hero-actions'>
              <Link to='/about' className='home-button home-button--primary'>
                About us
              </Link>
              <Link to='/events' className='home-button'>
                Events
              </Link>
            </div>
          </div>
        </div>

        {event && (
          <Link to={`/events/${event.link}`} className='home-hero-status'>
            <span>
              <b>{isUpcoming ? 'Next up' : 'Latest'}:</b> {event.title}
              <span className='home-hero-status-date'> · {formatEventDate(event)}</span>
            </span>
            <GoArrowRight aria-hidden='true' />
          </Link>
        )}
      </div>
    </section>
  );
}

export default HomeHero;
