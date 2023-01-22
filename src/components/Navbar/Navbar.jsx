import React from 'react';
import {RouteLink} from '../RouteLink/RouteLink';
import style from './Navbar.module.css';

const items = [
  {
    id: 1,
    title: 'Паспорт',
    to: '/passport',
  },
  {
    id: 2,
    title: 'Селфи',
    to: '/selfie',
  },
  {
    id: 3,
    title: 'Паспорт + селфи',
    to: '/passport-selfie',
  },
  {
    id: 4,
    title: 'Паспорт + прописка + селфи',
    to: '/passport-registration-selfie',
  },
]

export const Navbar = ({onItemClick, className, ...restProps}) => {
  return (
      <ul {...restProps} className={`${style.menu} ${className || ""}`}>
        {items.map(({to, id, title}) => (
          <RouteLink onClick={onItemClick} key={id} to={to}>{title}</RouteLink>
        ))}
      </ul>
  );
};
