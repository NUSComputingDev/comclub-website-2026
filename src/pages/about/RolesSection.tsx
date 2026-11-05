import React from 'react';
import WindowCard from '../../layout/WindowCard';
import RoleCard from './RoleCard';
import roles from './roles.json' with {type: 'json'};
import './RolesSection.css';

function RolesSection() {
  return (
    <div className='roles-section'>
      {
        Object.entries(roles).map((value) => {
          const [wing, members] = value;
          // on wide screens, fit the whole wing on one row
          const gridStyle = { '--lg-cols': Math.max(6, members.length) } as React.CSSProperties;
          return (
            <WindowCard
              key={wing}
              title={<h2>{wing}</h2>}
              content={
                <ul className='member-grid' style={gridStyle}>
                  {
                    members.map((member, index) => {
                      const imgSrc = member.img ??
                      `/members/thumbs/${member.name.replace(/\s/g, '')}.webp`;
                      return <RoleCard
                        name={member.name}
                        role={member.role}
                        imgSrc={imgSrc}
                        isLead={index === 0}
                        key={member.name}
                      ></RoleCard>;
                    })
                  }
                </ul>
              }
            ></WindowCard>
          );
        })
      }
    </div>
  );
}

export default RolesSection;
