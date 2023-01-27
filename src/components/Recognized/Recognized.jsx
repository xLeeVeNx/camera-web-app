import React from 'react';
import style from './Recongnized.module.css';
import {Mapper} from '../../utils/mapper.js';
import {getNumericConfidence} from '../../utils/getNumericConfidence.js';
import Badge from '../Badge/Badge.jsx';
import {v4 as uuidv4} from 'uuid';

const Recognized = ({items, docType, imageSrc, isRegistration}) => {
  const item = items.length && items[0];
  if (item?.doc_type !== docType || !item) return (
    <>
      <img className={style.image} src={imageSrc} alt={`${isRegistration ? 'Прописка' : 'Паспорт'}`}/>
      <h1 className={style.title}>Извините, на фото не {isRegistration ? 'видна прописка' : 'виден паспорт'}.</h1>
    </>
  );
  const fields = Mapper.mapRecognizedDataToItems(item?.fields, item?.doc_type || item?.doc_type)
  const isEmptyField = fields.every((field) => field.name === '');
  if (isEmptyField) return (
    <>
      <img className={style.image} src={imageSrc} alt=""/>
      <h1 className={style.title}>Извините, на фото не видны все поля {isRegistration ? 'прописки' : 'паспорта'}.</h1>
    </>
  )
  const getConfidence = ({confidenceNumber}) => {
    if (confidenceNumber === 0) return 'Поле не найдено';

    return getNumericConfidence(confidenceNumber);
  };

  return (
    <div className={style.items}>
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
    </div>
  );
};

export default Recognized;
