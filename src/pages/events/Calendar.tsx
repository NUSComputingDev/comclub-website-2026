import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  isWithinInterval,
  parse,
  parseISO,
  startOfDay,
  startOfToday,
} from 'date-fns';
import articles from './articles.json';
import SearchResult from './SearchResult';
import { Article, parseArticles } from './zod';

const parsedArticles = parseArticles(articles);
const articlesData: Article[] = Object.values(parsedArticles).sort((a, b) => {
  if (!a.startDatetime) return 1;
  if (!b.startDatetime) return -1;
  return (
    parseISO(a.startDatetime).getTime() - parseISO(b.startDatetime).getTime()
  );
});

type DepartmentFilter = 'ALL' | Article['department'];
type TimeFilter = 'ALL' | 'UPCOMING' | 'PAST' | 'TBC';

function classNames(...classes: (string | boolean | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Calendar() {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] =
    useState<DepartmentFilter>('ALL');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('ALL');
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  const calendarRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  function goToToday() {
    setCurrentMonth(format(today, 'MMM-yyyy'));
    setSelectedDay(today);
  }

  const displayedArticles = selectedDay
    ? articlesData.filter((article) => {
      if (!article.startDatetime || !article.endDatetime) return false;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const displayedArticles = articlesData.filter((article) => {
    if (selectedDay) {
      if (!article.startDatetime || !article.endDatetime) return false;
      const inSelectedDay = isWithinInterval(startOfDay(selectedDay), {
        start: startOfDay(parseISO(article.startDatetime)),
        end: startOfDay(parseISO(article.endDatetime)),
      });
      if (!inSelectedDay) return false;
    }

    if (departmentFilter !== 'ALL' && article.department !== departmentFilter) {
      return false;
    }

    if (timeFilter === 'TBC') {
      if (article.startDatetime || article.endDatetime) return false;
    } else if (timeFilter === 'UPCOMING') {
      if (!article.endDatetime) return false;
      if (startOfDay(parseISO(article.endDatetime)) < today) return false;
    } else if (timeFilter === 'PAST') {
      if (!article.endDatetime) return false;
      if (startOfDay(parseISO(article.endDatetime)) >= today) return false;
    }

    if (normalizedQuery) {
      const matchesTitle = article.title
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesBody = article.body.toLowerCase().includes(normalizedQuery);
      if (!matchesTitle && !matchesBody) return false;
    }

    return true;
  });

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
  }, [calendarRef, resultsRef]);

  const handleResultsAreaClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setSelectedDay(null);
    }
  };

  const departmentOptions: { label: string; value: DepartmentFilter }[] = [
    { label: 'All Wings', value: 'ALL' },
    { label: 'Student Development', value: 'SD' },
    { label: 'Student Life', value: 'SL' },
    { label: 'Internal Relations', value: 'IR' },
  ];

  const timeOptions: { label: string; value: TimeFilter }[] = [
    { label: 'All Dates', value: 'ALL' },
    { label: 'Upcoming', value: 'UPCOMING' },
    { label: 'Past', value: 'PAST' },
    { label: 'Date TBC', value: 'TBC' },
  ];

  return (
    <div className='pt-16'>
      <div className='w-[calc(100vw-2rem)] max-w-md mx-auto md:max-w-[68rem] md:px-6'>
        <div className='md:grid md:grid-cols-2 md:divide-x md:divide-gray-200'>
          <div className='self-start p-6 border border-gray-200 rounded-2xl md:mr-14' ref={calendarRef}>
            <div className='flex items-center'>
              <h2 className='flex-auto text-xl font-semibold text-gray-900'>
                {format(firstDayCurrentMonth, 'MMMM yyyy')}
              </h2>
              <button
                onClick={goToToday}
                type='button'
                className='-my-2 mr-2 flex flex-none items-center justify-center rounded-full
                  border border-gray-300 px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100'
              >
                Today
              </button>
              <button
                type='button'
                onClick={previousMonth}
                className='-my-2 flex flex-none items-center justify-center rounded-full border border-gray-300
                  p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500'
              >
                <span className='sr-only'>Previous month</span>
                <ChevronLeftIcon className='w-6 h-6' aria-hidden='true' />
              </button>
              <button
                onClick={nextMonth}
                type='button'
                className='-my-2 ml-2 flex flex-none items-center justify-center rounded-full
                  border border-gray-300 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500'
              >
                <span className='sr-only'>Next month</span>
                <ChevronRightIcon className='w-6 h-6' aria-hidden='true' />
              </button>
            </div>
            <div className='grid grid-cols-7 mt-6 text-xs leading-6 text-center font-semibold uppercase text-gray-500'>
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className='grid grid-cols-7 mt-2 text-sm'>
              {days.map((day, dayIdx) => (
                <div
                  key={day.toString()}
                  className={classNames(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    'py-1.5',
                  )}
                >
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDay(day);
                    }}
                    className={classNames(
                      selectedDay && isEqual(day, selectedDay) && 'text-white',
                      !selectedDay && isToday(day) && 'text-red-500',
                      selectedDay &&
                        !isEqual(day, selectedDay) &&
                        isToday(day) &&
                        'text-red-500',
                      !selectedDay &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        'text-gray-900',
                      selectedDay &&
                        !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        'text-gray-900',
                      !selectedDay &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        'text-gray-400',
                      selectedDay &&
                        !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        'text-gray-400',
                      selectedDay &&
                        isEqual(day, selectedDay) &&
                        isToday(day) &&
                        'bg-red-500',
                      selectedDay &&
                        isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        'bg-gray-900',
                      !selectedDay && 'hover:bg-gray-200',
                      ((selectedDay && isEqual(day, selectedDay)) ||
                        isToday(day)) &&
                        'font-semibold',
                      'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
                    )}
                  >
                    <time dateTime={format(day, 'yyyy-MM-dd')}>
                      {format(day, 'd')}
                    </time>
                  </button>

                  <div className='w-1 h-1 mx-auto mt-1'>
                    {articlesData.some((article) => {
                      if (!article.startDatetime || !article.endDatetime) {
                        return false;
                      }

                      return isWithinInterval(startOfDay(day), {
                        start: startOfDay(parseISO(article.startDatetime)),
                        end: startOfDay(parseISO(article.endDatetime)),
                      });
                    }) && <div className='w-1 h-1 rounded-full bg-sky-500' />}
                  </div>
                </div>
              ))}
            </div>
            <div
              className='flex flex-wrap items-center pt-4 mt-1 text-sm text-gray-500
                border-t border-gray-200 gap-x-5 gap-y-2'
            >
              <div className='flex items-center gap-2'>
                <span className='w-1.5 h-1.5 rounded-full bg-sky-500' aria-hidden='true' />
                Has events
              </div>
              <div className='flex items-center gap-2'>
                <span className='w-4 h-4 bg-red-500 rounded-full' aria-hidden='true' />
                Today
              </div>
              <div className='flex items-center gap-2'>
                <span className='w-4 h-4 bg-gray-900 rounded-full' aria-hidden='true' />
                Selected
              </div>
            </div>
          </div>
          <section
            className='gap-0 mt-12 md:mt-0 pl-0 md:pl-14 flex flex-col justify-start
              min-h-[200px] w-full md:min-w-[450px] pr-0'
            onClick={handleResultsAreaClick}
          >
            <div
              className='w-full pl-4 pr-2 mb-4 space-y-3'
              ref={resultsRef}
            >
              <div
                className='flex items-center gap-2 px-3 py-2 bg-white border
                  border-gray-300 rounded-xl focus-within:border-primary'
              >
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    className={classNames(
                      departmentFilter === option.value
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                      'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                    )}
                  >
                    {option.label}
                  </button>
                ))}
                <span className='mx-1 text-gray-300'>|</span>
                {timeOptions.map((option) => (
                  <button
                    key={option.value}
                    type='button'
                    aria-pressed={timeFilter === option.value}
                    onClick={() => {
                      setTimeFilter(option.value);
                      if (option.value === 'TBC') {
                        setSelectedDay(null);
                      }
                    }}
                    className={classNames(
                      timeFilter === option.value
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                      'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className='flex items-center justify-between pt-1'>
                <h2 className='font-semibold text-gray-900 text-left'>
                  {selectedDay
                    ? `Events on ${format(selectedDay, 'MMM dd, yyyy')}`
                    : 'All Events'}
                </h2>
                {selectedDay && (
                  <button
                    type='button'
                    onClick={() => setSelectedDay(null)}
                    className='text-xs font-medium text-primary hover:underline'
                  >
                    Clear date ({format(selectedDay, 'MMM dd')})
                  </button>
                )}
              </div>

              <div className='mt-4 space-y-8 text-sm leading-6 text-gray-500 h-full overflow-auto'>
                {displayedArticles.length > 0 ? (
                  displayedArticles.map((article) => (
                    <SearchResult
                      title={article.title}
                      link={`/events/${article.link}`}
                      snippet={
                        article.body.length > 120
                          ? article.body.substring(0, 120) + '...'
                          : article.body
                      }
                      key={article.link}
                    />
                  ))
                ) : (
                  <p>No events found.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];
