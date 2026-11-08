import React from 'react';
// import { Link } from 'react-router-dom';
import './index.css';
import RolesSection from './RolesSection';

function About() {
  return (
    <div>
      <section>
        <img src='/about_graphic.svg' className='section-graphic'></img>
        <div className='section-description'>
          <h1>About Us</h1>
          <p>
            Colloquially known as <span>Computing Club</span>,
            we are a constituent club of the NUS Students&#39; Union.
            Find out more about what we do and meet the
            <span> 29th Management Committee</span> below!
          </p>
        </div>
      </section>

      <div className='banner gap-4'>
        <h1>Who are we?</h1>
        <p>
          Established when the NUS School of Computing (SoC) gained
          independence as a separate faculty in 1998, the NUS Students&#39;
          Computing Club is the official faculty club and sole union
          representative of all undergraduates in SoC.
        </p>
        <p>
          The club has since been taking care of the student life in SoC by
          organising various events and activities to promote campus vibrancy.
          We safeguard the interest of our undergraduates, ensure their voices
          are heard, provide welfare, and form the bridge between our students
          and the school.
        </p>
      </div>

      <section className='icon-section'>
        <div className='icon-container'>
          <div className='icon-bubble'>
            <img src='/vision_icon.svg'></img>
          </div>
          <h3>Our Vision</h3>
          <p>
            To continually support our faculty, to build close-knit
            relationships among members past and present, and drive
            the charge for campus vibrancy.
          </p>
        </div>

        <div className='icon-container'>
          <div className='icon-bubble'>
            <img src='/mission_icon.svg'></img>
          </div>
          <h3>Our Mission</h3>
          <p>
            To be the voice of the students,
            to ensure their holistic well-being, and
            to bridge the gaps between them and the school.
          </p>
        </div>
      </section>

      <div className='banner'>
        <h2 className='text-xl'>Introducing the</h2>
        <h1>29th Management Committee</h1>
      </div>
      <RolesSection></RolesSection>
    </div>
  );
}

export default About;
