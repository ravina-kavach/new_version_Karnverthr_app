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

import {
  ApprovelsIcon,
  AttendanceIcon,
  CalendarIcon,
  DeclarationIcon,
  ExpenseIcon,
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
    isAttendanceFetching,
  } = useSelector(CommonSelector);

  const [attendance, setAttendance] = useState(null);
  const [location, setLocation] = useState(null);

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

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true
      );
      return () => backHandler.remove();
    }, [])
  );

  useEffect(() => {
    if (!isFocused) return;

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
  };
};
