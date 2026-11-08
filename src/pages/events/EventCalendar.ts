import type { Article } from './zod';

//this function returns a valid start and end date of an event
export function getEventDates(article: Article) {
  //this voids events with no start or end date
  if (!article.startDatetime || !article.endDatetime) {
    return null;
  }

  const start = new Date(article.startDatetime);
  const end = new Date(article.endDatetime);
  //check for date validity
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end <= start
  ) {
    return null;
  }

  return { start, end };
}

// Calendar providers use an exclusive end date for all-day events.
function getCalendarDates(article: Article) {
  const dates = getEventDates(article);

  if (!dates || !article.allDay) {
    return dates;
  }

  const exclusiveEnd = new Date(dates.end.getTime());
  exclusiveEnd.setUTCDate(exclusiveEnd.getUTCDate() + 1);

  return { start: dates.start, end: exclusiveEnd };
}

//formats the generation time, start and end
export function formatCalendarTimeStamp(date: Date): string {
  //ok i had to use codex for this cuz no way i knew this formatting for .ics files
  return date.toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
}
//formats the date to be added to calendar without the time for all day events
export function formatCalendarDate(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Singapore',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  return ['year', 'month', 'day']
    .map(type => parts.find(part => part.type === type)?.value)
    .join('');
}

//safely inserts the title of the event to calender
export function escapeCalendarText(value: string): string {
  //this as well...
  return value.replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

export function buildGoogleCalendarUrl(article: Article, pageUrl: string): string | null {
  const dates = getCalendarDates(article);

  if (!dates) {
    return null;
  }

  const calendarDates = article.allDay
    ? `${formatCalendarDate(dates.start)}/${formatCalendarDate(dates.end)}`
    : `${formatCalendarTimeStamp(dates.start)}/${formatCalendarTimeStamp(dates.end)}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: article.title,
    dates: calendarDates,
    details: pageUrl,
    ctz: 'Asia/Singapore',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildCalendarFile(article: Article, pageUrl: string): string | null {
  const dates = getCalendarDates(article);

  if (!dates) {
    return null;
  }
  let dateLines: string[];
  if (article.allDay) {
    dateLines = [
      `DTSTART;VALUE=DATE:${formatCalendarDate(dates.start)}`,
      `DTEND;VALUE=DATE:${formatCalendarDate(dates.end)}`,
    ];
  } else {
    dateLines = [
      `DTSTART:${formatCalendarTimeStamp(dates.start)}`,
      `DTEND:${formatCalendarTimeStamp(dates.end)}`,
    ];
  }
  //got this from codex too
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NUS Computing Club//Event Calendar//EN',
    'BEGIN:VEVENT',
    `UID:${encodeURIComponent(article.link)}@nuscomputing.com`,
    `DTSTAMP:${formatCalendarTimeStamp(new Date())}`,
    ...dateLines,
    `SUMMARY:${escapeCalendarText(article.title)}`,
    `URL:${pageUrl}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.map(foldCalendarLine).join('\r\n') + '\r\n';
}
//helper function to keep the calender lines limited to 75 bytes,tldr this is line folding
export function foldCalendarLine(line: string): string {
  const encoder = new TextEncoder();
  let result = '';
  let lineBytes = 0;

  for (const character of line) {
    const characterBytes = encoder.encode(character).length;

    if (lineBytes + characterBytes > 75) {
      result += '\r\n ';
      lineBytes = 1;
    }

    result += character;
    lineBytes += characterBytes;
  }

  return result;
}
