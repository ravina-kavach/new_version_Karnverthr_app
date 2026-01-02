import React, { useCallback } from "react";
import { useTranslation } from 'react-i18next';
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux';
import { CommonSelector, GetAttandanceList } from '../../store/reducers/commonSlice';
import { showMessage } from 'react-native-flash-message';
import { useIsFocused } from '@react-navigation/native';

export const useAttendance = () => {
  const { t, i18n } = useTranslation();
  const IsFocused = useIsFocused();
  const dispatch = useDispatch();
  const currentYear = moment().year();
  const currentMonth = moment().month() + 1;
  const months = React.useMemo(() => {
    return [
      { id: '', name: t("Attendance.Select_Month") },
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
    ];
  }, [t]);
  const YEARDATA = React.useMemo(() => {
    const startYear = currentYear;
    const endYear = 2007;

    const years = [{ id: '', name: t("Attendance.Select_Year") }];

    let id = 1;
    for (let year = startYear; year >= endYear; year--) {
      years.push({
        id: String(id++),
        name: String(year),
      });
    }

    return years;
  }, [t]);
  const [SelectedYear, setSelectedYear] = React.useState(() =>
    YEARDATA.find(y => y.name === String(currentYear))
  );

  const [Selectedmonth, setSelectedmonth] = React.useState(() =>
    months.find(m => Number(m.id) === currentMonth)
  );

  const { GetAttandanceListData, isGetAttandanceListFetching, UsersigninData } = useSelector(CommonSelector);


  React.useEffect(() => {

    if (IsFocused && UsersigninData) {
      let data = {
        id: Number(UsersigninData?.user_id),
        month: Number(Selectedmonth?.id),
        year: SelectedYear?.name ? Number(SelectedYear.name) : ""
      }
      console.log("data===>", data)
      dispatch(GetAttandanceList(data))
    }
  }, [IsFocused, Selectedmonth, SelectedYear])

  React.useEffect(() => {
    if (GetAttandanceListData?.message) {
      showMessage({
        icon: "success",
        message: GetAttandanceListData?.message,
        type: "success",
      })
    }
  }, [GetAttandanceListData?.message])
  const getDuration = (checkIn, checkOut) => {
    const inTime = moment(checkIn, "YYYY-MM-DD HH:mm:ss");
    const outTime = moment(checkOut, "YYYY-MM-DD HH:mm:ss");
    if (!inTime.isValid() || !outTime.isValid()) return " ";

    const duration = moment.duration(outTime.diff(inTime));
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes()) % 60;

    return `${hours}h : ${minutes}m`;
  };
  const onRefresh = useCallback(() => {
    setSelectedmonth(months.find(i => i.name == moment().format('MMMM')))
    setSelectedYear(YEARDATA.find(i => i.name == moment().format('YYYY')))
  }, []);

  return {
    t,
    months,
    YEARDATA,
    GetAttandanceListData,
    isGetAttandanceListFetching,
    getDuration,
    onRefresh,
    setSelectedmonth,
    setSelectedYear,
    Selectedmonth,
    SelectedYear,


  }
}