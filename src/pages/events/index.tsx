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

type DepartmentFilter = 'ALL' | Article['department'];

const departmentOptions: { label: string; value: DepartmentFilter }[] = [
  { label: 'All Wings', value: 'ALL' },
  { label: 'Student Development', value: 'SD' },
  { label: 'Student Life', value: 'SL' },
  { label: 'Internal Relations', value: 'IR' },
];

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
function EventCardGrid({ events, onBrowseAll }: { events: Article[]; onBrowseAll?: () => void }) {
  if (events.length === 0) {
    return (
      <div className='events-empty-state'>
        <p className='events-empty-text-bold'>Sorry, no events found</p>
        <p className='events-empty-browse'>
          Browse <span onClick={onBrowseAll} className='events-browse-link'>all events</span>.
        </p>
      </div>
    );
  }

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

// Reusable filter tabs component for both desktop and mobile.
function EventTabs({
  selectedDay,
  ariaLabel,
  className,
}: {
  selectedDay: Date | null;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <TabsList aria-label={ariaLabel} variant='line' className={className}>
      <TabsTrigger value='all'>All</TabsTrigger>
      <TabsTrigger value='past'>Past</TabsTrigger>
      <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
      {/* Date tab is disabled until a calendar day is selected. */}
      <TabsTrigger value='date' disabled={!selectedDay}>
        {selectedDay ? format(selectedDay, 'MMM dd, yyyy') : 'Selected Date'}
      </TabsTrigger>
    </TabsList>
  );
}

function Events() {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<EventTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] =
    useState<DepartmentFilter>('ALL');
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

  // Search and wing filters narrow the set before the tab split, so both
  // panes and the date tab always agree on the same visible events.
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredEvents = articlesData.filter((event) => {
    if (departmentFilter !== 'ALL' && event.department !== departmentFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      event.title.toLowerCase().includes(normalizedQuery) ||
      event.body.toLowerCase().includes(normalizedQuery)
    );
  });

  // Today is evaluated per render so filters stay correct without a midnight
  // timer; the calendar selection matters only for the date tab, so other
  // tabs never intersect it.
  const today = new Date();
  const cardsByTab: Record<EventTab, Article[]> = {
    all: filterEventCards(filteredEvents, 'all', null, today),
    past: filterEventCards(filteredEvents, 'past', null, today),
    upcoming: filterEventCards(filteredEvents, 'upcoming', null, today),
    date: filterEventCards(filteredEvents, 'date', selectedDay, today),
  };

  // One derivation for both panes: the left list and right cards read the
  // active tab's results and always agree.
  const activeEvents = cardsByTab[activeTab];

  // Reset every filter so the empty-state "all events" link always has
  // something to show.
  const resetFilters = useCallback(() => {
    setActiveTab('all');
    setSearchQuery('');
    setDepartmentFilter('ALL');
  }, []);

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
          {/* Search and wing filters carried over from the previous events
              page; they narrow both the list and the card pane. */}
          <div className='w-full px-4 mt-6 space-y-3'>
            <div
              className='flex items-center gap-2 px-3 py-2 bg-white border
                border-gray-300 rounded-xl focus-within:border-primary'
            >
              <input
                type='text'
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder='Search events by title or keyword...'
                aria-label='Search events'
                className='w-full text-sm text-gray-900 bg-transparent focus:outline-none'
              />
              {searchQuery && (
                <button
                  type='button'
                  onClick={() => setSearchQuery('')}
                  className='text-xs font-medium text-gray-400 hover:text-gray-600'
                >
                  Clear
                </button>
              )}
            </div>
            <div className='flex flex-wrap items-center gap-1.5'>
              {departmentOptions.map((option) => (
                <button
                  key={option.value}
                  type='button'
                  aria-pressed={departmentFilter === option.value}
                  onClick={() => setDepartmentFilter(option.value)}
                  className={[
                    departmentFilter === option.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                    'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          {/* Mobile filter tabs between calendar and compact list. Hidden on desktop. */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className='mb-4 lg:hidden'>
            <EventTabs
              selectedDay={selectedDay}
              ariaLabel='Filter event cards (mobile)'
              className='w-full max-w-full pt-1.5 pb-2'
            />
          </Tabs>
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
                <div className='events-empty-state'>
                  <p className='events-empty-text-bold'>Sorry, no events found</p>
                  <p className='events-empty-browse'>
                    Browse <span onClick={resetFilters} className='events-browse-link'>all events</span>.
                  </p>
                </div>
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
            <EventTabs selectedDay={selectedDay} ariaLabel='Filter event cards' />
            <TabsContent value='all'>
              <EventCardGrid events={cardsByTab.all} onBrowseAll={resetFilters} />
            </TabsContent>
            <TabsContent value='past'>
              <EventCardGrid events={cardsByTab.past} onBrowseAll={resetFilters} />
            </TabsContent>
            <TabsContent value='upcoming'>
              <EventCardGrid events={cardsByTab.upcoming} onBrowseAll={resetFilters} />
            </TabsContent>
            <TabsContent value='date'>
              <EventCardGrid events={cardsByTab.date} onBrowseAll={resetFilters} />
            </TabsContent>
          </Tabs>
        </section>
      </section>
    </div>
  );
}

export default Events;
