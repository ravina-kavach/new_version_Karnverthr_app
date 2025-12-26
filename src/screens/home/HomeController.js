import React, { useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CommonSelector, UserAttendance, updateState } from '../../store/reducers/commonSlice';
import { useFocusEffect } from '@react-navigation/native';
import { permission } from '../../utils/permission';
import { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';
import Service from '../../utils/service';
import { HomeMenuIcons } from '../../assets/icons';
import BackgroundGeolocation from 'react-native-background-geolocation';
import BackgroundHandler from '../../utils/BackgroundHandler';
import { useIsFocused } from '@react-navigation/native';
export const useHome = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const IsFocused = useIsFocused();
    const [localAttendanceData, setLocalAttendanceData] = React.useState({});
    const [latestLocation, setLatestLocation] = React.useState({ latitude: 0, longitude: 0 });
    const { UsersigninData, isError, errorMessage, UserAttendanceData, isAttendanceFetching } = useSelector(CommonSelector);

    const MENUDATA = [
        { id: '1', image: HomeMenuIcons.Attendance, title: t('Home.Attendance'), screen: 'attendance' },
        { id: '2', image: HomeMenuIcons.Expense, title: t('Home.Expense'), screen: 'expenses' },
        { id: '3', image: HomeMenuIcons.Leave, title: t('Home.Leave'), screen: 'leaves' },
        { id: '4', image: HomeMenuIcons.Calendar, title: t('Home.Calendar'), screen: 'calender' },
        { id: '5', image: HomeMenuIcons.NotApproved, title: t('Home.Approvals'), screen: 'approvals' },
        { id: '6', image: HomeMenuIcons.Report, title: t('Home.Reports'), screen: 'reports' },
        { id: '7', image: HomeMenuIcons.Payslip, title: t('Home.PaySlip'), screen: 'payslip' },
        { id: '8', image: HomeMenuIcons.Announcement, title: t('Home.Announcement'), screen: 'announcement' },
        { id: '9', image: HomeMenuIcons.Shift, title: t('Home.Shift_Timings'), screen: 'shiftTiming' },
    ];

    useFocusEffect(
        useCallback(() => {
            const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
            return () => backHandler.remove();
        }, [])
    );

    useEffect(() => {
        if (IsFocused) {
            const initLocation = async () => {
                try {
                    const state = await BackgroundGeolocation.ready({
                        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
                        distanceFilter: 10,
                        stopOnTerminate: false,
                        startOnBoot: true,
                    });

                    const location = await BackgroundGeolocation.getCurrentPosition({
                        persist: false,
                        samples: 1,
                        maximumAge: 0,
                        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
                        timeout: 30,
                    });

                    setLatestLocation({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    });

                    // Subscribe to updates
                    const subscription = BackgroundGeolocation.onLocation(
                        loc => {
                            setLatestLocation({
                                latitude: loc.coords.latitude,
                                longitude: loc.coords.longitude,
                            });
                        },
                        error => console.log('Location error:', error)
                    );

                    return () => subscription.remove();
                } catch (err) {
                    console.log('Error initializing location:', err.message);
                }
            };

            initLocation();
        }
    }, [IsFocused]);


    const getCheckInData = async () => {
        const checkindata = await Service.GetAsyncAttendanceData();
        setLocalAttendanceData(checkindata || {});
    };

    useEffect(() => {
        getCheckInData();
    }, []);

    useEffect(() => {
        if (isError) {
            showMessage({
                icon: "danger",
                message: errorMessage,
                type: "danger",
                duration: 2000
            });
            dispatch(updateState({ isError: false, errorMessage: "" }));
        }
    }, [isError]);

    useEffect(() => {
        if (UserAttendanceData?.action) {
            if (UserAttendanceData.action === "CHECK_IN") {
                showMessage({ icon: "success", message: t('messages.Check_in'), type: "success" });
            } else {
                showMessage({ icon: "success", message: t('messages.Check_out'), type: "success" });
            }
        }
    }, [UserAttendanceData]);

    const handleAttendance = async (type, imageBase64) => {
        const attendanceData = await Service.GetAsyncAttendanceData();
        const timeNow = new Date().toISOString();
        let payload = {
            Image: imageBase64,
            email: UsersigninData.email,
            Longitude: String(latestLocation.longitude),
            Latitude: String(latestLocation.latitude),
        };

        if (type === "CHECK_IN") {
            payload = { ...payload, check_in: timeNow, action: "CHECK_IN" };
            setLocalAttendanceData({
                check_in_image: imageBase64,
                check_in_time: timeNow,
                action: "CHECK_IN",
            })
        } else {
            payload = {
                ...payload,
                check_out: timeNow,
                check_in: attendanceData?.check_in_time || "",
                action: "CHECK_OUT",
            };
        }

        try {
            const res = await dispatch(UserAttendance(payload)).unwrap();

            if (type === "CHECK_IN") {
                await Service.setAsyncAttendanceData({
                    ...attendanceData,
                    check_in_image: imageBase64,
                    check_in_time: timeNow,
                    action: "CHECK_IN",
                });
                BackgroundHandler.startTracking();

            } else {
                await Service.removeAsyncAttendanceData();
                BackgroundHandler.stopTracking();
            }

        } catch (err) {
            if (type === "CHECK_IN") {
                setLocalAttendanceData({})
            } else {
                await Service.setAsyncAttendanceData({
                    ...attendanceData,
                });
            }
        }
        getCheckInData();
    };

    const takeImage = async (value) => {
        const result = await permission.heandleOnCamera();
        if (result.success && result.image) {
            handleAttendance(value, result.image.base64);
        }
    };


    return {
        MENUDATA,
        UsersigninData,
        takeImage,
        isAttendanceFetching,
        localAttendanceData,
        latestLocation,
    };
};
