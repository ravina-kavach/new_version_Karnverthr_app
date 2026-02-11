import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import store from '../index';
import { UserToken } from './commonSlice';

const API = axios.create({
  baseURL: Config.BASE_URL,
  timeout: 20000,
});

const skipAuthUrls = ['api/auth'];

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

API.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('USER_TOKEN');
    console.log("BASE_URL====>",Config.BASE_URL)
    console.log("TOKEN====>",token)
    if (!skipAuthUrls.some(url => config.url.includes(url))) {
      if (token) {
        config.headers.Authorization = token;
      }
    }

    return config;
  },
  error => Promise.reject(error)
);

API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 &&
        !originalRequest._retry &&
        !skipAuthUrls.some(url => originalRequest.url.includes(url))
    ) {

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = token;
            return API(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Token expired. Generating new token...");

        const result = await store.dispatch(
          UserToken({ user_name: 'john' })
        ).unwrap();

        await AsyncStorage.setItem('USER_TOKEN', result);

        processQueue(null, result);

        originalRequest.headers.Authorization = result;

        return API(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
