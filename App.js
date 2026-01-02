import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';
import { Provider, useDispatch } from 'react-redux';

import Navigation from './src/navigations/Navigation';
import store from './src/store';
import './src/utils/i18n';
import { UserToken } from './src/store/reducers/commonSlice';
import GlobalStyle from './src/theme/globalstyle';

const Root = () =>{ 
  const dispatch = useDispatch();

  React.useEffect(() => {
    const init = async () => {
      try {
        await dispatch(UserToken({ user_name: 'john' })).unwrap();
        console.log('Token request success');
      } catch (err) {
        console.log('Token request failed:', err);
      }
    };

    init();
  }, [dispatch]);

  return (
    <SafeAreaProvider>
      <Navigation />
      <FlashMessage
        position="bottom"
        style={GlobalStyle.massageCotanier}
      />
    </SafeAreaProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}

export default App;
