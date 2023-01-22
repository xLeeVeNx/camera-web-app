import React, {useEffect} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper';
import {PassportScreen} from '../PassportScreen/PassportScreen.jsx';
import {SelfieScreen} from '../SelfieScreen/SelfieScreen.jsx';
import {SelfieCheck} from '../../components/SelfieCheck/SelfieCheck.jsx';
import {RegistrationScreen} from '../RegistationScreen/RegistationScreen.jsx';
import {useOutletContext} from 'react-router-dom';
import {Api} from '../../api/api.js';

export const PassportRegistrationSelfie = () => {
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
    <Swiper pagination={true} autoHeight observer observeParents modules={[Pagination]} className="mySwiper">
      <SwiperSlide>
        {({isActive}) => (
          <PassportScreen isActive={isActive} setSelfieCheckDataToRequest={setSelfieCheckDataToRequest}/>
        )}
      </SwiperSlide>
      <SwiperSlide>
        {({isActive}) => (
          <RegistrationScreen isActive={isActive}/>
        )}
      </SwiperSlide>
      <SwiperSlide>
        {({ isActive }) => (
          <SelfieScreen isActive={isActive} setSelfieCheckDataToRequest={setSelfieCheckDataToRequest}/>
        )}
      </SwiperSlide>
      {result && <SwiperSlide><SelfieCheck result={result}/></SwiperSlide>}
    </Swiper>
  );
};
