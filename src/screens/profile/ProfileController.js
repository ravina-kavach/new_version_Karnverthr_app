import React, { useState, useEffect, useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { CommonSelector, GetUserDetails, ProfileUpdate } from '../../store/reducers/commonSlice'
import Service from '../../utils/service'
import AsyncStorage from '@react-native-async-storage/async-storage';

const useProfile = () => {
  const IsFocused = useIsFocused()
  const dispatch = useDispatch();
  const Navigation = useNavigation()
  const { UsersigninData, UserDetailsData, ProfileUpdateData, isUserDetailsFetching, isProfileUpdate, isProfileUpdateFetching } = useSelector(CommonSelector);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [IsReSetmodalvisible,setIsReSetmodalvisible] = useState(false)
  const [avatar, setAvatar] = useState(
    UsersigninData?.profile_image || null
  );


  useEffect(() => {
    if (!IsFocused || !UsersigninData) return;
    const data = {
      id: Number(UsersigninData.user_id),
    };
    dispatch(GetUserDetails(data))
  }, [IsFocused, UsersigninData]);

  const navigationEditProfile = () => {
    Navigation.navigate('editProfile')
  }

  const navigationEmergencyDetails = () =>{
    Navigation.navigate("emergencyDetails")
  }
  const handleProfileUpload = (image) => {
    setAvatar(image.uri)
  }

  const handleProfileUpdate = useCallback(
    (formData) => {
      if (!UsersigninData || !UserDetailsData) return;
      dispatch(
        ProfileUpdate({
          empId: UsersigninData.employee_id,
          id: UsersigninData.user_id,
          userData: formData,
        })
      );
    },
    [dispatch, UsersigninData, UserDetailsData]
  );

  const handleOnLogout = async () => {
    const isFirstTime = await Service.GetisFirstime();
    const token = await AsyncStorage.getItem('USER_TOKEN');
    await Service.ClearStorage();
    if (isFirstTime) {
      await Service.setisFirstime(isFirstTime);
      await AsyncStorage.setItem('USER_TOKEN', token);
    }
    Navigation.reset({
      index: 0,
      routes: [{ name: 'signInScreen' }],
    });
  };

  return {
    UsersigninData,
    UserDetailsData,
    navigationEditProfile,
    navigationEmergencyDetails,
    pickerVisible,
    setPickerVisible,
    handleProfileUpload,
    avatar,
    handleProfileUpdate,
    handleOnLogout,
    isProfileUpdate,
    isProfileUpdateFetching,
    isUserDetailsFetching,
    IsReSetmodalvisible,
    setIsReSetmodalvisible
  }
}

export default useProfile