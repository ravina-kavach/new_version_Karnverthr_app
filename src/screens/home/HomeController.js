import React, { useCallback } from 'react'
import { BackHandler } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { CommonSelector, Checkin, CheckOut, GetAttandanceList, GetCheckStatus, updateState } from '../../store/reducers/commonSlice'
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
    const [IsAtandance, setIsAtandance] = React.useState(false);
    const { UsersigninData, isCheckin, isCheckOut, isError, errorMessage, isGetCheckStatus, GetCheckStatusData, isGetCheckStatusFetching, isGetAttandanceListFetching, GetAttandanceListData, isCheckOutFetching, isCheckinFetching } = useSelector(CommonSelector);
    const MENUDATA = [
  { id: '1', image: HomeMenuIcons.Expense, title: t('Home.Expense'), screen: 'Expenses' },
  { id: '2', image: HomeMenuIcons.Attendance, title: t('Home.Attendance'), screen: 'Attendance' },
  { id: '3', image: HomeMenuIcons.Leave, title: t('Home.Leave'), screen: 'Leaves' },
  { id: '4', image: HomeMenuIcons.Calendar, title: t('Home.Calendar'), screen: 'Calender' },
  { id: '5', image: HomeMenuIcons.NotApproved, title: t('Home.Approvals'), screen: 'Approvals' },
  { id: '6', image: HomeMenuIcons.Report, title: t('Home.Reports'), screen: 'Reports' },
  { id: '7', image: HomeMenuIcons.Payslip, title: t('Home.PaySlip'), screen: 'Payslip' },
  { id: '8', image: HomeMenuIcons.Announcement, title: t('Home.Announcement'), screen: 'Announcement' },
  { id: '9', image: HomeMenuIcons.Shift, title: t('Home.Shift_Timings'), screen: 'ShiftTiming' },
];
 
    useFocusEffect(
        useCallback(() => {
            GetDevicelocation();
            GetStatus();
            dispatch(GetAttandanceList({ email: UsersigninData.email }));
            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                () => true
            );
            return () => backHandler.remove();
        }, [])
    );

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
        if (isCheckin) {
            showMessage({
                icon: "success",
                message: `${t('messages.Check_in')}`,
                type: "success",
            })
            if (UsersigninData?.is_geo_tracking) {
                BackgroundHandler.startTracking()
            }
            setIsAtandance(true);
            dispatch(updateState({ isCheckin: false }));
            dispatch(GetAttandanceList({ email: UsersigninData.email }));
        }
    }, [isCheckin])

    React.useEffect(() => {
        if (isCheckOut) {
            showMessage({
                icon: "success",
                message: `${t('messages.Check_out')}`,
                type: "success",
            })
            BackgroundHandler.stopTracking()
            setIsAtandance(false);
            dispatch(updateState({ isCheckOut: false }));
            dispatch(GetAttandanceList({ email: UsersigninData.email }));
        }
    }, [isCheckOut])
    
    React.useEffect(() => {
        if (isGetCheckStatus) {
            let ischeckedIn = GetCheckStatusData?.status == 'CheckedIn' ? true : false;
            dispatch(updateState({ isGetCheckStatus: false }));
            setIsAtandance(ischeckedIn)
        }
    }, [isGetCheckStatus])


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
    const HeandleonCheckIn = async (data) => {
        const formdata = new FormData();
        formdata.append("CheckInImage", data)
        formdata.append("email", UsersigninData.email)
        formdata.append("Longitude", CurrentLongitude)
        formdata.append("Latitude", CurrentLatitude)
        // formdata.append("Longitude", '72.579863')
        // formdata.append("Latitude", '23.022505')
        formdata.append("location", `${CurrentLongitude},${CurrentLatitude}`)
        dispatch(Checkin(formdata))
    }
    const HeandleonCheckOut = async (data) => {
        const formdata = new FormData();
        formdata.append("CheckOutImage", data)
        formdata.append("check_in", checkInData.check_in)
        formdata.append("email", UsersigninData.email)
        formdata.append("Longitude", CurrentLongitude)
        formdata.append("Latitude", CurrentLatitude)
        // formdata.append("Longitude", '72.579863')
        // formdata.append("Latitude", '23.022505')
        formdata.append("location", `${CurrentLongitude},${CurrentLatitude}`)
        dispatch(CheckOut(formdata))
    }
    const GetStatus = async () => {
        dispatch(GetCheckStatus({ 'email': UsersigninData.email }))
    }
    const takeImage = (value) => {
        const res = permission.heandleOnCamera()
        if (value === 2) {
            HeandleonCheckIn(res)
        } else {
            HeandleonCheckOut(res)
        }
    }

    const checkInData = React.useMemo(() => {
        return !GetAttandanceListData[0]?.check_out ? GetAttandanceListData[0] : null;
    }, [GetAttandanceListData])

    const checkOutData = React.useMemo(() => {
        return checkInData && checkInData.check_out ? checkInData : null;
    }, [checkInData])

    return {
        MENUDATA,
        IsAtandance,
        UsersigninData,
        isCheckin,
        isCheckOut,
        isError,
        errorMessage,
        isGetCheckStatus,
        GetCheckStatusData,
        isGetCheckStatusFetching,
        isGetAttandanceListFetching,
        GetAttandanceListData,
        isCheckOutFetching,
        isCheckinFetching,
        takeImage,
        checkInData,
        checkOutData,
    }
}