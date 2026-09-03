import React from 'react';
import { officers } from './constants';
import RoleCard from '../about/RoleCard';

function Officer() {
  return (
    <div className='officers'>
      <h1 className='my-8'>Elections Committee</h1>
      <div className='flex flex-wrap justify-center items-center gap-12 scale-110 py-12'>
        {officers.map((member) => {
          const imgSrc: string = `/members/${member.imageName}.jpg`;
          return (
            <RoleCard
              name={member.name}
              role={member.role}
              imgSrc={imgSrc}
              key={member.name}
            ></RoleCard>
          );
        })}
      </div>
    </div>
  );
}

export default Officer;
