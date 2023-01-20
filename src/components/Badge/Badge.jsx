import React from 'react';
import style from './Badge.module.css';

const getClassname = (mode) => {
  switch (mode) {
    case 'Low':
      return style.low;
    case 'Medium':
      return style.medium;
    case 'High':
      return style.high;
  }
};

const Badge = ({mode, children, className}) => {
  return (
    <div className={[style.root, getClassname(mode), className || ''].join(' ')}>
      {children}
    </div>
  );
};

export default Badge;
