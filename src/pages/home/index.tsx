import React from 'react';
import './index.css';
import EventsPreview from './EventsPreview';
import Gallery from './Gallery';
import HomeFeedback from './HomeFeedback';
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

      <HomeFeedback />
    </div>
  );
}

export default Home;
