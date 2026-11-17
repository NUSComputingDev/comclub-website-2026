import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import EventsPreview from './EventsPreview';
import Gallery from './Gallery';
import HomeHero from './HomeHero';
import NusPosts from './NusPosts';

function Home() {
  return (
    <div className='home'>
      <HomeHero />

      <EventsPreview />

      <Gallery />

      <NusPosts
        title='From NUS Computing'
        description='News and research stories from around the School of Computing.'
        tabs={[
          { type: 'news', label: 'News' },
          { type: 'features', label: 'Features' },
        ]}
      />

      {/* study planner */}
      {/* flex-col-reverse is used to render the graphic on top */}
      <section className='flex-col-reverse md:flex-row'>
        <div className='section-description'>
          <h2>Stressed about</h2>
          <h1>Study plans?</h1>
          <p>
            Set yourself up for <span>academic success</span> with our
            <span> study planner</span>!
          </p>
          <Link to='./resources'>
            <button className='rounded-lg'>Resources</button>
          </Link>
        </div>
        <img src='/planner_graphic.svg' className='section-graphic'></img>
      </section>
    </div>
  );
}

export default Home;
