import { useEffect, useCallback, useState, useMemo } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { CommonSelector, GetLeavetype, GetLeaveAllocation, CreateLeave, GetLeaveList } from '../../store/reducers/commonSlice';
import moment from 'moment';
import { STATE, COLOR } from '../../theme/theme';
import { showMessage } from 'react-native-flash-message';
import { LEAVE_STATUS } from '../../utils/metrics';

export const useLeaves = () => {
  const { t } = useTranslation();
  const { UsersigninData, GetLeavetypeData,UserDetailsData, GetLeaveAllocationData, GetLeaveListData, isGetLeaveListFetching } = useSelector(CommonSelector);
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
  const [selectedStatus, setSelectedStatus] = useState(
    LEAVE_STATUS[0]
  );

  useEffect(() => {
    if (UsersigninData && IsFocused) {
      const data = {
        id: Number(UsersigninData.user_id),
      };
      Promise.all([
        getLeaveList(),
        dispatch(GetLeavetype(data)),
        dispatch(GetLeaveAllocation(data)),
      ]);
    }
  }, [IsFocused, UsersigninData]);


  const getLeaveList = () => {
    const data = {
      id: Number(UsersigninData.user_id),
    };
    dispatch(GetLeaveList(data))
  }

  useEffect(() => {
    
    if (GetLeaveAllocationData && IsFocused) {
      console.log("GetLeaveListData====>",GetLeaveAllocationData)
      updateLeaveSummary(GetLeaveAllocationData);
    } else {
      setLeavesSummary([]);
    }
  }, [IsFocused, GetLeaveAllocationData]);


  const updateLeaveSummary = (res) => {
  const cards = Array.isArray(res) ? res : [];
  console.log("cards====>",cards)
  const mappedData = cards.map((item) => {
    const total = Number(item?.total) || 0;
    const used = Number(item?.used) || 0;
    const remaining = Number(item?.remaining) || 0;

    return {
      title: item.leave_type,         
      used: String(used).padStart(2, '0'),
      total: String(total).padStart(2, '0'),
      left: remaining,
    };
  });

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
    if (status === 'confirm') return STATE.confirm
    if (status === 'approved') return STATE.approved
    if (status === 'refuse') return STATE.refuse
    if (status === 'validate') return STATE.approved
    if (status === 'validate2') return STATE.validate2
    if (status === 'cancel') return STATE.cancel
    return COLOR.Red
  };
  const getStatus = (status) => {
    if (status === 'confirm') return STATE.confirm
    if (status === 'approved') return STATE.approved
    if (status === 'refuse') return STATE.refuse
    if (status === 'validate') return STATE.approved
    if (status === 'validate2') return STATE.validate2
    if (status === 'cancel') return STATE.cancel
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
    const data = {
      holiday_status_id: selectedLeaveType?.id,
      date_from: moment(selectStartDate).format("YYYY-MM-DD"),
      date_to: moment(selectEndDate).format("YYYY-MM-DD"),
      reason: resonText,
    };

    const obj = {
      userid: UsersigninData.user_id,
      userData: data,
    };

    const result = await dispatch(CreateLeave(obj)).unwrap();
    showMessage({
      icon: "success",
      message: result?.message,
      type: "success",
    });
  } catch (error) {
    showMessage({
      icon: "danger",
      message: error?.message,
      type: "danger",
    });
  }
  handleModal();
  getLeaveList();
};

  const onRefresh = useCallback(() => {
    dispatch(GetLeaveList())
  }, []);

  const filteredLeaves = useMemo(() => {
    if (!selectedStatus || selectedStatus.id === 'all') {
      return GetLeaveListData;
    }
    return GetLeaveListData?.filter(item => {
      const itemLabel = LEAVE_STATUS[item.status];
      return itemLabel === selectedStatus.name;
    });
  }, [GetLeaveListData, selectedStatus]);

  return {
    t,
    UsersigninData,
    UserDetailsData,
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
    getStatus,
    selectedStatus,
    setSelectedStatus,
    filteredLeaves

  }
}