import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AuthSelector, GetMonthlyShifts } from '../../store/reducers/commonSlice';

export const useShiftTiming = () => {
     const dispatch = useDispatch();
    const [expandedId, setExpandedId] = React.useState(null);
    
    
        const { GetMonthlyShiftsData, UsersigninData } = useSelector(AuthSelector);
    
        React.useEffect(() => {
            dispatch(GetMonthlyShifts({ "email": UsersigninData?.email }))
        }, [])
    
        const ShiftData = GetMonthlyShiftsData?.map((shift, index) => {
            return {
                id: `${index + 1}`,
                day: shift.date,
                weekday: shift.weekday,
                shifts: shift.shifts
            };
        }) || [];
  return {
    expandedId,
    setExpandedId,
    ShiftData
  }
}
