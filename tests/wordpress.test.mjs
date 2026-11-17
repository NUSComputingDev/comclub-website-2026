import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../src/pages/home/wordpress.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
});
const { parsePosts, loadPosts, toText } = await import(`data:text/javascript;base64,${
  Buffer.from(outputText).toString('base64')}`);

const site = 'https://www.comp.nus.edu.sg';
const item = (id, extra = {}) => ({
  id, date: '2026-11-02T07:27:31', link: `${site}/news/story-${id}/`,
  title: { rendered: `Story ${id}` }, excerpt: { rendered: '<p>Hello</p>' }, ...extra,
});

test('toText strips tags and decodes entities', () => {
  assert.equal(toText('<p>From Code to Cancer: NUS Computing&#8217;s &amp; AI&#x2019;s <b>role</b></p>\n'),
    'From Code to Cancer: NUS Computing’s & AI’s role');
  assert.equal(toText('&unknown; &#99999999;'), '&unknown; &#99999999;');
});

test('parsePosts keeps valid posts and rejects bad shapes and off-site URLs', () => {
  assert.throws(() => parsePosts({}));
  const posts = parsePosts([
    item(1, {
      excerpt: { rendered: '<p>Sean Er started his first company [&hellip;]</p>' },
      _embedded: { 'wp:featuredmedia': [{ source_url: `${site}/full.png`,
        media_details: { sizes: { medium_large: { source_url: `${site}/card.png` } } } }] },
    }),
    item(2, { _embedded: { 'wp:featuredmedia': [{ source_url: 'https://evil.example/x.png' }] } }),
    item(3, { link: 'javascript:alert(1)' }),
    item('4'),
    null,
  ]);
  assert.deepEqual(posts.map(p => p.id), [1, 2]);
  assert.equal(posts[0].excerpt, 'Sean Er started his first company');
  assert.equal(posts[0].image, `${site}/card.png`);
  assert.equal(posts[1].image, undefined);
});

test('loadPosts shares requests, slices smaller asks, refetches bigger ones, and retries after failure', async () => {
  const realFetch = globalThis.fetch;
  const calls = [];
  let fail = true;
  globalThis.fetch = async (url) => {
    calls.push(url);
    if (fail) return { ok: false, status: 503 };
    const count = Number(new URL(url).searchParams.get('per_page'));
    return { ok: true, json: async () => Array.from({ length: count }, (_, i) => item(i + 1)) };
  };
  try {
    const first = loadPosts('news');
    const second = loadPosts('news');
    await assert.rejects(first, /503/);
    await assert.rejects(second, /503/);
    assert.equal(calls.length, 1); // both callers shared one request
    fail = false;
    assert.equal((await loadPosts('news')).length, 6); // the failure was dropped, so this refetches
    assert.equal((await loadPosts('news', 3)).length, 3); // fewer: sliced from the cache
    assert.equal(calls.length, 2);
    assert.equal((await loadPosts('news', 9)).length, 9); // more: refetches the bigger amount
    assert.equal((await loadPosts('news', 6)).length, 6); // then the bigger cache serves smaller asks
    assert.equal(calls.length, 3);
    assert.match(calls[0], /\/wp-json\/wp\/v2\/news\?per_page=6&/);
    assert.match(calls[2], /per_page=9&/);
    assert.match(calls[0], /&orderby=date&order=desc&/);
  } finally {
    globalThis.fetch = realFetch;
  }
});
