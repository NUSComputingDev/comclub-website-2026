import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SPLASH_DURATION = 1600;

/**
 * Brief intro on a fresh page load: the club mark is painted in from left to
 * right, then the white veil fades away. Route changes don't remount App, so
 * this only plays on a real load / refresh.
 */
function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), SPLASH_DURATION);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className='splash-screen' aria-hidden='true'>
      <img className='splash-logo' src='/comclub_logo.png' alt=''></img>
    </div>
  );
}

export default SplashScreen;
