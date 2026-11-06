import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './index.css';

function NotFound() {
  return (
    <div className='min-h-[70vh] px-8 py-20 flex flex-col items-center justify-center text-center'>
      <p className='text-sm md:text-base font-subheading font-bold tracking-[0.3em] uppercase text-neutral-500'>
        Error 404
      </p>
      <h1 className='mt-4 text-6xl md:text-8xl font-heading font-bold text-primary'>
        Page not found
      </h1>
      <p className='mt-6 max-w-xl font-body text-neutral-600'>
        The page you are looking for does not exist, or it may have moved.
        Check the address, or head back to the home page.
      </p>
      <Link to='/' className='not-found-button'>
        <FaArrowLeft aria-hidden='true' />
        Back to home
      </Link>
    </div>
  );
}

export default NotFound;
