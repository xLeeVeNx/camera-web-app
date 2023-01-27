import React from 'react';
import style from './Navbar.module.css';
import {RecognizeScreen} from '../../screens/RecognizeScreen/RecognizeScreen.jsx';
import {SelfieScreen} from '../../screens/SelfieScreen/SelfieScreen.jsx';
import {PassportSelfieScreen} from '../../screens/PassportSelfieScreen/PassportSelfieScreen.jsx';
import {
  SINGLE_PASSPORT_TYPE, SINGLE_SELFIE_TYPE,
} from '../../constants/constants.js';
import {
  PassportRegistrationSelfieScreen
} from '../../screens/PassportRegistrationSelfieScreen/PassportRegistrationSelfieScreen.jsx';

const items = [
  {
    id: 1,
    title: 'Паспорт',
    component: <RecognizeScreen componentType={SINGLE_PASSPORT_TYPE} />,
  },
  {
    id: 2,
    title: 'Селфи',
    component: <SelfieScreen componentType={SINGLE_SELFIE_TYPE} />,
  },
  {
    id: 3,
    title: 'Паспорт + селфи',
    component: <PassportSelfieScreen />,
  },
  {
    id: 4,
    title: 'Паспорт + прописка + селфи',
    component:  <PassportRegistrationSelfieScreen isRegistration={true} />,
  },
];

export const Navbar = ({isActive, isApp = false, onItemClick, onMenuClose}) => {
  const classNames = `${style.menu} ${isActive ? style.active : ''} ${isApp ? style.isApp : ''}`;

  const handleClick = (component) => {
    onItemClick?.(component);
    onMenuClose?.();
  };

  return (
    <ul className={classNames}>
      {items.map(({id, title, component}) => (
        <Item key={id} onClick={() => handleClick(component)}>{title}</Item>
      ))}
    </ul>
  );
};

const Item = ({children, onClick}) => {
  return (
    <li className={style.item} onClick={onClick}>
      <button className={style.button} type="button">{children}</button>
    </li>
  );
};
