import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';
import { GetPaySlip, CommonSelector } from '../../store/reducers/commonSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

export const usePaySlip = () => {
  const {
    isPaySlipBase64Fetching,
    UserDetailsData,
  } = useSelector(CommonSelector);

  const { t } = useTranslation();
  const IsFocused = useIsFocused();
  const dispatch = useDispatch();

  const [paySlip, setPaySlip] = useState(null);

  const currentDate = useMemo(() => moment(), []);
  const currentYear = currentDate.year();
  const currentMonth = currentDate.month() + 1;

  const previousDate = useMemo(
    () => moment().subtract(1, 'month'),
    []
  );

  const defaultYear = previousDate.year();
  const defaultMonth = previousDate.month() + 1;

  const YEARDATA = useMemo(() => ([
    { id: '1', name: String(currentYear) },
    { id: '2', name: String(currentYear - 1) },
  ]), [currentYear]);

  const ALL_MONTHS = useMemo(() => [
    { id: '1', name: t('Attendance.January') },
    { id: '2', name: t('Attendance.February') },
    { id: '3', name: t('Attendance.March') },
    { id: '4', name: t('Attendance.April') },
    { id: '5', name: t('Attendance.May') },
    { id: '6', name: t('Attendance.June') },
    { id: '7', name: t('Attendance.July') },
    { id: '8', name: t('Attendance.August') },
    { id: '9', name: t('Attendance.September') },
    { id: '10', name: t('Attendance.October') },
    { id: '11', name: t('Attendance.November') },
    { id: '12', name: t('Attendance.December') },
  ], [t]);

  const [SelectedYear, setSelectedYear] = useState(null);
  const [Selectedmonth, setSelectedmonth] = useState(null);

  const months = useMemo(() => {
    if (!SelectedYear) return [];

    const selectedYearNumber = Number(SelectedYear.name);

    if (selectedYearNumber === currentYear) {
      return ALL_MONTHS.filter(
        m => Number(m.id) < currentMonth
      );
    }

    return ALL_MONTHS;
  }, [SelectedYear, ALL_MONTHS, currentYear, currentMonth]);

  useEffect(() => {
    if (!YEARDATA.length || !ALL_MONTHS.length) return;

    const yearObj = YEARDATA.find(
      y => Number(y.name) === defaultYear
    );

    const monthObj = ALL_MONTHS.find(
      m => Number(m.id) === defaultMonth
    );

    setSelectedYear(yearObj);
    setSelectedmonth(monthObj);
  }, [YEARDATA, ALL_MONTHS, defaultYear, defaultMonth]);

  useEffect(() => {
    if (!Selectedmonth || !months.length) return;

    const isValid = months.some(
      m => m.id === Selectedmonth.id
    );

    if (!isValid) {
      setSelectedmonth(months[months.length - 1]);
    }
  }, [months]);

  useEffect(() => {
    if (IsFocused && UserDetailsData && Selectedmonth && SelectedYear) {
      getPaySlips();
    }
  }, [IsFocused, Selectedmonth, SelectedYear]);

  const getPaySlips = async () => {
    try {
      const payload = {
        employee_id: UserDetailsData.id,
        month: Number(Selectedmonth.id),
        year: Number(SelectedYear.name),
      };

      const result = await dispatch(GetPaySlip(payload)).unwrap();

      setPaySlip(result?.data?.pdf_base64 || null);

      showMessage({
        icon: 'success',
        message: result.message,
        type: 'success',
      });
    } catch (error) {
      showMessage({
        icon: 'danger',
        message: error?.error || 'Something went wrong',
        type: 'danger',
      });
    }
  };

  return {
    YEARDATA,
    months,
    SelectedYear,
    setSelectedYear,
    Selectedmonth,
    setSelectedmonth,
    UserDetailsData,
    isPaySlipBase64Fetching,
    paySlip,
  };
};
