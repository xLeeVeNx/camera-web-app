import {Api} from '../../api/api.js';
import {base64ToFile} from '../../utils/base64ToFile.js';
import passport from '../../assets/images/passport.jpg';
import {URLtoDataURL} from '../../utils/URLtoDataURL.js';

/* eslint-disable no-restricted-globals */
self.onmessage = async (event) => {
  if (event && event.data && event.data.msg === 'getData') {
    const {response, file, base64} = await getData(event.data);
    self.postMessage({...JSON.parse(JSON.stringify({response, base64})), file})
  }
};

async function getData({file, base64, params}) {
  const response = await Api.recognize(file, params);
  return {response, file, base64}
}
