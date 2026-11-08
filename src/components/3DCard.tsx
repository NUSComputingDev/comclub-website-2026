import React from 'react';
import WindowCard from '../layout/WindowCard';
import './3DCard.css';

interface ThreeDCardProps {
  /** Photo shown at the full width of the card. */
  photo: string;
  heading: string;
  subheading: string;
  description: string;
  /** How many lines of description to show before the ellipsis. */
  displayLineCount: number;
}

function ThreeDCard({
  photo,
  heading,
  subheading,
  description,
  displayLineCount,
}: ThreeDCardProps) {
  const content = (
    <div className='three-d-card'>
      <img className='three-d-card-photo' src={photo} alt={heading} />
      <h4 className='three-d-card-heading'>{heading}</h4>
      {/* Undated events pass an empty subheading: omit the row entirely. */}
      {subheading && <p className='three-d-card-subheading'>{subheading}</p>}
      <p
        className='three-d-card-description'
        // Clamp the description to displayLineCount lines; CSS appends the ellipsis.
        style={{
          display: '-webkit-box',
          WebkitLineClamp: displayLineCount,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {description}
      </p>
    </div>
  );

  return <WindowCard content={content} />;
}

export default ThreeDCard;
