import React from 'react';

function Footer() {
  return (
    <div className='flex flex-col justify-center items-center my-12 gap-8'>
      <h1
        className='mx-8
    md:mx-64
    text-[28px]
    md:text-[32px]
    font-bold
    text-center
    text-primary'
      >
        Empowering Students.{' '}
        <span className='text-yellow-500'>Enriching Lives.</span>
      </h1>
      <p className='text-lg font-bold text-yellow-500 text-center'>
        Contact us @ elections@nuscomputing.com
      </p>
    </div>
  );
}

export default Footer;
