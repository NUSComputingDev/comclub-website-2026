import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
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

  return (
    <footer className='w-full'>
      <div className='footer-banner'>
        <h4 className='font-heading font-bold text-xl'>
          NUS Students&#39; Computing Club
        </h4>
        <p className='font-subheading text-sm'>
          A constituent club of the NUS Students&#39; Union
        </p>

        <div className='flex flex-row flex-wrap'>
          {
            socialMediaLinks.map((data, key) => {
              return (
                <Link
                  to={data.url}
                  aria-label={data.platform}
                  key={key}
                  className='mr-4 my-1 text-xl'
                >
                  <data.icon />
                </Link>
              );
            })
          }
        </div>

        <p className='font-subheading text-sm'>
          Copyright © NUS Students&#39; Computing Club •&nbsp;
          <span className='inline-block underline'>
            <Link to='/privacy'>Privacy Policy</Link>
          </span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
