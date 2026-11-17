// Reads posts from the NUS Computing website. It runs WordPress, and every WordPress site has a public REST API
// at /wp-json/. Each section of the site is a "post type" (news, features, ...) with the same JSON shape, so one
// parser covers them all. The API sends CORS headers, so a plain fetch() works (no JSONP like Flickr needs).
export const SITE = 'https://www.comp.nus.edu.sg/';

export type PostType = 'news' | 'features';

export interface Post {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  link: string;
  image?: string;
}

// WordPress sends titles and excerpts as HTML (e.g. "Computing&#8217;s", "<p>...</p>").
// Strip the tags and decode the entities into plain text, so React can render it safely as text.
const named: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: '\'', nbsp: ' ', hellip: '…',
  ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
};

export const toText = (html: string) => html
  .replace(/<[^>]*>/g, '')
  .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, body: string) => {
    if (body[0] !== '#') return named[body.toLowerCase()] ?? entity;
    const code = body[1].toLowerCase() === 'x' ? parseInt(body.slice(2), 16) : Number(body.slice(1));
    return code <= 0x10ffff ? String.fromCodePoint(code) : entity;
  })
  .replace(/\s+/g, ' ')
  .trim();

// Only links and images on the NUS site are allowed into the page.
const onSite = (url: unknown): url is string => typeof url === 'string' && url.startsWith(SITE);

// Use this as an example page to see the structure of the posts
// https://www.comp.nus.edu.sg/wp-json/wp/v2/news?per_page=6&_embed=wp:featuredmedia
//   &_fields=id,date,link,title,excerpt,_links,_embedded
export function parsePosts(data: unknown): Post[] {
  if (!Array.isArray(data)) throw new Error('Invalid posts response');

  return data.flatMap((item) => {
    if (!item || typeof item.id !== 'number' || !onSite(item.link) ||
      typeof item.title?.rendered !== 'string' || typeof item.date !== 'string') return [];

    // The ~768px wide size fits a card; fall back to the original upload if that size is missing.
    const media = item._embedded?.['wp:featuredmedia']?.[0];
    const image = media?.media_details?.sizes?.medium_large?.source_url ?? media?.source_url;

    return [{
      id: item.id,
      title: toText(item.title.rendered),
      date: item.date,
      // WordPress ends cut-off excerpts with "[…]"; the card clamps the text itself.
      excerpt: toText(item.excerpt?.rendered ?? '').replace(/\s*\[…\]$/, ''),
      link: item.link,
      image: onSite(image) ? image : undefined,
    }];
  });
}

// One entry per post type: the promise plus how many posts it asked for. Storing the promise (not the result)
// lets callers that ask at the same time share one request. A failed request is dropped so "Try again" refetches.
// ponytail: lives until the page reloads (no expiry); the data only changes a few times a week.
const cache = new Map<PostType, { count: number; request: Promise<Post[]> }>();

export function loadPosts(type: PostType, noOfPosts: number = 6): Promise<Post[]> {
  // Enough cached: hand back the first noOfPosts. Too few: fall through and fetch the bigger amount.
  const cached = cache.get(type);
  if (cached && cached.count >= noOfPosts) return cached.request.then((posts) => posts.slice(0, noOfPosts));

  const params = new URLSearchParams({
    per_page: String(noOfPosts),
    orderby: 'date',
    order: 'desc',
    _embed: 'wp:featuredmedia', // include the featured image in the same response
    _fields: 'id,date,link,title,excerpt,_links,_embedded', // _embedded needs _links to be listed too
  });

  // this is a promise of a future response returned. The AbortSingal is for new browsers (older get no timeout)
  const request = fetch(`${SITE}wp-json/wp/v2/${type}?${params}`, { signal: AbortSignal.timeout?.(12000) })
    .then((response) => {
      if (!response.ok) throw new Error(`NUS Computing returned ${response.status}`);
      return response.json();
    })
    .then(parsePosts);

  // Only drop our own entry: a bigger request may have replaced it while this one was in flight.
  request.catch(() => { if (cache.get(type)?.request === request) cache.delete(type); });
  cache.set(type, { count: noOfPosts, request }); // we store that promise to be used upon later

  return request;
}
