import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserToken } from '../store/reducers/commonSlice';

let isBootstrapping = false;

export const bootstrapAuth = async (dispatch) => {
  if (isBootstrapping) {
    console.log('Bootstrap already running, skipping...');
    return;
  }
  isBootstrapping = true;
  try {
    const token = await AsyncStorage.getItem('USER_TOKEN');
    const expiresAt = await AsyncStorage.getItem('TOKEN_EXPIRES_AT');
    const isExpired = expiresAt || Date.now() > Number(expiresAt);

    console.log('TOKEN CHECK →', { token, isExpired });

    if (!token || isExpired) {
      console.log('Token missing/expired → fetching new token');

      await AsyncStorage.multiRemove([
        'USER_TOKEN',
        'TOKEN_EXPIRES_AT',
      ]);

      await dispatch(UserToken({ user_name: 'john' })).unwrap();
    } else {
      console.log('Valid token restored from storage');
    }
  } catch (error) {
    console.error('bootstrapAuth failed:', error);
  } finally {
    isBootstrapping = false; // 🔥 ALWAYS RESET
  }
};
