import React, { useState } from 'react';
import { IoMenu, IoClose } from 'react-icons/io5';
import NavigationMenuItem from './NavigationMenuItem';
import './NavigationMenu.css';

function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationLinks = {
    'Home': '/',
    'About': '/about',
    'Events': '/events',
    'Resources': '/resources',
    'Photos': 'https://www.flickr.com/photos/137141057@N04/albums/',
  };

  return (
    <>
      <div className='navigation-menu-container'>
        {
          Object.entries(navigationLinks)
            .map(([label, link], key) => {
              return <NavigationMenuItem
                label={label}
                link={link}
                key={key}
              />;
            })
        }
      </div>

      <div className='md:hidden relative'>
        <div
          className='navigation-menu-icon'
          onClick={() => setIsOpen(!isOpen)}
        >
          {
            !isOpen
              ? <IoMenu className='h-10 w-auto' />
              : <IoClose className='h-10 w-auto' />
          }
        </div>
        <div className={`navigation-menu-dropdown ${!isOpen ? 'hidden' : ''}`}>
          {
            Object.entries(navigationLinks)
              .map(([label, link], key) => {
                return <NavigationMenuItem
                  label={label}
                  link={link}
                  dropdown={true}
                  key={key}
                />;
              })
          }
        </div>
      </div>
    </>
  );
}

export default NavigationMenu;
