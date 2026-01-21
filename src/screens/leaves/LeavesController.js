import { useEffect, useCallback, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { CommonSelector, GetLeavetype, GetLeaveAllocation, CreateLeave, GetLeaveList } from '../../store/reducers/commonSlice';
import moment from 'moment';
import { APPROVALS, COLOR } from '../../theme/theme';
import { showMessage } from 'react-native-flash-message';

export const useLeaves = () => {
  const { t } = useTranslation();
  const { UsersigninData, GetLeavetypeData, GetLeaveAllocationData, GetLeaveListData, isGetLeaveListFetching } = useSelector(CommonSelector);
  const dispatch = useDispatch();
  const IsFocused = useIsFocused();
  const [visibleModal, setVisibleModel] = useState(false)
  const [selectedLeaveType, setSelectedLeaveType] = useState({ id: '', name: t("Leaves.Select_Leave_Type") })
  const [selectedDeptType, setSelectedDeptType] = useState({ id: '', name: t("Leaves.Select_Department_Type") })
  const [openStartDataPicker, setOpenStartDatePicker] = useState(false)
  const [openEndDataPicker, setOpenEndDatePicker] = useState(false)
  const [selectStartDate, setSelectStartDate] = useState(new Date())
  const [selectEndDate, setSelectEndDate] = useState(new Date())
  const [resonText, setResonText] = useState(null)
  const [isPublicLeave, setIsPublicLeave] = useState(false)
  const [isOverTimeLeave, setIsOverTimeLeave] = useState(false)
  const [isEarnedLeave, setIsEarnedLeave] = useState(false)
  const [leavesSummary, setLeavesSummary] = useState([]);

  useEffect(() => {
    if (!IsFocused || !UsersigninData) return;

    const data = {
      id: Number(UsersigninData.user_id),
    };

    Promise.all([
      dispatch(GetLeaveList(data)),
      dispatch(GetLeavetype(data)),
      dispatch(GetLeaveAllocation(data)),
    ]);
  }, [IsFocused, UsersigninData]);

  useEffect(() => {
    if (GetLeaveAllocationData?.success && IsFocused) {
      updateLeaveSummary(GetLeaveAllocationData);
    } else {
      setLeavesSummary([]); // optional fallback
    }
  }, [IsFocused, GetLeaveAllocationData]);


  const updateLeaveSummary = (res) => {
    const cards = res?.cards ?? [];

    const mappedData = cards.map(item => ({
      title: leaveTypeMap[item.leave_type] || item.leave_type,
      used: String(item?.used ?? 0).padStart(2, "0"),
      total: String(item?.total ?? 0).padStart(2, "0"),
      left: item?.remaining ?? 0,
    }));

    setLeavesSummary(mappedData);
  };

  const resetLeaveForm = () => {
  setSelectedLeaveType({ id: '', name: t("Leaves.Select_Leave_Type") });
  setSelectedDeptType({ id: '', name: t("Leaves.Select_Department_Type") });

  setSelectStartDate(new Date());
  setSelectEndDate(new Date());

  setOpenStartDatePicker(false);
  setOpenEndDatePicker(false);

  setResonText(null);

  setIsPublicLeave(false);
  setIsOverTimeLeave(false);
  setIsEarnedLeave(false);
};


  const getStatusColor = (status) => {
    if (status === 'confirm') return APPROVALS.confirm
    if (status === 'approved') return APPROVALS.approved
    if (status === 'refuse') return APPROVALS.refuse
    if (status === 'validate') return APPROVALS.approved
    if (status === 'validate2') return APPROVALS.validate2
    if (status === 'cancel') return APPROVALS.cancel
    return COLOR.Red
  };
   const getStatus = (status) => {
    if (status === 'confirm') return APPROVALS.confirm
    if (status === 'approved') return APPROVALS.approved
    if (status === 'refuse') return APPROVALS.refuse
    if (status === 'validate') return APPROVALS.approved
    if (status === 'validate2') return APPROVALS.validate2
    if (status === 'cancel') return APPROVALS.cancel
    return COLOR.Red
  };
  const handleModal = () => {
    setVisibleModel(false);
    resetLeaveForm();

  }

  const handleOpenModal = () => {
    setVisibleModel(true)
  }

  const onChangeStartDate = (event, selectedDate) => {
    setSelectStartDate(selectedDate)
    setOpenStartDatePicker(false)
  };

  const onChangeEndDate = (event, selectedDate) => {
    setSelectEndDate(selectedDate)
    setOpenEndDatePicker(false)
  };

  const saveLeave = async () => {
    try {
      let data = {
        holiday_status_id: selectedLeaveType.id,
        date_from: moment(selectStartDate).format("YYYY-MM-DD"),
        date_to: moment(selectEndDate).format("YYYY-MM-DD"),
        reason: resonText,
      };

      const obj = {
        userid: UsersigninData.user_id,
        userData: data,
      };

      const result = await dispatch(CreateLeave(obj)).unwrap();
      if (result?.success) {
        showMessage({
          icon: "success",
          message: result.successMessage || "Leave applied successfully",
          type: "success",
        });

        handleModal();
        setSelectedLeaveType({ id: '', name: t("Leaves.Select_Leave_Type") });
        await dispatch(GetLeaveList());
      } else {
        handleModal();
        showMessage({
          icon: "danger",
          message: result?.message || "Failed to apply leave",
          type: "danger",
        });
      }

    } catch (error) {
      handleModal();
      showMessage({
        icon: "danger",
        message:
          error?.message ||
          error?.error ||
          "Something went wrong. Please try again.",
        type: "danger",
      });
    }
    handleModal();
  };

  const onRefresh = useCallback(() => {
    dispatch(GetLeaveList())
  }, []);

  return {
    t,
    UsersigninData,
    leavesSummary,
    getStatusColor,
    visibleModal,
    handleModal,
    handleOpenModal,
    saveLeave,
    GetLeavetypeData,
    selectedLeaveType,
    setSelectedLeaveType,

    selectedDeptType,
    setSelectedDeptType,
    selectStartDate,
    selectEndDate,
    openStartDataPicker,
    openEndDataPicker,
    onChangeStartDate,
    onChangeEndDate,
    setOpenStartDatePicker,
    setOpenEndDatePicker,
    resonText,
    setResonText,
    GetLeaveListData,
    isGetLeaveListFetching,
    onRefresh,
    isPublicLeave,
    setIsPublicLeave,
    isOverTimeLeave,
    setIsOverTimeLeave,
    isEarnedLeave,
    setIsEarnedLeave,
    GetLeaveAllocationData,
    getStatus

  }
}