import React, {useEffect} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import {PassportScreen} from '../PassportScreen/PassportScreen.jsx';
import {SelfieScreen} from '../SelfieScreen/SelfieScreen.jsx';
import {Api} from '../../api/api.js';
import {SelfieCheck} from '../../components/SelfieCheck/SelfieCheck.jsx';
import {useOutletContext} from 'react-router-dom';

export const PassportSelfieScreen = () => {
  const [selfieCheckDataToRequest, setSelfieCheckDataToRequest] = React.useState(null);
  const [result, setResult] = React.useState(null);
  const [passportResult, setPassportResult] = React.useState(null);
  const [selfieResult, setSelfieResult] = React.useState(null);
  const {loading, setLoading} = useOutletContext();
  const [isPassportRequest, setIsPassportRequest] = React.useState(false);
  const [isSelfieRequest, setIsSelfieRequest] = React.useState(false);

  useEffect(() => {
    const getResult = async () => {
      const dataToRequest = await selfieCheckDataToRequest;
      if (dataToRequest?.selfieSrc && dataToRequest?.documentSrc) {
        const response = await Api.splitSelfiePassportCheck({
          selfieFile: dataToRequest.selfieFile,
          documentFile: dataToRequest.documentFile,
          selfieSrc: dataToRequest.selfieSrc,
          documentSrc: dataToRequest.documentSrc,
        });
        setLoading({status: false, text: ''});
        setResult(response);
      }
    };
    getResult();

  }, [selfieCheckDataToRequest]);

  return (
    <>
      {
        isSelfieRequest && result ? (
          <Swiper initialSlide={2} autoHeight pagination={true} observer observeParents modules={[Pagination]}>
            <SwiperSlide>
              <PassportScreen selfieCheckDataToRequest={selfieCheckDataToRequest} passportResult={passportResult}/>
            </SwiperSlide>
            <SwiperSlide>
              <SelfieScreen selfieResult={selfieResult}/>
            </SwiperSlide>
            {passportResult?.doc_type === 'passport_main' && (
              <SwiperSlide><SelfieCheck result={result}/></SwiperSlide>
            )}
          </Swiper>
        ) : isPassportRequest ? (
          <SelfieScreen setSelfieResult={setSelfieResult} setIsSelfieRequest={setIsSelfieRequest}
                        setSelfieCheckDataToRequest={setSelfieCheckDataToRequest}/>
        ) : (
          <PassportScreen setIsPassportRequest={setIsPassportRequest} setPassportResult={setPassportResult}
                          setSelfieCheckDataToRequest={setSelfieCheckDataToRequest}/>
        )
      }
    </>
  );
};
