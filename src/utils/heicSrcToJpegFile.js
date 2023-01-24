import heic2any from 'heic2any';
import {URLtoDataURL} from './URLtoDataURL.js';
import {base64ToFile} from './base64ToFile.js';

/* eslint-disable no-restricted-globals */
export const heicSrcToJpegFile = async (src, fileName = 'unnamed') => {
  return await fetch(src)
    .then((res) => res.blob())
    .then((blob) =>
      heic2any({
        blob,
        toType: 'image/jpeg',
        quality: 1,
      }),
    )
    .then((conversionResult) => new File([conversionResult], fileName, {
      lastModified: new Date().getTime(),
      type: conversionResult.type,
    }))
    .catch(async (e) => {
      return base64ToFile(await URLtoDataURL(src), fileName);
    });
};
