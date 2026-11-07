import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

// Use the same TypeScript loading approach as flickr.test.mjs, without a new dependency.
const source = readFileSync(new URL('../src/pages/events/EventCalendar.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
});
const { buildGoogleCalendarUrl } = await import(`data:text/javascript;base64,${
  Buffer.from(outputText).toString('base64')}`);

const article = {
  department: 'SD',
  title: 'Computing workshop',
  body: 'Workshop details',
  link: 'computing-workshop',
  imgSrc: '',
  startDatetime: '2026-11-10T10:00:00+08:00',
  endDatetime: '2026-11-10T12:30:00+08:00',
  allDay: false,
};
const pageUrl = 'https://nuscomputing.com/events/computing-workshop';

test('timed event link prefills the title, UTC range, page URL, and Singapore timezone', () => {
  const url = new URL(buildGoogleCalendarUrl(article, pageUrl));

  assert.equal(url.origin, 'https://calendar.google.com');
  assert.equal(url.pathname, '/calendar/render');
  assert.deepEqual(Object.fromEntries(url.searchParams), {
    action: 'TEMPLATE',
    text: article.title,
    dates: '20261110T020000Z/20261110T043000Z',
    details: pageUrl,
    ctz: 'Asia/Singapore',
  });
});

test('timed events can cross midnight and omit the optional allDay flag', () => {
  const url = new URL(buildGoogleCalendarUrl({
    ...article,
    startDatetime: '2026-11-10T23:00:00+08:00',
    endDatetime: '2026-11-11T01:00:00+08:00',
    allDay: undefined,
  }, pageUrl));

  assert.equal(url.searchParams.get('dates'), '20261110T150000Z/20261110T170000Z');
});

const invalidRanges = [
  ['both dates missing', { startDatetime: undefined, endDatetime: undefined }],
  ['start missing', { startDatetime: undefined }],
  ['end missing', { endDatetime: undefined }],
  ['start empty', { startDatetime: '' }],
  ['end empty', { endDatetime: '' }],
  ['start invalid', { startDatetime: 'not a date' }],
  ['end invalid', { endDatetime: 'not a date' }],
  ['equal instants with different offsets', { endDatetime: '2026-11-10T02:00:00Z' }],
  ['end before start', { endDatetime: '2026-11-10T09:59:00+08:00' }],
];

for (const [name, dates] of invalidRanges) {
  test(`event link rejects ${name}`, () => {
    assert.equal(buildGoogleCalendarUrl({ ...article, ...dates }, pageUrl), null);
  });
}
