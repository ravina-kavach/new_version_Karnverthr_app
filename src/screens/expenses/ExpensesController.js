import React, { useState } from 'react'
import { PermissionsAndroid, Linking } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { CommonSelector, CategoryList, CreateExpenses, GetExpenseList, AccountList, updateState } from '../../store/reducers/commonSlice'
import { launchCamera } from 'react-native-image-picker'
import { showMessage } from 'react-native-flash-message'
import SimpleReactValidator from 'simple-react-validator'
import { useTranslation } from 'react-i18next';
import moment from 'moment'
import { request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

export const useExpenses = () => {
  const { t, i18n } = useTranslation();
  const IsFocused = useIsFocused();
  const dispatch = useDispatch();
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
  const heandleonCamera = async (value) => {
    try {
      let hasPermission = false;

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Konvert HR - Camera Permission',
            message: 'Konvert HR needs access to your camera to take a photo.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          hasPermission = true;
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            'Camera Permission Needed',
            'Please enable camera access from Settings to continue using Konvert HR.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => openSettings() },
            ]
          );
          return;
        } else {
          Alert.alert(
            'Permission Denied',
            'Camera access is required to take your photo.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Try Again', onPress: () => heandleonCamera(value) },
            ]
          );
          return;
        }
      } else if (Platform.OS === 'ios') {
        const result = await request(PERMISSIONS.IOS.CAMERA);

        switch (result) {
          case RESULTS.GRANTED:
            hasPermission = true;
            break;
          case RESULTS.DENIED:
            Alert.alert(
              'Camera Access Needed',
              'Konvert HR needs access to your camera to take a photo.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => openSettings() },
              ]
            );
            return;
          case RESULTS.BLOCKED:
            Alert.alert(
              'Camera Access Blocked',
              'Please enable camera access from Settings to continue using Konvert HR.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => openSettings() },
              ]
            );
            return;
        }
      }

      if (hasPermission) {
        launchCamera(
          {
            mediaType: 'photo',
            cameraType: 'front',
            saveToPhotos: false,
            includeBase64: true,
            includeExtra: true,
          },
          (response) => {
            if (response.didCancel) {
              console.log('User cancelled camera picker');
            } else if (response.errorCode) {
              console.log('Camera Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
              const source = response.assets[0];
              setFileObj(source); // ✅ same logic as your original code
            }
          },
        );
      }
    } catch (err) {
      console.warn('Camera Permission Error:', err);
    }
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
      showMessage({
        icon: "danger",
        message: `${t('messages.Expanse_image')}`,
        type: "danger",
      });
      return;
    }
    if (!startDate) {
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
  };


  const closeModal = () => {
    setIsExoensemodal(false);
  };
  const onRefresh = () => {
    dispatch(GetExpenseList({ id: Number(UsersigninData?.user_id) }))
  }
  const openImage = (uri) => {
    setPreviewImage(uri);
    setPreviewVisible(true);
  };

  const onImagePicked = (image) => {
  setFileObj(image); // image has base64, uri, fileName, type
};

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
    heandleonCamera,
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
  }

}