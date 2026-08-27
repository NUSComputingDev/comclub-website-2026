/* eslint-disable @stylistic/max-len */
'use client';
import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOutsideClick } from '../../../hooks/use-outside-click';
import WindowCard from '../../layout/WindowCard';
import { candidates } from './candidateData';

export function Candidates() {
  const [active, setActive] = useState<(typeof candidates)[number] | null>(
    null,
  );
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(null);
      }
    }

    if (active && typeof active === 'object') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const data = [...candidates].sort((a, b) => a.title.localeCompare(b.title)).map((card, index) => {
    const content = (
      <>
        <div className='w-48 p-4 flex flex-col items-stretch gap-1 flex-1'>
          <motion.div
            className='self-center'
            layoutId={`image-${card.title}-${index}-${card.id}`}
          >
            <img
              src={card.src}
              alt={card.title}
              className='rounded-md w-32 h-32 object-cover object-center'
            />
          </motion.div>
          <div className='m-2 flex flex-col justify-between h-48'>
            <div>
              <motion.h3
                layoutId={`title-${card.title}-${index}-${card.id}`}
                className='font-medium text-neutral-800 text-center md:text-left'
              >
                {card.title}
              </motion.h3>
              <motion.p
                layoutId={`description-${card.description}-${index}-${card.id}`}
                className='text-sm leading-tight text-neutral-600 text-center md:text-left'
              >
                {card.description}
              </motion.p>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${index}-${card.id}`}
              className='mt-4 px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-yellow-500 hover:text-white text-black'
            >
              {card.ctaText}
            </motion.button>
          </div>
        </div>
      </>
    );

    return (
      <motion.div
        layoutId={`card-${card.title}-${id}-${card.id}`}
        key={`card-${card.title}-${id}-${card.id}`}
        onClick={() => setActive(card)}
        className='p-4 flex flex-row flex-wrap justify-center
            items-center rounded-xl cursor-pointer'
      >
        <WindowCard content={content} key={index}></WindowCard>
      </motion.div>
    );
  });

  return (
    <section className='elections h-full gap-4'>
      <h1 className='title'>Candidates</h1>
      <p className='text-neutral-500 text-xl text-center'>
        Meet the candidates running in the 29th NUS Students&apos; Computing Club
        Management Committee Elections.
      </p>
      <AnimatePresence>
        {active && typeof active === 'object' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/20 h-full w-full z-[100]'
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === 'object' ? (
          <div className='fixed inset-0 grid place-items-center z-[101]'>
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className='flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6'
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}-${active.id}`}
              ref={ref}
              className='w-full max-w-[800px] h-full sm:h-fit md:max-h-[93%] px-2 flex flex-col sm:flex-row bg-white sm:rounded-3xl overflow-auto self-center sm:overflow-hidden'
            >
              <motion.div
                className='w-full sm:w-2/5 my-16 sm:my-auto p-4'
                layoutId={`image-${active.title}-${id}-${active.id}`}
              >
                <img
                  src={active.src}
                  alt={active.title}
                  className='w-full max-h-[70vh] rounded-lg object-contain object-center'
                />
              </motion.div>

              <div className='w-full sm:w-3/5 pt-8'>
                <div className='flex justify-between items-start p-4'>
                  <div className=''>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}-${active.id}`}
                      className='font-bold text-neutral-700'
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}-${active.id}`}
                      className='text-neutral-600 overflow-auto'
                    >
                      {active.description}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='text-neutral-600 overflow-auto'
                    >
                      {active.year} / {active.major}
                    </motion.p>
                  </div>
                </div>
                <div className='relative px-4'>
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='text-neutral-600 text-sm h-fit sm:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto'
                  >
                    <p className='whitespace-pre-line'>{active.manifesto}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className='gap-8 flex flex-row flex-wrap justify-center items-center w-full px-8 md:px-24'>
        {data}
      </ul>
    </section>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='h-4 w-4 text-black'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M18 6l-12 12' />
      <path d='M6 6l12 12' />
    </motion.svg>
  );
};
