import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import store from '../index';
import { UserToken, UserOdooToken } from './commonSlice';
import APIS_ENDPOINTS from './apiEndPoints';

// odoo Api prod url
// BASE_URL=https://odooprod.konverthr.com//

// odoo stage url
// BASE_URL=http://odooapi.konverthr.com//

const ODOO_API = axios.create({
    baseURL: 'https://odooprod.konverthr.com//',
    timeout: 20000,
});

const skipAuthUrls = [APIS_ENDPOINTS.AUTH_TOKEN];

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

ODOO_API.interceptors.request.use(
    async config => {
        const token = await AsyncStorage.getItem('USER_ODOO_TOKEN');
        console.log("BASE_URL====>", Config.BASE_URL)
        console.log("TOKEN====>", token)
        if (!skipAuthUrls.some(url => config.url.includes(url))) {
            if (token) {
                config.headers.Authorization = token;
            }
        }

        return config;
    },
    error => Promise.reject(error)
);

ODOO_API.interceptors.response.use(
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
                        return ODOO_API(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                console.log("Token expired. Generating new token...");

                const result = await store.dispatch(
                    UserOdooToken({ user_name: "ravina" })
                ).unwrap();

                await AsyncStorage.setItem('USER_ODOO_TOKEN', result);

                processQueue(null, result);

                originalRequest.headers.Authorization = result;

                return ODOO_API(originalRequest);

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

export default ODOO_API;
