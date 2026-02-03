import React, { useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { CommonSelector, CategoryList, CreateExpenses, GetExpenseList, AccountList, updateState } from '../../store/reducers/commonSlice'
import { showMessage } from 'react-native-flash-message'
import SimpleReactValidator from 'simple-react-validator'
import { useTranslation } from 'react-i18next';
import moment from 'moment'
import { EXPENSE_STATUS } from '../../utils/metrics'

export const useExpenses = () => {
  const { t, i18n } = useTranslation();
  const IsFocused = useIsFocused();
  const dispatch = useDispatch();
  const Navigation = useNavigation()
  const [Formdata, setFormdata] = React.useState({})
  const [IsStartdatepickeropen, setIsStartdatepickeropen] = React.useState(false)
  const [startDate, setStartDate] = React.useState(null);
  const [selectedId, setSelectedId] = React.useState(1);
  const [FileObj, setFileObj] = React.useState({});
  const [IsExoensemodal, setIsExoensemodal] = React.useState(false);
  const [PreviewVisible, setPreviewVisible] = React.useState(false);
  const [PreviewImage, setPreviewImage] = React.useState(false);
  const [selectCategoryType, setSelectedCategoryType] = useState({})
  const [selectAccountType, setSelectedAccountType] = useState({})
  const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState(
  EXPENSE_STATUS[0]
);



  const Validator = React.useRef(new SimpleReactValidator({}));
  const [, forceUpdate] = React.useState();
  const { CategoryListData, UsersigninData, AccountListData, isCreateExpensesFetching, isCreateExpenses, GetExpenseListData, isGetExpenseList, isGetExpenseListFetching } = useSelector(CommonSelector);

  React.useEffect(() => {
    if (IsFocused) {

      dispatch(CategoryList({ id: Number(UsersigninData?.user_id) }))
      dispatch(AccountList({ id: Number(UsersigninData?.user_id) }))
      dispatch(GetExpenseList({ id: Number(UsersigninData?.user_id) }))
    }
  }, [IsFocused])

  React.useEffect(() => {
    if (isCreateExpenses) {
      showMessage({
        icon: "success",
        message: `${t('messages.Your_expense')}`,
        type: "success",
      })
      setIsExoensemodal(false)
      setFormdata({})
      setSelectedCategoryType({ id: 0, category_name: "Select category" })
      setSelectedId(1)
      setStartDate(null)
      setFileObj({})
      dispatch(updateState({ isCreateExpenses: false }))
    }
  }, [isCreateExpenses])
  const onChangeStartDate = (event, selectedDate) => {
    setStartDate(selectedDate)
    setIsStartdatepickeropen(false)
  };

  const resetExpenseForm = () => {
  setFormdata({});
  setStartDate(null);
  setSelectedId(1);

  setFileObj({});
  setPreviewImage(false);
  setPreviewVisible(false);

  setSelectedCategoryType({ id: 0, category_name: "Select category" });
  setSelectedAccountType({ id: 0, name: "Select account" });

  setIsStartdatepickeropen(false);
  setIsImagePickerVisible(false);

  Validator.current.hideMessages();
  forceUpdate(0);
};

  const SubmitExpense = async () => {
    const formvalid = Validator.current.allValid();
    const rawBase64 = FileObj?.base64?.includes(",")
      ? FileObj.base64.split(",")[1]
      : FileObj?.base64;

    const dataObj = {
      name: Formdata.ExpenseName || "",
      account_id: selectAccountType.id,
      product_id: selectCategoryType.id,
      total_amount_currency: Formdata.Amount || "",
      attachment: rawBase64,
      fileName: FileObj.fileName || "expense_receipt.jpg",
      date: startDate
        ? moment(startDate).format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD'),
      payment_mode: selectedId === 1 ? 'own_account' : 'company_account',
    };

    if (!rawBase64) {
      closeModal();
      showMessage({
        icon: "danger",
        message: `${t('messages.Expanse_image')}`,
        type: "danger",
      });
      return;
    }
    if (!startDate) {
      closeModal();
      showMessage({
        icon: "danger",
        message: `${t('messages.Expanse_Date')}`,
        type: "danger",
      });
      return;
    }

    if (formvalid) {
      Validator.current.hideMessages();
      forceUpdate(0);

      const obj = {
        userId: UsersigninData.user_id,
        userData: dataObj
      };
      try {
        const result = await dispatch(CreateExpenses(obj)).unwrap();
        if (result.status === "success") {
          showMessage({
            icon: "success",
            message: result.message,
            type: "success",
          });
          closeModal();
          onRefresh();
        } else {
          showMessage({
            icon: "danger",
            message: result.message || "Failed to save",
            type: "danger",
          });
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    } else {
      Validator.current.showMessages();
      forceUpdate(1);
    }
    closeModal();
  };


  const closeModal = () => {
    setIsExoensemodal(false);
    resetExpenseForm();
  };
  const onRefresh = () => {
    dispatch(GetExpenseList({ id: Number(UsersigninData?.user_id) }))
  }
  const openImage = (uri) => {
    setPreviewImage(uri);
    setPreviewVisible(true);
  };

  const onImagePicked = (image) => {
  setFileObj(image);
};

const filteredExpenses = React.useMemo(() => {
  if (!selectedStatus || selectedStatus.id === 'all') {
    return GetExpenseListData;
  }
  return GetExpenseListData?.filter(item => {
    const itemLabel = EXPENSE_STATUS[item.state]; 
    return itemLabel === selectedStatus.name;
  });
}, [GetExpenseListData, selectedStatus]);

const NavigateExpenseDetail = (item) => {
  Navigation.navigate('expenseDetail', {
      expense: item,
    })
  }

  return {
    t,
    IsStartdatepickeropen,
    startDate,
    selectedId,
    FileObj,
    IsExoensemodal,
    PreviewVisible,
    PreviewImage,
    SubmitExpense,
    Formdata,
    onChangeStartDate,
    closeModal,
    onRefresh,
    openImage,
    CategoryListData,
    isCreateExpensesFetching,
    GetExpenseListData,
    isGetExpenseList,
    isGetExpenseListFetching,
    setSelectedId,
    Validator,
    setIsExoensemodal,
    setIsStartdatepickeropen,
    setPreviewVisible,
    setFormdata,
    selectCategoryType,
    setSelectedCategoryType,
    selectAccountType,
    setSelectedAccountType,
    AccountListData,
    onImagePicked,
    isImagePickerVisible,
    setIsImagePickerVisible,
    filteredExpenses,
    selectedStatus, 
    setSelectedStatus,
    NavigateExpenseDetail
  }

}