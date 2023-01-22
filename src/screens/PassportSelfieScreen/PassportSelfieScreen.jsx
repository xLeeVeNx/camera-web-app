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
  const {setLoading} = useOutletContext();

  useEffect(() => {
    const getResult = async () => {
      if (selfieCheckDataToRequest?.selfieSrc && selfieCheckDataToRequest?.documentSrc) {
        setLoading({status: true, text: 'Сравниваем...'});
        const response = await Api.splitSelfiePassportCheck({
          selfieFile: selfieCheckDataToRequest.selfieFile,
          documentFile: selfieCheckDataToRequest.documentFile,
          selfieSrc: selfieCheckDataToRequest.selfieSrc,
          documentSrc: selfieCheckDataToRequest.documentSrc,
        });
        setLoading({status: false, text: ''});
        setResult(response);
      }
    };
    getResult();

  }, [selfieCheckDataToRequest]);

  return (
    <>
      <PassportScreen setSelfieCheckDataToRequest={setSelfieCheckDataToRequest}/>
      <SelfieScreen setSelfieCheckDataToRequest={setSelfieCheckDataToRequest}/>
      {result && <SelfieCheck result={result}/>}
    </>
    // <Swiper pagination={true} autoHeight observer observeParents modules={[Pagination]} className="mySwiper">
    //   <SwiperSlide><PassportScreen setSelfieCheckDataToRequest={setSelfieCheckDataToRequest}/></SwiperSlide>
    //   <SwiperSlide><SelfieScreen setSelfieCheckDataToRequest={setSelfieCheckDataToRequest}/></SwiperSlide>
    //   {result && <SwiperSlide><SelfieCheck result={result}/></SwiperSlide>}
    // </Swiper>
  );
};
