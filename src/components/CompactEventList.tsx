import React from 'react';
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
      <p className='compact-event-list-description'>{description}</p>
    </div>
  );
}

export default CompactEventList;
