
import 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { COLOR } from './src/theme/theme';
import FlashMessage from 'react-native-flash-message';
import Navigation from './src/navigations/Navigation';
import './src/utils/i18n';


function App() {
  return (
     <SafeAreaProvider>
          <Navigation />
        <FlashMessage position="bottom" />
      </SafeAreaProvider>
  );
}
export default App;
