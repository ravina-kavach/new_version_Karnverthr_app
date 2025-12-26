import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: Config.BASE_URL,
  timeout: 20000,
});

const skipAuthUrls = ['api/auth'];

API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('USER_TOKEN');
      console.log("Config.BASE_URL===>",Config.BASE_URL)
      console.log("Token===>",token)
      if (!skipAuthUrls.some((url) => config.url.includes(url)) && token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    } catch (err) {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (for debugging)
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;