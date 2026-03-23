import { Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {
    AndroidImportance,
    EventType,
} from '@notifee/react-native';

import { navigate } from '../navigations/NavigationService';
import {
    NotificationEmitter,
    NOTIFICATION_RECEIVED,
} from '../utils/NotificationEmitter';


export const requestUserPermission = async () => {
    try {
        let permissionGranted = true;

        // ✅ Android 13+
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                permissionGranted = false;
            }
        }

        // ✅ iOS permission
        const authStatus = await messaging().requestPermission({
            alert: true,
            badge: true,
            sound: true,
        });

        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) permissionGranted = false;

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


export const createNotificationChannel = async () => {
    return await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
    });
};

export const displayNotification = async (
    title = '',
    body = '',
    data = {},
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
                importance: AndroidImportance.HIGH,
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
| FOREGROUND MESSAGE LISTENER
|--------------------------------------------------------------------------
*/
const getNotificationContent = (remoteMessage) => {
    const notification = remoteMessage?.notification || {};
    const data = remoteMessage?.data || {};

    return {
        title:
            notification.title ||
            data.title ||
            data.notification_title ||
            'Notification',

        body:
            notification.body ||
            data.body ||
            data.message ||
            data.notification_body ||
            '',
    };
};

export const notificationListener = () => {
    return messaging().onMessage(async remoteMessage => {
        console.log('Foreground message:', remoteMessage);

        const { title, body } =
            getNotificationContent(remoteMessage);

        if (remoteMessage?.notification) {
            await displayNotification(title, body, remoteMessage?.data);
        }

        NotificationEmitter.emit(NOTIFICATION_RECEIVED);
    });
};

/*
|--------------------------------------------------------------------------
| HANDLE NAVIGATION
|--------------------------------------------------------------------------
*/

export const handleNotificationNavigation = (data = {}) => {
    console.log('Navigate from notification:', data);
    setTimeout(() => {
        navigate('notifications');
    }, 600);
};

/*
|--------------------------------------------------------------------------
| OPEN EVENTS (CLICK HANDLING)
|--------------------------------------------------------------------------
*/

export const notificationOpenHandler = () => {
    /*
    |----------------------------------
    | BACKGROUND STATE
    |----------------------------------
    */
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Opened from background:', remoteMessage);

        handleNotificationNavigation(remoteMessage?.data);
        NotificationEmitter.emit(NOTIFICATION_RECEIVED);
    });

    /*
    |----------------------------------
    | QUIT STATE (APP CLOSED)
    |----------------------------------
    */
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log('Opened from quit state');

                setTimeout(() => {
                    handleNotificationNavigation(remoteMessage?.data);
                    NotificationEmitter.emit(NOTIFICATION_RECEIVED);
                }, 800);
            }
        });

    /*
    |----------------------------------
    | NOTIFEE FOREGROUND PRESS
    |----------------------------------
    */
    notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS) {
            handleNotificationNavigation(detail.notification?.data);
            NotificationEmitter.emit(NOTIFICATION_RECEIVED);
        }
    });
};