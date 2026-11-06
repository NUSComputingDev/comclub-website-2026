export interface GalleryPhoto {
  id: string;
  src: string;
  link: string;
  ratio: number;
}

export function parsePhotos(data: unknown, ownerId: string): GalleryPhoto[] {
  // given the flickr json data parse it to extract the images we want from it
  if (!data || typeof data !== 'object' || !('items' in data) || !Array.isArray(data.items)) {
    throw new Error('Invalid Flickr feed');
  }

  const photos = new Map<string, GalleryPhoto>();

  for (const item of data.items) {
    if (!item || typeof item.description !== 'string' || typeof item.media?.m !== 'string') continue;

    // shortcut: public feeds identify videos in English descriptions; revisit if Flickr changes its feed format.
    if (item.description.includes('posted a video')) continue;

    // Only accept Flickr's static medium (_m) JPEGs, and capture the photo ID (group 1).
    // The ID is also checked against item.link below, so unexpected URLs never reach the page.
    const image = item.media.m.match(/^https:\/\/live\.staticflickr\.com\/\d+\/(\d+)_[a-f0-9]+_m\.jpg$/);

    if (!image || typeof item.link !== 'string' ||
      !item.link.startsWith(`https://www.flickr.com/photos/${ownerId}/${image[1]}/`)) continue;

    // get the image dimension from the desc otherwise default assume 1.5 ratio
    const width = Number(item.description.match(/\bwidth="(\d+)"/)?.[1]);
    const height = Number(item.description.match(/\bheight="(\d+)"/)?.[1]);

    photos.set(image[1], {
      id: image[1], src: item.media.m, link: item.link,
      ratio: width > 0 && height > 0 ? width / height : 1.5,
    });
  }

  // finaly we only want the GalleryPhoto list so take the values of the map
  return [...photos.values()];
}

export function arrangePhotos(photos: GalleryPhoto[]): GalleryPhoto[] {
  const remaining = [...photos];

  // Approximate desktop slot ratios: large landscape, tall portrait, two small landscapes.
  return [1.3, 0.55, 1.1, 1.1]
    // Never use more slots than we have photos, otherwise `remaining` runs out and remaining[index] crashes.
    .slice(0, photos.length)
    .map((target) => {
      // Greedy, slot by slot: pick the remaining photo whose ratio is closest to this slot's target.
      // Math.log makes it symmetric (2x wider and 2x narrower are equally far from the target).
      const best = remaining.reduce((index, photo, candidate) =>
        Math.abs(Math.log(photo.ratio / target)) < Math.abs(Math.log(remaining[index].ratio / target))
          ? candidate : index, 0);
      // splice removes the photo from `remaining` in place (so it can't be picked twice)
      // and returns an array of the removed items, so [0] is that single photo.
      return remaining.splice(best, 1)[0];
    });
}

const cache = new Map<string, { photos: GalleryPhoto[]; expires: number }>();
const pending = new Map<string, Promise<GalleryPhoto[]>>();
let sequence = 0;

/*
 * Fetches one album's photos from Flickr's public feed using JSONP instead of fetch().
 *
 * Why not fetch()? Browsers enforce the same-origin policy: a page on our domain can't read a response from
 * www.flickr.com via fetch/XHR unless Flickr opts in with CORS headers (Access-Control-Allow-Origin). Flickr's
 * public feeds are built for the older JSONP trick instead, and we have no backend to proxy the request.
 * (We haven't verified Flickr's CORS headers; check the Network tab if you want to try plain fetch().)
 *
 * Why does JSONP work? <script src="..."> tags are NOT subject to that policy; a page can load and run a script
 * from any domain. So:
 *   1. We define a global function, e.g. window.comclubFlickr1 = (data) => { ... }
 *   2. We add <script src="https://www.flickr.com/services/feeds/photoset.gne?...&jsoncallback=comclubFlickr1">
 *   3. Flickr replies with JavaScript, not plain JSON: comclubFlickr1({ "items": [...] })
 *   4. The browser runs it, which calls our function with the data. We parse it, then remove the script.
 *
 * Trade-offs: we run whatever script Flickr returns (hence the strict validation in parsePhotos), there are no
 * HTTP status codes (only onerror), and a timeout is needed because a silent failure never fires onerror.
 */
export function loadAlbum(albumId: string, ownerId: string): Promise<GalleryPhoto[]> {
  const key = `${ownerId}/${albumId}`;
  const cached = cache.get(key); // Memoization from CS1101S haha!
  if (cached && cached.expires > Date.now()) return Promise.resolve(cached.photos);

  const existing = pending.get(key);
  if (existing) return existing; // we are already fetching the images dont need to refetch

  // The executor below runs immediately; the async part is the script download. The promise settles
  // (resolve/reject) later, when Flickr's response calls our callback, the script errors, or the timeout fires.
  const request = new Promise<GalleryPhoto[]>((resolve, reject) => {
    // A unique global name per request, so concurrent loads (different albums) don't overwrite each other.
    const callback = `comclubFlickr${++sequence}`;
    // `Window` has no index signature, so TypeScript won't allow window[callback]; the double cast works around it.
    const callbacks = window as unknown as Record<string, unknown>;

    const script = document.createElement('script');
    const cleanup = () => {
      window.clearTimeout(timeout);
      script.remove();
      // A removed JSONP script may still finish downloading after a timeout.
      callbacks[callback] = () => undefined;
      window.setTimeout(() => { delete callbacks[callback]; }, 60000);
    };

    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('Flickr took too long to respond'));
    }, 12000);

    callbacks[callback] = (data: unknown) => {
      cleanup();
      try {
        const photos = parsePhotos(data, ownerId);
        cache.set(key, { photos, expires: Date.now() + 15 * 60 * 1000 });
        resolve(photos);
      } catch (error) { reject(error); }
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('Could not load Flickr'));
    };

    const params = new URLSearchParams({
      set: albumId, nsid: ownerId, format: 'json', lang: 'en-us', jsoncallback: callback,
    });
    // set / nsid pick the album and owner; jsoncallback names the global function Flickr wraps the JSON in.
    script.src = `https://www.flickr.com/services/feeds/photoset.gne?${params}`;
    script.async = true;

    document.head.appendChild(script);

  }).finally(() => { pending.delete(key); });

  pending.set(key, request);

  return request;
}
