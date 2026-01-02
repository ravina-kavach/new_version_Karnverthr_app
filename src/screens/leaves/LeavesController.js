import { useEffect,useCallback, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { CommonSelector,GetLeavetype, GetDepartmentType, CreateLeave ,GetLeaveList } from '../../store/reducers/commonSlice';
import moment from 'moment';
import { APPROVALS,COLOR } from '../../theme/theme';

export const useLeaves = () =>{
    const { t } = useTranslation();
    const { UsersigninData, GetLeavetypeData, GetDepartmentTypeData, GetLeaveListData ,isGetLeaveListFetching } = useSelector(CommonSelector);
    const dispatch = useDispatch();
    const IsFocused = useIsFocused();
    const [visibleModal,setVisibleModel] = useState(false)
    const [selectedLeaveType,setSelectedLeaveType] = useState({ id: '', name: t("Leaves.Select_Leave_Type") })
    const [selectedDeptType,setSelectedDeptType] =useState({id:'',name: t("Leaves.Select_Department_Type")})
    const [openStartDataPicker,setOpenStartDatePicker] = useState(false)
    const [openEndDataPicker,setOpenEndDatePicker] = useState(false)
    const [selectStartDate,setSelectStartDate] = useState(new Date())
    const [selectEndDate,setSelectEndDate] = useState(new Date())
    const [resonText,setResonText] = useState(null)

   useEffect(() => {
  if (!IsFocused || !UsersigninData) return;

  const data = {
    id: Number(UsersigninData.user_id),
  };

  Promise.all([
    dispatch(GetLeaveList(data)),
    dispatch(GetLeavetype(data)),
    dispatch(GetDepartmentType(data)),
  ]);
}, [IsFocused, UsersigninData]);

      const leavesSummary = [
    { title: 'Annual', used: '05', total: '12', left: 7 },
    { title: 'Medical', used: '04', total: '10', left: 6 },
    { title: 'Casual', used: '01', total: '06', left: 5 },
    { title: 'Others', used: '02', total: '04', left: 2 },
  ];

  const submittedLeaves = [
    { type: 'Annual', from: '20 Dec', to: '22 Dec', days: 2, status: 'Approved' },
    { type: 'Medical', from: '10 Dec', to: '11 Dec', days: 1, status: 'Pending' },
    { type: 'Casual', from: '10 Sep', to: '10 Sep', days: 1, status: 'Rejected' },
  ];

  const getStatusColor = (status) => {
    if (status === 'confirm') return APPROVALS.confirm
    if (status === 'approved') return APPROVALS.approved
    if (status === 'refuse') return APPROVALS.refuse
    if (status === 'validate') return APPROVALS.validate
    if (status === 'validate2') return APPROVALS.validate2
    if (status === 'cancel') return APPROVALS.cancel
    return COLOR.Red
  };
  const handleModal = () =>{
  setVisibleModel(!visibleModal)
  }

  const onChangeStartDate = (event, selectedDate) => {
            setSelectStartDate(selectedDate)
            setOpenStartDatePicker(false)
        };

  const onChangeEndDate = (event, selectedDate) => {
            setSelectEndDate(selectedDate)
            setOpenEndDatePicker(false)
        };      

  const saveLeave = async() => {
    let data = {
      "employee_id": 16626,
      "holiday_status_id" : selectedLeaveType.id,
      "date_from": moment(selectStartDate).format("YYYY-MM-DD"),
      "date_to": moment(selectEndDate).format("YYYY-MM-DD"),
      "reason": resonText
      };
    const result = await dispatch(CreateLeave(UsersigninData.id, data)).unwrap()
    if(result){
      setSelectedLeaveType({ id: '', name: t("Leaves.Select_Leave_Type") });
      selectedDeptType({id:'',name: t("Leaves.Select_Department_Type")});
      await dispatch(GetLeaveList(data))
    }
  }
const onRefresh = useCallback(() => {
    dispatch(GetLeaveList(data))
  }, []);

return {
    t,
    UsersigninData,
    leavesSummary,
    submittedLeaves,
    getStatusColor,
    visibleModal,
    handleModal,
    saveLeave,
    GetLeavetypeData,
    selectedLeaveType,
    setSelectedLeaveType,
    GetDepartmentTypeData,
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
    onRefresh

}
}