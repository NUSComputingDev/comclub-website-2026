import React from 'react';
import { Link } from 'react-router-dom';
import WindowCard from '../../layout/WindowCard';
import './HomeFeedback.css';

// Closing section: the club is the students' voice, so the page ends by asking for theirs.
// Framed as a window like the hero, so the page opens and closes on the same motif.
function HomeFeedback() {
  return (
    <section className='home-feedback'>
      <WindowCard
        title='feedback'
        widthClass='w-full max-w-7xl mx-auto'
        content={
          <div className='home-feedback-body'>
            <div className='home-feedback-copy'>
              <h2>Got something</h2>
              <h1>to say?</h1>
              <p>
                We&#39;re here to be your <span>voice</span> in SoC. Tell us
                what&#39;s working, what isn&#39;t, and what you&#39;d like to
                see. It goes straight to the <span>committee</span>.
              </p>
              <div className='home-feedback-actions'>
                <Link to='/feedback' className='home-button home-button--primary'>
                  Give feedback
                </Link>
                <a
                  href='https://t.me/nuscomputingclub'
                  target='_blank'
                  rel='noreferrer'
                  className='home-button'
                >
                  Join our Telegram
                </a>
              </div>
            </div>
            <img src='/hero_graphic.svg' className='home-feedback-graphic' alt=''></img>
          </div>
        }
      ></WindowCard>
    </section>
  );
}

export default HomeFeedback;
