import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

//=======================
const OpenLocaitonbutton =()=>{
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: "<h2>Enable Location Services</h2>App needs location services enabled.",
        ok: "Enable",
        cancel: "Cancel",
        enableHighAccuracy: true, // GPS
        showDialog: true,
        openLocationServices: true,
        preventOutSideTouch: false,
        preventBackClick: false,
        providerListener: true
      }).then(function(success) {
        console.log("Location enabled:", success);
      }).catch((error) => {
        console.log("Location enable error:", error.message);
      });
}

const ClearStorage = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.log('try catch[ service> ClearStorage] error:', error.message);
    }
}
const setisFirstime = async (data) => {
    try {
        await AsyncStorage.setItem('isFirstime', data);
    } catch (error) {
        console.log('try catch[ service> setisFirstime] error:', error.message);
    }
}
const removeisFirstime = async () => {
    try {
        console.log("removeisFirstime()>>")
        await AsyncStorage.removeItem('isFirstime');
    } catch (error) {
        console.log('try catch[ service> removeisFirstime] error:', error.message);
    }
}
const GetisFirstime = async () => {
    try {
        // removeisFirstime();
        let isFirstime = await AsyncStorage.getItem('isFirstime');
        return (isFirstime ? isFirstime : false);
    } catch (error) {
        console.log('try catch[ service> GetisFirstime] error:', error.message);
    }
}
const setisBiomatic = async (data) => {
    try {
        await AsyncStorage.setItem('isBiomatic', data);
    } catch (error) {
        console.log('try catch[ service> setisBiomatic] error:', error.message);
    }
}
const removeisBiomatic = async () => {
    try {
        console.log("removeisBiomatic()>>")
        await AsyncStorage.removeItem('isBiomatic');
    } catch (error) {
        console.log('try catch[ service> removeisBiomatic] error:', error.message);
    }
}
const GetisBiomatic = async () => {
    try {
        // removeisBiomatic();
        let isBiomatic = await AsyncStorage.getItem('isBiomatic');
        return (isBiomatic ? isBiomatic : false);
    } catch (error) {
        console.log('try catch[ service> GetisBiomatic] error:', error.message);
    }
}
const setRemember = async (data) => {
    try {
        await AsyncStorage.setItem('Rememberlogindetail', JSON.stringify(data));
    } catch (error) {
        console.log('try catch[ service> setRemember] error:', error.message);
    }
}
const removeRemember = async () => {
    try {
        console.log("removeRemember()>>")
        await AsyncStorage.removeItem('Rememberlogindetail');
    } catch (error) {
        console.log('try catch[ service> removeRemember] error:', error.message);
    }
}
const GetRemember = async () => {
    try {
        // removeRemember();
        let Remember = await AsyncStorage.getItem('Rememberlogindetail');
        return (Remember ? JSON.parse(Remember) : null);
    } catch (error) {
        console.log('try catch[ service> GetRemember] error:', error.message);
    }
}

const FormatIndianNumber = (number) => {
    const numberStr = number?.toString();
    if (numberStr?.length !== 10) {
        console.log("The number should have exactly 10 digits.")
        return numberStr; 
    }
    const formattedNumber = `+91 ${numberStr?.slice(0, 5)} ${numberStr?.slice(5)}`;
    return formattedNumber;
}
const getDayDifference = (startDate, endDate) => {
    const start = moment(startDate).startOf('day');
    const end = moment(endDate).startOf('day');
    const duration = end.diff(start, 'days') + 1;
    return duration;
}

const setisVerified = async (data) => {
    try {
        await AsyncStorage.setItem('isVerified', data);
    } catch (error) {
        console.log('try catch[ service> isVerified] error:', error.message);
    }
}
const removeisVerified = async () => {
    try {
        await AsyncStorage.removeItem('isVerified');
    } catch (error) {
        console.log('try catch[ service> removeisVerified] error:', error.message);
    }
}
const GetisVerified = async () => {
    try {
        let isVerified = await AsyncStorage.getItem('isVerified');
        return (isVerified ? isVerified : false);
    } catch (error) {
        console.log('try catch[ service> GetisVerified] error:', error.message);
    }
}

const setAsyncAttendanceData = async (data) => {
    try {
        await AsyncStorage.setItem('Attendance', JSON.stringify(data));
    } catch (error) {
        console.log('try catch[ service> Attendance] error:', error.message);
    }
}
const removeAsyncAttendanceData = async () => {
    try {
        await AsyncStorage.removeItem('Attendance');
    } catch (error) {
        console.log('try catch[ service> removeAttendance] error:', error.message);
    }
}
const GetAsyncAttendanceData = async () => {
    try {
        let Attendance = await AsyncStorage.getItem('Attendance');
        return (Attendance ? JSON.parse(Attendance) : null);
    } catch (error) {
        console.log('try catch[ service> Get Attendance] error:', error.message);
    }
}

const Service = {
    setRemember, GetRemember, removeRemember, GetisFirstime, removeisFirstime, setisFirstime, ClearStorage,
    FormatIndianNumber, getDayDifference, GetisBiomatic, removeisBiomatic, setisBiomatic,OpenLocaitonbutton,
    setisVerified,removeisVerified,GetisVerified,setAsyncAttendanceData,removeAsyncAttendanceData,GetAsyncAttendanceData
};

export default Service;
