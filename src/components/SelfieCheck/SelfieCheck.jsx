import React from 'react';
import style from './SelfieCheck.module.css';
import Badge from '../Badge/Badge.jsx';

export const SelfieCheck = ({result}) => {
  const mode = result.result > 0.5 ? 'High' : 'Low';
  return (
    <div className={style.selfieCheck}>
      <div className={style.item}>
        <div className={`text ${style.text}`}>Селфи</div>
        <div className={`text ${style.text}`}>Паспорт</div>
      </div>
      <div className={style.item}>
        <img className={style.image} src={result.selfieSrc} alt="Селфи"/>
        <img className={style.image} src={result.documentSrc} alt="Паспорт"/>
      </div>
      <div className={style.margin}>
        <div className={`text ${style.text}`}>Лица</div>
        <Badge className={style.badge} mode={mode}>{mode === 'High' ? 'Совпали' : 'Не совпали'}</Badge>
      </div>
      <div>
        <div className={`text ${style.text}`}>Дистанция</div>
        <Badge className={style.badge} mode="Low">{result.result}</Badge>
      </div>
    </div>
  );
};
