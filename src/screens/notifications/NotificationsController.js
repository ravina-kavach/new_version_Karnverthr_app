import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetNotifications } from "../../store/reducers/commonSlice";
import { CommonSelector } from "../../store/reducers/commonSlice";

const useNotifications = () => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const { UsersigninData, GetAllNotificationData, isGetAllNotificationfeatching } = useSelector(CommonSelector);

    useEffect(() => {
        if (isFocused) {
            getAllNotification();
        }
    }, [isFocused])

    const getAllNotification = async () => {
        const token = await AsyncStorage.getItem('USER_ODOO_TOKEN');
        try {
            const payload = {
                token: token,
                id: UsersigninData?.user_id,
            };

            const result = await dispatch(GetNotifications(payload)).unwrap();

            if (result?.status === "success") {
                showMessage({
                    icon: 'success',
                    message: result?.message,
                    type: 'success',
                });
            } else {
                showMessage({
                    icon: 'danger',
                    message: result?.message,
                    type: 'danger',
                });
            }

        } catch (error) {
            showMessage({
                icon: 'danger',
                message: error?.message || error?.error,
                type: 'danger',
            });
        };
    }

    const getUniqueNotifications = (data) => {
        const seen = new Set();

        return data.filter(item => {
            const key = `${item.reference_id}-${item.created_on}`;

            if (seen.has(key)) return false;

            seen.add(key);
            return true;
        });
    };

    const uniqueNotifications = getUniqueNotifications(GetAllNotificationData?.data || []);

    const badgeCount = uniqueNotifications.length;

    return {
        GetAllNotificationData,
        isGetAllNotificationfeatching,
        badgeCount
    }
}

export default useNotifications;