import React, { useState } from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import {
  add,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  endOfYear,
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
  startOfYear,
} from 'date-fns';
import { Article } from './zod';

interface CalendarProps {
  selectedDay: Date | null;
  onSelectDay: (day: Date | null) => void;
  /** Events used to render the day markers. */
  events: Article[];
  /** Parent-owned ref so the page can detect clicks outside the calendar. */
  containerRef: React.RefObject<HTMLDivElement>;
}

function classNames(...classes: (string | boolean | null)[]) {
  return classes.filter(Boolean).join(' ');
}

// Date picker only: selection state lives in the page.
function Calendar({ selectedDay, onSelectDay, events, containerRef }: CalendarProps) {
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
  // 'days' shows the usual day grid. 'months' swaps it for a month picker so a
  // distant month is one tap away instead of many arrow clicks.
  const [view, setView] = useState<'days' | 'months'>('days');
  const showingMonths = view === 'months';

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  const months = eachMonthOfInterval({
    start: startOfYear(firstDayCurrentMonth),
    end: endOfYear(firstDayCurrentMonth),
  });

  // The arrows step by month in the day grid and by year in the month picker.
  function shift(direction: 1 | -1) {
    const target = add(
      firstDayCurrentMonth,
      showingMonths ? { years: direction } : { months: direction },
    );
    setCurrentMonth(format(target, 'MMM-yyyy'));
  }

  function pickMonth(month: Date) {
    setCurrentMonth(format(month, 'MMM-yyyy'));
    setView('days');
  }

  // Jump back to the current month and select today.
  function goToToday() {
    setCurrentMonth(format(today, 'MMM-yyyy'));
    setView('days');
    onSelectDay(today);
  }

  // A day gets a dot when any event's start/end range covers it.
  function hasEventOnDay(day: Date) {
    return events.some(
      (event) =>
        Boolean(event.startDatetime && event.endDatetime) &&
        isWithinInterval(startOfDay(day), {
          start: startOfDay(parseISO(event.startDatetime!)),
          end: startOfDay(parseISO(event.endDatetime!)),
        }),
    );
  }

  // A month gets a dot when any event's start/end range overlaps it.
  function hasEventInMonth(month: Date) {
    const monthEnd = endOfMonth(month);
    return events.some(
      (event) =>
        Boolean(event.startDatetime && event.endDatetime) &&
        parseISO(event.startDatetime!) <= monthEnd &&
        parseISO(event.endDatetime!) >= month,
    );
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && showingMonths) setView('days');
      }}
    >
      <div className='flex items-center'>
        <h2 className='flex-auto min-w-0 text-lg font-semibold text-gray-900 xs:text-xl'>
          <button
            type='button'
            onClick={() => setView(showingMonths ? 'days' : 'months')}
            aria-expanded={showingMonths}
            aria-label={showingMonths
              ? `${format(firstDayCurrentMonth, 'yyyy')}, back to days`
              : `${format(firstDayCurrentMonth, 'MMMM yyyy')}, choose a month`}
            className='-mx-2 -my-1 inline-flex max-w-[calc(100%+1rem)] items-center gap-1 rounded-lg
              px-2 py-1 text-left hover:bg-gray-100'
          >
            {/* Short month name on phones so the title never crowds the buttons. */}
            <span className='truncate xs:hidden'>
              {format(firstDayCurrentMonth, showingMonths ? 'yyyy' : 'MMM yyyy')}
            </span>
            <span className='hidden truncate xs:inline'>
              {format(firstDayCurrentMonth, showingMonths ? 'yyyy' : 'MMMM yyyy')}
            </span>
            <ChevronDownIcon
              className={classNames(
                showingMonths && 'rotate-180',
                'w-5 h-5 flex-none text-gray-400 transition-transform',
              )}
              aria-hidden='true'
            />
          </button>
        </h2>
        <button
          type='button'
          onClick={goToToday}
          className='-my-2 mr-2 flex flex-none items-center justify-center rounded-full
            border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100
            xs:px-4 xs:text-base'
        >
          Today
        </button>
        <button
          type='button'
          onClick={() => shift(-1)}
          className='-my-2 flex flex-none items-center justify-center rounded-full border
            border-gray-300 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500'
        >
          <span className='sr-only'>{showingMonths ? 'Previous year' : 'Previous month'}</span>
          <ChevronLeftIcon className='w-6 h-6' aria-hidden='true' />
        </button>
        <button
          onClick={() => shift(1)}
          type='button'
          className='-my-2 ml-2 flex flex-none items-center justify-center rounded-full
            border border-gray-300 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500'
        >
          <span className='sr-only'>{showingMonths ? 'Next year' : 'Next month'}</span>
          <ChevronRightIcon className='w-6 h-6' aria-hidden='true' />
        </button>
      </div>
      {showingMonths ? (
        <div className='grid grid-cols-3 gap-2 mt-6 mb-3 text-sm'>
          {months.map((month) => {
            const isShown = isSameMonth(month, firstDayCurrentMonth);
            const isThisMonth = isSameMonth(month, today);
            return (
              <button
                key={month.toString()}
                type='button'
                onClick={() => pickMonth(month)}
                aria-pressed={isShown}
                className={classNames(
                  isShown && 'bg-gray-900 text-white',
                  !isShown && 'hover:bg-gray-200',
                  !isShown && isThisMonth && 'text-red-500',
                  !isShown && !isThisMonth && 'text-gray-900',
                  (isShown || isThisMonth) && 'font-semibold',
                  'flex h-14 flex-col items-center justify-center rounded-xl',
                )}
              >
                <time dateTime={format(month, 'yyyy-MM')}>
                  <span aria-hidden='true'>{format(month, 'MMM')}</span>
                  <span className='sr-only'>{format(month, 'MMMM yyyy')}</span>
                </time>
                <span
                  className={classNames(
                    hasEventInMonth(month) && 'bg-sky-500',
                    'w-1 h-1 mt-1 rounded-full',
                  )}
                  aria-hidden='true'
                />
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <div className='grid grid-cols-7 mt-6 text-xs font-semibold uppercase leading-6 text-center text-gray-500'>
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
                    onSelectDay(day);
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
                  {hasEventOnDay(day) && (
                    <div className='w-1 h-1 rounded-full bg-sky-500'/>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
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

export default Calendar;
