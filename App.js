import React, { useEffect, useState,useRef } from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';
import { Provider, useDispatch } from 'react-redux';
import { AppState } from 'react-native';
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
    const provider = Platform.OS === 'ios' ? 'appStore' : 'playStore';
    const currentVersion = DeviceInfo.getVersion();
    const latestVersion = await VersionCheck.getLatestVersion({ provider });
    const storeUrl = await VersionCheck.getStoreUrl({ provider });

    if (!latestVersion || !storeUrl) return;

    console.log("Current Version:", currentVersion);
    console.log("Latest Version:", latestVersion);

    const needUpdate = await VersionCheck.needUpdate({
      currentVersion,
      latestVersion,
    });

    console.log("Need Update:", needUpdate);

    if (needUpdate?.isNeeded) {
      setStoreUrl(storeUrl);
      setShowUpdate(true);
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
