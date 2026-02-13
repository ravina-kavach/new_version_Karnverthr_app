import React, { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  CommonSelector,
  UserAttendance,
  CheckAttandanceStatus,
  updateState,
} from "../../store/reducers/commonSlice";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { permission } from "../../utils/permission";
import { showMessage } from "react-native-flash-message";
import { useTranslation } from "react-i18next";
import BackgroundGeolocation from "react-native-background-geolocation";
import BackgroundHandler from "../../utils/BackgroundHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Service from "../../utils/service";

import {
  ApprovelsIcon,
  AttendanceIcon,
  CalendarIcon,
  DeclarationIcon,
  ExpenseIcon,
  GovIcon,
  LeaveMenuIcon,
  PaySlipIcon,
  ReportIcon,
  ShiftIcon,
} from "../../assets/svgs";

export const useHome = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const Navigation = useNavigation();

  const {
    UsersigninData,
    isError,
    errorMessage,
    UserAttendanceData,
    UserDetailsData,
    isAttendanceFetching,
  } = useSelector(CommonSelector);

  const [attendance, setAttendance] = useState(null);
  const [location, setLocation] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false)
    const [logoutVisible, setLogoutVisible] = useState(false);
  const MENUDATA = [
    { id: "1", image: <AttendanceIcon />, title: t("Home.Attendance"), screen: "attendance" },
    { id: "2", image: <ExpenseIcon />, title: t("Home.Expense"), screen: "expenses" },
    { id: "3", image: <LeaveMenuIcon />, title: t("Home.Leave"), screen: "leaves" },
    { id: "4", image: <CalendarIcon />, title: t("Home.Calendar"), screen: "calender" },
    { id: "5", image: <ApprovelsIcon />, title: t("Home.Approvals"), screen: "approvals" },
    { id: "6", image: <ReportIcon />, title: t("Home.Reports"), screen: "reports" },
    { id: "7", image: <PaySlipIcon />, title: t("Home.PaySlip"), screen: "paySlip" },
    { id: "8", image: <DeclarationIcon />, title: t("Home.Announcement"), screen: "announcement" },
    { id: "9", image: <ShiftIcon />, title: t("Home.Shift_Timings"), screen: "shiftTiming" },
  ];
  // "master","adminAttendance", "adminEmployee", "adminLeave", "adminPayroll"

  const ADMIN_MENUDATA = [
    { id: "1", image: <ApprovelsIcon />, title: t("Home.Master"), screen: "adminMaster" },
    { id: "2", image: <AttendanceIcon />, title: t("Home.Attendance_manage"), screen: "adminAttendance" },
    { id: "3", image: <ShiftIcon />, title: t("Home.Employee_manage"), screen: "adminEmployee" },
    { id: "4", image: <LeaveMenuIcon />, title: t("Home.Leave_manage"), screen: "adminLeave" },
    { id: "5", image: <PaySlipIcon />, title: t("Home.Payroll"), screen: "adminPayroll" },
  ];
  useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      setLogoutVisible(true);
      return true;        
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => backHandler.remove();
  }, [])

  
);

  useEffect(() => {
    if (!isFocused) return;
    // console.log("UserDetailsData====>",JSON.stringify(UserDetailsData,null,2))
    // console.log("UsersigninData====>",JSON.stringify(UsersigninData,null,2))
    if(UsersigninData.user_role === "REGISTER_ADMIN"){
      setIsAdmin(true)
    }
    const initLocation = async () => {
      try {
        await BackgroundGeolocation.ready({
          desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
          distanceFilter: 10,
          stopOnTerminate: false,
          startOnBoot: true,
        });

        const pos = await BackgroundGeolocation.getCurrentPosition({
          samples: 1,
          persist: false,
          timeout: 30,
        });

        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });

        const subscription = BackgroundGeolocation.onLocation(loc =>
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          })
        );

        return () => subscription.remove();
      } catch (err) {
        showMessage({
          icon: "danger",
          message: "Unable to fetch location. Please enable GPS.",
          type: "danger",
        });
      }
    };

    initLocation();
  }, [isFocused]);

  const handleOnLogout = async () => {
  try {
   await dispatch(
      updateState({
        VerfiedUserData: {},
        UsersigninData: {},
        UserDetailsData: {},
        isVerified: false,
        isSignin: false,
      })
    );

    const keysToPreserve = ['isFirstTime', 'USER_TOKEN'];
    const preservedValues = {};

    await Promise.all(
      keysToPreserve.map(async key => {
        preservedValues[key] = await AsyncStorage.getItem(key);
      })
    );

    await Service.ClearStorage();
    await Promise.all(
      keysToPreserve.map(async key => {
        const value = preservedValues[key];
        if (value !== null) {
          await AsyncStorage.setItem(key, value);
        }
      })
    );
    Navigation.reset({
      index: 0,
      routes: [{ name: 'signInScreen' }],
    });

  } catch (error) {
    console.error('Logout failed:', error);
  }
  };

  const syncAttendance = async () => {
    try {
      const res = await dispatch(
        CheckAttandanceStatus({ email: UsersigninData.email })
      ).unwrap();

      if (res?.status === "CheckedIn") {
        setAttendance({
          check_in_time: res.action_time,
          check_in_image: res.action_image,
          action: "CHECK_IN",
        });
        BackgroundHandler.startTracking();
        return;
      }

      if (res?.status === "CheckedOut") {
        setAttendance(null);
        BackgroundHandler.stopTracking();
        return;
      }

    } catch (err) {
      console.log("Attendance sync failed", err);
    }
  };

  useEffect(() => {
    if (isFocused && UsersigninData?.email) {
      syncAttendance();
    }
  }, [isFocused, UsersigninData?.email]);

  const handleAttendance = async (type, imageBase64) => {
    if (!location || !UsersigninData?.email) return;

    const payload = {
      email: UsersigninData.email,
      Image: imageBase64,
      Latitude: String(location.latitude),
      Longitude: String(location.longitude),
      action: type,
    };

    try {
      await dispatch(UserAttendance(payload)).unwrap();
      await syncAttendance();

      showMessage({
        icon: "success",
        message:
          type === "CHECK_IN"
            ? t("messages.Check_in")
            : t("messages.Check_out"),
        type: "success",
        duration: 2000,
      });
    } catch (err) {
      showMessage({
        icon: "danger",
        message: err?.error,
        type: "danger",
        duration: 2000,
      });
    }
  };

  const takeImage = async type => {
    const result = await permission.handleOnCamera();
    if (result.success && result.image) {
      handleAttendance(type, result.image.base64);
    }
  };

  useEffect(() => {
    if (isError) {
      showMessage({
        icon: "danger",
        message: errorMessage,
        type: "danger",
        duration: 2000,
      });
      dispatch(updateState({ isError: false, errorMessage: "" }));
    }
  }, [isError]);

  const navigateChatBot = () => {
    Navigation.navigate("chatbot");
  };

  return {
    MENUDATA,
    UsersigninData,
    attendance,
    isAttendanceFetching,
    takeImage,
    location,
    navigateChatBot,
    logoutVisible,  
    setLogoutVisible,
    handleOnLogout,
    isAdmin,
    ADMIN_MENUDATA
  };
};
