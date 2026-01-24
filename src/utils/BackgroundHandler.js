import BackgroundGeolocation from 'react-native-background-geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

let locationSubscription = null;

/**
 * START BACKGROUND LOCATION TRACKING
 * Call this on CHECK-IN
 */
const startTracking = async () => {
  try {
    let hasPermission = false;

    // ===== ANDROID PERMISSIONS =====
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      ]);

      hasPermission = Object.values(granted).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!hasPermission) {
        Alert.alert(
          'Location Permission Needed',
          'Please allow location access to enable tracking.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openSettings },
          ]
        );
        return;
      }
    }

    // ===== IOS PERMISSIONS =====
    if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);

      if (result !== RESULTS.GRANTED) {
        Alert.alert(
          'Location Permission Needed',
          'Please enable location access from Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openSettings },
          ]
        );
        return;
      }
    }

    // ===== CONFIGURE BACKGROUND GEOLOCATION =====
    const state = await BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 20,               // update only if user moves 20 meters
      interval: 60000,                  // 1 minute
      fastestInterval: 30000,
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
      preventSuspend: false,
      allowIdenticalLocations: false,
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

    if (!state.enabled) {
      await BackgroundGeolocation.start();
    }

    // ===== LOCATION LISTENER =====
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

        // Avoid duplicate points
        if (
          last &&
          last.latitude === newLocation.latitude &&
          last.longitude === newLocation.longitude
        ) {
          return;
        }

        stored.push(newLocation);
        await AsyncStorage.setItem(
          'pending_geo_data',
          JSON.stringify(stored)
        );

        console.log('📍 Location saved:', newLocation);
      },
      error => {
        console.log('⚠️ Location error:', error);
      }
    );

    console.log('✅ Background tracking started');
  } catch (error) {
    console.log('❌ Start tracking error:', error.message);
  }
};

/**
 * STOP BACKGROUND LOCATION TRACKING
 * Call this on CHECK-OUT
 */
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
