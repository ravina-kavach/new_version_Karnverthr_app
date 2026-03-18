import React, { useCallback, useState } from "react";
import { useTranslation } from 'react-i18next';
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux';
import {
  CommonSelector,
  GetAttandanceList,
  UserAttendanceRegcategories,
  UserAttendanceRegularization
} from '../../store/reducers/commonSlice';
import { showMessage } from 'react-native-flash-message';
import { useIsFocused } from '@react-navigation/native';

export const useAttendance = () => {
  const { t } = useTranslation();
  const IsFocused = useIsFocused();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const currentYear = moment().year();
  const currentMonth = moment().month() + 1;

  const months = React.useMemo(() => ([
    { id: '1', name: t("Attendance.January") },
    { id: '2', name: t("Attendance.February") },
    { id: '3', name: t("Attendance.March") },
    { id: '4', name: t("Attendance.April") },
    { id: '5', name: t("Attendance.May") },
    { id: '6', name: t("Attendance.June") },
    { id: '7', name: t("Attendance.July") },
    { id: '8', name: t("Attendance.August") },
    { id: '9', name: t("Attendance.September") },
    { id: '10', name: t("Attendance.October") },
    { id: '11', name: t("Attendance.November") },
    { id: '12', name: t("Attendance.December") },
  ]), [t]);

  const YEARDATA = React.useMemo(() => {
    const years = [];
    for (let i = 0; i < 2; i++) {
      years.push({ id: String(i + 1), name: String(currentYear - i) });
    }
    return years;
  }, [currentYear]);

  const [SelectedYear, setSelectedYear] = useState(
    YEARDATA.find(y => y.name === String(currentYear))
  );

  const [Selectedmonth, setSelectedmonth] = useState(
    months.find(m => Number(m.id) === currentMonth)
  );

  const { 
    GetAttandanceListData,
    isGetAttandanceListFetching,
    UserAttendanceRegcategoriesData,
    UsersigninData,
    isFeatchAttendanceReguration
  } = useSelector(CommonSelector);

  const [selectRegcategory, setSelectedRegcategory] = useState({});

  // ✅ API CALL
  React.useEffect(() => {
    if (!IsFocused || !UsersigninData) return;

    if (!Selectedmonth?.id || !SelectedYear?.name) return;

    const payload = {
      id: Number(UsersigninData.user_id),
      month: Number(Selectedmonth.id),
      year: Number(SelectedYear.name),
    };

    dispatch(GetAttandanceList(payload));
    dispatch(UserAttendanceRegcategories({ id: Number(UsersigninData.user_id) }));

  }, [IsFocused, Selectedmonth?.id, SelectedYear?.name]);

  // ✅ SUCCESS MESSAGE
  React.useEffect(() => {
    if (GetAttandanceListData?.message) {
      showMessage({
        icon: "success",
        message: GetAttandanceListData.message,
        type: "success",
      });
    }
  }, [GetAttandanceListData?.message]);

  // ✅ REFRESH
  const onRefresh = useCallback(() => {
    const currentMonthIndex = moment().month();
    const currentYearValue = moment().year();

    setSelectedmonth(months[currentMonthIndex]);
    setSelectedYear(
      YEARDATA.find(y => Number(y.name) === currentYearValue)
    );
  }, [months, YEARDATA]);

  // ✅ MONTH NAVIGATION
  const changeMonth = (direction) => {
    let monthIndex = Number(Selectedmonth?.id) - 1;
    let yearIndex = YEARDATA.findIndex(y => y.name === SelectedYear?.name);

    if (direction === "prev") {
      if (monthIndex === 0) {
        if (yearIndex < YEARDATA.length - 1) {
          setSelectedYear(YEARDATA[yearIndex + 1]);
          setSelectedmonth(months[11]);
        }
      } else {
        setSelectedmonth(months[monthIndex - 1]);
      }
    }

    if (direction === "next") {
      if (monthIndex === 11) {
        if (yearIndex > 0) {
          setSelectedYear(YEARDATA[yearIndex - 1]);
          setSelectedmonth(months[0]);
        }
      } else {
        setSelectedmonth(months[monthIndex + 1]);
      }
    }
  };

  const handleModal = () => setVisible(!visible);

  const onCreateRegularization = async (payload) => {
    try {
      const userData = {
        id: UsersigninData.user_id,
        data: { ...payload, employee_id: UsersigninData.employee_id },
      };

      const result = await dispatch(
        UserAttendanceRegularization(userData)
      ).unwrap();

      showMessage({
        icon: "success",
        message: result.message,
        type: "success",
      });

      setVisible(false);
    } catch (err) {
      showMessage({
        icon: "danger",
        message: err.error,
        type: "danger",
      });
      setVisible(false);
    }
  };

  return {
    t,
    months,
    YEARDATA,
    GetAttandanceListData,
    isGetAttandanceListFetching,
    onRefresh,
    setSelectedmonth,
    setSelectedYear,
    Selectedmonth,
    SelectedYear,
    changeMonth,
    handleModal,
    UserAttendanceRegcategoriesData,
    selectRegcategory,
    setSelectedRegcategory,
    visible,
    onCreateRegularization,
    isFeatchAttendanceReguration,
  };
};