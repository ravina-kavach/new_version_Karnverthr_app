import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import {
  PermissionsAndroid,
  Alert,
  Platform,
  BackHandler,
  Linking,
} from 'react-native';
import Service from './service';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

let isPickerOpen = false;

const requestLocationPermission = async () => {
 
  if (Platform.OS === 'android') {
    const fineGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    const coarseGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    );

    if (fineGranted || coarseGranted) return true;

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Konvert HR - Location Access Required',
        message:
          'Konvert HR needs access to your location to track attendance and check-ins accurately.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      }
    );

    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    await showPermissionSettingsAlert();
    return await requestLocationPermission();
  }

  if (Platform.OS === 'ios') {
    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

    if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
      return true;
    }

    Alert.alert(
      'Location Permission Required',
      'Please allow location permission from Settings to continue.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: openSettings },
      ],
      { cancelable: false }
    );

    return false;
  }

  return false;
};

const showPermissionSettingsAlert = () => {
  return new Promise(resolve => {
    Alert.alert(
      'Location Permission Required',
      'Please allow location permission from Settings to continue.',
      [
        { text: 'Exit App', onPress: () => BackHandler.exitApp() },
        {
          text: 'Open Settings',
          onPress: async () => {
            await Linking.openSettings();
            resolve();
          },
        },
      ],
      { cancelable: false }
    );
  });
};

const checkLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const fine = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    const coarse = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    );
    return fine || coarse;
  }

  if (Platform.OS === 'ios') {
    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
  }

  return false;
};


const getLocation = () => {
  Geolocation.getCurrentPosition(
    position => {
      console.log('coords:', position.coords);
    },
    error => {
      console.log('location error:', error);

  
      if (Platform.OS === 'android') {
        Service.OpenLocaitonbutton();
      }

      if (Platform.OS === 'ios') {
        Alert.alert(
          'Enable Location Services',
          'Please enable Location Services from Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openSettings },
          ],
          { cancelable: false }
        );
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    }
  );
};


// const handleOnCamera = async () => {
//   try {
//     let hasPermission = false;

//     const checkPermission = async () => {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.check(
//           PermissionsAndroid.PERMISSIONS.CAMERA
//         );
//         if (granted) return true;

//         const requestResult = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA
//         );
//         return requestResult === PermissionsAndroid.RESULTS.GRANTED;
//       } else {
//         const result = await request(PERMISSIONS.IOS.CAMERA);
//         return result === RESULTS.GRANTED;
//       }
//     };

//     while (!hasPermission) {
//       hasPermission = await checkPermission();
//       if (!hasPermission) {
//         await showSettingsAlert();
//       }
//     }

//     return new Promise(resolve => {
//       launchCamera(
//         {
//           mediaType: 'photo',
//           quality: 0.6,
//           cameraType: 'front',
//           includeBase64: true,
//           saveToPhotos: false,
//           // presentationStyle: 'fullScreen',
//         },
//         response => {
//           if (response?.didCancel || response?.errorCode) {
//             return resolve({ success: false });
//           }

//           const asset = response.assets?.[0];
//           resolve({
//             success: true,
//             image: {
//               base64: asset?.base64,
//               uri: asset?.uri,
//               fileName: asset?.fileName,
//               type: asset?.type,
//             },
//           });
//         }
//       );
//     });
//   } catch (error) {
//     console.log('Camera error:', error);
//     return { success: false };
//   }
// };

const handleOnCamera = async () => {
  try {
    const checkPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const result = await request(PERMISSIONS.IOS.CAMERA);

        if (result === RESULTS.BLOCKED) {
          Alert.alert(
            'Permission Required',
            'Camera permission is blocked. Please enable it from settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
          return false;
        }

        return result === RESULTS.GRANTED;
      }
    };

    const hasPermission = await checkPermission();

    if (!hasPermission) {
      return { success: false };
    }

    return new Promise(resolve => {
      launchCamera(
        {
          mediaType: 'photo',
          quality: 0.5,
          cameraType: 'front',
          includeBase64: false,
          saveToPhotos: false,
        },
        async response => {
          if (response?.didCancel) {
            return resolve({ success: false });
          }

          if (response?.errorCode) {
            console.log('Camera error:', response.errorMessage);
            return resolve({ success: false });
          }

          const asset = response.assets?.[0];

          if (!asset?.uri) {
            return resolve({ success: false });
          }

          try {
            // ✅ Resize image to prevent 413
            const resizedImage = await ImageResizer.createResizedImage(
              asset.uri,
              800,
              800,
              'JPEG',
              60
            );

            // ✅ Convert resized image to base64
            const base64Image = await RNFS.readFile(
              resizedImage.uri,
              'base64'
            );

            resolve({
              success: true,
              image: {
                base64: base64Image,
                type: 'image/jpeg',
                fileName: 'photo.jpg',
              },
            });
          } catch (resizeError) {
            console.log('Resize/Base64 error:', resizeError);
            resolve({ success: false });
          }
        }
      );
    });
  } catch (error) {
    console.log('Camera permission error:', error);
    return { success: false };
  }
};

const handleOnGallery = async () => {
  try {
    if (isPickerOpen) return;
    isPickerOpen = true;

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
      isPickerOpen = false;
      return { success: false };
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: true,
      quality: 0.8,
    });

    isPickerOpen = false;

    if (result.didCancel || result.errorCode || !result.assets?.length) {
      return { success: false };
    }

    const asset = result.assets[0];

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
    isPickerOpen = false;
    return { success: false };
  }
};

const showSettingsAlert = () => {
  Alert.alert(
    'Permission Required',
    'Please enable permission in Settings.',
    [{ text: 'Open Settings', onPress: openSettings }],
    { cancelable: false }
  );
};

export const permission = {
  requestLocationPermission,
  checkLocationPermission,
  showPermissionSettingsAlert,
  showSettingsAlert,
  handleOnCamera,
  handleOnGallery,
  getLocation,
};
