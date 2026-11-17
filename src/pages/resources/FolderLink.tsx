import React from 'react';
import { Link } from 'react-router-dom';
import './FolderLink.css';
import { asset } from '../../lib/asset';

interface FolderLinkProps {
  label: string;
  link: string;
}

function FolderLink(props: FolderLinkProps) {
  const content = (
    <>
      <img src={asset('/folder_icon.svg')} alt=''></img>
      <p>{props.label}</p>
    </>
  );

  if (props.link.startsWith('/')) {
    return (
      <Link className='folder-link' to={props.link}>
        {content}
      </Link>
    );
  }

  return (
    <a className='folder-link' href={props.link} target='_blank' rel='noreferrer'>
      {content}
    </a>
  );
}

export default FolderLink;
