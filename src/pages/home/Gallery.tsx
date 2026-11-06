import React, { useEffect, useRef, useState } from 'react';
import { GoArrowUpRight, GoChevronLeft, GoChevronRight } from 'react-icons/go';
import albumsData from './flickrAlbums.json';
import { arrangePhotos, GalleryPhoto, loadAlbum } from './flickr';
import './Gallery.css';

const albums = Object.values(albumsData);

function Photo({ photo, index, title }: { photo: GalleryPhoto; index: number; title: string }) {
  const [quality, setQuality] = useState('large');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;

    const timeout = window.setTimeout(() => setQuality('failed'), 15000);

    return () => window.clearTimeout(timeout);
  }, [loaded]);

  const failed = quality === 'failed';
  const src = quality === 'large' ? photo.src.replace('_m.jpg', index === 0 ? '_b.jpg' : '_z.jpg') : photo.src;

  return (
    <a
      className={`gallery-photo gallery-slot-${index} ${loaded || failed ? 'is-ready' : 'gallery-skeleton'}`}
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

function Album({ index, visible }: { index: number; visible: boolean }) {
  const album = albums[index];
  const [photos, setPhotos] = useState<GalleryPhoto[] | null>(null);
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
    <div className='gallery-album' id='gallery-active-album' aria-busy={loading}>
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
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(0);

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

  return (
    <section ref={root} className='comclub-gallery' aria-labelledby='gallery-title'>
      <div className='gallery-inner'>
        <div className='gallery-heading'>
          <div>
            <h2 id='gallery-title'>ComClub in Focus</h2>
            <p>Our events, through the lens. Find your favourite moments.</p>
          </div>
          <div className='gallery-controls' aria-label='Event navigation'>
            <span>{String(selected + 1).padStart(2, '0')} / {albums.length}</span>
            <button aria-label='Previous event' disabled={selected === 0} onClick={() => setSelected(selected - 1)}>
              <GoChevronLeft />
            </button>
            <button
              aria-label='Next event'
              disabled={selected === albums.length - 1}
              onClick={() => setSelected(selected + 1)}>
              <GoChevronRight />
            </button>
          </div>
        </div>
        <Album key={albums[selected].albumId} index={selected} visible={visible} />
        <div className='gallery-events' ref={strip} role='group' aria-label='Choose an event'>
          {albums.map((album, index) => (
            <button
              key={album.albumId}
              aria-pressed={selected === index}
              aria-controls='gallery-active-album'
              onClick={() => setSelected(index)}>
              <span>{album.title.split(' ').slice(1).join(' ')}</span>
              <span className='gallery-event-year'>{album.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
