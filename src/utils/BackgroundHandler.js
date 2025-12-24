 
import BackgroundGeolocation from 'react-native-background-geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Service from './service';
import Config from 'react-native-config';
import { request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

let locationSubscription = null;

const startTracking = async () => {
  try {
    let hasPermission = false;

    // ✅ 1. Handle permissions differently for Android & iOS
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      ]);

      hasPermission = Object.values(granted).every(
        permission => permission === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!hasPermission) {
        Alert.alert(
          'Konvert HR - Location Permission Needed',
          'Please grant all location permissions to enable background tracking.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () =>openSettings() },
          ]
        );
        return;
      }
    } else if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);

      if (result === RESULTS.GRANTED) {
        hasPermission = true;
      } else if (result === RESULTS.DENIED) {
        Alert.alert(
          'Konvert HR - Location Access Needed',
          'Konvert HR needs location access to track your movements in background.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ]
        );
        return;
      } else if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Location Access Blocked',
          'Please enable location access from Settings to continue using Konvert HR.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ]
        );
        return;
      }
    }
   
    // ✅ 2. Configure BackgroundGeolocation
    const state = await BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 0,
      interval: 60000,
      fastestInterval: 60000,
      locationUpdateInterval: 60000,
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
      allowIdenticalLocations: true,
      showsBackgroundLocationIndicator: true,
      allowsBackgroundLocationUpdates: true,
      locationAuthorizationRequest: 'Always',
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      foregroundService: true,
      notification: {
        title: 'Konvert HR is tracking',
        text: 'Your location is being recorded in background',
        channelName: 'Location Tracking',
        priority: BackgroundGeolocation.NOTIFICATION_PRIORITY_LOW,
        sound: null,
      },
    });

    if (!state.enabled) {
      await BackgroundGeolocation.start();
    }

    // ✅ 3. Subscribe to location updates
    locationSubscription = BackgroundGeolocation.onLocation(
      async location => {
        const loc = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: new Date(location.timestamp).toISOString(),
        };

        const existing = await AsyncStorage.getItem('foreground_locations');
        const stored = existing ? JSON.parse(existing) : [];
        stored.push(loc);
        await AsyncStorage.setItem('foreground_locations', JSON.stringify(stored));

        const netState = await NetInfo.fetch();
        const isOnline = netState.isConnected && netState.isInternetReachable;

        const pending = await AsyncStorage.getItem('pending_geo_data');
        const pendingData = pending ? JSON.parse(pending) : [];
        const allLocations = [...pendingData, loc];

        const newdata = await Service.GetRemember();
        const formData = new FormData();
        formData.append('email', newdata?.email);
        formData.append('geo_fence_data', JSON.stringify(allLocations));

        if (isOnline) {
          // try {
          //   const response = await fetch(`${Config.BASE_URL}api/geo_fence`, {
          //     method: 'POST',
          //     body: formData,
          //   });
          //   const result = await response.json();

          //   if (response.ok) {
          //     console.log('✅ Sent to API:', result);
          //     await AsyncStorage.removeItem('pending_geo_data');
          //   } else {
          //     console.log('❌ API error:', result);
          //     await AsyncStorage.setItem('pending_geo_data', JSON.stringify(allLocations));
          //   }
          // } catch (err) {
          //   console.log('❌ Network/API error:', err);
          //   await AsyncStorage.setItem('pending_geo_data', JSON.stringify(allLocations));
          // }
        } else {
          // const existingPending = await AsyncStorage.getItem('pending_geo_data');
          // const storedPending = existingPending ? JSON.parse(existingPending) : [];
          // const isDuplicate = storedPending.some(
          //   item =>
          //     item.latitude === loc.latitude &&
          //     item.longitude === loc.longitude &&
          //     item.timestamp === loc.timestamp
          // );

          // if (!isDuplicate) {
          //   storedPending.push(loc);
          //   await AsyncStorage.setItem('pending_geo_data', JSON.stringify(storedPending));
          // }
        }
      },
      error => {
        console.log('⚠️ Location error:', error);
      }
    );

    console.log('📍 Konvert HR Tracking Started');
  } catch (error) {
    console.log('❌ Error starting tracking:', error.message);
  }
};
  
  const stopTracking = async () => {
    try {
      if (locationSubscription) {
        locationSubscription.remove();
        locationSubscription = null;
      }
  
      await BackgroundGeolocation.stop();
      console.log('🛑 Tracking stopped');
    } catch (err) {
      console.log('❌ Failed to stop tracking:', err.message);
    }
  };

const BackgroundHandler={startTracking,stopTracking}
  export default BackgroundHandler;