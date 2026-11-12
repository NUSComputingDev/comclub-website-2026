import React from 'react';
import { Link } from 'react-router-dom';
import ThreeDCard from '../../components/3DCard';
import { formatEventDate, latestEvents } from '../events/articlesData';
import './EventsPreview.css';

const PREVIEW_COUNT = 3;

// Homepage events section: the "What's up?" intro, a few event cards read
// from the same data as the events page, and a link to see the rest.
function EventsPreview() {
  const events = latestEvents(PREVIEW_COUNT);

  return (
    <div className='events-preview'>
      <div className='events-preview-header'>
        <img src='/events_graphic.svg' className='events-preview-graphic' alt='' />
        <div className='section-description'>
          <h2>Wondering</h2>
          <h1>What&#39;s up?</h1>
          <p>
            There&#39;s always something <span>new</span> to look forward to.
            Keep an eye out for the latest Computing Club <span>events</span>!
          </p>
          {/* Sits under the blurb, like the other homepage sections, so the
              whole section fits on one desktop screen. */}
          <Link to='./events'>
            <button className='rounded-lg'>More events</button>
          </Link>
        </div>
      </div>

      <div className='events-preview-grid'>
        {events.map((event) => (
          <Link key={event.link} to={`/events/${event.link}`}>
            <ThreeDCard
              photo={event.imgSrc}
              heading={event.title}
              subheading={formatEventDate(event)}
              description={event.body}
              displayLineCount={3}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default EventsPreview;
