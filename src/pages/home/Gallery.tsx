import React, { useEffect, useRef, useState } from 'react';
import { GoArrowUpRight, GoChevronLeft, GoChevronRight } from 'react-icons/go';
import albumsData from './flickrAlbums.json';
import { arrangePhotos, GalleryPhoto, largeSrc, loadAlbum, peekAlbum, prefetchAlbum, warmed } from './flickr';
import './Gallery.css';

const albums = Object.values(albumsData);

type View = { selected: number; leaving: number | null };

// Pure state updater (module level, so effects can use it without extra dependencies).
// Wraps the index around, and remembers the outgoing album so it can stay underneath while the new one fades in.
const go = (to: (current: number) => number) => (view: View): View => {
  const selected = (to(view.selected) + albums.length) % albums.length;
  return selected === view.selected ? view : { selected, leaving: view.selected };
};

function Photo({ photo, index, title }: { photo: GalleryPhoto; index: number; title: string }) {
  const large = largeSrc(photo, index);
  // Already prefetched and decoded: show it straight away (no skeleton, no per-photo fade).
  const [instant] = useState(() => warmed.has(large));
  const [quality, setQuality] = useState('large');
  const [loaded, setLoaded] = useState(instant);

  useEffect(() => {
    if (loaded) return;

    const timeout = window.setTimeout(() => setQuality('failed'), 15000);

    return () => window.clearTimeout(timeout);
  }, [loaded]);

  const failed = quality === 'failed';
  const src = quality === 'large' ? large : photo.src;
  const state = loaded || failed ? 'is-ready' : 'gallery-skeleton';

  return (
    <a
      className={`gallery-photo gallery-slot-${index} ${state}${instant ? ' is-instant' : ''}`}
      href={photo.link}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={`Open photo ${index + 1} from ${title} on Flickr (new tab)`}
      style={{ animationDelay: `${index * 65}ms` }}>
      {failed ? <span className='gallery-photo-error'>View photo on Flickr <GoArrowUpRight /></span> : (
        <img
          src={src}
          alt={`${title} — event photo ${index + 1}`}
          decoding='async'
          onLoad={() => setLoaded(true)}
          onError={() => setQuality(quality === 'large' ? 'original' : 'failed')}
        />
      )}
      {index === 0 && !failed && <span className='gallery-photo-hint'>Explore on Flickr <GoArrowUpRight /></span>}
    </a>
  );
}

function Album({ index, visible, leaving = false }: { index: number; visible: boolean; leaving?: boolean }) {
  const album = albums[index];
  // Start from the cache if we have it, so revisited / prefetched albums never flash the skeleton.
  const [photos, setPhotos] = useState<GalleryPhoto[] | null>(() => {
    const cached = peekAlbum(album.albumId, album.ownerId);
    return cached && arrangePhotos(cached);
  });
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Wait until the user has scrolled near the gallery (the parent flips `visible` once, and it stays true).
    if (!visible) return;

    let active = true;
    setError(false);

    loadAlbum(album.albumId, album.ownerId).then((result) => {
      if (active) setPhotos(arrangePhotos(result));
    }).catch(() => { if (active) setError(true); });

    // Cleanup: runs when this Album unmounts (e.g. another event is selected) and before the effect re-runs
    // (album / visible / attempt changed). It doesn't cancel the request (it still finishes and fills the cache);
    // it just stops this stale run from calling setPhotos / setError.
    return () => { active = false; };
  }, [album, visible, attempt]);

  const loading = !photos && !error;
  return (
    // The outgoing album is purely decorative while it sits under the new one, so hide it from assistive tech.
    <div
      className={`gallery-album${leaving ? ' is-leaving' : ''}`}
      id={leaving ? undefined : 'gallery-active-album'}
      aria-hidden={leaving || undefined}
      aria-busy={loading}>
      <div className='gallery-viewfinder'>
        {error || photos?.length === 0 ? (
          <div className='gallery-message'>
            <h4>{error ? 'Photos are taking a little longer.' : 'More moments on Flickr.'}</h4>
            <p>{error ? 'Try again, or explore the event’s album.' : 'Open the full album to see this event.'}</p>
            <div>
              {error && <button onClick={() => { setError(false); setAttempt(attempt + 1); }}>Try again</button>}
              <a href={album.link} target='_blank' rel='noopener noreferrer'>View album on Flickr</a>
            </div>
          </div>
        ) : (
          <div className={`gallery-grid gallery-count-${photos?.length ?? 4}`}>
            {photos ? photos.map((photo, slot) => (
              <Photo key={photo.id} photo={photo} index={slot} title={album.title} />
            )) : [0, 1, 2, 3].map((slot) => (
              <div key={slot} className={`gallery-skeleton gallery-slot-${slot}`} aria-hidden='true' />
            ))}
          </div>
        )}
      </div>
      <div className='gallery-caption'>
        <div>
          <h3>{album.title}</h3>
          <p>Through the lens of NUS Computing Club photographers</p>
        </div>
        <a href={album.link} target='_blank' rel='noopener noreferrer'>View full album <GoArrowUpRight /></a>
      </div>
      <span className='sr-only' role='status'>
        {loading ? `Loading ${album.title}` : error
          ? 'Photos could not be loaded.' : `${photos?.length} photos loaded.`}
      </span>
    </div>
  );
}

