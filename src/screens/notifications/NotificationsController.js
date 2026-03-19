import { useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetNotifications, CommonSelector } from "../../store/reducers/commonSlice";
import {
    NotificationEmitter,
    NOTIFICATION_RECEIVED
} from '../../utils/NotificationEmitter'

const SEEN_NOTIFICATION_KEY = "SEEN_NOTIFICATIONS";

const useNotifications = () => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const {
        UsersigninData,
        GetAllNotificationData,
        isGetAllNotificationfeatching
    } = useSelector(CommonSelector);

    const [unseenNotifications, setUnseenNotifications] = useState([]);

    useEffect(() => {
        const refreshNotifications = () => {
            getAllNotification();
        };

        NotificationEmitter.on(
            NOTIFICATION_RECEIVED,
            refreshNotifications
        );

        return () => {
            NotificationEmitter.off(
                NOTIFICATION_RECEIVED,
                refreshNotifications
            );
        };
    }, []);

    useEffect(() => {
        if (isFocused) {
            getAllNotification();
        }
    },
        [isFocused])

    const getAllNotification = async () => {
        const token = await AsyncStorage.getItem("USER_ODOO_TOKEN");

        try {
            const payload = {
                token,
                id: UsersigninData?.user_id,
            };

            await dispatch(GetNotifications(payload)).unwrap();

        } catch (error) {
            console.log("Notification error ===>", error);
        }
    };

    // ================= UNIQUE FILTER =================
    const getUniqueNotifications = (data) => {
        const seen = new Set();

        return data.filter((item) => {
            const key = `${item.reference_id}-${item.created_on}`;

            if (seen.has(key)) return false;

            seen.add(key);
            return true;
        });
    };

    const uniqueNotifications = useMemo(() => {
        return getUniqueNotifications(
            GetAllNotificationData?.data || []
        );
    }, [GetAllNotificationData?.data]);

    // ================= STORAGE HELPERS =================
    const getSeenNotifications = async () => {
        const data = await AsyncStorage.getItem(SEEN_NOTIFICATION_KEY);
        return data ? JSON.parse(data) : [];
    };

    const saveSeenNotifications = async (ids) => {
        await AsyncStorage.setItem(
            SEEN_NOTIFICATION_KEY,
            JSON.stringify(ids)
        );
    };

    // ================= UNSEEN CALCULATION =================
    const calculateUnseen = async () => {
        const seenIds = await getSeenNotifications();

        const unseen = uniqueNotifications.filter(
            (item) => !seenIds.includes(item.id)
        );

        setUnseenNotifications(prev => {
            if (JSON.stringify(prev) === JSON.stringify(unseen)) {
                return prev; // 🚀 prevent rerender
            }
            return unseen;
        });
    };

    useEffect(() => {
        calculateUnseen();
    }, [uniqueNotifications]);

    // ================= MARK ALL AS SEEN =================
    const markAllAsSeen = async () => {
        const ids = uniqueNotifications.map((n) => n.id);
        await saveSeenNotifications(ids);
        setUnseenNotifications([]);
    };

    const badgeCount = unseenNotifications.length;

    return {
        uniqueNotifications,
        unseenNotifications,
        badgeCount,
        markAllAsSeen,
        GetAllNotificationData,
        isGetAllNotificationfeatching,
    };
};

export default useNotifications;