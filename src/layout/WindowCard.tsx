import React from 'react';
import './WindowCard.css';

interface WindowProps {
  content: React.ReactNode;
  title?: React.ReactNode;
  heightClass?: string;
  widthClass?: string;
}

function WindowCard(props: WindowProps) {
  return (
    <div className={
      `window ${props.heightClass || ''} ${props.widthClass || ''}`
    }>
      <div className='action-bar'>
        <div className='action-button bg-[#ff605c]'></div>
        <div className='action-button bg-[#ffbd44]'></div>
        <div className='action-button bg-[#00ca4e]'></div>
        {props.title && <div className='window-title'>{props.title}</div>}
      </div>
      <div className='window-content'>
        <div>{props.content}</div>
      </div>
    </div>
  );
}

export default WindowCard;
