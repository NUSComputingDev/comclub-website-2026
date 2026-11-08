import { isBefore, isWithinInterval, parseISO, startOfDay } from 'date-fns';
import { Article } from './zod';

export type EventTab = 'all' | 'past' | 'upcoming' | 'date';

// A day matches when local start-of-day falls inside the event's inclusive
// local start/end day range. Undated events never match.
export function eventCoversDay(event: Article, day: Date) {
  if (!event.startDatetime || !event.endDatetime) return false;

  return isWithinInterval(startOfDay(day), {
    start: startOfDay(parseISO(event.startDatetime)),
    end: startOfDay(parseISO(event.endDatetime)),
  });
}

// Local day the event ends, or null when the event has no dates.
function eventEndDay(event: Article): Date | null {
  if (!event.startDatetime || !event.endDatetime) return null;

  return startOfDay(parseISO(event.endDatetime));
}

// Filter cards by tab using local calendar days. The current date is passed
// explicitly so checks stay deterministic; input order is preserved and the
// source array is never mutated.
export function filterEventCards(
  events: Article[],
  tab: EventTab,
  selectedDay: Date | null,
  today: Date,
): Article[] {
  const startOfToday = startOfDay(today);

  switch (tab) {
    case 'all':
      // All keeps everything, including undated events.
      return events;
    case 'past':
      // Ended strictly before today's local day.
      return events.filter((event) => {
        const end = eventEndDay(event);
        return end !== null && isBefore(end, startOfToday);
      });
    case 'upcoming':
      // Ends today or later, so ongoing events stay included.
      return events.filter((event) => {
        const end = eventEndDay(event);
        return end !== null && !isBefore(end, startOfToday);
      });
    case 'date':
      return selectedDay
        ? events.filter((event) => eventCoversDay(event, selectedDay))
        : [];
  }
}
