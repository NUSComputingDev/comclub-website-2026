import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

// Use the same TypeScript loading approach as flickr.test.mjs, without a new dependency.
const source = readFileSync(new URL('../src/pages/events/EventCalendar.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
});
const {
  buildGoogleCalendarUrl,
  buildOutlookCalendarUrl,
  buildCalendarFile,
} = await import(`data:text/javascript;base64,${
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
const articles = JSON.parse(readFileSync(new URL('../src/pages/events/articles.json', import.meta.url), 'utf8'));

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

test('Outlook link prefills a timed event using one entry point', () => {
  const url = new URL(buildOutlookCalendarUrl(article, pageUrl));

  assert.equal(url.origin, 'https://outlook.live.com');
  assert.equal(url.pathname, '/calendar/0/deeplink/compose');
  assert.deepEqual(Object.fromEntries(url.searchParams), {
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: article.title,
    startdt: '2026-11-10T02:00:00.000Z',
    enddt: '2026-11-10T04:30:00.000Z',
    allday: 'false',
    body: pageUrl,
  });
});

test('Outlook timed events cross midnight without an allDay flag', () => {
  const url = new URL(buildOutlookCalendarUrl({
    ...article,
    startDatetime: '2026-11-10T23:00:00+08:00',
    endDatetime: '2026-11-11T01:00:00+08:00',
    allDay: undefined,
  }, pageUrl));

  assert.equal(url.searchParams.get('startdt'), '2026-11-10T15:00:00.000Z');
  assert.equal(url.searchParams.get('enddt'), '2026-11-10T17:00:00.000Z');
  assert.equal(url.searchParams.get('allday'), 'false');
});

test('Outlook FSC link includes all four camp days', () => {
  const url = new URL(buildOutlookCalendarUrl(articles.fsc, pageUrl));

  assert.equal(url.searchParams.get('startdt'), '2026-06-16');
  assert.equal(url.searchParams.get('enddt'), '2026-06-20');
  assert.equal(url.searchParams.get('allday'), 'true');
});

test('Outlook link safely encodes special characters', () => {
  const title = 'Camp & code + games? #1 / 50%: \u732b \ud83c\udf89\nSave the date!';
  const eventPageUrl = `${pageUrl}?source=club&label=A%2BB#details`;
  const url = new URL(buildOutlookCalendarUrl({ ...article, title }, eventPageUrl));

  assert.equal(url.searchParams.get('subject'), title);
  assert.equal(url.searchParams.get('body'), eventPageUrl);
  assert.equal([...url.searchParams].length, 7);
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
  for (const allDay of [false, true]) {
    test(`${allDay ? 'all-day' : 'timed'} calendar exports reject ${name}`, () => {
      const event = { ...article, ...dates, allDay };

      assert.equal(buildGoogleCalendarUrl(event, pageUrl), null);
      assert.equal(buildCalendarFile(event, pageUrl), null);
      assert.equal(buildOutlookCalendarUrl(event, pageUrl), null);
    });
  }
}

test('FSC includes all four days from June 16 through June 19', () => {
  const url = new URL(buildGoogleCalendarUrl(articles.fsc, 'https://nuscomputing.com/events/fsc'));

  assert.equal(url.searchParams.get('dates'), '20260616/20260620');
  assert.equal(url.searchParams.get('ctz'), 'Asia/Singapore');
});

const allDayRanges = [
  ['single day', '2026-06-16', '2026-06-16', '20260616/20260617', '2026-06-17'],
  ['month rollover', '2026-06-30', '2026-06-30', '20260630/20260701', '2026-07-01'],
  ['year rollover', '2026-12-30', '2026-12-31', '20261230/20270101', '2027-01-01'],
  ['leap day', '2028-02-28', '2028-02-29', '20280228/20280301', '2028-03-01'],
];

