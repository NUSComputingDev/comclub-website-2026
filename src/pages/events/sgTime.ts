const SG_TIME_ZONE = 'Asia/Singapore';

// Singapore calendar parts for an instant, independent of the viewer's zone.
function sgParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SG_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);

  return { year: get('year'), month: get('month'), day: get('day') };
}

/** Day number (UTC midnight) of the Singapore calendar day for an instant. */
export function sgDayNumber(date: Date) {
  const { year, month, day } = sgParts(date);
  return Date.UTC(year, month - 1, day);
}

/** "Jun 16, 2026" in Singapore, regardless of where the viewer is. */
export function formatSgDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: SG_TIME_ZONE,
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function isSameSgDay(a: Date, b: Date) {
  return sgDayNumber(a) === sgDayNumber(b);
}
