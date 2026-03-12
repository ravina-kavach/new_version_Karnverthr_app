/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App'
import { name as appName } from './app.json';
import BackgroundGeolocation from 'react-native-background-geolocation';
import BackgroundGeolocationHeadlessTask from './src/utils/HeadlessTask.js'
import messaging from '@react-native-firebase/messaging';
import { displayNotification } from './src/utils/PushNotificationService.js';

if (typeof __DEV__ !== 'undefined' && __DEV__) {
  console.log = () => { };
  console.warn = () => { };
  console.error = () => { };
  console.info = () => { };
  console.debug = () => { };
}
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message:', remoteMessage);

  const title =
    remoteMessage?.notification?.title ||
    remoteMessage?.data?.title ||
    '';

  const body =
    remoteMessage?.notification?.body ||
    remoteMessage?.data?.body ||
    '';

  await displayNotification(title, body, remoteMessage?.data);
});

BackgroundGeolocation.registerHeadlessTask(BackgroundGeolocationHeadlessTask);


AppRegistry.registerComponent(appName, () => App);
