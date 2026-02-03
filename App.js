import React,{useEffect,useState} from 'react';
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


const Root = () => {
  const dispatch = useDispatch();
  const [showUpdate, setShowUpdate] = useState(false);
  const [storeUrl, setStoreUrl] = useState('');

  useEffect(() => {
    bootstrapAuth(dispatch);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        bootstrapAuth(dispatch);
      }
    });

    return () => subscription.remove();
  }, [dispatch]);

  const checkAppVersion = async () => {
    try {
      const currentVersion = DeviceInfo.getVersion();
      const latestVersion = await VersionCheck.getLatestVersion();
      const url = await VersionCheck.getStoreUrl();
      

      if (!currentVersion || !latestVersion || !url) return;

      const updateNeeded = VersionCheck.needUpdate({
        currentVersion,
        latestVersion,
      });
      if (updateNeeded?.isNeeded) {
        setStoreUrl(url);
        setShowUpdate(true);
      }
    } catch (error) {
      console.log('Version check failed:', error);
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
