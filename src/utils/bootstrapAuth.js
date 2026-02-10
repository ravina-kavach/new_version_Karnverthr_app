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
    console.log('Refreshing auth token on app entry');

    await AsyncStorage.multiRemove([
      'USER_TOKEN',
      'TOKEN_EXPIRES_AT',
    ]);

    await dispatch(
      UserToken({ user_name: 'john' })
    ).unwrap();

  } catch (error) {
    console.error('bootstrapAuth failed:', error);
  } finally {
    isBootstrapping = false;
  }
};
