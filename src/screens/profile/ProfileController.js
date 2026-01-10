import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { CommonSelector } from '../..//store/reducers/commonSlice'
import Service from '../../utils/service'
import AsyncStorage from '@react-native-async-storage/async-storage';

const useProfile = () => {
  const { UsersigninData } = useSelector(CommonSelector);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [avatar, setAvatar] = useState(
    UsersigninData?.profile_image || null
  );
  const Navigation = useNavigation()
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
    navigationEditProfile,
    pickerVisible,
    setPickerVisible,
    handleProfileUpload,
    avatar,
    handleOnLogout
  }
}

export default useProfile