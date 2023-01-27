import React, {useEffect} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import {RecognizeScreen} from '../RecognizeScreen/RecognizeScreen.jsx';
import {SelfieScreen} from '../SelfieScreen/SelfieScreen.jsx';
import {Api} from '../../api/api.js';
import {SelfieCheck} from '../../components/SelfieCheck/SelfieCheck.jsx';
import {
  PASSPORT_COMPONENT,
  PASSPORT_DOC_TYPE,
  PASSPORT_REGISTRATION_DOC_TYPE,
  REGISTRATION_COMPONENT,
  SELFIE_COMPONENT,
} from '../../constants/constants.js';

export const PassportSelfieScreen = ({setLoading, isRegistration}) => {
  const initialSlide = isRegistration ? 3 : 2;

  const [requestData, setRequestData] = React.useState(null);
  const [result, setResult] = React.useState(null);

  const [requestResult, setRequestResult] = React.useState({
    [PASSPORT_COMPONENT]: null,
    [REGISTRATION_COMPONENT]: null,
    [SELFIE_COMPONENT]: null,
  });
  const [requested, setRequested] = React.useState({
    [PASSPORT_COMPONENT]: false,
    [REGISTRATION_COMPONENT]: false,
    [SELFIE_COMPONENT]: false,
  });

  useEffect(() => {
    const getResult = async () => {
      const dataToRequest = await requestData;
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

  }, [requestData]);

  return (
    <>
      {
        requested[SELFIE_COMPONENT] && result ? (
          <Swiper initialSlide={initialSlide} autoHeight pagination={true} observer observeParents
                  modules={[Pagination]}>
            <SwiperSlide>
              <RecognizeScreen requestResult={requestResult} componentType={PASSPORT_COMPONENT}/>
            </SwiperSlide>
            {isRegistration && (
              <SwiperSlide>
                <RecognizeScreen requestResult={requestResult} componentType={REGISTRATION_COMPONENT}
                                 isRegistration={isRegistration}/>
              </SwiperSlide>
            )}
            <SwiperSlide>
              <SelfieScreen requestResult={requestResult} componentType={SELFIE_COMPONENT}/>
            </SwiperSlide>
            <SwiperSlide><SelfieCheck result={result}/></SwiperSlide>
          </Swiper>
        ) : isRegistration ? (
          <RegistrationLayout
            requested={requested}
            setRequested={setRequested}
            setLoading={setLoading}
            setRequestData={setRequestData}
            setRequestResult={setRequestResult}
          />
        ) : requested[PASSPORT_COMPONENT] ? (
          <SelfieScreen setLoading={setLoading} setRequested={setRequested} setRequestResult={setRequestResult}
                        setRequestData={setRequestData}
                        componentType={SELFIE_COMPONENT}/>
        ) : (
          <RecognizeScreen setRequested={setRequested} setRequestResult={setRequestResult}
                           setRequestData={setRequestData} docType={PASSPORT_DOC_TYPE}
                           componentType={PASSPORT_COMPONENT}/>
        )
      }
    </>
  );
};

const RegistrationLayout = ({
                              setLoading,
                              setRequestData,
                              setRequestResult,
                              setRequested,
                              requested,
                            }) => {
  return requested[REGISTRATION_COMPONENT] ? (
    <SelfieScreen setLoading={setLoading} setRequested={setRequested} setRequestResult={setRequestResult} setRequestData={setRequestData}
                  componentType={SELFIE_COMPONENT}/>
  ) : requested[PASSPORT_COMPONENT] ? (
    <RecognizeScreen setRequested={setRequested} setRequestResult={setRequestResult}
                     docType={PASSPORT_REGISTRATION_DOC_TYPE}
                     isRegistration={true} componentType={REGISTRATION_COMPONENT}
    />
  ) : (
    <RecognizeScreen setRequested={setRequested} setRequestResult={setRequestResult} setRequestData={setRequestData}
                     docType={PASSPORT_DOC_TYPE} componentType={PASSPORT_COMPONENT}
    />
  );
};
