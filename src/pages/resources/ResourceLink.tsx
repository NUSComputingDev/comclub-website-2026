import React from 'react';
import { IconType } from 'react-icons';
import './ResourceLink.css';

interface ResourceLink {
  label: string;
  link: string;
  icon: IconType;
}

function ResourceLink(props: ResourceLink) {
  return (
    <a className='resource-link' href={props.link} target='_blank' rel='noreferrer'>
      <props.icon className='resource-link-icon' />
      <p>{props.label}</p>
    </a>
  );
}

export default ResourceLink;
