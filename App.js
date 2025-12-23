
import React from 'react';
import 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';
import Navigation from './src/navigations/Navigation';
import store from './src/store'
import './src/utils/i18n';
import { Provider } from 'react-redux';
import { UserToken } from './src/store/reducers/commonSlice';

function App() {
  React.useEffect(() => {
  store.dispatch(UserToken({ user_name: 'john' }));
}, []);
  
  return (
    <Provider store={store}>
     <SafeAreaProvider>
          <Navigation />
        <FlashMessage position="bottom" />
      </SafeAreaProvider>
    </Provider>
  );
}
export default App;
