import React, {useEffect} from 'react';
import {Loader} from '../Loader/Loader.jsx';
import {Burger} from '../Burger/Burger.jsx';
import {Navbar} from '../Navbar/Navbar.jsx';
import style from './Layout.module.css';

export const Layout = ({children, handleScreenChange}) => {
  const [loading, setLoading] = React.useState({status: false, text: ''});
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuText = isMenuOpen ? '' : 'Меню';

  useEffect(() => {
    if (loading.status) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
  }, [loading.status]);

  const handleMenuToggle = () => {
    if (isMenuOpen) {
      document.body.style.overflowY = 'auto';
    } else {
      document.body.style.overflowY = 'hidden';
    }
    setIsMenuOpen(!isMenuOpen);
  }

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { setLoading });
    }
    return child;
  });

  return (
    <>
      {loading.status && <Loader>{loading.text}</Loader> }
      <Burger isOpen={isMenuOpen} onToggle={handleMenuToggle}>{menuText}</Burger>
      <Navbar isActive={isMenuOpen} onMenuClose={handleMenuToggle} onItemClick={handleScreenChange} />
      <div className={style.screen}>{childrenWithProps}</div>
    </>
  );
};
