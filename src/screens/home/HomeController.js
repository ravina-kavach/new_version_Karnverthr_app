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
} from "@react-navigation/native";
import { permission } from "../../utils/permission";
import { showMessage } from "react-native-flash-message";
import { useTranslation } from "react-i18next";
import Service from "../../utils/service";
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
    { id: "7", image: <PaySlipIcon />, title: t("Home.PaySlip"), screen: "payslip" },
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
        console.log("Location error:", err?.message);
      }
    };

    initLocation();
  }, [isFocused]);

  const syncAttendance = async () => {
  try {
    // 1️⃣ Load cached attendance FIRST
    const cached = await Service.GetAsyncAttendanceData();
    if (cached) {
      setAttendance(cached);
    }

    // 2️⃣ Fetch latest status from API
    const res = await dispatch(
      CheckAttandanceStatus({ email: UsersigninData.email })
    ).unwrap();

    // 3️⃣ API confirms CHECK-IN
    if (res?.status === "CHECK_IN") {
      const data = {
        check_in_time: res.action_time,
        check_in_image: res.action_image,
        action: "CHECK_IN",
      };

      setAttendance(data);
      await Service.setAsyncAttendanceData(data);
      BackgroundHandler.startTracking();
      return;
    }

    // 4️⃣ API confirms CHECK-OUT
    if (res?.status === "CHECK_OUT") {
      setAttendance(null);
      await Service.removeAsyncAttendanceData();
      BackgroundHandler.stopTracking();
      return;
    }

    // 5️⃣ Fallback: KEEP cached data (DO NOTHING)
    console.log("Attendance status unchanged");

  } catch (err) {
    console.log("Attendance sync failed", err);
    // ❗ Do NOT clear attendance on error
  }
};


  useEffect(() => {
    if (isFocused && UsersigninData?.email) {
      syncAttendance();
    }
  }, [isFocused, UsersigninData?.email]);

  const handleAttendance = async (type, imageBase64) => {
    if (!location || !UsersigninData?.email) return;

    const timeNow = new Date().toISOString();

    const payload = {
      email: UsersigninData.email,
      Image: imageBase64,
      Latitude: String(location.latitude),
      Longitude: String(location.longitude),
      action: type,
      ...(type === "CHECK_IN"
        ? { check_in: timeNow }
        : { check_out: timeNow }),
    };

    try {
      await dispatch(UserAttendance(payload)).unwrap();

      if (type === "CHECK_IN") {
        const data = {
          check_in_time: timeNow,
          check_in_image: imageBase64,
          action: "CHECK_IN",
        };

        setAttendance(data);
        await Service.setAsyncAttendanceData(data);
        BackgroundHandler.startTracking();
      } else {
        setAttendance(null);
        await Service.removeAsyncAttendanceData();
        BackgroundHandler.stopTracking();
      }

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
        message: "Attendance failed. Please try again.",
        type: "danger",
        duration: 2000,
      });
    }
  };


  const takeImage = async type => {
    const result = await permission.heandleOnCamera();
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


  useEffect(() => {
    if (UserAttendanceData?.action) {
      showMessage({
        icon: "success",
        message:
          UserAttendanceData.action === "CHECK_IN"
            ? t("messages.Check_in")
            : t("messages.Check_out"),
        type: "success",
        duration: 2000,
      });
    }
  }, [UserAttendanceData]);


  return {
    MENUDATA,
    UsersigninData,
    attendance,
    isAttendanceFetching,
    takeImage,
    location,
  };
};
