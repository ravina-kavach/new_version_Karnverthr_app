import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Service from '../utils/service'
import Config from 'react-native-config';

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
      const netState = await NetInfo.fetch();
      const isOnline = netState.isConnected && netState.isInternetReachable;
      let newdata = await Service.GetRemember();      
      const email = newdata?.email;
      if (!email) {
        console.log('[HeadlessTask] Email not found, skipping API call');
        return;
      }

      if (isOnline) {
        const pendingRaw = await AsyncStorage.getItem('background_locations');
        const pending = pendingRaw ? JSON.parse(pendingRaw) : [];
        const allData = [...pending, loc];

        const formData = new FormData();
        formData.append('email', email);
        formData.append('geo_fence_data', JSON.stringify(allData));

        try {
          const response = await fetch(`${Config.BASE_URL}api/geo_fence`, {
            method: 'POST',
            body: formData,
          });          
          if (response.ok) {
            // console.log('[HeadlessTask] ✅ Data sent successfully.');
            await AsyncStorage.removeItem('background_locations');
          } else {
            // console.log('[HeadlessTask] ❌ Server error, storing for retry.');
            await AsyncStorage.setItem('background_locations', JSON.stringify(allData));
          }
        } catch (error) {
          // console.log('[HeadlessTask] ❌ Network/API error:', error);
          await AsyncStorage.setItem('background_locations', JSON.stringify(allData));
        }
      } else {
        // console.log('[HeadlessTask] 📡 Offline — storing location locally.');
        const existingRaw = await AsyncStorage.getItem('background_locations');
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        const isDuplicate = existing.some(item =>
          item.latitude === loc.latitude &&
          item.longitude === loc.longitude &&
          item.timestamp === loc.timestamp
        );
        if (!isDuplicate) {
          existing.push(loc);
          await AsyncStorage.setItem('background_locations', JSON.stringify(existing));
        } else {
          console.log('[HeadlessTask] 🔁 Duplicate location — not storing again.');
        }
      }
    } catch (err) {
      console.log('[HeadlessTask] 💥 Unexpected error:', err);
    }
  }
};

export default BackgroundGeolocationHeadlessTask;
