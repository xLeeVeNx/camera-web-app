import React from 'react';
import {Burger} from '../../components/Burger/Burger.jsx';
import {Outlet} from 'react-router-dom';
import {Navbar} from '../../components/Navbar/Navbar.jsx';
import style from './RootScreen.module.css';
import {Loader} from '../../components/Loader/Loader.jsx';

export const RootScreen = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [loading, setLoading] = React.useState({status: false, text: ''});

  const handleMenuToggle = () => {
    if (isMenuOpen) {
      document.body.style.overflowY = 'auto';
    } else {
      document.body.style.overflowY = 'hidden';
    }
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <div className="app">

      <Outlet context={{setLoading}}/>
    </div>
  );
};
