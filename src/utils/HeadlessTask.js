import AsyncStorage from '@react-native-async-storage/async-storage';

const BackgroundGeolocationHeadlessTask = async (event) => {
  if (event.name === 'location') {
    const location = event.params;

    const loc = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: new Date(location.timestamp).toISOString(),
    };

    console.log('[HeadlessTask] Background location:', loc);

    try {
      const existingRaw = await AsyncStorage.getItem('background_locations');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const isDuplicate = existing.some(
        item =>
          item.latitude === loc.latitude &&
          item.longitude === loc.longitude &&
          item.timestamp === loc.timestamp
      );

      if (!isDuplicate) {
        existing.push(loc);
        await AsyncStorage.setItem('background_locations', JSON.stringify(existing));
        console.log('[HeadlessTask] Location stored locally.');
      } else {
        console.log('[HeadlessTask] Duplicate location — not storing again.');
      }
    } catch (err) {
      console.log('[HeadlessTask] 💥 Unexpected error:', err);
    }
  }
};

export default BackgroundGeolocationHeadlessTask;
