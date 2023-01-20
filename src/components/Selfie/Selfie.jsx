import React from 'react';
import style from './Selfie.module.css';
import live from '../../assets/images/live.svg';
import noLive from '../../assets/images/no_live.svg';
import Badge from '../Badge/Badge.jsx';
import {v4 as uuidv4} from 'uuid';
import {getConfidenceText} from '../../utils/getConfidenceText.js';

export const Selfie = ({items}) => {
  return (
<>
      <div className={style.item}>
        <div className="text">Селфи</div>
        <div className="text">Лайфнес</div>
        <div className="text">Уверенность</div>
      </div>
      {
        items.map((item) => {
          const confidenceText = getConfidenceText(item.result);

          return (
            <div className={style.item} key={uuidv4()}>
              <img className={style.image} src={item.src} alt="Селфи"/>
              <img src={confidenceText === 'Low' ? noLive : live} alt="Живой"/>
              <Badge mode={confidenceText}>
                {item.result.toFixed(3)}
              </Badge>
            </div>
          );
        })
      }
    </>
  );
};
