
import 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';
import Navigation from './src/navigations/Navigation';
import store from './src/store'
import './src/utils/i18n';
import { Provider, } from 'react-redux';

function App() {
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
