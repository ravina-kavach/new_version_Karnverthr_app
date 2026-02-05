import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserToken } from '../store/reducers/commonSlice';

let isBootstrapping = false;

export const bootstrapAuth = async (dispatch) => {
  if (isBootstrapping) return;
  isBootstrapping = true;

  const token = await AsyncStorage.getItem('USER_TOKEN');
  const expiresAt = await AsyncStorage.getItem('TOKEN_EXPIRES_AT');

  const isExpired =
    !expiresAt || Date.now() > Number(expiresAt);
    
  if (!token || isExpired) {
    console.log('Token missing or expired → fetching new token');

    await AsyncStorage.multiRemove([
      'USER_TOKEN',
      'TOKEN_EXPIRES_AT',
    ]);

    await dispatch(UserToken({ user_name: 'john' })).unwrap();
  } else {
    console.log('Valid token restored from storage');
  }

  isBootstrapping = false;
};
