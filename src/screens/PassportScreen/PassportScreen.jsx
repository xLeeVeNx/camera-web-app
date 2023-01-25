import React, {useEffect} from 'react';
import Webcam from 'react-webcam';
import style from './PassportScreen.module.css';
import {base64ToFile} from '../../utils/base64ToFile.js';
import Passport from '../../components/Passport/Passport.jsx';
import {Button} from '../../components/Button/Button.jsx';
import circle from '../../assets/images/cirlce.svg';
import {useOutletContext} from 'react-router-dom';

const videoConstraints = {
  width: 1920,
  height: 1080,
  facingMode: { exact: "environment" }
  // facingMode: 'user',
};

const docType = 'passport_main';

export const PassportScreen = ({
                                 setSelfieCheckDataToRequest,
                                 setPassportResult,
                                 setIsPassportRequest,
                                 passportResult,
  selfieCheckDataToRequest
                               }) => {
  const webcamRef = React.useRef(null);
  const [result, setResult] = React.useState(null);
  const {setLoading} = useOutletContext();
  const passportWorker = React.useMemo(
    () => new Worker(new URL('./worker.js', import.meta.url)),
    [],
  );

  useEffect(() => {
    passportWorker.onmessage = (event) => {
      if (event && event.data) {
        if (window.location.pathname === '/passport') {
          setLoading({status: false, text: ''});
        } else {
          setSelfieCheckDataToRequest?.((prev) => ({...prev, documentFile: file, documentSrc: base64}));
        }
        const {response, file, base64} = event.data;
        setResult(response?.data?.items[0]);
        setPassportResult?.(response?.data?.items[0]);
      }
    };
  }, [passportWorker]);

  function getData(file, base64) {
    const data = JSON.parse(JSON.stringify({
      msg: 'getData',
      base64,
    }));

    passportWorker
      .postMessage({...data, file});
  }

  const capture = React.useCallback(async () => {
    setIsPassportRequest?.(true);
    const base64 = webcamRef.current.getScreenshot();
    // const base64 = await URLtoDataURL(passport)
    const file = base64ToFile(base64, 'passport.jpeg');
    getData(file, base64);
    if (window.location.pathname === '/passport') {
      setLoading({status: true, text: 'Распознаем...'});
    }
  }, [webcamRef]);

  return (
    <div className={style.passport}>
      {result || passportResult ? <Passport imageSrc={selfieCheckDataToRequest?.documentSrc}
        item={result || passportResult}
        docType={docType}/> : (
        <>
          <h2 className="title">Паспорт</h2>
          <div className="subtitle">Расположите паспорт в рамку</div>
          <Webcam className={`video ${style.video}`} ref={webcamRef} videoConstraints={videoConstraints}
                  screenshotFormat="image/jpeg" autoPlay audio={false} playsInline forceScreenshotSourceSize
                  imageSmoothing={false} screenshotQuality={1}/>
          <Button onClick={capture}><img src={circle} alt="Круг"/></Button>
        </>
      )}
    </div>
  );
};
