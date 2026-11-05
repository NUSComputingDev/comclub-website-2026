import React from 'react';
import './RoleCard.css';

interface RoleCardProps {
  name: string;
  role: string;
  imgSrc: string;
  isLead?: boolean;
}

function RoleCard(props: RoleCardProps) {
  return (
    <li className={`role-card ${props.isLead ? 'lead' : ''}`}>
      <img
        src={props.imgSrc}
        alt={props.name}
        width={480}
        height={640}
        loading='lazy'
        decoding='async'
      ></img>
      <h3>{props.name}</h3>
      <p>{props.role}</p>
    </li>
  );
}

export default RoleCard;
