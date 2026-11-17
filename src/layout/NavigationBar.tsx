import React from 'react';
import { Link } from 'react-router-dom';
import NavigationMenu from './NavigationMenu';
import './NavigationBar.css';
import { asset } from '../lib/asset';

function NavigationBar() {
  return (
    <header className='w-full h-20'>
      <div className='navigation-bar'>
        <Link to='/'>
          <img src={asset('/comclub_logo.png')} className='h-14 p-2'></img>
        </Link>
        <NavigationMenu />
      </div>
    </header>
  );
}

export default NavigationBar;
