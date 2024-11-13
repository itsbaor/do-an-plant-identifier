//This file container function calling api
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {AxiosInstance, AxiosResponse} from 'axios';

export const ERROR = {
  KEY_EXHAUSTED: JSON.stringify({}),
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  error => {
    if (error.response) {
      return Promise.reject({});
    }
    if (error.request) {
      console.log(error);
      return Promise.reject({});
    }
    return Promise.reject({});
  },
);

export const getApi = (url: string, data?: any): Promise<any> =>
  axiosInstance
    .get(url, {
      params: data,
    })
    .then((response: AxiosResponse) => response.data)
    .catch(error => error);

export const getApiWithApiKey = (
  url: string,
  apiKey: string,
  data?: any,
): Promise<any> =>
  axiosInstance
    .get(url, {
      params: data,
      headers: {
        'Api-Key': apiKey,
      },
    })
    .then((response: AxiosResponse) => response.data)
    .catch(error => error);

export const postApi = (
  url: string,
  data: any,
  headers: any = {},
): Promise<any> =>
  axiosInstance
    .post(url, data, headers)
    .then((response: AxiosResponse) => response.data)
    .catch(error => error);

export const putApi = (url: string, data: any): Promise<any> =>
  axiosInstance
    .put(url, data)
    .then((response: AxiosResponse) => response.data)
    .catch(error => error);

export const patchApi = (url: string, data: any): Promise<any> =>
  axiosInstance
    .patch(url, data)
    .then((response: AxiosResponse) => response.data)
    .catch(error => error);

export const deleteApi = (url: string): Promise<any> =>
  axiosInstance
    .delete(url)
    .then((response: AxiosResponse) => response.data)
    .catch(error => error);

export const uploadApi = (url: string, data: FormData): Promise<any> =>
  axiosInstance
    .post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response: AxiosResponse) => response.data);

export const uploadApiWithApiKey = (
  url: string,
  data: FormData,
  apiKey: string,
): Promise<any> =>
  axiosInstance
    .post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Api-Key': apiKey,
      },
    })
    .then((response: AxiosResponse) => response.data);
// .catch((error) => {
//   console.error("Dev define error in fetching post with apikey:\n", error);
//   return error;
// });

export default axiosInstance;