export default function Gallery() {
  const root = useRef<HTMLElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  // the functions to check if the images should be pulled
  const [visible, setVisible] = useState(false);
  // selected = the album being shown; leaving = the previous one, kept mounted briefly for the crossfade.
  const [{ selected, leaving }, setView] = useState<View>({ selected: 0, leaving: null });

  // the functions to check if the images should carousel
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  // NOTE THIS PAUSED IS FOR INTERACTION PAUSES

  // Unmount the outgoing album once the new one has finished fading in over it (matches the 400ms CSS animation).
  useEffect(() => {
    if (leaving === null) return;
    // WARNING: Make sure the 400 ms timeout matches in the GalleryAlbum Animation Delay
    const id = window.setTimeout(() => setView((view) => ({ ...view, leaving: null })), 400);
    return () => window.clearTimeout(id);
  }, [leaving]);

  // While looking at one album, quietly fetch the next one (data + images) so the switch is instant.
  useEffect(() => {
    if (!visible) return;
    const next = albums[(selected + 1) % albums.length];
    prefetchAlbum(next.albumId, next.ownerId);
  }, [visible, selected]);

  useEffect(() => {
    // Fallback for very old browsers: they can't detect visibility, so the gallery just loads immediately.
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }

    // rootMargin grows the "viewport" by 250px on every side, so we start loading just before the gallery scrolls in.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '250px' });

    // root.current is the real <section> DOM node (via ref={root}); it's null until React has mounted it.
    if (root.current) observer.observe(root.current);

    // When unmounted, stop observing.
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // when our selected event changes
    // scroll the horizontal bar to make sure that event
    // is at the centre

    const rail = strip.current;
    const button = rail?.children[selected] as HTMLElement | undefined;

    if (!rail || !button) return;
    // Scroll only the event rail, never the page containing it.
    // No `behavior` option here on purpose: it defaults to 'auto', which follows the CSS `scroll-behavior`
    // on .gallery-events (smooth, but instant for prefers-reduced-motion). Passing 'smooth' would override that.

    rail.scrollTo({ left: button.offsetLeft - rail.offsetLeft - (rail.clientWidth - button.clientWidth) / 2 });
  }, [selected]);

  useEffect(() => {
    // no fallback for old browser... since old browser
    // we dont really want to auto scroll

    if (!root.current) return;

    // this time we are observing for when the images are in
    // the 40% of the viewport of the screen

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(root.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // see if the user has put the window setting of reduced motion
    // if they have then dont do the animation otherwise do it!
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // if the user is not seeing it, or redced motion OR interacting with the box
    // then dont do the scrolling behavior
    if (!inView || paused || reduceMotion) return;

    const id = window.setTimeout(() => setView(go((s) => s + 1)), 5000);
    return () => window.clearTimeout(id);
  }, [inView, paused, selected]);

  return (
    <section ref={root} className='comclub-gallery' aria-labelledby='gallery-title'
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className='gallery-inner'>
        <div className='gallery-heading'>
          <div>
            <h2 id='gallery-title'>ComClub in Focus</h2>
            <p>Our events, through the lens. Find your favourite moments.</p>
          </div>
          <div className='gallery-controls' aria-label='Event navigation'>
            <span>{String(selected + 1).padStart(2, '0')} / {albums.length}</span>
            <button aria-label='Previous event' onClick={() => setView(go((s) => s - 1))}>
              <GoChevronLeft />
            </button>
            <button aria-label='Next event' onClick={() => setView(go((s) => s + 1))}>
              <GoChevronRight />
            </button>
          </div>
        </div>
        {/* Both albums share one grid cell: the old one stays put underneath, the new one fades in on top. */}
        <div className='gallery-stage'>
          {leaving !== null && <Album key={albums[leaving].albumId} index={leaving} visible leaving />}
          <Album key={albums[selected].albumId} index={selected} visible={visible} />
        </div>
        <div className='gallery-events' ref={strip} role='group' aria-label='Choose an event'>
          {albums.map((album, index) => (
            <button
              key={album.albumId}
              aria-pressed={selected === index}
              aria-controls='gallery-active-album'
              onClick={() => setView(go(() => index))}>
              <span>{album.title.split(' ').slice(1).join(' ')}</span>
              <span className='gallery-event-year'>{album.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
