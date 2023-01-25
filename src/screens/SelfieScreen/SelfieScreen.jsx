import React, {useEffect, useRef} from 'react';
import * as faceapi from 'face-api.js';
import style from './SelfieScreen.module.css';
import {Api} from '../../api/api.js';
import circle from '../../assets/images/cirlce.svg';
import {base64ToFile} from '../../utils/base64ToFile.js';
import {Selfie} from '../../components/Selfie/Selfie.jsx';
import {Button} from '../../components/Button/Button.jsx';
import {useOutletContext} from 'react-router-dom';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 1920,
  height: 1080,
  facingMode: 'user',
};

export const SelfieScreen = ({setSelfieCheckDataToRequest, setSelfieResult, setIsSelfieRequest, selfieResult}) => {
  const [screenShots, setScreenShots] = React.useState([]);
  const [faceClass, setFaceClass] = React.useState('');
  const {setLoading} = useOutletContext();
  const [result, setResult] = React.useState(null);

  const isFace = useRef(null);
  const videoRef = useRef(null);
  const screenShotIntervalId = useRef(null);
  const faceDetectionIntervalId = useRef(null);

  useEffect(() => {
    if (!result || !selfieResult) {
      videoRef && loadModels();
      screenShotIntervalId.current = setInterval(() => {
        const src = videoRef.current?.getScreenshot();
        if (isFace.current) {
          setScreenShots(prev => {
            const newScreenShots = [...prev, src];
            if (newScreenShots.length > 5) {
              newScreenShots.shift();
            }
            return newScreenShots;
          });
        }
      }, 500);
    }

    return () => {
      clearInterval(screenShotIntervalId.current);
      clearInterval(faceDetectionIntervalId.current);
    };
  }, []);
  const loadModels = () => {
    const MODEL_URL = '/models';
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ]).then(() => {
      faceDetection();
    });
  };

  const faceDetection = async () => {
    faceDetectionIntervalId.current = setInterval(async () => {
      const detection = videoRef.current?.video && await faceapi.detectSingleFace(videoRef.current.video, new faceapi.TinyFaceDetectorOptions({
        inputSize: 128,
        scoreThreshold: 0.3,
      })).withFaceLandmarks();
      const landmarks = detection?.landmarks;
      const nose = landmarks?.getNose();

      const isNoseTurned = !(nose?.every((point) => point.x < 385 && point.x > 270 && point.y < 380 && point.y > 120));

      if (isNoseTurned) {
        isFace.current = false;
        setFaceClass('');
      } else {
        isFace.current = true;
        setFaceClass(style.face);
      }
    }, 100);
  };

  const capture = React.useCallback(
    async () => {
      setIsSelfieRequest?.(true);
      setLoading({status: true, text: 'Сравниваем...'});
      clearInterval(screenShotIntervalId.current);
      clearInterval(faceDetectionIntervalId.current);

      const detection = videoRef.current?.video && await faceapi.detectSingleFace(videoRef.current.video, new faceapi.TinyFaceDetectorOptions({
        inputSize: 128,
        scoreThreshold: 0.3,
      })).withFaceLandmarks();

      let newScreenShots = [...screenShots];

      if (detection) {
        const src = videoRef.current.getScreenshot();
        newScreenShots = [...screenShots, src];

        if (newScreenShots.length > 5) {
          newScreenShots.shift();
        }

        setScreenShots(newScreenShots);
      }

      const files = newScreenShots.map((screenShot) => base64ToFile(screenShot, 'selfie.jpeg'));
      const response = await Api.batchLiveness(files, newScreenShots);

      if (setSelfieCheckDataToRequest) {
        const selfieSrc = newScreenShots[newScreenShots.length - 1];
        const selfieFile = base64ToFile(selfieSrc, 'selfie.jpeg');

        setSelfieCheckDataToRequest(prev => ({
          ...prev,
          selfieFile,
          selfieSrc,
        }));
      }
      setResult(response);
      setSelfieResult?.(response);
    });

  return (
    <>
      <div className={style.selfie}>
        {
          result || selfieResult ? (
            <Selfie items={result || selfieResult}/>
          ) : (
            <>
              <h2 className="title">Селфи</h2>
              <div className="subtitle">Расположите лицо в рамку</div>
              <Webcam className={`video ${style.video} ${faceClass}`} ref={videoRef} videoConstraints={videoConstraints}
                      screenshotFormat="image/jpeg" autoPlay audio={false} playsInline mirrored
                      forceScreenshotSourceSize imageSmoothing={false} screenshotQuality={1}/>
              <Button onClick={capture}><img src={circle} alt="Круг"/></Button>
            </>
          )
        }
      </div>
    </>
  );
};
