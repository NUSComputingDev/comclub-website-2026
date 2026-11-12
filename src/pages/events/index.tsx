import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Article } from './zod';
import { articlesData, formatEventDate } from './articlesData';
import { filterEventCards, type EventTab } from './eventFilters';
import Calendar from './Calendar';
import ThreeDCard from '../../components/3DCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/tabs';
import './index.css';
import 'react-calendar/dist/Calendar.css';

type DepartmentFilter = 'ALL' | Article['department'];

const departmentOptions: { label: string; value: DepartmentFilter }[] = [
  { label: 'All Wings', value: 'ALL' },
  { label: 'Student Development', value: 'SD' },
  { label: 'Student Life', value: 'SL' },
  { label: 'Internal Relations', value: 'IR' },
];

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

// Reusable filter tabs component.
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
  // Shared boundary for the outside-click check: spans the calendar and the
  // event pane so pane interactions keep the selection.
  const layoutRef = useRef<HTMLElement>(null);

  // One handler for choosing and clearing the calendar day. Choosing a day
  // activates the date tab; clearing only falls back to All when the date
  // tab is the active one.
  const handleDayChange = useCallback((day: Date | null) => {
    setSelectedDay(day);
    setActiveTab((tab) => (day ? 'date' : tab === 'date' ? 'all' : tab));
  }, []);

  // Search and wing filters narrow the set before the tab split.
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
  // timer; the calendar selection matters only for the date tab.
  const today = new Date();
  const cardsByTab: Record<EventTab, Article[]> = {
    all: filterEventCards(filteredEvents, 'all', null, today),
    past: filterEventCards(filteredEvents, 'past', null, today),
    upcoming: filterEventCards(filteredEvents, 'upcoming', null, today),
    date: filterEventCards(filteredEvents, 'date', selectedDay, today),
  };

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

  return (
    <div className='events'>
      <h1>
        Events
      </h1>

      {/* Calendar on the left, full event browser on the right. */}
      <section className='events-layout' ref={layoutRef}>
        <div className='events-left'>
          <Calendar
            selectedDay={selectedDay}
            onSelectDay={handleDayChange}
            events={articlesData}
            containerRef={calendarRef}
          />
        </div>

        <section className='events-cards' aria-label='Event cards'>
          <div className='events-filters'>
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
