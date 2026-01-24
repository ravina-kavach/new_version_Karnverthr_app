import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { PermissionsAndroid, Alert, Platform } from 'react-native';
import Service from './service';
import { launchCamera ,launchImageLibrary } from 'react-native-image-picker';

const requestLocationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Konvert HR - Location Access Required',
          message: 'Konvert HR needs access to your location to track attendance and check-ins accurately.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getLocation();
      } else {
        showPermissionSettingsAlert();
      }
    } else {
      const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (result === RESULTS.GRANTED) {
        getLocation();
      } else {
        showPermissionSettingsAlert(true);
      }
    }
  } catch (err) {
    console.log('Location permission error:', err);
  }
};

const showPermissionSettingsAlert = (isIOS = false) => {
  Alert.alert(
    'Location Permission',
    'Please enable location access in Settings.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: openSettings },
    ]
  );
};

const getLocation = () => {
  Geolocation.getCurrentPosition(
    position => {
      console.log('coords:', position.coords);
    },
    error => {
      console.log('location error:', error);
      Service.OpenLocaitonbutton();
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    }
  );
};

const heandleOnCamera = async () => {
  try {
    let hasPermission = false;

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const result = await request(PERMISSIONS.IOS.CAMERA);
      hasPermission = result === RESULTS.GRANTED;
    }

    if (!hasPermission) {
      showSettingsAlert();
      return { success: false };
    }

    return new Promise(resolve => {
      launchCamera(
        {
          mediaType: 'photo',
          quality: 0.1,
          cameraType: 'front',
          includeBase64: true,
        },
        response => {
          if (response?.didCancel || response?.errorCode) {
            return resolve({ success: false });
          }

          const asset = response.assets?.[0];
          resolve({
            success: true,
            image: {
              base64: asset.base64,
              uri: asset.uri,
              fileName: asset.fileName,
              type: asset.type,
            },
          });
        }
      );
    });
  } catch {
    return { success: false };
  }
};

const handleOnGallery = async () => {
  try {
    let hasPermission = true;
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      hasPermission =
        result === RESULTS.GRANTED || result === RESULTS.LIMITED;
    }

    if (!hasPermission) {
      showSettingsAlert();
      return { success: false };
    }
    await new Promise((res) => setTimeout(res, 250));
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: true,
      quality: 0.8,
    });
    if (result.didCancel || result.errorCode) {
      return { success: false };
    }
    if (!result.assets || !result.assets.length) {
      return { success: false };
    }

    const asset = result.assets[0];

    if (!asset?.uri) {
      return { success: false };
    }
    return {
      success: true,
      image: {
        base64: asset.base64 || '',
        uri: asset.uri,
        fileName: asset.fileName || `image_${Date.now()}.jpg`,
        type: asset.type || 'image/jpeg',
      },
    };
  } catch (error) {
    console.log('handleOnGallery error:', error);
    return { success: false };
  }
};



const showSettingsAlert = () => {
  Alert.alert(
    'Permission Required',
    'Please enable permission in Settings.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: openSettings },
    ]
  );
};

export const permission = {
  requestLocationPermission,
  showPermissionSettingsAlert,
  showSettingsAlert,
  heandleOnCamera,
  handleOnGallery
};
