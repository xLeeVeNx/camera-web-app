import React, {useEffect} from 'react';
import Webcam from 'react-webcam';
import {base64ToFile} from '../../utils/base64ToFile.js';
import Recognized from '../../components/Recognized/Recognized.jsx';
import circle from '../../assets/images/cirlce.svg';
import {SINGLE_PASSPORT_TYPE} from '../../constants/constants.js';

const videoConstraints = {
  facingMode: {exact: 'environment'},
};

export const RecognizeScreen = ({
                                  setRequestData,
                                  setRequestResult,
                                  setRequested,
                                  requestResult,
                                  setLoading,
                                  docType,
                                  componentType,
                                  isRegistration,
                                }) => {
  const webcamRef = React.useRef(null);
  const [result, setResult] = React.useState(null);
  const [base64, setBase64] = React.useState(null);
  const recognizeWorker = React.useMemo(
    () => new Worker(new URL('../../workers/recognizeWorker.js', import.meta.url)),
    [componentType],
  );

  useEffect(() => {
    recognizeWorker.onmessage = (event) => {
      if (event && event.data) {
        if (componentType === SINGLE_PASSPORT_TYPE) {
          setLoading({status: false, text: ''});
        }
        const {response, file, base64} = event.data;

        setBase64(base64);
        if (!setRequestData) {
          setResult(response?.data?.items);
        }
        setRequestResult?.((prev) => {
          const result = {...prev, [componentType]: {items: response?.data?.items, imageSrc: base64}};
          return result;
        });
        setRequestData?.((prev) => ({...prev, documentFile: file, documentSrc: base64}));
      }
    };
  }, [recognizeWorker]);

  function getData(file, base64) {
    const data = JSON.parse(JSON.stringify({
      msg: 'getData',
      base64,
    }));

    recognizeWorker
      .postMessage({...data, file, params: {doc_type: docType}});
  }

  const capture = React.useCallback(async () => {
    if (componentType === SINGLE_PASSPORT_TYPE) {
      setLoading({status: true, text: 'Распознаем...'});
    }
    setRequested?.((prev) => ({...prev, [componentType]: true}));
    const base64 = webcamRef.current.getScreenshot();
    const file = base64ToFile(base64, 'passport.jpeg');
    getData(file, base64);
  }, [webcamRef, componentType, setLoading, setRequested]);

  return (
    <>
      {result || requestResult && requestResult[componentType] ? (
        <Recognized imageSrc={base64 || requestResult[componentType].imageSrc} items={result || requestResult[componentType].items}
                    docType={docType} isRegistration={isRegistration}/>
      ) : (
        <>
          <h2 className="title">{isRegistration ? 'Прописка' : 'Паспорт'}</h2>
          <div className="subtitle">Расположите {isRegistration ? 'прописку' : 'паспорт'} в рамку</div>
          <Webcam className="video" ref={webcamRef} videoConstraints={videoConstraints}
                  screenshotFormat="image/jpeg" autoPlay audio={false} playsInline forceScreenshotSourceSize
                  imageSmoothing={false} screenshotQuality={1}/>
          <button className="reset-button mt-30" onClick={capture}><img src={circle} alt="Круг"/></button>
        </>
      )}
    </>
  );
};
