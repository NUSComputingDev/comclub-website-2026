import assert from 'node:assert/strict';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

// Load the TypeScript filter helper through esbuild, then import the emitted
// ESM so bare imports (date-fns) resolve against the repo's node_modules.
const here = path.dirname(fileURLToPath(import.meta.url));
const tsPath = path.join(here, '..', 'src', 'pages', 'events', 'eventFilters.ts');
const source = readFileSync(tsPath, 'utf8');
const emitted = transformSync(source, {
  loader: 'ts',
  format: 'esm',
  sourcefile: 'eventFilters.ts',
}).code;
const outPath = path.join(here, 'eventFilters.check.mjs');
writeFileSync(outPath, emitted);

let filterEventCards;
let eventCoversDay;
try {
  ({ filterEventCards, eventCoversDay } = await import(outPath));
} finally {
  rmSync(outPath);
}

// Fixed local current date. Fixture timestamps use explicit offsets whose
// instants fall on the same calendar day in both Asia/Singapore (UTC+8) and
// America/Los_Angeles (UTC-8), so expectations hold when run under either TZ.
const TODAY = new Date(2026, 0, 15);

function event(title, link, startDatetime, endDatetime) {
  const base = { department: 'IR', title, body: '', link, imgSrc: '' };
  if (startDatetime) base.startDatetime = startDatetime;
  if (endDatetime) base.endDatetime = endDatetime;
  return base;
}

const fixtures = [
  event('past', 'past', '2026-01-13T20:00:00+08:00', '2026-01-14T07:00:00-05:00'),
  event('ends-today', 'ends-today', '2026-01-14T12:00:00Z', '2026-01-15T12:00:00Z'),
  event('starts-tomorrow', 'starts-tomorrow', '2026-01-16T12:00:00Z', '2026-01-17T12:00:00Z'),
  event('ongoing', 'ongoing', '2026-01-14T20:00:00+08:00', '2026-01-16T07:00:00-05:00'),
  event('multi-day', 'multi-day', '2026-01-10T12:00:00Z', '2026-01-20T12:00:00Z'),
  event('undated', 'undated'),
];

const links = (events) => events.map((event) => event.link);
const linksOf = (tab, selectedDay = null) => links(filterEventCards(fixtures, tab, selectedDay, TODAY));

// All: every record in input order, undated included.
assert.deepEqual(linksOf('all'), ['past', 'ends-today', 'starts-tomorrow', 'ongoing', 'multi-day', 'undated']);

// Past: ended strictly before today's local day.
assert.deepEqual(linksOf('past'), ['past']);

// Upcoming: ends today or later, including the ongoing event; undated excluded.
assert.deepEqual(linksOf('upcoming'), ['ends-today', 'starts-tomorrow', 'ongoing', 'multi-day']);

// Date: events covering the selected day.
assert.deepEqual(linksOf('date', new Date(2026, 0, 15)), ['ends-today', 'ongoing', 'multi-day']);

// Date: both endpoints of a multi-day event match (inclusive range).
assert.deepEqual(linksOf('date', new Date(2026, 0, 10)), ['multi-day']);
assert.deepEqual(linksOf('date', new Date(2026, 0, 20)), ['multi-day']);

// Date: a day just outside the range matches nothing.
assert.deepEqual(linksOf('date', new Date(2026, 0, 9)), []);
assert.deepEqual(linksOf('date', new Date(2026, 0, 21)), []);

// Date: an empty day matches nothing; undated events never match a day.
assert.deepEqual(linksOf('date', new Date(2026, 0, 1)), []);
assert.equal(eventCoversDay(fixtures[5], new Date(2026, 0, 15)), false);

// Date: no selection means no results.
assert.deepEqual(linksOf('date', null), []);

// eventCoversDay: inclusive start/end day coverage.
assert.equal(eventCoversDay(fixtures[4], new Date(2026, 0, 10)), true);
assert.equal(eventCoversDay(fixtures[4], new Date(2026, 0, 20)), true);
assert.equal(eventCoversDay(fixtures[4], new Date(2026, 0, 15)), true);
assert.equal(eventCoversDay(fixtures[4], new Date(2026, 0, 9)), false);

// Input array order and contents survive every filter call.
const snapshot = JSON.stringify(fixtures);
for (const tab of ['all', 'past', 'upcoming', 'date']) {
  filterEventCards(fixtures, tab, new Date(2026, 0, 15), TODAY);
  filterEventCards(fixtures, tab, null, TODAY);
}
assert.equal(JSON.stringify(fixtures), snapshot);

console.log(`check-event-tabs OK (${Intl.DateTimeFormat().resolvedOptions().timeZone})`);
