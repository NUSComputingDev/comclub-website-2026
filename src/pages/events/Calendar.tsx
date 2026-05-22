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
const articlesData: Article[] = Object.values(parsedArticles).sort((a, b) =>
  parseISO(a.startDatetime).getTime() - parseISO(b.startDatetime).getTime(),
);

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

  const displayedArticles = selectedDay
    ? articlesData.filter((article) =>
      isWithinInterval(startOfDay(selectedDay), {
        start: startOfDay(parseISO(article.startDatetime)),
        end: startOfDay(parseISO(article.endDatetime)),
      }),
    )
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
      <div className='max-w-sm px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6'>
        <div className='md:grid md:grid-cols-2 md:divide-x md:divide-gray-200'>
          <div className='md:pr-14 h-[350px]' ref={calendarRef}>
            <div className='flex items-center'>
              <h2 className='flex-auto font-semibold text-gray-900'>
                {format(firstDayCurrentMonth, 'MMMM yyyy')}
              </h2>
              <button
                type='button'
                onClick={previousMonth}
                className='-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500'
              >
                <span className='sr-only'>Previous month</span>
                <ChevronLeftIcon className='w-5 h-5' aria-hidden='true' />
              </button>
              <button
                onClick={nextMonth}
                type='button'
                className='-my-1.5 -mr-1.5 ml-2 flex flex-none items-center
                  justify-center p-1.5 text-gray-400 hover:text-gray-500'
              >
                <span className='sr-only'>Next month</span>
                <ChevronRightIcon className='w-5 h-5' aria-hidden='true' />
              </button>
            </div>
            <div className='grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500'>
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
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
                    {articlesData.some((article) =>
                      isWithinInterval(startOfDay(day), {
                        start: startOfDay(parseISO(article.startDatetime)),
                        end: startOfDay(parseISO(article.endDatetime)),
                      }),
                    ) && (
                      <div className='w-1 h-1 rounded-full bg-sky-500'/>
                    )}
                  </div>
                </div>
              ))}
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
