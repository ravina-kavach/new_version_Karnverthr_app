import BackgroundGeolocation from 'react-native-background-geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { permission } from './permission';

let locationSubscription = null;
const startTracking = async () => {
  try {
    const hasPermission = await permission.checkLocationPermission();
    if (!hasPermission) {
      const granted = await permission.requestLocationPermission();
      if (!granted) {
        permission.showPermissionSettingsAlert();
        return;
      }
    }
    const state = await BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 20, // only update if moved 20m
      interval: 60000,
      fastestInterval: 30000,
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
      foregroundService: true,
      debug: false,
      logLevel: BackgroundGeolocation.LOG_LEVEL_OFF,
      notification: {
        title: 'Konvert HR Tracking',
        text: 'Location tracking is active',
        channelName: 'Location Tracking',
        priority: BackgroundGeolocation.NOTIFICATION_PRIORITY_LOW,
      },
    });

    if (!state.enabled) await BackgroundGeolocation.start();

    if (!locationSubscription) {
      locationSubscription = BackgroundGeolocation.onLocation(
        async location => {
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            timestamp: location.timestamp,
          };

          const stored = JSON.parse(
            (await AsyncStorage.getItem('pending_geo_data')) || '[]'
          );

          const last = stored[stored.length - 1];
          if (!last || last.latitude !== newLocation.latitude || last.longitude !== newLocation.longitude) {
            stored.push(newLocation);
            await AsyncStorage.setItem('pending_geo_data', JSON.stringify(stored));
          }

          console.log('📍 Location saved:', newLocation);
        },
        error => {
          console.log('⚠️ Location error:', error);
        }
      );
    }

    console.log('✅ Background tracking started');
  } catch (error) {
    console.log('❌ Start tracking error:', error.message);
  }
};

const stopTracking = async () => {
  try {
    if (locationSubscription) {
      locationSubscription.remove();
      locationSubscription = null;
    }

    await BackgroundGeolocation.stop();
    console.log('🛑 Background tracking stopped');
  } catch (error) {
    console.log('❌ Stop tracking error:', error.message);
  }
};

const BackgroundHandler = {
  startTracking,
  stopTracking,
};

export default BackgroundHandler;
