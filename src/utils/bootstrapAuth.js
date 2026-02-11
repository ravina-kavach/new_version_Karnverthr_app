import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserToken } from '../store/reducers/commonSlice';

let isBootstrapping = false;

export const bootstrapAuth = async (dispatch) => {
  if (isBootstrapping) {
    return;
  }

  isBootstrapping = true;

  try {
    const token = await AsyncStorage.getItem('USER_TOKEN');
    if (!token) {
      console.log('No token found. Generating new token...');
      await dispatch(
        UserToken({ user_name: 'john' })
      ).unwrap();
    }

  } catch (error) {
    console.error('bootstrapAuth failed:', error);
  } finally {
    isBootstrapping = false;
  }
};
