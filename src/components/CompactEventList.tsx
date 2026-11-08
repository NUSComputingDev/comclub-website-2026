import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './CompactEventList.css';

interface CompactEventListProps {
  name: string;
  description: string;
  /** Human-readable label plus the ISO value backing the <time> element. */
  date?: { label: string; value: string };
  link: string;
}

function CompactEventList({ name, description, date, link }: CompactEventListProps) {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    const element = descriptionRef.current;
    const text = textRef.current;
    if (!element || !text) return;

    const observer = new ResizeObserver(() => {
      const range = document.createRange();
      range.selectNodeContents(text);
      const lines = Array.from(range.getClientRects());
      setTruncated(lines.length > 3 || (lines.length === 3 && lines[2].width > element.clientWidth / 2));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [description]);

  return (
    <div className='compact-event-list'>
      <Link to={link}>
        <h4>{name}</h4>
      </Link>
      {date && (
        <time dateTime={date.value} className='compact-event-list-date'>
          {date.label}
        </time>
      )}
      <p
        ref={descriptionRef}
        className={`compact-event-list-description${truncated ? ' is-truncated' : ''}`}
      >
        <span ref={textRef}>{description}</span>
      </p>
    </div>
  );
}

export default CompactEventList;
