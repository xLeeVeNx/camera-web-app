import React, {useEffect, useRef} from 'react';
import * as faceapi from 'face-api.js';
import style from './SelfieScreen.module.css';
import {Api} from '../../api/api.js';
import circle from '../../assets/images/cirlce.svg';
import {base64ToFile} from '../../utils/base64ToFile.js';
import {Selfie} from '../../components/Selfie/Selfie.jsx';
import Webcam from 'react-webcam';
import {SINGLE_SELFIE_TYPE} from '../../constants/constants.js';

const videoConstraints = {
  facingMode: 'user',
};

export const SelfieScreen = ({
                               setRequestData,
                               requestResult,
                               setRequested,
                               setRequestResult,
                               setLoading,
                               componentType,
                             }) => {
    const [screenShots, setScreenShots] = React.useState([]);
    const [faceClass, setFaceClass] = React.useState('');
    const [result, setResult] = React.useState(null);
    const [sizes, setSizes] = React.useState(null);
    const isFace = useRef(null);
    const videoRef = useRef(null);

    const screenShotIntervalId = useRef(null);
    const faceDetectionIntervalId = useRef(null);

    const tinyFaceDetector = React.useRef(null);

    const onLoadedData = () => {
      const base64 = videoRef.current.getScreenshot();
      const image = new Image();
      image.src = base64;
      image.onload = function () {
        setSizes({
          x: 640 / this.width,
          y: 480 / this.height,
        });
      };
    };

    useEffect(() => {
      if (!result || !requestResult[componentType] && sizes) {
        videoRef && loadModels();

        screenShotIntervalId.current = setInterval(() => {
          const screenshot = videoRef.current?.getScreenshot();
          if (isFace.current) {
            const newScreenShots = [...screenShots, screenshot];
            if (newScreenShots.length > 5) {
              newScreenShots.shift();
            }
            setScreenShots(newScreenShots);
          }
        }, 500);

        return () => {
          clearInterval(screenShotIntervalId.current);
          clearInterval(faceDetectionIntervalId.current);
        };
      }
    }, [sizes]);

    const loadModels = () => {
      const MODEL_URL = '/models';
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]).then(() => {
        tinyFaceDetector.current = new faceapi.TinyFaceDetectorOptions({
          inputSize: 128,
          scoreThreshold: 0.3,
        });
        faceDetection();
      });
    };
    const faceDetection = async () => {
      faceDetectionIntervalId.current = setInterval(async () => {
        const detection = videoRef.current?.video &&
          await faceapi
            .detectSingleFace(videoRef.current.video, tinyFaceDetector.current)
            .withFaceLandmarks();

        const position = detection?.landmarks?.positions[27];
        const {x, y} = position || {x: 0, y: 0};

        if (sizes && position) {
          const isStraightFace = x * sizes.x < 385 && x * sizes.x > 270 && y * sizes.y < 300 && y * sizes.y > 120;
          isFace.current = isStraightFace;
          setFaceClass(isStraightFace ? style.face : '');
        }
      }, 100);
    };

    const capture = React.useCallback(
      async () => {

        setRequested?.((prev) => ({...prev, [componentType]: true}));
        setLoading({status: true, text: 'Сравниваем...'});
        clearInterval(screenShotIntervalId.current);
        clearInterval(faceDetectionIntervalId.current);

        const detection = videoRef.current?.video &&
          await faceapi
            .detectSingleFace(videoRef.current.video, tinyFaceDetector.current)
            .withFaceLandmarks();

        let newScreenShots = [...screenShots];

        if (detection) {
          const screenshot = videoRef.current.getScreenshot();
          newScreenShots = [...screenShots, screenshot];

          if (newScreenShots.length > 5) {
            newScreenShots.shift();
          }

          setScreenShots(newScreenShots);
        }

        const files = newScreenShots.map((screenShot) => base64ToFile(screenShot, 'selfie.jpeg'));
        const response = await Api.batchLiveness(files, newScreenShots);

        if (componentType === SINGLE_SELFIE_TYPE) {
          setLoading({status: false, text: ''});
        }

        setResult(response);
        setRequestResult?.((prev) => ({...prev, [componentType]: response}));

        if (setRequestData) {
          const selfieSrc = newScreenShots[newScreenShots.length - 1];
          const selfieFile = base64ToFile(selfieSrc, 'selfie.jpeg');

          setRequestData(prev => ({
            ...prev,
            selfieFile,
            selfieSrc,
          }));
        }
      }, [videoRef, screenShots, componentType, setRequestData, setRequested, setLoading, setRequestResult]);

    return (
      <>
        {
          result || requestResult && requestResult[componentType] ? (
            <Selfie items={result || requestResult[componentType]}/>
          ) : (
            <>
              <h2 className="title">Селфи</h2>
              <div className="subtitle">Расположите лицо в рамку</div>
              <Webcam className={`video ${style.video} ${faceClass}`} ref={videoRef} videoConstraints={videoConstraints}
                      screenshotFormat="image/jpeg" autoPlay audio={false} playsInline mirrored
                      forceScreenshotSourceSize imageSmoothing={false} screenshotQuality={1}
                      onLoadedData={onLoadedData}
              />
              <button className="reset-button mt-30" onClick={capture}><img src={circle} alt="Круг"/></button>
            </>
          )
        }
      </>
    );
  }
;
