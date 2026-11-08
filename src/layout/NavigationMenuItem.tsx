import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationMenuItem.css';

interface NavigationMenuItemProps {
  link: string;
  label: string;
  dropdown?: boolean;
  onClick?: () => void;
}

function NavigationMenuItem(props: NavigationMenuItemProps) {
  return (
    <Link
      to={props.link}
      onClick={props.onClick}
      className={`
        navigation-menu-item
        ${props.dropdown ? 'p-4 hover:rounded-md hover:bg-gray-100' : ''}
      `}
    >
      {props.label}
    </Link>
  );
}

export default NavigationMenuItem;
