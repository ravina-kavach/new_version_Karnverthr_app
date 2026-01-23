import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import { resetToLogin } from '../../utils/NavigationService';

const API = axios.create({
  baseURL: Config.BASE_URL,
  timeout: 20000,
});

const skipAuthUrls = ['api/auth'];
let isLoggingOut = false;

API.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('USER_TOKEN');
      console.log("API_URL===>",Config.BASE_URL)
      console.log("TOKEN===>",token)
    if (!skipAuthUrls.some(url => config.url.includes(url))) {
      if (!token) {
        return Promise.reject({
          response: { status: 401 },
        });
      }

      config.headers.Authorization = token;
    }

    return config;
  },
  error => Promise.reject(error)
);

API.interceptors.response.use(
  response => response,
  async error => {
    if (error?.response?.status === 401 && !isLoggingOut) {
      isLoggingOut = true;
      await AsyncStorage.removeItem('USER_TOKEN');
      resetToLogin();
    }
    return Promise.reject(error);
  }
);

export default API;
