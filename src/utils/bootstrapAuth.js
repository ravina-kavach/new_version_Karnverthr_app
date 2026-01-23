// src/utils/bootstrapAuth.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserToken } from '../store/reducers/commonSlice';

let isBootstrapping = false;

export const bootstrapAuth = async (dispatch) => {
  if (isBootstrapping) return;
  isBootstrapping = true;

  const token = await AsyncStorage.getItem('USER_TOKEN');

  if (!token) {
    console.log('No token found → fetching new token');
    await dispatch(UserToken({ user_name: 'john' })).unwrap();
  } else {
    console.log('Token restored from storage');
  }

  isBootstrapping = false;
};
