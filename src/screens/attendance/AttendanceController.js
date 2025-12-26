import React, {useCallback} from "react";
import { useTranslation } from 'react-i18next';
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux';
import { CommonSelector, GetAttandanceList } from '../../store/reducers/commonSlice';
import { showMessage } from 'react-native-flash-message';
import { useIsFocused } from '@react-navigation/native';

export const useAttendance = () =>{
     const { t, i18n } = useTranslation();
     const IsFocused = useIsFocused();
      const dispatch = useDispatch();
      const months = [
        { "id": '', "name": `${t("Attendance.Select_Month")}` },
        { "id": '1', "name": `${t("Attendance.January")}` },
        { "id": '2', "name": `${t("Attendance.February")}` },
        { "id": '3', "name": `${t("Attendance.March")}` },
        { "id": '4', "name": `${t("Attendance.April")}` },
        { "id": '5', "name": `${t("Attendance.May")}` },
        { "id": '6', "name": `${t("Attendance.June")}` },
        { "id": '7', "name": `${t("Attendance.July")}` },
        { "id": '8', "name": `${t("Attendance.August")}` },
        { "id": '9', "name": `${t("Attendance.September")}` },
        { "id": '10', "name": `${t("Attendance.October")}` },
        { "id": '11', "name": `${t("Attendance.November")}` },
        { "id": '12', "name": `${t("Attendance.December")}` },
      ];
      const YEARDATA = [
        { "id": '', "name": `${t("Attendance.Select_Year")}` },
        { "id": '1', "name": "2025" },
        { "id": '2', "name": "2024" },
        { "id": '3', "name": "2023" },
        { "id": '4', "name": "2022" },
        { "id": '5', "name": "2021" },
        { "id": '6', "name": "2020" },
        { "id": '7', "name": "2019" },
        { "id": '8', "name": "2018" },
        { "id": '9', "name": "2017" },
        { "id": '10', "name": "2016" },
        { "id": '11', "name": "2015" },
        { "id": '12', "name": "2014" },
        { "id": '13', "name": "2013" },
        { "id": '14', "name": "2012" },
        { "id": '15', "name": "2011" },
        { "id": '16', "name": "2010" },
        { "id": '17', "name": "2009" },
        { "id": '18', "name": "2008" },
        { "id": '19', "name": "2007" },
      ];
      const [Selectedmonth, setSelectedmonth] = React.useState(months.find(i => i.name == moment().format('MMMM')))
      const [SelectedYear, setSelectedYear] = React.useState(YEARDATA.find(i => i.name == moment().format('YYYY')))
      const { GetAttandanceListData, isGetAttandanceListFetching, UsersigninData } = useSelector(CommonSelector);
    
      React.useEffect(() => {
      if(IsFocused){
        let data = {
          id: Number(UsersigninData?.user_id),
          month: Number(Selectedmonth?.id),
          year: SelectedYear?.id ? Number(SelectedYear.name) : ""
        }
        dispatch(GetAttandanceList(data))
        }
      }, [IsFocused , Selectedmonth , SelectedYear])

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