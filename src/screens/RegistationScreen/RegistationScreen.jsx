import React, {useEffect} from 'react';
import Webcam from 'react-webcam';
import style from './RegistationScreen.module.css';
import {base64ToFile} from '../../utils/base64ToFile.js';
import Passport from '../../components/Passport/Passport.jsx';
import {Button} from '../../components/Button/Button.jsx';
import circle from '../../assets/images/cirlce.svg';

const videoConstraints = {
  width: 1920,
  height: 1080,
  facingMode: { exact: "environment" }
  // facingMode: 'user',
};

const docType = 'passport_registration';

export const RegistrationScreen = ({
                                 setRegistrationResult, setIsRegistrationRequest, registrationResult
                               }) => {
  const webcamRef = React.useRef(null);
  const [result, setResult] = React.useState(null);
  const [base64, setBase64] = React.useState(null);
  const passportWorker = React.useMemo(
    () => new Worker(new URL('../PassportScreen/worker.js', import.meta.url)),
    [],
  );

  useEffect(() => {
    passportWorker.onmessage = (event) => {
      if (event && event.data) {
        const {response, base64} = event.data;
        setBase64(base64);
        setResult(response?.data?.items[0]);
        setRegistrationResult?.(response?.data?.items[0]);
      }
    };
  }, [passportWorker]);

  function getData(file, base64) {
    const data = JSON.parse(JSON.stringify({
      msg: 'getData',
      base64,
    }));

    passportWorker
      .postMessage({...data, file, params: {doc_type: docType}});
  }

  const capture = React.useCallback(async () => {
    setIsRegistrationRequest?.(true);
    const base64 = webcamRef.current.getScreenshot();
    // const base64 = await URLtoDataURL(passport)
    const file = base64ToFile(base64, 'passport.jpeg');
    getData(file, base64);
  }, [webcamRef]);

  return (
    <div className={style.registration}>
      {result || registrationResult ? <Passport imageSrc={base64} isRegistration={true}
                                            item={result || registrationResult}
                                            docType={docType}/> : (
        <>
          <h2 className="title">Прописка</h2>
          <div className="subtitle">Расположите прописку в рамку</div>
          <Webcam className={`video`} ref={webcamRef} videoConstraints={videoConstraints}
                  screenshotFormat="image/jpeg" autoPlay audio={false} playsInline forceScreenshotSourceSize
                  imageSmoothing={false} screenshotQuality={1}/>
          <Button onClick={capture}><img src={circle} alt="Круг"/></Button>
        </>
      )}
    </div>
  );
};
