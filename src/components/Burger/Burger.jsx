import React from 'react';
import style from './Burger.module.css';
import burger from '../../assets/images/burger.svg';
import close from '../../assets/images/close.svg';

export const Burger = ({isOpen = false, onClick}) => {
  const handleOnClick = () => {
    onClick?.();
  };

  const classNames = `${style.button} ${isOpen ? style.opened : ''}`;
  const alt = isOpen ? 'Закрыть' : 'Открыть';
  const src = isOpen ? close : burger;

  return (
    <button className={classNames} onClick={handleOnClick}>
      <img src={src} alt={alt}/>
      {!isOpen && 'Меню'}
    </button>
  );
};
