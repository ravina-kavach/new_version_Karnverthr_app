import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { CommonSelector } from '../..//store/reducers/commonSlice'




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

  return {
    UsersigninData,
    navigationEditProfile,
    pickerVisible,
    setPickerVisible,
    handleProfileUpload,
    avatar
  }
}

export default useProfile