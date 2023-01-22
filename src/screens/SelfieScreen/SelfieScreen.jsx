import React, {useEffect, useRef} from 'react';
import * as faceapi from 'face-api.js';
import style from './SelfieScreen.module.css';
import {Api} from '../../api/api.js';
import circle from '../../assets/images/cirlce.svg';
import {dataURLtoFile} from '../../utils/dataURLtoFile.js';
import {Selfie} from '../../components/Selfie/Selfie.jsx';
import {Button} from '../../components/Button/Button.jsx';
import {useOutletContext} from 'react-router-dom';

export const SelfieScreen = ({setSelfieCheckDataToRequest}) => {
  const [screenShots, setScreenShots] = React.useState([]);
  const [result, setResult] = React.useState(null);
  const {setLoading} = useOutletContext();

  const isFace = useRef(null);
  const videoRef = useRef(null);
  const screenShotIntervalId = useRef(null);
  const faceDetectionIntervalId = useRef(null);

  const getScreenshotSource = (element) => {
    const canvas = document.createElement('canvas');
    canvas.width = element?.videoWidth;
    canvas.height = element?.videoHeight;
    if (element) {
      canvas.getContext('2d').drawImage(element, 0, 0);
    }

    return canvas.toDataURL('image/jpeg');
  }

  useEffect(() => {
    startVideo();
    videoRef && loadModels();

    screenShotIntervalId.current = setInterval(() => {
      const src = getScreenshotSource(videoRef.current);
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

    return () => {
      videoRef.current?.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current?.pause();
      clearInterval(screenShotIntervalId.current);
      clearInterval(faceDetectionIntervalId.current);
    };
  }, []);
  const loadModels = () => {
    const MODEL_URL = '/models';
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    ]).then(() => {
      faceDetection();
    });
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({video: true})
      .then((currentStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      }).catch((err) => {
      console.log(err);
    });
  };

  const faceDetection = async () => {
    faceDetectionIntervalId.current = setInterval(async () => {
      const detections = await faceapi.detectAllFaces
      (videoRef.current, new faceapi.TinyFaceDetectorOptions({
        inputSize: 128,
        scoreThreshold: 0.5,
      }));

      if (detections.length) {
        isFace.current = true;
      } else {
        isFace.current = false;
      }
    }, 100);
  };

  const capture = React.useCallback(
    async () => {
      clearInterval(screenShotIntervalId.current);
      clearInterval(faceDetectionIntervalId.current);

      setLoading({status: true, text: 'Загружаем...'});

      const detections = await faceapi.detectAllFaces
      (videoRef.current, new faceapi.TinyFaceDetectorOptions({
        inputSize: 128,
        scoreThreshold: 0.3,
      }));

      let newScreenShots = [...screenShots];

      if (detections.length) {
        const src = getScreenshotSource(videoRef.current);

        newScreenShots = [...screenShots, src];

        if (newScreenShots.length > 5) {
          newScreenShots.shift();
        }

        setScreenShots(newScreenShots);
      }

      const files = newScreenShots.map((screenShot) => dataURLtoFile(screenShot, 'selfie.jpeg'));
      const response = await Api.batchLiveness(files, newScreenShots);

      setLoading({status: false, text: ''});

      setSelfieCheckDataToRequest?.((prev) => ({...prev, selfieFile: files[files.length - 1], selfieSrc: newScreenShots[newScreenShots.length - 1]}));
      setResult(response);
    });

  return (
    <>
      <div className={style.selfie}>
        {
          result ? (
            <Selfie items={result}/>
          ) : (
            <>
              <video className="video" crossOrigin="anonymous" ref={videoRef} autoPlay muted></video>
              <Button onClick={capture}><img src={circle} alt="Круг"/></Button>
            </>
          )
        }
      </div>
    </>
  );
};
