import React, { useEffect, useState, useRef } from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';
import { Provider, useDispatch } from 'react-redux';
import { AppState, Platform } from 'react-native';
import Navigation from './src/navigations/Navigation';
import store from './src/store';
import './src/utils/i18n';
import GlobalStyle from './src/theme/globalstyle';
import VersionCheck from 'react-native-version-check';
import { bootstrapAuth } from './src/utils/bootstrapAuth';
import UpdateModal from './src/components/UpdateModal'
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import OfflineModal from './src/components/OfflineModal';
import { showMessage } from 'react-native-flash-message';
import {
  requestUserPermission,
  getFCMToken,
  notificationListener,
  notificationOpenHandler,
} from './src/utils/PushNotificationService';

const Root = () => {
  const dispatch = useDispatch();
  const [showUpdate, setShowUpdate] = useState(false);
  const [storeUrl, setStoreUrl] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const appStateRef = useRef(AppState.currentState);
  const isNetworkStable = (state) => {
    const details = state.details || {};
    const linkSpeed = details.linkSpeed || 0;
    const strength = details.strength ?? 0;

    if (linkSpeed && linkSpeed < 5) {
      return {
        stable: false,
        reason: 'Your internet connection is very slow. Please switch to a faster network.',
      };
    }

    if (strength && strength < 40) {
      return {
        stable: false,
        reason: 'Your Wi-Fi signal is weak. Move closer to the router or try another network.',
      };
    }

    if (state.type === 'cellular' && state.isConnectionExpensive) {
      return {
        stable: false,
        reason: 'Your mobile data connection is unstable. Network performance may be limited.',
      };
    }

    return {
      stable: true,
      reason: null,
    };
  };

  useEffect(() => {
    let lastReason = null;
    const unsubscribe = NetInfo.addEventListener(state => {
      const offline = !state.isConnected || state.isInternetReachable === false;
      setIsOffline(offline);

      if (offline) {
        lastReason = null;
        return;
      }
      const { stable, reason } = isNetworkStable(state);

      if (!stable && reason !== lastReason) {
        lastReason = reason;

        showMessage({
          icon: 'danger',
          message: reason,
          type: 'danger',
          duration: 3000,
        });
      }

      if (stable) {
        lastReason = null;
      }
    });

    return () => unsubscribe();
  }, []);

  // notification configation

  useEffect(() => {
    requestUserPermission();
    getFCMToken();

    const unsubscribe = notificationListener();
    notificationOpenHandler();

    return unsubscribe;
  }, []);

  const handleRetry = async () => {
    const state = await NetInfo.fetch();
    const offline = !state.isConnected || state.isInternetReachable === false;
    setIsOffline(offline);
    if (!offline) {
      const { stable, reason } = isNetworkStable(state);

      if (!stable) {
        showMessage({
          icon: 'danger',
          message: reason,
          type: 'danger',
          duration: 3000,
        });
      }
    }
  };


  useEffect(() => {
    bootstrapAuth(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        bootstrapAuth(dispatch);
      }
      appStateRef.current = nextState;
    });

    return () => subscription.remove();
  }, [dispatch]);

  const checkAppVersion = async () => {
    try {
      const currentVersion = DeviceInfo.getVersion();

      console.log("Current Version:", currentVersion);

      if (Platform.OS === "ios") {
        try {
          const response = await fetch(
            "https://itunes.apple.com/lookup?id=6758077368&country=in"
          );

          const data = await response.json();

          if (!data?.results?.length) return;

          const latestVersion = data.results[0].version;
          let storeUrl = data.results[0].trackViewUrl;

          if (storeUrl.startsWith("https://")) {
            storeUrl = storeUrl.replace("https://", "itms-apps://");
          }

          const needUpdate = await VersionCheck.needUpdate({
            currentVersion,
            latestVersion,
          });

          console.log("Latest Version:", latestVersion);
          console.log("Need Update:", needUpdate);

          if (needUpdate?.isNeeded) {
            setStoreUrl(storeUrl);
            setShowUpdate(true);
          }
        } catch (error) {
          console.log("iOS version check failed:", error);
        }
      }

      if (Platform.OS === "android") {
        try {
          const latestVersion = await VersionCheck.getLatestVersion({
            provider: "playStore",
          });

          const needUpdate = await VersionCheck.needUpdate({
            currentVersion,
            latestVersion,
          });

          console.log("Latest Version:", latestVersion);
          console.log("Need Update:", needUpdate);

          if (needUpdate?.isNeeded) {
            const storeUrl = await VersionCheck.getStoreUrl({
              provider: "playStore",
            });

            setStoreUrl(storeUrl);
            setShowUpdate(true);
          }
        } catch (error) {
          console.log("Android version check failed:", error);
        }
      }
    } catch (error) {
      console.log("Version check failed:", error);
    }
  };



  useEffect(() => {
    checkAppVersion();
  }, []);

  return (
    <SafeAreaProvider>
      <Navigation />
      <FlashMessage
        position="bottom"
        floating
        style={GlobalStyle.massageCotanier}
      />
      <UpdateModal
        visible={showUpdate}
        storeUrl={storeUrl}
      />
      <OfflineModal
        visible={isOffline}
        onRetry={handleRetry}
      />
    </SafeAreaProvider>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
