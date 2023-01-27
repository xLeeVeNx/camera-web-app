import {Api} from '../api/api.js';

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
