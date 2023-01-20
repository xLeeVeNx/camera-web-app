import React from 'react';
import {Link} from 'react-router-dom';
import style from './RouteLink.module.css';

export const RouteLink = ({to, children, onClick}) => {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <li className={style.li} onClick={handleClick}>
      <Link className={style.link} to={to}>{children}</Link>
    </li>
  );
};
