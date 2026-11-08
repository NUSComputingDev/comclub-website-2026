import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../src/pages/home/flickr.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
});
const { parsePhotos, arrangePhotos, loadAlbum } = await import(`data:text/javascript;base64,${
  Buffer.from(outputText).toString('base64')}`);
const owner = '137141057@N04';
const item = (id, description = '<img width="240" height="160">') => ({
  media: { m: `https://live.staticflickr.com/65535/${id}_abcdef_m.jpg` },
  link: `https://www.flickr.com/photos/${owner}/${id}/`,
  description,
});

test('feed validation rejects invalid payloads, videos, unsafe URLs, and duplicates', () => {
  assert.throws(() => parsePhotos({}, owner));
  const photos = parsePhotos({ items: [
    item('1'), item('1'), item('2', 'posted a video'), null,
    { ...item('3'), link: 'https://example.com/' },
    { ...item('4'), media: { m: 'javascript:alert(1)' } },
    item('5', '<img width="0" height="0">'),
  ] }, owner);
  assert.deepEqual(photos.map(p => p.id), ['1', '5']);
  assert.equal(photos[0].ratio, 1.5);
  assert.equal(photos[1].ratio, 1.5);
});

test('collage matches orientation without duplicates or mutating the source', () => {
  const photos = [0.55, 1.1, 1.3, 1.1, 2].map((ratio, id) => ({ id: String(id), ratio }));
  assert.deepEqual(arrangePhotos(photos).map(p => p.ratio), [1.3, 0.55, 1.1, 1.1]);
  assert.equal(photos.length, 5);
  for (let count = 0; count <= 4; count++) {
    const result = arrangePhotos(photos.slice(0, count));
    assert.equal(result.length, count);
    assert.equal(new Set(result.map(p => p.id)).size, count);
  }
});

test('JSONP deduplicates requests, caches success, cleans up and allows retries after timeout', async () => {
  const scripts = [];
  const timers = new Map();
  let timerId = 0;
  globalThis.window = {
    setTimeout: (fn, delay) => { timers.set(++timerId, { fn, delay }); return timerId; },
    clearTimeout: id => timers.delete(id),
  };
  globalThis.document = {
    createElement: () => ({ remove() { this.removed = true; } }),
    head: { appendChild: script => scripts.push(script) },
  };
  try {
    const first = loadAlbum('123', owner);
    assert.equal(loadAlbum('123', owner), first);
    const callback = new URL(scripts[0].src).searchParams.get('jsoncallback');
    window[callback]({ items: [item('1')] });
    assert.equal((await first).length, 1);
    assert.ok(scripts[0].removed);
    await loadAlbum('123', owner);
    assert.equal(scripts.length, 1);
    const timedOut = loadAlbum('456', owner);
    [...timers.values()].find(timer => timer.delay === 12000).fn();
    await assert.rejects(timedOut, /too long/);
    assert.ok(scripts[1].removed);
    const retry = loadAlbum('456', owner);
    scripts[2].onerror();
    await assert.rejects(retry, /Could not load/);
  } finally {
    delete globalThis.window;
    delete globalThis.document;
  }
});
