import React from 'react';
import {PassportSelfieScreen} from '../PassportSelfieScreen/PassportSelfieScreen.jsx';

export const PassportRegistrationSelfieScreen = ({setLoading, isRegistration}) => {
  return (
    <PassportSelfieScreen setLoading={setLoading} isRegistration={isRegistration} />
  );
};
