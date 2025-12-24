import React, { useCallback, useEffect } from 'react'
import { BackHandler } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { CommonSelector, UserAttendance , GetAttandanceList, updateState } from '../../store/reducers/commonSlice'
import { useFocusEffect } from '@react-navigation/native';
import { permission } from '../../utils/permission'
import BackgroundGeolocation from "react-native-background-geolocation";
import { showMessage } from 'react-native-flash-message'
import { useTranslation } from 'react-i18next';
import Service from '../../utils/service'
import BackgroundHandler from '../../utils/BackgroundHandler'
import { HomeMenuIcons } from '../../assets/icons';

export const useHome = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [CurrentLongitude, setCurrentLongitude] = React.useState(0)
    const [CurrentLatitude, setCurrentLatitude] = React.useState(0)
    const [localAttendanceData, setLocalAttendanceData] = React.useState({})
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
            GetDevicelocation();
            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                () => true
            );
            return () => backHandler.remove();
        }, [])
    );

    const getCheckInData = async () => {
        if (!UserAttendanceData && !Object.keys(UserAttendanceData).length === 0) {
            if (UserAttendanceData === "CHECK_IN") {
                const obj = {
                    check_in_image: UserAttendanceData.check_in_image,
                    check_in_time: UserAttendanceData.check_in_time,
                    action: result.data.action
                }
                setLocalAttendanceData(obj)
            } else {
                setLocalAttendanceData({})
            }
        } else {
            const checkindata = await Service.GetAsyncAttendanceData();
            setLocalAttendanceData(checkindata);

        }
    };

    useEffect(() => {
        getCheckInData();
    }, []);

    //   React.useEffect(() => {
    //     Navigation.setOptions({
    //       headerTitle: () => <Text style={{ fontWeight: "700", fontSize: 16, color: COLOR?.Black1 }}>{t('Home.Home')}</Text>,
    //       headerRight: () =>
    //         <Div style={{ flexDirection: 'row', justifyContent: 'center' }}>
    //           <TouchableWithoutFeedback onPress={() => Navigation.navigate('Announcement')}>
    //             <Div style={{ marginRight: 10 }}>
    //               <Ionicons name="chatbox-ellipses-outline" color="#000" size={30} />
    //             </Div>
    //           </TouchableWithoutFeedback>
    //           <ProfileBTN />
    //         </Div>

    //     });
    //   }, [Navigation]);

    React.useEffect(() => {
        if (isError) {
            showMessage({
                icon: "danger",
                message: errorMessage,
                type: "danger",
                duration: 2000
            })
            dispatch(updateState({ isError: false, errorMessage: "" }))
        }
    }, [isError])

    React.useEffect(() => {
        BackgroundHandler.startTracking()
        // dispatch(GetAttandanceList({ email: UsersigninData.email }));
    }, [UsersigninData])

    React.useEffect(() => {
        if (UserAttendanceData?.action) {
            if (UserAttendanceData?.action === "CHECK_IN") {
                showMessage({
                    icon: "success",
                    message: `${t('messages.Check_in')}`,
                    type: "success",
                })
            } else {
                showMessage({
                    icon: "success",
                    message: `${t('messages.Check_out')}`,
                    type: "success",
                })
            }
            // dispatch(GetAttandanceList({ email: UsersigninData.email }));
        }
        if (UserAttendanceData.action === "CHECK_OUT") {
            BackgroundHandler.stopTracking()
        }
    }, [UserAttendanceData])


    const GetDevicelocation = async () => {
        try {
            const location = await BackgroundGeolocation.getCurrentPosition({
                persist: false,
                samples: 1,
                maximumAge: 0,
                desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
                timeout: 30,
            });

            const lat = location.coords.latitude.toString();
            const lng = location.coords.longitude.toString();

            setCurrentLatitude(lat);
            setCurrentLongitude(lng);
            // console.log("GPS LOCATION:", lat, lng);
        } catch (error) {
            Service.OpenLocaitonbutton();
            console.log("error.message>>>", error.message)
        }
    };

    const handleAttendance = async (type, imageBase64) => {
        console.log("calll")
        const formdata = new FormData();
        const attendanceData = await Service.GetAsyncAttendanceData();
        const timeNow = new Date().toISOString();

        formdata.append("Image", imageBase64);
        formdata.append("email", UsersigninData.email);
        formdata.append("Longitude", CurrentLongitude);
        formdata.append("Latitude", CurrentLatitude);

        if (type === "CHECK_IN") {
            formdata.append("check_in", timeNow);
            const obj = {
                ...attendanceData,
                check_in_image: imageBase64,
                check_in_time: timeNow,
                action: "CHECK_IN",
            };

            await Service.setAsyncAttendanceData(obj);
        }

        if (type === "CHECK_OUT") {
            formdata.append("check_out", timeNow);
            formdata.append("check_in", attendanceData?.check_in_time || "");
            await Service.removeAsyncAttendanceData();
        }
        dispatch(UserAttendance(formdata));
        getCheckInData();
    };

    const takeImage = async (value) => {
        const image = await permission.heandleOnCamera();
        if (value === "CHECK_IN") {
            handleAttendance(value, image);
        } else {
            handleAttendance(value, image);
        }
    };

    return {
    MENUDATA,
    UsersigninData,
    takeImage,
    isAttendanceFetching,
    localAttendanceData
    }
}