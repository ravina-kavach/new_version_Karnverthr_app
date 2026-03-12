import { Platform, PermissionsAndroid, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

/*
|--------------------------------------------------------------------------
| REQUEST PERMISSION
|--------------------------------------------------------------------------
*/

export const requestUserPermission = async () => {
    try {
        let permissionGranted = true;

        // ANDROID 13+
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                permissionGranted = false;
            }
        }

        // IOS
        const authStatus = await messaging().requestPermission({
            alert: true,
            badge: true,
            sound: true,
        });

        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
            permissionGranted = false;
        }

        return permissionGranted;
    } catch (e) {
        console.log('Permission error:', e);
        return false;
    }
};

/*
|--------------------------------------------------------------------------
| GET FCM TOKEN
|--------------------------------------------------------------------------
*/

export const getFCMToken = async () => {
    try {
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        console.log('FCM TOKEN:', token);
        return token;
    } catch (e) {
        console.log('Token error:', e);
    }
};

/*
|--------------------------------------------------------------------------
| CREATE CHANNEL (ANDROID)
|--------------------------------------------------------------------------
*/

export const createNotificationChannel = async () => {
    return await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
    });
};

/*
|--------------------------------------------------------------------------
| DISPLAY NOTIFICATION
|--------------------------------------------------------------------------
*/

export const displayNotification = async (
    title = '',
    body = '',
    data = {}
) => {
    try {
        const channelId = await createNotificationChannel();

        await notifee.displayNotification({
            title,
            body,
            data,

            android: {
                channelId,
                smallIcon: 'ic_notification',
                pressAction: {
                    id: 'default',
                },
            },

            ios: {
                sound: 'default',
            },
        });
    } catch (e) {
        console.log('Display error:', e);
    }
};

/*
|--------------------------------------------------------------------------
| FOREGROUND LISTENER
|--------------------------------------------------------------------------
*/

export const notificationListener = () => {
    return messaging().onMessage(async remoteMessage => {
        console.log('Foreground message:', remoteMessage);

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
};

/*
|--------------------------------------------------------------------------
| OPEN EVENTS
|--------------------------------------------------------------------------
*/

export const notificationOpenHandler = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Opened from background:', remoteMessage);
    });

    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log('Opened from quit state:', remoteMessage);
            }
        });

    notifee.onForegroundEvent(({ type, detail }) => {
        console.log('Notifee event:', type, detail);
    });
};