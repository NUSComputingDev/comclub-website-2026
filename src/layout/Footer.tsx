import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaTelegramPlane,
  FaYoutube,
  FaLinkedinIn,
} from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import './Footer.css';

function Footer() {
  const socialMediaLinks = [
    {
      platform: 'Facebook',
      url: 'https://www.facebook.com/nuscomputing',
      icon: FaFacebookF,
    },
    {
      platform: 'Instagram',
      url: 'https://www.instagram.com/NUSComputingClub/',
      icon: FaInstagram,
    },
    {
      platform: 'Telegram',
      url: 'https://t.me/nuscomputingclub',
      icon: FaTelegramPlane,
    },
    {
      platform: 'YouTube',
      url: 'https://www.youtube.com/channel/UCIXFOIE140R6x0z05hgim0Q',
      icon: FaYoutube,
    },
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/company/nus-students-computing-club/',
      icon: FaLinkedinIn,
    },
    {
      platform: 'Email',
      url: 'mailto:connect@nuscomputing.com',
      icon: IoMdMail,
    },
  ];

  const exploreLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Events', to: '/events' },
    { label: 'Resources', to: '/resources' },
    { label: 'Feedback', to: '/feedback' },
  ];

  return (
    <footer className='w-full'>
      <div className='footer-banner'>
        <div className='footer-inner'>
          <div className='footer-brand'>
            <h4>NUS Students&#39; Computing Club</h4>
            <p>A constituent club of the NUS Students&#39; Union</p>

            <div className='footer-socials'>
              {
                socialMediaLinks.map((data) => (
                  <a
                    key={data.platform}
                    href={data.url}
                    aria-label={data.platform}
                    target={data.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel='noreferrer'
                  >
                    <data.icon />
                  </a>
                ))
              }
            </div>
          </div>

          <div className='footer-links'>
            <div className='footer-col'>
              <h5>Explore</h5>
              {
                exploreLinks.map((link) => (
                  <Link key={link.to} to={link.to}>{link.label}</Link>
                ))
              }
            </div>

            <div className='footer-col'>
              <h5>Connect</h5>
              <Link to='/feedback'>Feedback</Link>
              <a href='mailto:connect@nuscomputing.com'>Email us</a>
              <Link to='/privacy'>Privacy Policy</Link>
            </div>

            <a
              className='footer-map'
              href='https://www.comp.nus.edu.sg/maps/venues/'
              target='_blank'
              rel='noreferrer'
            >
              <FaMapMarkerAlt className='footer-map-icon' aria-hidden='true' />
              <span>
                <strong>Campus map</strong>
                <span>Find your way around SoC</span>
              </span>
            </a>
          </div>
        </div>

        <p className='footer-copy'>
          Copyright © NUS Students&#39; Computing Club
        </p>
      </div>
    </footer>
  );
}

export default Footer;
