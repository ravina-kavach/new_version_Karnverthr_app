import React, { useState, useCallback } from 'react';
import {
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  CommonSelector,
  GetUserDetails,
  ProfileUpdate,
  updateState,
} from '../../store/reducers/commonSlice';
import Service from '../../utils/service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useProfile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {
    UsersigninData,
    UserDetailsData,
    isUserDetailsFetching,
    isProfileUpdate,
    isProfileUpdateFetching,
  } = useSelector(CommonSelector);

  const [pickerVisible, setPickerVisible] = useState(false);
  const [IsReSetmodalvisible, setIsReSetmodalvisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [avatar, setAvatar] = useState(
    UserDetailsData?.image_url || null
  );


  const fetchUserDetails = useCallback(() => {
    const userId = Number(UsersigninData?.user_id);

    if (!userId || Number.isNaN(userId)) return;

    dispatch(GetUserDetails({ id: userId }));
  }, [dispatch, UsersigninData?.user_id]);

  useFocusEffect(
    useCallback(() => {
      if (UsersigninData?.user_id) {
        fetchUserDetails();
      }
    }, [fetchUserDetails, UsersigninData?.user_id])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserDetails();
    setRefreshing(false);
  }, [fetchUserDetails]);

  const navigationEditProfile = () => {
    navigation.navigate('editProfile');
  };

  const navigationEmergencyDetails = () => {
    navigation.navigate('emergencyDetails');
  };

  const handleProfileUpload = useCallback(
    (image) => {
      if (!image) return;

      setAvatar(image.uri);

      const payload = {
        image_1920: image.base64,
      };

      handleProfileUpdate(payload);
    },
    []
  );

  const handleProfileUpdate = useCallback(
    (formData) => {
      if (!UsersigninData?.employee_id || !UsersigninData?.user_id) return;

      dispatch(
        ProfileUpdate({
          empId: UsersigninData.employee_id,
          id: UsersigninData.user_id,
          userData: formData,
        })
      );
    },
    [dispatch, UsersigninData]
  );

  const handleOnLogout = useCallback(async () => {
    try {
      dispatch(
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
        keysToPreserve.map(async (key) => {
          preservedValues[key] = await AsyncStorage.getItem(key);
        })
      );

      await Service.ClearStorage();

      await Promise.all(
        keysToPreserve.map(async (key) => {
          if (preservedValues[key] !== null) {
            await AsyncStorage.setItem(key, preservedValues[key]);
          }
        })
      );

      navigation.reset({
        index: 0,
        routes: [{ name: 'signInScreen' }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [dispatch, navigation]);

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
    setIsReSetmodalvisible,
    logoutVisible,
    setLogoutVisible,
    refreshing,
    onRefresh,
  };
};

export default useProfile;
