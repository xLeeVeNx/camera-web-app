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
  const [activeIndex, setActiveIndex] = React.useState(0);

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
    <Swiper pagination={true} autoHeight observer observeParents modules={[Pagination]} className="mySwiper"
            onActiveIndexChange={({activeIndex}) => {
              setActiveIndex(activeIndex);
            }
            }>
      <SwiperSlide>
        {activeIndex === 0 && <PassportScreen setSelfieCheckDataToRequest={setSelfieCheckDataToRequest}/> }
      </SwiperSlide>
      <SwiperSlide>
        {activeIndex === 1 && <RegistrationScreen/> }
      </SwiperSlide>
      <SwiperSlide>
        {activeIndex === 2 && <SelfieScreen setSelfieCheckDataToRequest={setSelfieCheckDataToRequest}/>}
      </SwiperSlide>
      {result && <SwiperSlide><SelfieCheck result={result}/></SwiperSlide>}
    </Swiper>
  );
};
