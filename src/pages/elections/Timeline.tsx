import React from 'react';
import { TimelineEvents } from './constants';

function Timeline() {
  return (
    <div className='relative h-full mt-4 mb-8'>
      <div className='max-w-5xl py-4 mx-auto'>
        <div className='grid gap-4 sm:grid-cols-12'>
          <div className='col-span-12 sm:col-span-3'>
            <div
              className='text-center sm:text-left mb-14 before:block before:w-24 before:h-3
                before:mb-5 before:rounded-md before:mx-auto sm:before:mx-0 before:bg-[#365486]'
            >
              <h3 className='text-3xl font-semibold pb-2'>Timeline</h3>
              <span
                className='text-sm tracking-wide font-medium
                dark:text-gray-600'
              >
                The election will run through the first half of{' '}
                <span className='text-primary font-bold'>
                  AY26/27 Semester 1
                </span>
                . Do take note of key dates and events. For more information
                about each phase, check out our{' '}
                <a href='#faq-section' className='text-[#365486] font-bold'>
                  FAQ
                </a>{' '}
                section!
              </span>
            </div>
          </div>
          <div className='relative col-span-12 px-4 space-y-6 sm:col-span-9'>
            <div
              className='col-span-12 space-y-12 relative px-4 sm:col-span-8 sm:space-y-8 before:absolute
                before:top-2 before:bottom-0 before:w-0.5 before:-left-3
                before:dark:bg-gray-300 translate-x-[20px] sm:translate-x-0'
            >
              {TimelineEvents.map((event, index) => (
                <div
                  key={index}
                  className='flex flex-col relative before:absolute before:top-2 before:w-4
                        before:h-4 before:rounded-full before:left-[-35px]
                        before:z-[1] before:dark:bg-[#e58e26]'
                >
                  <h3 className='text-xl font-semibold tracking-wide'>
                    {event.title}
                  </h3>
                  <time className='text-xs p-2 tracking-wide uppercase dark:text-gray-600'>
                    {event.date}
                  </time>
                  <p className='mt-3'>{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timeline;
