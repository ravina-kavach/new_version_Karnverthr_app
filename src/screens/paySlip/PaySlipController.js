import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';
import { GetPaySlip, CommonSelector } from '../../store/reducers/commonSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

export const usePaySlip = () => {
  const {
    getisPaySlipBase64Fetching,
    UserDetailsData,
    getPaySlipBase64
  } = useSelector(CommonSelector);
  const { t, i18n } = useTranslation();
  const IsFocused = useIsFocused();
  const dispatch = useDispatch();
  const [slips, setSlips] = useState([])
  const currentYear = moment().year();
  const currentMonth = moment().month() + 1;
  const months = React.useMemo(() => {
    return [
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
    const years = [];

    for (let i = 0; i < 2; i++) {
      years.push({
        id: String(i + 1),
        name: String(startYear - i),
      });
    }

    return years;
  }, [currentYear]);
  const [SelectedYear, setSelectedYear] = React.useState(() =>
    YEARDATA.find(y => y.name === String(currentYear))
  );

  const [Selectedmonth, setSelectedmonth] = React.useState(() =>
    months.find(m => Number(m.id) === currentMonth)
  );

  useEffect(() => {
    if (IsFocused && UserDetailsData) {
      getPaySlips()
    }
  }, [IsFocused, Selectedmonth, SelectedYear])

  const getPaySlips = async () => {
    try {
      const payload = {
        employee_id: UserDetailsData.id,
        month: Number(Selectedmonth.id),
        year: Number(SelectedYear.name)
      };
      await dispatch(GetPaySlip(payload)).unwrap();

    } catch (error) {
      console.log("error==>",error)
  }
  }

  return {
    YEARDATA,
    months,
    SelectedYear,
    setSelectedYear,
    slips,
    getPaySlips,
    UserDetailsData,
    Selectedmonth,
    setSelectedmonth
  }
}