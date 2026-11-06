import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, isSameDay, parseISO } from 'date-fns';
import articles from './articles.json';
import { Article, parseArticles } from './zod';
import { eventCoversDay } from './eventFilters';
import Calendar from './Calendar';
import CompactEventList from '../../components/CompactEventList';
import ThreeDCard from '../../components/3DCard';
import './index.css';
import 'react-calendar/dist/Calendar.css';

// Newest start first; undated events always sort to the end.
const articlesData: Article[] = Object.values(parseArticles(articles)).sort((a, b) => {
  if (!a.startDatetime) return 1;
  if (!b.startDatetime) return -1;
  return parseISO(b.startDatetime).getTime() - parseISO(a.startDatetime).getTime();
});

// Range label (start – end) only when the end falls on a different day.
function formatEventDate(event: Article) {
  const start = parseISO(event.startDatetime!);
  const startLabel = format(start, 'MMM dd, yyyy');

  if (event.endDatetime) {
    const end = parseISO(event.endDatetime);
    if (!isSameDay(start, end)) {
      return `${startLabel} – ${format(end, 'MMM dd, yyyy')}`;
    }
  }

  return startLabel;
}

function Events() {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  // Shared boundary for the outside-click check: spans the left column and
  // the sibling card pane, so right-pane interactions keep the selection.
  const layoutRef = useRef<HTMLElement>(null);

  const displayedEvents = selectedDay
    ? articlesData.filter((event) => eventCoversDay(event, selectedDay))
    : articlesData;

  // Clear the selection when clicking anywhere outside the events layout.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        layoutRef.current &&
        !layoutRef.current.contains(event.target as Node)
      ) {
        setSelectedDay(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleResultsAreaClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setSelectedDay(null);
    }
  };

  return (
    <div className='events'>
      <h1>
        Events
      </h1>

      {/* Full-width parent: sticky left column plus room for a sibling card pane. */}
      <section className='events-layout' ref={layoutRef}>
        <div className='events-left'>
          <Calendar
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            events={articlesData}
            containerRef={calendarRef}
          />
          {/* Event pane spans the compact left column, aligned beneath the calendar. */}
          <section
            className='events-results gap-0 mt-12 flex flex-col justify-start
              min-h-[200px] max-w-sm pr-0'
            onClick={handleResultsAreaClick}
          >
            <h2 className='font-semibold text-gray-900 text-left w-full pl-4'>
              {selectedDay
                ? `Events on ${format(selectedDay, 'MMM dd, yyyy')}`
                : 'All Events'}
            </h2>
            <div
              className='mt-4 space-y-8 text-sm leading-6 text-gray-500 h-full overflow-auto'
              ref={resultsRef}
            >
              {displayedEvents.length > 0 ? (
                displayedEvents.map((event) => (
                  <CompactEventList
                    key={event.link}
                    name={event.title}
                    description={event.body}
                    link={`/events/${event.link}`}
                    date={
                      event.startDatetime
                        ? { label: formatEventDate(event), value: event.startDatetime }
                        : undefined
                    }
                  />
                ))
              ) : (
                <p>No events found.</p>
              )}
            </div>
          </section>
        </div>
        {/* Right pane: event cards mirroring the compact list's displayed events. */}
        <section className='events-cards' aria-label='Event cards'>
          {displayedEvents.length > 0 ? (
            <div className='events-cards-grid'>
              {displayedEvents.map((event) => (
                <Link key={event.link} to={`/events/${event.link}`}>
                  <ThreeDCard
                    photo={event.imgSrc}
                    heading={event.title}
                    // Undated events get no date subheading at all.
                    subheading={event.startDatetime ? formatEventDate(event) : ''}
                    description={event.body}
                    displayLineCount={3}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p>No events found.</p>
          )}
        </section>
      </section>
    </div>
  );
}

export default Events;
