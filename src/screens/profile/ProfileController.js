import React, {useState,useEffect} from 'react'
import { useNavigation } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { CommonSelector,GetUserDetails } from '../../store/reducers/commonSlice'
import Service from '../../utils/service'
import AsyncStorage from '@react-native-async-storage/async-storage';

const useProfile = () => {
  const IsFocused = useIsFocused()
  const dispatch = useDispatch();
  const Navigation = useNavigation()
  const { UsersigninData, UserDetailsData } = useSelector(CommonSelector);
  const [pickerVisible, setPickerVisible] = useState(false);
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

  const navigationEditProfile=()=>{
    Navigation.navigate('editProfile')
  }

  const handleProfileUpload = (image)=>{
    setAvatar(image.uri)
  }

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
    pickerVisible,
    setPickerVisible,
    handleProfileUpload,
    avatar,
    handleOnLogout
  }
}

export default useProfile