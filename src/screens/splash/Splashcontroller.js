import { useEffect } from "react";
import { permission} from '../../utils/permission'
import Service from '../../utils/service'
import {  useIsFocused, useNavigation } from '@react-navigation/native';

const useSplash = () =>{
    const Navigation = useNavigation();
    const IsFocused = useIsFocused();

  useEffect(() => {
    if (IsFocused) {
      permission.requestLocationPermission();
      Getdata();
    }
  }, [IsFocused])

   const Getdata = async () => {
    setTimeout(() => {
        Navigation.navigate('welcome1')
      }, 500);
    }
//     let isFirstime = await Service.GetisFirstime()
//     if (isFirstime) {
//       setTimeout(() => {
//         // Navigation.navigate('MyTabs')
//         Navigation.navigate('signIn')
//       }, 500);
//     } else {
//       setTimeout(() => {
//         Navigation.navigate('welcome1')
//       }, 500);
//     }
//   }
}

export default useSplash