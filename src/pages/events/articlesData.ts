import { parseISO } from 'date-fns';
import articles from './articles.json';
import { Article, parseArticles } from './zod';
import { formatSgDate, isSameSgDay, sgDayNumber } from './sgTime';

// Newest start first; undated events always sort to the end.
// Shared by the events page and the homepage preview so both read one source.
export const articlesData: Article[] = Object.values(parseArticles(articles)).sort((a, b) => {
  if (!a.startDatetime) return 1;
  if (!b.startDatetime) return -1;
  return parseISO(b.startDatetime).getTime() - parseISO(a.startDatetime).getTime();
});

// Range label (start – end) only when the end falls on a different Singapore
// day. Dates are pinned to Singapore so overseas viewers see the club's dates.
export function formatEventDate(event: Article) {
  const start = parseISO(event.startDatetime!);
  const startLabel = formatSgDate(start);

  if (event.endDatetime) {
    const end = parseISO(event.endDatetime);
    if (!isSameSgDay(start, end)) {
      return `${startLabel} – ${formatSgDate(end)}`;
    }
  }

  return startLabel;
}

// Events for the homepage preview: upcoming/ongoing ones first (soonest
// first), topped up with the most recent past ones so the list is never empty.
export function latestEvents(count: number, today: Date = new Date()): Article[] {
  const todayDay = sgDayNumber(today);
  const dated = articlesData.filter((event) => event.startDatetime && event.endDatetime);
  const isPast = (event: Article) =>
    sgDayNumber(parseISO(event.endDatetime!)) < todayDay;

  const upcoming = dated.filter((event) => !isPast(event)).reverse();
  const past = dated.filter(isPast);

  return [...upcoming, ...past].slice(0, count);
}
