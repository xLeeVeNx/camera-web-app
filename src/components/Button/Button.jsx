import React from 'react';
import style from './Button.module.css';

export const Button = ({children, ...restProps}) => {
  return (
    <button {...restProps} className={`${style.button} button`} type="button">{children}</button>
  );
};
