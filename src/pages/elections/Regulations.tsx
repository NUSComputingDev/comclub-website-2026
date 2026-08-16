import React from 'react';
import './index.css';
import { informationalData, nominationsFormsData, regulationsData } from './constants';

function Documents() {
  return (
    <div className='w-full mx-auto px-5 py-8 bg-white h-full' id='documents-section'>
      <div className='flex flex-col items-center regulations'>
        <h1>Documents</h1>
        <p className='text-neutral-500 text-xl mt-3 text-center'>
          Last updated as of 15 August 2026.
        </p>
      </div>
      <div className='grid divide-y divide-neutral-200 max-w-xl mx-auto mt-8'>
        <p className='text-[#e58e26] text-xl font-semibold mb-2 leading-12'>Nomination Forms</p>
        {nominationsFormsData.map((regulation, index) => (
          <div key={index} className='py-5 flex items-center'>
            <div className='mr-4'>
              <i className='fa-solid fa-link' style={{ color: regulation.color }}></i>
            </div>
            <p className='pt-text'>
              <a href={regulation.link} className='text-black no-underline
                hover:underline' target='_blank' rel='noopener noreferrer'>
                {regulation.title}
              </a>
            </p>
          </div>
        ))}
      </div>

      <div className='grid divide-y divide-neutral-200 max-w-xl mx-auto mt-8'>
        <p className='text-[#e58e26] text-xl font-semibold mb-2 leading-12'>Informational Docs</p>
        {informationalData.map((regulation, index) => (
          <div key={index} className='py-5 flex items-center'>
            <div className='mr-4'>
              <i className='fa-solid fa-link' style={{ color: regulation.color }}></i>
            </div>
            <p className='pt-text'>
              <a href={regulation.link} className='text-black no-underline
                hover:underline' target='_blank' rel='noopener noreferrer'>
                {regulation.title}
              </a>
            </p>
          </div>
        ))}
      </div>

      <div className='grid divide-y divide-neutral-200 max-w-xl mx-auto mt-8'>
        <p className='text-[#e58e26] text-xl font-semibold mb-2 leading-12'>Standing Orders and Regulations</p>
        {regulationsData.map((regulation, index) => (
          <div key={index} className='py-5 flex items-center'>
            <div className='mr-4'>
              <i className='fa-solid fa-link' style={{ color: regulation.color }}></i>
            </div>
            <p className='pt-text'>
              <a href={regulation.link} className='text-black no-underline
                hover:underline' target='_blank' rel='noopener noreferrer'>
                {regulation.title}
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Documents;
