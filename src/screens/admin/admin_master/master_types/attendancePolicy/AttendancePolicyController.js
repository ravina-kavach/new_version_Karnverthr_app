import { useEffect } from 'react';
import { AttendancePolicyList, AdminSelector } from '../../../../../store/reducers/adminSlice';
import { CommonSelector } from '../../../../../store/reducers/commonSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

export const useAttendancePolicy = () => {

  const dispatch = useDispatch();

  const {
    AttendancePolicyListData,
    isAttendancePolicyListFetching
  } = useSelector(AdminSelector);

  const { UsersigninData } = useSelector(CommonSelector);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && UsersigninData?.user_id) {
      const data = {
        id: Number(UsersigninData.user_id),
      };

      dispatch(AttendancePolicyList(data));
    }
  }, [isFocused, UsersigninData?.user_id, dispatch]);

  useEffect(() => {
      if (AttendancePolicyListData?.message) {
        showMessage({
          icon: "success",
          message: AttendancePolicyListData?.message,
          type: "success",
        })
      }
    }, [AttendancePolicyListData?.message])

  return {
    AttendancePolicyListData,
    isAttendancePolicyListFetching
  }
}
