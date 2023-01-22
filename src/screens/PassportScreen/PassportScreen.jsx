import React, {useEffect} from 'react';
import Webcam from 'react-webcam';
import style from './PassportScreen.module.css';
import {dataURLtoFile} from '../../utils/dataURLtoFile.js';
import passport from '../../assets/images/passport.jpg';
import {Api} from '../../api/api.js';
import {URLtoDataURL} from '../../utils/URLtoDataURL.js';
import Passport from '../../components/Passport/Passport.jsx';
import {Mapper} from '../../utils/mapper.js';
import {Button} from '../../components/Button/Button.jsx';
import circle from '../../assets/images/cirlce.svg';
import {useOutletContext} from 'react-router-dom';

const videoConstraints = {
  facingMode: { exact: "environment" }
};

const docType = 'passport_main';

export const PassportScreen = ({setSelfieCheckDataToRequest}) => {
  const [result, setResult] = React.useState(null);
  const {setLoading} = useOutletContext();
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(
    async () => {
      setLoading({status: true, text: 'Распознаём...'});
      const dataURL = webcamRef.current.getScreenshot();
      // const dataURL = await URLtoDataURL(passport);
      const file = dataURLtoFile(dataURL, 'passport.jpeg');
      const data = await Api.recognize(file);
      setLoading({status: false, text: ''});
      setSelfieCheckDataToRequest?.((prev) => ({...prev, documentFile: file, documentSrc: dataURL}));
      setResult(data.data.items[0]);
    },
    [webcamRef],
  );

  return (
    <div className={style.passport}>
      {result ? <Passport fields={Mapper.mapRecognizedDataToItems(result.fields, docType)} docType={docType}/> : (
        <>
          <Webcam className="video" ref={webcamRef} videoConstraints={videoConstraints}
                  screenshotFormat="image/jpeg" autoPlay muted playsInline/>
          <Button onClick={capture}><img src={circle} alt="Круг"/></Button>
        </>
      )}
    </div>
  );
};
