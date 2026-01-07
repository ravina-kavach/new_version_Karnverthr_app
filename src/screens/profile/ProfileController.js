import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { CommonSelector } from '../..//store/reducers/commonSlice'




const useProfile = () => {
  const { UsersigninData } = useSelector(CommonSelector);
  const Navigation = useNavigation()
  // const navigationEditProfile=()=>{
  //   Navigation.navigate('editProfile')
  // }
  return {
    UsersigninData
  }
}

export default useProfile