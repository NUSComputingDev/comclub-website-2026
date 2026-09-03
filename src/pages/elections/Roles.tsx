/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @stylistic/max-len */
import React from 'react';
import './index.css';
import { wingsData } from './constants';
import WindowCard from '../../layout/WindowCard';
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

function Roles() {
  return (
    <div
      className='w-full mx-auto px-5 py-4 bg-white h-full'
      id='roles-section'
    >
      <div className='flex flex-col items-center roles'>
        <h1>Roles</h1>
        <p className='text-neutral-500 text-xl mt-3 text-center'>
          Learn more about the roles available in the NUS Students' Computing
          Club.
        </p>
        <div className='mt-8 mb-4'>
          <WindowCard content={
            <div className='flex justify-center items-center'>
              <img src='/elections/29th_MC_Roles_Chart.png' className='object-cover min-w-40 max-h-[30rem] p-2'></img>
            </div>
          }></WindowCard>
        </div>
      </div>
      <div className='grid divide-y divide-neutral-200 max-w-xl mx-auto mt-8'>
        {wingsData.map((wing, index) => (
          <div key={index} className='py-5'>
            <details className='group'>
              <summary className='flex justify-between items-center font-medium cursor-pointer list-none'>
                <span>{wing.title}</span>
                <span className='transition group-open:rotate-180'>
                  <svg
                    fill='none'
                    height='24'
                    shapeRendering='geometricPrecision'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1.5'
                    viewBox='0 0 24 24'
                    width='24'
                  >
                    <path d='M6 9l6 6 6-6'></path>
                  </svg>
                </span>
              </summary>
              <div className='text-neutral-600 mt-3 group-open:animate-fadeIn'>
                <ul className='pl-4 leading-8'>
                  {wing.roles.map((role, roleIndex) => (
                    <li className='list-disc' key={roleIndex}>
                      <b>{role.name}</b>
                      {role.subRoles && (
                        <ul className='list-[circle] pl-4'>
                          {role.subRoles.map((subRole, subRoleIndex) => (
                            <li className='list-[circle]' key={subRoleIndex}>
                              {subRole}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
                {/* <button
                  className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700'
                  onClick={() => window.open(wing.link, '_self')}
                >
                  More information
                  <i className='fa-solid fa-arrow-right ml-2'></i>
                </button> */}
              </div>
            </details>
          </div>
        ))}
      </div>
      <div className='flex flex-row justify-center items-center mt-4 text-[#e58e26]'>
        <a href='/elections/29th_MC_Roles_and_Responsibilities.pdf' target='_blank' className='font-semibold text-lg underline'>View roles &amp; responsibilities</a>
        <FaArrowUpRightFromSquare className='ml-2'/>
      </div>
    </div>
  );
};

export default Roles;
