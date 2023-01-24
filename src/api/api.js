import {axiosInstance, secondaryURL} from './index.js';
import axios from 'axios';

export class Api {
  static async recognize(file) {
    const formData = new FormData();
    formData.append('image', file);
    return axiosInstance.post('https://latest.dbrain.io/recognize', formData, {
      params: {
        with_hitl: false,
        mode: 'default',
        token: 'docr2021docr',
      },
    });
  }

  static async splitSelfiePassportCheck({selfieFile, documentFile, selfieSrc, documentSrc}) {
    const formData = new FormData();
    formData.append('face_image', selfieFile);
    formData.append('document_image', documentFile);

    try {
      const response = await axios.post(`${secondaryURL}/pipelines/run/face_selfie_split`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

      return {...response.data, selfieSrc, documentSrc};
    } catch (e) {
      return {
        status: 'rejected',
        selfieFile,
        documentFile,
      };
    }
  }

  static async faceLiveness(file, screenShot) {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${secondaryURL}/pipelines/run/face_liveness`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        ...response.data,
        src: screenShot,
      };
    } catch (e) {
      return {
        status: 'rejected',
        file,
      };
    }
  }

  static async batchLiveness(files, screenShots) {
    const promises = [];

    files.forEach((file, index) => {
      promises.push(Api.faceLiveness(file, screenShots[index]));
    });

    return await Promise.all(promises);
  }
}
