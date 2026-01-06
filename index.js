/**
 * @format
 */

import { AppRegistry } from 'react-native';
import  App from './App'
import { name as appName } from './app.json';
import BackgroundGeolocation from 'react-native-background-geolocation';
import BackgroundGeolocationHeadlessTask from './src/utils/HeadlessTask.js'

if (typeof __DEV__ !== 'undefined' &&__DEV__) {
  // console.log = () => {};
  // console.warn = () => {};
  // console.error = () => {};
  // console.info = () => {};
  console.debug = () => {};
}

BackgroundGeolocation.registerHeadlessTask(BackgroundGeolocationHeadlessTask);


AppRegistry.registerComponent(appName, () => App);
