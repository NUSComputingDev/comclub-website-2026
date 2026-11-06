import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, isSameDay, parseISO } from 'date-fns';
import articles from './articles.json';
import { Article, parseArticles } from './zod';
import { filterEventCards, type EventTab } from './eventFilters';
import Calendar from './Calendar';
import CompactEventList from '../../components/CompactEventList';
import ThreeDCard from '../../components/3DCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/tabs';
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

// Left-pane heading that mirrors the active tab. The date tab only activates
// with a selected day, so a date heading always has a day to format.
function formatCompactHeading(tab: EventTab, selectedDay: Date | null) {
  if (tab === 'date' && selectedDay) {
    return `Events on ${format(selectedDay, 'MMM dd, yyyy')}`;
  }

  if (tab === 'past') return 'Past Events';
  if (tab === 'upcoming') return 'Upcoming Events';
  return 'All Events';
}

// Shared card grid so every tab panel renders identical card markup.
function EventCardGrid({ events }: { events: Article[] }) {
  if (events.length === 0) return <p>No events found.</p>;

  return (
    <div className='events-cards-grid'>
      {events.map((event) => (
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
  );
}

function Events() {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<EventTab>('all');
  const calendarRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  // Shared boundary for the outside-click check: spans the left column and
  // the sibling card pane, so right-pane interactions keep the selection.
  const layoutRef = useRef<HTMLElement>(null);

  // One handler for choosing and clearing the calendar day. Choosing a day
  // activates the date tab; clearing only falls back to All when the date
  // tab is the active one. Functional update keeps the document listener
  // from reading a stale active tab.
  const handleDayChange = useCallback((day: Date | null) => {
    setSelectedDay(day);
    setActiveTab((tab) => (day ? 'date' : tab === 'date' ? 'all' : tab));
  }, []);

  // Today is evaluated per render so filters stay correct without a midnight
  // timer; the calendar selection matters only for the date tab, so other
  // tabs never intersect it.
  const today = new Date();
  const cardsByTab: Record<EventTab, Article[]> = {
    all: filterEventCards(articlesData, 'all', null, today),
    past: filterEventCards(articlesData, 'past', null, today),
    upcoming: filterEventCards(articlesData, 'upcoming', null, today),
    date: filterEventCards(articlesData, 'date', selectedDay, today),
  };

  // One derivation for both panes: the left list and right cards read the
  // active tab's results and always agree.
  const activeEvents = cardsByTab[activeTab];

  // Clear the selection when clicking anywhere outside the events layout.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        layoutRef.current &&
        !layoutRef.current.contains(event.target as Node)
      ) {
        handleDayChange(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleDayChange]);

  const handleResultsAreaClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleDayChange(null);
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
            onSelectDay={handleDayChange}
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
              {formatCompactHeading(activeTab, selectedDay)}
            </h2>
            <div
              className='mt-4 space-y-8 text-sm leading-6 text-gray-500 h-full overflow-auto'
              ref={resultsRef}
            >
              {activeEvents.length > 0 ? (
                activeEvents.map((event) => (
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
        {/* Right pane: event cards filtered by the line tab bar. */}
        <section className='events-cards' aria-label='Event cards'>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='mb-4'
          >
            <TabsList aria-label='Filter event cards' variant='line'>
              <TabsTrigger value='all'>All</TabsTrigger>
              <TabsTrigger value='past'>Past</TabsTrigger>
              <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
              {/* Placeholder label until a calendar day is chosen. */}
              <TabsTrigger value='date' disabled={!selectedDay}>
                {selectedDay ? format(selectedDay, 'MMM dd, yyyy') : 'Selected Date'}
              </TabsTrigger>
            </TabsList>
            <TabsContent value='all'>
              <EventCardGrid events={cardsByTab.all} />
            </TabsContent>
            <TabsContent value='past'>
              <EventCardGrid events={cardsByTab.past} />
            </TabsContent>
            <TabsContent value='upcoming'>
              <EventCardGrid events={cardsByTab.upcoming} />
            </TabsContent>
            <TabsContent value='date'>
              <EventCardGrid events={cardsByTab.date} />
            </TabsContent>
          </Tabs>
        </section>
      </section>
    </div>
  );
}

export default Events;