for (const [name, start, end, expected, exclusiveEnd] of allDayRanges) {
  test(`all-day event uses Singapore dates and an exclusive end: ${name}`, () => {
    const event = {
      ...article,
      allDay: true,
      startDatetime: `${start}T00:00:00+08:00`,
      endDatetime: `${end}T23:59:59+08:00`,
    };
    const url = new URL(buildGoogleCalendarUrl(event, pageUrl));

    assert.equal(url.searchParams.get('dates'), expected);
    const [startDate, endDate] = expected.split('/');
    assert.ok(buildCalendarFile(event, pageUrl).includes(
      `DTSTART;VALUE=DATE:${startDate}\r\nDTEND;VALUE=DATE:${endDate}\r\n`,
    ));
    const outlookUrl = new URL(buildOutlookCalendarUrl(event, pageUrl));

    assert.equal(outlookUrl.searchParams.get('startdt'), start);
    assert.equal(outlookUrl.searchParams.get('enddt'), exclusiveEnd);
    assert.equal(outlookUrl.searchParams.get('allday'), 'true');
  });
}

const eventPeriods = [
  ['past', '2020-06-16', '20200616T020000Z/20200616T070000Z', '20200616/20200617', '2020-06-17'],
  ['current', '2026-11-08', '20261108T020000Z/20261108T070000Z', '20261108/20261109', '2026-11-09'],
  ['future', '2030-06-16', '20300616T020000Z/20300616T070000Z', '20300616/20300617', '2030-06-17'],
];

for (const [period, day, timedRange, allDayRange, exclusiveEnd] of eventPeriods) {
  for (const allDay of [false, true]) {
    test(`${period} ${allDay ? 'all-day' : 'timed'} events can be saved`, (t) => {
      // At noon in Singapore, the current example is still in progress.
      t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-11-08T04:00:00Z') });
      const event = {
        ...article,
        allDay,
        startDatetime: `${day}T10:00:00+08:00`,
        endDatetime: `${day}T15:00:00+08:00`,
      };
      const expected = allDay ? allDayRange : timedRange;
      const url = new URL(buildGoogleCalendarUrl(event, pageUrl));
      const [start, end] = expected.split('/');
      const dateType = allDay ? ';VALUE=DATE' : '';

      assert.equal(url.searchParams.get('dates'), expected);
      assert.ok(buildCalendarFile(event, pageUrl).includes(
        `DTSTART${dateType}:${start}\r\nDTEND${dateType}:${end}\r\n`,
      ));
      const outlookUrl = new URL(buildOutlookCalendarUrl(event, pageUrl));

      assert.equal(outlookUrl.searchParams.get('startdt'), allDay ? day : `${day}T02:00:00.000Z`);
      assert.equal(outlookUrl.searchParams.get('enddt'), allDay ? exclusiveEnd : `${day}T07:00:00.000Z`);
    });
  }
}

test('special characters in the title and page URL survive encoding without extra parameters', () => {
  const title = 'Camp & code + games? #1 / 50%: \u732b \ud83c\udf89\nSave the date!';
  const eventPageUrl = `${pageUrl}?source=club&label=A%2BB#details`;
  const url = new URL(buildGoogleCalendarUrl({ ...article, title }, eventPageUrl));

  assert.equal(url.searchParams.get('text'), title);
  assert.equal(url.searchParams.get('details'), eventPageUrl);
  assert.equal([...url.searchParams].length, 5);
});

for (const [name, event, dates] of [
  ['timed', article, ['DTSTART:20261110T020000Z', 'DTEND:20261110T043000Z']],
  ['all-day', articles.fsc, ['DTSTART;VALUE=DATE:20260616', 'DTEND;VALUE=DATE:20260620']],
]) {
  test(`existing ${name} .ics output is preserved`, () => {
    const calendar = buildCalendarFile(event, pageUrl);

    assert.match(calendar, /DTSTAMP:\d{8}T\d{6}Z\r\n/);
    assert.equal(calendar.replace(/DTSTAMP:\d{8}T\d{6}Z/, 'DTSTAMP:<generated>'), [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//NUS Computing Club//Event Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${event.link}@nuscomputing.com`,
      'DTSTAMP:<generated>',
      ...dates,
      `SUMMARY:${event.title}`,
      `URL:${pageUrl}`,
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ].join('\r\n'));
  });
}
