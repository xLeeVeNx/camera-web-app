import React from 'react';
import style from './Passport.module.css';
import {Mapper} from '../../utils/mapper.js';
import {getNumericConfidence} from '../../utils/getNumericConfidence.js';
import Badge from '../Badge/Badge.jsx';
import {v4 as uuidv4} from 'uuid';

const Passport = ({fields, docType}) => {
  const getConfidence = ({confidenceNumber}) => {
    if (confidenceNumber === 0) return 'Поле не найдено';

    return getNumericConfidence(confidenceNumber);
  };

  return (
    <>
      <div className={`${style.item} ${style.margin}`}>
        <div className="text">Поля и Значения</div>
        <div className="text">Уверенность</div>
      </div>
      {
        fields.map((field) => !field.name.includes('mrz') && (
          <React.Fragment key={uuidv4()}>
            <div className={style.item}>
              <div className={style.sub_item}>
                {
                  Mapper.mapDocumentFieldName(
                    docType,
                    field.name,
                  )
                }
              </div>

              {field.confidenceNumber !== 0 && (
                <Badge mode={field.confidenceLevel}>
                  {getConfidence(field)}
                </Badge>
              )}
            </div>
            <div className={`${style.sub_item} ${style.margin}`}>
              {
                Mapper.mapRecognizedValue(
                  docType,
                  field.name,
                  field.value,
                )
              }
            </div>
          </React.Fragment>
        ))
      }
    </>
  );
};

export default Passport;