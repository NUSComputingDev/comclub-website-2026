import assert from 'node:assert/strict';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

// Load the pure Singapore-time helper through esbuild so bare TS imports are
// stripped and the emitted ESM can be imported directly by node.
const here = path.dirname(fileURLToPath(import.meta.url));
const tsPath = path.join(here, '..', 'src', 'pages', 'events', 'sgTime.ts');
const emitted = transformSync(readFileSync(tsPath, 'utf8'), {
  loader: 'ts',
  format: 'esm',
  sourcefile: 'sgTime.ts',
}).code;
const outPath = path.join(here, 'sgTime.check.mjs');
writeFileSync(outPath, emitted);

let formatSgDate;
let sgDayNumber;
let isSameSgDay;
try {
  ({ formatSgDate, sgDayNumber, isSameSgDay } = await import(outPath));
} finally {
  rmSync(outPath);
}

// FSC starts at midnight Singapore time on 16 June. In Los Angeles that
// instant is still 15 June, so this is the exact case the review flagged.
const fscStart = new Date('2026-06-16T00:00:00+08:00');
const fscEnd = new Date('2026-06-19T00:00:00+08:00');

assert.equal(formatSgDate(fscStart), 'Jun 16, 2026');
assert.equal(formatSgDate(fscEnd), 'Jun 19, 2026');

// Same instant, written in a US zone, must still format as the Singapore day.
assert.equal(formatSgDate(new Date('2026-06-15T09:00:00-07:00')), 'Jun 16, 2026');
assert.equal(formatSgDate(new Date('2026-06-15T16:00:00Z')), 'Jun 16, 2026');
assert.equal(formatSgDate(new Date('2026-06-15T15:59:59Z')), 'Jun 15, 2026');

// Day numbers are UTC midnights of the Singapore calendar day.
assert.equal(sgDayNumber(fscStart), sgDayNumber(new Date('2026-06-16T23:59:00+08:00')));
assert.notEqual(sgDayNumber(fscStart), sgDayNumber(new Date('2026-06-15T23:59:00+08:00')));

assert.equal(isSameSgDay(fscStart, new Date('2026-06-16T23:00:00+08:00')), true);
assert.equal(isSameSgDay(fscStart, new Date('2026-06-15T23:00:00+08:00')), false);

console.log(`sgTime OK (${process.env.TZ || 'default TZ'})`);
