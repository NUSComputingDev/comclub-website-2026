import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { GoArrowUpRight } from 'react-icons/go';
import { loadPosts, Post, PostType, SITE } from './wordpress';
import './NusPosts.css';

export interface PostTab { type: PostType; label: string }

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });

function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    // The delay staggers the fade-up, so cards arrive one after another instead of all at once.
    <li style={{ animationDelay: `${index * 60}ms` }}>
      <a className='post-card' href={post.link} target='_blank' rel='noopener noreferrer'>
        <div className='post-image'>
          {/* Decorative: the title right below already says what the story is. */}
          {post.image && <img src={post.image} alt='' loading='lazy' decoding='async' referrerPolicy='no-referrer'
            onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }} />}
        </div>
        <div className='post-body'>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <h3>{post.title}</h3>
          {post.excerpt && <p>{post.excerpt}</p>}
          <span className='post-open'>Read article <GoArrowUpRight aria-hidden /></span>
          <span className='sr-only'>(opens in a new tab)</span>
        </div>
      </a>
    </li>
  );
}

export default function NusPosts(
  { tabs, title, description, noOfPosts = 6 }:
    { tabs: PostTab[]; title: string; description: string; noOfPosts?: number },
) {
  const root = useRef<HTMLElement>(null);
  const pills = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(0);
  // Results are kept per tab, so going back to a tab shows its cards straight away (no skeleton flash).
  const [results, setResults] = useState<Partial<Record<PostType, Post[] | 'error'>>>({});

  // this is a counter designed to cause the loadPost function to try again
  // when the try again button is calld. it deliverately is used to cause
  // the use effect to rerender. Thats all.
  const [attempt, setAttempt] = useState(0);

  const { type } = tabs[selected];
  const result = results[type];
  const posts = Array.isArray(result) ? result : null;
  const error = result === 'error';

  // Same as Gallery: only fetch once the section is about to scroll into view.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '250px' });
    if (root.current) observer.observe(root.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let active = true;

    // ONLY update the posts of the tab i just opened keep the other the same
    loadPosts(type, noOfPosts).then(
      (loaded) => { if (active) setResults((all) => ({ ...all, [type]: loaded })); },
      () => { if (active) setResults((all) => ({ ...all, [type]: 'error' })); },
    );

    return () => { active = false; };
  }, [type, noOfPosts, visible, attempt]);

  // Slide the highlight under the selected pill. Pills differ in width, so measure the real button.
  // useLayoutEffect runs before the browser paints, so the highlight never shows in the wrong place.
  // The ResizeObserver re-measures when the pill widths change (e.g. once the web font finishes loading).
  useLayoutEffect(() => {
    const group = pills.current;
    if (!group) return;

    const place = () => {
      const pill = group.children[selected] as HTMLElement | undefined;
      if (!pill) return;
      group.style.setProperty('--pill-x', `${pill.offsetLeft}px`);
      group.style.setProperty('--pill-w', `${pill.offsetWidth}px`);
    };
    place();

    if (!('ResizeObserver' in window)) return;
    const observer = new ResizeObserver(place);
    observer.observe(group);
    return () => observer.disconnect();
  }, [selected]);

  const allLink = `${SITE}${type}/`;

  return (
    <section ref={root} className='nus-posts' aria-labelledby={titleId}>
      <div className='posts-inner'>
        <div className='posts-heading'>
          <div>
            <h2 id={titleId}>{title}</h2>
            <p>{description}</p>
          </div>
          <a href={allLink} target='_blank' rel='noopener noreferrer'>
            View all <span className='sr-only'>{tabs[selected].label} </span><GoArrowUpRight aria-hidden />
          </a>
        </div>

        {/* A single tab needs no switcher. */}
        {tabs.length > 1 && (
          <div className='posts-pills' ref={pills} role='group' aria-label='Choose a category'>
            {tabs.map((tab, index) => (
              <button key={tab.type} aria-pressed={index === selected} onClick={() => setSelected(index)}>
                {tab.label}
              </button>
            ))}
            <span className='posts-pill-highlight' aria-hidden='true' />
          </div>
        )}

        {error || posts?.length === 0 ? (
          <div className='posts-message'>
            <h4>{error ? 'Stories are taking a little longer.' : 'No stories yet.'}</h4>
            <div>
              {/* we dont directly call loadPosts again so that the old fetching and active */}
              {/* cleanly id discarded, the stale requests are removed and then only new one */}
              {/* created saving space */}
              {error && <button onClick={() => {
                setResults((all) => ({ ...all, [type]: undefined })); // back to skeletons while retrying
                setAttempt(attempt + 1);
              }}>Try again</button>}
              <a href={allLink} target='_blank' rel='noopener noreferrer'>Read on NUS Computing</a>
            </div>
          </div>
        ) : (
          <ul className='posts-grid' aria-busy={!posts}>
            {posts ? posts.map((post, index) => <PostCard key={post.id} post={post} index={index} />)
              : Array.from({ length: noOfPosts }, (_, slot) =>
                <li key={slot} className='post-skeleton' aria-hidden='true' />)}
          </ul>
        )}
      </div>
    </section>
  );
}
