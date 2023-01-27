import React from 'react';
import style from './Burger.module.css';

export const Burger = ({isOpen = false, onToggle, children}) => {
  const handleOnToggle = () => {
    onToggle?.();
  };

  const classNames = `${style.burger} ${isOpen ? style.active : ''}`;

  return (
    <button className={classNames} onClick={handleOnToggle}>
      <div>
        <span className={style.line}></span>
        <span className={style.line}></span>
        <span className={style.line}></span>
      </div>
      {children && <span className={style.text}>{children}</span>}
    </button>
  );
};
