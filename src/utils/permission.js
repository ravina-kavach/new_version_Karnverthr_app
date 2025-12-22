
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { PermissionsAndroid, Alert, Platform } from 'react-native'
import Service from './service';
import { launchCamera } from 'react-native-image-picker'

const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        // ✅ ANDROID FLOW
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
          console.log('Location permission granted');
          getLocation();
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          console.log('User selected Never Ask Again');
          showPermissionSettingsAlert();
        } else {
          console.log('Location permission denied');
          showPermissionSettingsAlert();
        }
      } else {
        // ✅ iOS FLOW
        const permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
        const result = await request(permission);
        console.log("result>>>>", result)

        switch (result) {
          case RESULTS.GRANTED:
            console.log('iOS location permission granted');
            getLocation();
            break;

          case RESULTS.DENIED:
            console.log('iOS location permission denied');
            Alert.alert(
              'Konvert HR - Location Required',
              'Please allow location access to enable attendance and check-in features.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => openSettings() },
              ]
            );
            break;

          case RESULTS.BLOCKED:
            console.log('iOS location permission permanently denied');
            showPermissionSettingsAlert(true);
            break;

          default:
            console.log('iOS permission status:', result);
            showPermissionSettingsAlert(true);
            break;
        }
      }
    } catch (err) {
      console.log('Error requesting location permission:', err);
    }
  };

    const showPermissionSettingsAlert = (isBlocked = false) => {
    const message = isBlocked
      ? 'You have permanently denied location access. Please enable it in settings.'
      : 'Please enable location access in settings.';

    Alert.alert('Location Permission', message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => openSettings() },
    ]);
  };
  const getLocation = async () => {
    Geolocation.getCurrentPosition((position) => {
      console.log("position.coords>>>", position.coords)
    },
      (error) => {
        Service.OpenLocaitonbutton()
        console.log("error.message>>>", error)
      },
      { enableHighAccuracy: false, timeout: 60000, maximumAge: 0 }
    );
  }

  const heandleOnCamera = async () => {
    try {
      let hasPermission = false;

      // ✅ Android Permission Handling
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Konvert HR - Camera Permission',
            message: 'Konvert HR needs access to your camera to take your photo.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          hasPermission = true;
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          showSettingsAlert(false);
          return;
        } else {
          showSettingsAlert(false);
          return;
        }
      }

      // ✅ iOS Permission Handling
      if (Platform.OS === 'ios') {
        const result = await request(PERMISSIONS.IOS.CAMERA);

        switch (result) {
          case RESULTS.GRANTED:
            hasPermission = true;
            break;
          case RESULTS.DENIED:
            Alert.alert(
              'Konvert HR - Camera Access Needed',
              'Please allow camera access to take a photo using Konvert HR.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => openSettings() },
              ]
            );
            return;
          case RESULTS.BLOCKED:
            showSettingsAlert(true);
            return;
          default:
            showSettingsAlert(true);
            return;
        }
      }

      if (hasPermission) {
        launchCamera(
          {
            mediaType: 'photo',
            PhotoQuality: 0.1,
            cameraType: 'front',
            saveToPhotos: false,
            includeBase64: true,
            includeExtra: true,
          },
          (response) => {
            if (response.didCancel) {
              console.log('User cancelled camera picker');
            } else if (response.errorCode) {
              console.log('Camera Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
              const source = response.assets[0];
               return source
            }
          },
        );
      }
    } catch (err) {
      console.warn('Camera Permission Error:', err);
    }
  };

   const showSettingsAlert = (isIOS = false) => {
    Alert.alert(
      'Konvert HR - Permission Required',
      isIOS
        ? 'Please enable camera access in Settings to use Konvert HR camera features.'
        : 'Please enable camera access in Settings to use Konvert HR camera features.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => openSettings() },
      ]
    );
  };


  export const permission = {
    requestLocationPermission,
    showPermissionSettingsAlert,
    showSettingsAlert,
    heandleOnCamera

  }

