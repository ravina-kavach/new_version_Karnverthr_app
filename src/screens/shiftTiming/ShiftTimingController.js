import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { CommonSelector, GetMonthlyShifts } from '../../store/reducers/commonSlice';
import { useIsFocused } from '@react-navigation/native';

export const useShiftTiming = () => {
    const dispatch = useDispatch();
    const IsFocused =useIsFocused();

    const { GetMonthlyShiftsData, UsersigninData, isGetMonthlyShiftsFetching } = useSelector(CommonSelector);

    useEffect(() => {
        if(IsFocused && UsersigninData){
            const data = {
                id: Number(UsersigninData.user_id),
            };  
            dispatch(GetMonthlyShifts(data))
          }
    }, [])
    return {
        GetMonthlyShiftsData,
        isGetMonthlyShiftsFetching
    }
}
