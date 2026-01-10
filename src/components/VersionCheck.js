import { Alert, Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import VersionCheck from 'react-native-version-check';

export const checkAppVersion = async () => {
  try {
    const currentVersion = DeviceInfo.getVersion();
    const latestVersion = await VersionCheck.getLatestVersion();
    const storeUrl = await VersionCheck.getStoreUrl();

    if (currentVersion !== latestVersion) {
      Alert.alert(
        'Update Available',
        'A new version of KonverHR is available. Please update to continue.',
        [
          {
            text: 'Update Now',
            onPress: () => Linking.openURL(storeUrl),
          },
        ],
        { cancelable: false } // force user to update
      );
    }
  } catch (error) {
    console.log('Version check failed:', error);
  }
};
