import React, { useEffect, useRef, useState } from 'react';
import { format, isSameDay, isWithinInterval, parseISO, startOfDay } from 'date-fns';
import articles from './articles.json';
import { Article, parseArticles } from './zod';
import Calendar from './Calendar';
import CompactEventList from '../../components/CompactEventList';
import './index.css';
import 'react-calendar/dist/Calendar.css';

// Newest start first; undated events always sort to the end.
const articlesData: Article[] = Object.values(parseArticles(articles)).sort((a, b) => {
  if (!a.startDatetime) return 1;
  if (!b.startDatetime) return -1;
  return parseISO(b.startDatetime).getTime() - parseISO(a.startDatetime).getTime();
});

function eventCoversDay(event: Article, day: Date) {
  if (!event.startDatetime || !event.endDatetime) return false;

  return isWithinInterval(startOfDay(day), {
    start: startOfDay(parseISO(event.startDatetime)),
    end: startOfDay(parseISO(event.endDatetime)),
  });
}

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

  const displayedEvents = selectedDay
    ? articlesData.filter((event) => eventCoversDay(event, selectedDay))
    : articlesData;

  // Clear the selection when clicking anywhere outside the calendar and the results.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
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

      <section className='md:items-start'>
        <div className='pt-16 max-w-sm px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6'>
          <div className='md:grid md:grid-cols-2 md:divide-x md:divide-gray-200'>
            <div className='md:pr-14 h-[350px]'>
              <Calendar
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
                events={articlesData}
                containerRef={calendarRef}
              />
            </div>
            <section
              className='gap-0 mt-12 md:mt-0 pl-0 md:pl-14 flex flex-col justify-start
                min-h-[200px] w-full md:min-w-[450px] pr-0'
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
        </div>
      </section>
    </div>
  );
}

export default Events;
