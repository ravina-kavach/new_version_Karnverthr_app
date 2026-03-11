import { Platform, PermissionsAndroid, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';



export const requestUserPermission = async () => {
    try {

        let permissionGranted = true;

        /*
        ---------------------------
        ANDROID 13+ PERMISSION
        ---------------------------
        */

        if (Platform.OS === 'android' && Platform.Version >= 33) {

            const hasPermission = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );

            if (!hasPermission) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    permissionGranted = false;
                }
            }
        }

        /*
        ---------------------------
        IOS PERMISSION
        ---------------------------
        */

        const authStatus = await messaging().requestPermission({
            alert: true,
            badge: true,
            sound: true
        });

        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {

            permissionGranted = false;

            Alert.alert(
                "Notification Disabled",
                "Push notifications are disabled. Enable them in settings to receive updates."
            );
        }

        return permissionGranted;

    } catch (error) {

        console.log("Permission Error:", error);
        return false;

    }
};

/*
|--------------------------------------------------------------------------
| GET FCM TOKEN (ONLY IF PERMISSION GRANTED)
|--------------------------------------------------------------------------
*/

export const getFCMToken = async () => {
    try {
        const token = await messaging().getToken();
        console.log("FCM Token:", token);
        return token;
    } catch (error) {

        console.log("FCM Token Error:", error);

    }
};

/*
|--------------------------------------------------------------------------
| DISPLAY NOTIFICATION USING NOTIFEE
|--------------------------------------------------------------------------
*/

export const displayNotification = async (title, body, data = {}) => {
    try {
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
        });

        await notifee.displayNotification({
            title: title || '',
            body: body || '',
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
            }

        });

    } catch (error) {
        console.log("Display Notification Error:", error);

    }
};

/*
|--------------------------------------------------------------------------
| FOREGROUND NOTIFICATION LISTENER
|--------------------------------------------------------------------------
*/

export const notificationListener = () => {

    return messaging().onMessage(async remoteMessage => {
        console.log("Foreground Notification:", remoteMessage);
        const title =
            remoteMessage?.notification?.title ||
            remoteMessage?.data?.title ||
            '';

        const body =
            remoteMessage?.notification?.body ||
            remoteMessage?.data?.body ||
            '';
        displayNotification(title, body, remoteMessage?.data || {});
    });
};

/*
|--------------------------------------------------------------------------
| BACKGROUND NOTIFICATION HANDLER
|--------------------------------------------------------------------------
*/

export const backgroundNotificationHandler = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log("Background Notification:", remoteMessage);
        const title =
            remoteMessage?.notification?.title ||
            remoteMessage?.data?.title ||
            '';

        const body =
            remoteMessage?.notification?.body ||
            remoteMessage?.data?.body ||
            '';
        displayNotification(title, body, remoteMessage?.data || {});

    });
};

/*
|--------------------------------------------------------------------------
| NOTIFICATION OPEN EVENTS
|--------------------------------------------------------------------------
*/

export const onNotificationOpened = () => {

    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log("Opened from background:", remoteMessage);
    });
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log("Opened from quit state:", remoteMessage);
            }
        });
    notifee.onForegroundEvent(({ type, detail }) => {
        console.log("Notifee Event:", type, detail);
    });
};