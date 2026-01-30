import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';
import { Provider, useDispatch } from 'react-redux';

import Navigation from './src/navigations/Navigation';
import store from './src/store';
import './src/utils/i18n';
import GlobalStyle from './src/theme/globalstyle';
import { checkAppVersion } from './src/components/VersionCheck';
import { bootstrapAuth } from './src/utils/bootstrapAuth';

const Root = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    bootstrapAuth(dispatch);
  }, []);

  React.useEffect(() => {
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
