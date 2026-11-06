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
  return parseISO(a.startDatetime).getTime() - parseISO(b.startDatetime).getTime();
});

function classNames(...classes: (string | boolean | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Calendar() {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
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

      return isWithinInterval(startOfDay(selectedDay), {
        start: startOfDay(parseISO(article.startDatetime)),
        end: startOfDay(parseISO(article.endDatetime)),
      });
    })
    : articlesData;

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
                      selectedDay && !isEqual(day, selectedDay) && isToday(day) && 'text-red-500',
                      !selectedDay && !isToday(day) && isSameMonth(day, firstDayCurrentMonth) && 'text-gray-900',
                      selectedDay && !isEqual(day, selectedDay) &&
                      !isToday(day) && isSameMonth(day, firstDayCurrentMonth) && 'text-gray-900',
                      !selectedDay && !isToday(day) && !isSameMonth(day, firstDayCurrentMonth) && 'text-gray-400',
                      selectedDay && !isEqual(day, selectedDay) && !isToday(day) &&
                      !isSameMonth(day, firstDayCurrentMonth) && 'text-gray-400',
                      selectedDay && isEqual(day, selectedDay) && isToday(day) && 'bg-red-500',
                      selectedDay && isEqual(day, selectedDay) && !isToday(day) && 'bg-gray-900',
                      !selectedDay && 'hover:bg-gray-200',
                      (selectedDay && isEqual(day, selectedDay) || isToday(day)) && 'font-semibold',
                      'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
                    )}
                  >
                    <time dateTime={format(day, 'yyyy-MM-dd')}>
                      {format(day, 'd')}
                    </time>
                  </button>

                  <div className='w-1 h-1 mx-auto mt-1'>
                    {articlesData.some((article) => {
                      if (!article.startDatetime || !article.endDatetime) return false;

                      return isWithinInterval(startOfDay(day), {
                        start: startOfDay(parseISO(article.startDatetime)),
                        end: startOfDay(parseISO(article.endDatetime)),
                      });
                    }) && (
                      <div className='w-1 h-1 rounded-full bg-sky-500'/>
                    )}
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
            <h2 className='font-semibold text-gray-900 text-left w-full pl-4'>
              {selectedDay
                ? `Events on ${format(selectedDay, 'MMM dd, yyyy')}`
                : 'All Events'}
            </h2>
            <div
              className='mt-4 space-y-8 text-sm leading-6 text-gray-500 h-full overflow-auto'
              ref={resultsRef}
            >
              {displayedArticles.length > 0 ? (
                displayedArticles.map((article) => (
                  <SearchResult
                    title={article.title}
                    link={`/events/${article.link}`}
                    snippet={article.body.length > 120 ? article.body.substring(0, 120) + '...' : article.body}
                    key={article.link}
                  />
                ))
              ) : (
                <p>No events found.</p>
              )}
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
