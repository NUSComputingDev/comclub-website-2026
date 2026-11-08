import React from 'react';
import { FaTelegramPlane } from 'react-icons/fa';
import { SiLinktree } from 'react-icons/si';
import './index.css';
import ResourceLink from './ResourceLink';
import FolderLink from './FolderLink';

function Resources() {
  return (
    <div className='resources'>
      <h1>
        Resources
      </h1>

      <div className='resources-content'>
        <div className='resource-window-container'>

          <br/>

          <ResourceLink
            label='t.me/nuscomputingclub'
            link='https://t.me/nuscomputingclub'
            icon={FaTelegramPlane}
          ></ResourceLink>
          <ResourceLink
            label='linktr.ee/nuscomputingclub'
            link='https://linktr.ee/nuscomputingclub'
            icon={SiLinktree}
          ></ResourceLink>
        </div>

        <div className='resource-link-container'>

          <div className='flex flex-col'>
            <div className='flex flex-row justify-center'>
              <FolderLink
                label='Photos'
                link='https://www.flickr.com/photos/137141057@N04/albums/'
              ></FolderLink>
              <FolderLink
                label='Maps'
                link='https://www.comp.nus.edu.sg/maps/venues/'
              ></FolderLink>
            </div>
            <div className='flex flex-row justify-center'>
              <FolderLink
                label='Merch'
                link='https://nusfastpay.nus.edu.sg/ccmerch/menu'
              ></FolderLink>
              <FolderLink
                label='Feedback'
                link='https://feedback.nuscomputing.com/'
              ></FolderLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;
