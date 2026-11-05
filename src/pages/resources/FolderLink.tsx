import React from 'react';
import './FolderLink.css';

interface FolderLinkProps {
  label: string;
  link: string;
}

function FolderLink(props: FolderLinkProps) {
  return (
    <a className='folder-link' href={props.link} target='_blank' rel='noreferrer'>
      <img src='/folder_icon.svg'></img>
      <p>{props.label}</p>
    </a>
  );
}

export default FolderLink;
