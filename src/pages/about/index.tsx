import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  ChevronDownIcon,
  EyeIcon,
  FolderOpenIcon,
  HeartIcon,
  LocationMarkerIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/solid';
import WindowCard from '../../layout/WindowCard';
import RolesSection from './RolesSection';
import './index.css';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function scrollToId(id: string) {
  return (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) {
      return;
    }
    target.scrollIntoView({
      behavior: window.matchMedia(REDUCED_MOTION).matches ? 'auto' : 'smooth',
      block: 'start',
    });
  };
}

const DO_CARDS = [
  {
    title: 'Events',
    icon: CalendarIcon,
    copy: 'Hackathons, camps, welfare drives and the moments that make SoC feel like home.',
    to: '/events',
    cta: 'See what\'s on',
  },
  {
    title: 'Welfare',
    icon: HeartIcon,
    copy: 'Support, resources and a louder voice for every undergraduate in Computing.',
    to: '/resources',
    cta: 'Find support',
  },
  {
    title: 'Community',
    icon: UserGroupIcon,
    copy: 'Photos, memories and the people who make the club what it is.',
    to: '/photos',
    cta: 'Meet the club',
  },
  {
    title: 'Resources',
    icon: FolderOpenIcon,
    copy: 'Guides, links and academic support collected in one place.',
    to: '/resources',
    cta: 'Browse resources',
  },
];

const VALUE_CARDS = [
  {
    title: 'Our Vision',
    icon: EyeIcon,
    copy: 'To continually support our faculty, build close-knit relationships '
      + 'among members past and present, and drive the charge for campus vibrancy.',
  },
  {
    title: 'Our Mission',
    icon: LocationMarkerIcon,
    copy: 'To be the voice of the students, ensure their holistic well-being, '
      + 'and bridge the gaps between them and the school.',
  },
];

const WINGS = [
  'Internal Relations',
  'External Relations',
  'Student Development',
  'Student Life',
];

function About() {
  return (
    <div className='about-page'>
      <section className='about-hero'>
        <div className='about-hero-copy'>
          <span className='about-kicker'>NUS Students&#39; Computing Club</span>
          <h1>About Us</h1>
          <p>
            The official faculty club and sole union representative for all
            undergraduates in NUS Computing. We build community, look after
            student life, and make sure your voice is heard.
          </p>
          <div className='about-actions'>
            <a
              href='#committee'
              className='about-cta about-cta--primary'
              onClick={scrollToId('committee')}
            >
              Meet the 29th MC
              <ChevronDownIcon aria-hidden='true' />
            </a>
            <a
              href='#what-we-do'
              className='about-cta'
              onClick={scrollToId('what-we-do')}
            >
              What we do
              <span className='about-arrow' aria-hidden='true'>&#8594;</span>
            </a>
          </div>
        </div>

        <div className='about-hero-art' aria-hidden='true'>
          <span className='about-hero-blob'></span>
          <img className='about-hero-logo' src='/comclub_logo.png' alt=''></img>
          <span className='about-float about-float--1'>est. 1998</span>
          <span className='about-float about-float--2'>4 wings</span>
          <span className='about-float about-float--3'>1 voice</span>
        </div>
      </section>

      <div className='about-banner' id='who-we-are'>
        <h2>Who are we?</h2>
        <p>
          Established in 1998 when the NUS School of Computing became a
          separate faculty, the Computing Club has grown into the home for
          every SoC undergraduate. We organise events and activities that keep
          campus vibrant, safeguard your interests, provide welfare, and form
          the bridge between our students and the school.
        </p>
        <div className='about-chips'>
          <span>Est. 1998</span>
          <span>Constituent club</span>
          <span>4 wings</span>
          <span>30 members</span>
          <span>1 voice</span>
        </div>
      </div>

      <section className='about-section' id='what-we-do'>
        <div className='about-section-head'>
          <h2>What we do</h2>
          <p>Events, welfare, community and resources.</p>
        </div>
        <div className='about-card-grid'>
          {
            DO_CARDS.map(({ title, icon: Icon, copy, to, cta }) => (
              <WindowCard
                key={title}
                title={title}
                content={
                  <div className='about-card-body'>
                    <span className='about-card-icon'>
                      <Icon aria-hidden='true'></Icon>
                    </span>
                    <p>{copy}</p>
                    <Link to={to} className='about-card-link'>
                      {cta}
                      <span className='about-arrow' aria-hidden='true'>&#8594;</span>
                    </Link>
                  </div>
                }
              ></WindowCard>
            ))
          }
        </div>
      </section>

      <section className='about-section about-section--slate'>
        <div className='about-section-head'>
          <h2>What guides us</h2>
          <p>Vision, mission and values.</p>
        </div>
        <div className='about-card-grid about-card-grid--3'>
          {
            VALUE_CARDS.map(({ title, icon: Icon, copy }) => (
              <WindowCard
                key={title}
                title={title}
                content={
                  <div className='about-card-body about-card-body--center'>
                    <span className='about-card-icon'>
                      <Icon aria-hidden='true'></Icon>
                    </span>
                    <p>{copy}</p>
                  </div>
                }
              ></WindowCard>
            ))
          }
          <WindowCard
            title='Our Values'
            content={
              <div className='about-card-body about-card-body--center'>
                <span className='about-card-icon'>
                  <SparklesIcon aria-hidden='true'></SparklesIcon>
                </span>
                <p>Welfare, vibrancy and voice guide everything we do.</p>
                <div className='about-value-chips'>
                  <span>Welfare</span>
                  <span>Vibrancy</span>
                  <span>Voice</span>
                </div>
              </div>
            }
          ></WindowCard>
        </div>
      </section>

      <div
        className='about-banner about-committee-banner'
        id='committee'
      >
        <span className='about-banner-kicker'>Introducing the</span>
        <h1>29th Management Committee</h1>
        <div className='about-chips'>
          {
            WINGS.map((wing) => {
              const slug = wing.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <a
                  key={wing}
                  href={`#wing-${slug}`}
                  onClick={scrollToId(`wing-${slug}`)}
                >
                  {wing}
                  <span className='about-chip-arrow' aria-hidden='true'>↓</span>
                </a>
              );
            })
          }
        </div>
        <a
          href='#committee-tree'
          className='about-scroll-cue'
          aria-label='Scroll to the committee'
          onClick={scrollToId('committee-tree')}
        >
          <ChevronDownIcon aria-hidden='true'></ChevronDownIcon>
        </a>
      </div>

      <div id='committee-tree' className='about-committee scroll-mt-24'>
        <RolesSection></RolesSection>
      </div>
    </div>
  );
}

export default About;
