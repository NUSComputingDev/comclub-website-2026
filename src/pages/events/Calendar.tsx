import React, { useState } from 'react';
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

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  // Jump back to the current month and select today.
  function goToToday() {
    setCurrentMonth(format(today, 'MMM-yyyy'));
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

  return (
    <div ref={containerRef}>
      <div className='flex items-center'>
        <h2 className='flex-auto text-xl font-semibold text-gray-900'>
          {format(firstDayCurrentMonth, 'MMMM yyyy')}
        </h2>
        <button
          type='button'
          onClick={goToToday}
          className='-my-2 mr-2 flex flex-none items-center justify-center rounded-full
            border border-gray-300 px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100'
        >
          Today
        </button>
        <button
          type='button'
          onClick={previousMonth}
          className='-my-2 flex flex-none items-center justify-center rounded-full border
            border-gray-300 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500'
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
