import React, { useState, useEffect, useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { CommonSelector, GetUserDetails, ProfileUpdate, updateState } from '../../store/reducers/commonSlice'
import Service from '../../utils/service'
import AsyncStorage from '@react-native-async-storage/async-storage';

const useProfile = () => {
  const IsFocused = useIsFocused()
  const dispatch = useDispatch();
  const Navigation = useNavigation()
  const { UsersigninData, UserDetailsData, ProfileUpdateData, isUserDetailsFetching, isProfileUpdate, isProfileUpdateFetching } = useSelector(CommonSelector);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [IsReSetmodalvisible, setIsReSetmodalvisible] = useState(false)
  const [avatar, setAvatar] = useState(
    UsersigninData?.profile_image || null
  );


  useEffect(() => {
  if (!IsFocused) return;
  const userId = Number(UsersigninData?.user_id);
  if (!userId || Number.isNaN(userId)) {
    return;
  }
  dispatch(GetUserDetails({ id: userId }));
}, [IsFocused, UsersigninData]);

  const navigationEditProfile = () => {
    Navigation.navigate('editProfile')
  }

  const navigationEmergencyDetails = () => {
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
  try {
   await dispatch(
      updateState({
        VerfiedUserData: {},
        UsersigninData: {},
        UserDetailsData: {},
        isVerified: false,
        isSignin: false,
      })
    );

    const keysToPreserve = ['isFirstTime', 'USER_TOKEN'];
    const preservedValues = {};

    await Promise.all(
      keysToPreserve.map(async key => {
        preservedValues[key] = await AsyncStorage.getItem(key);
      })
    );

    await Service.ClearStorage();
    await Promise.all(
      keysToPreserve.map(async key => {
        const value = preservedValues[key];
        if (value !== null) {
          await AsyncStorage.setItem(key, value);
        }
      })
    );
    Navigation.reset({
      index: 0,
      routes: [{ name: 'signInScreen' }],
    });

  } catch (error) {
    console.error('Logout failed:', error);
  }
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