import React, { useState } from 'react'
import { Animated, BackHandler, Dimensions } from 'react-native'
import Service from '../../../utils/service'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { showMessage } from 'react-native-flash-message'
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import SimpleReactValidator from 'simple-react-validator';
import DeviceInfo from 'react-native-device-info';
import Geolocation from '@react-native-community/geolocation';
import dayjs from 'dayjs'
import { CommonSelector, ForgotPassword, Usersignin, updateState } from '../../../store/reducers/commonSlice'
import { useTranslation } from 'react-i18next';

export const useSignInScreen = () => {
  const { t, i18n } = useTranslation();
  const Navigation = useNavigation();
  const dispatch = useDispatch();
  const IsFocused = useIsFocused();

  const Validator = React.useRef(new SimpleReactValidator({
    validators: {
      pass: {
        message: 'Password dose not match criteria.\nPassword must be 8+ chars with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
        rule: (val, params, validator) => {
          return validator.helpers.testRegex(val, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/)
        },
      },
    },
  }));
  const [, forceUpdate] = React.useState();
  const ResetValidator = React.useRef(new SimpleReactValidator({}));
  const [, ResetforceUpdate] = React.useState();
  
  const [Formdata, setFormdata] = React.useState({})  
  // const [Formdata, setFormdata] = React.useState({ "email": "gauravsingh4632@gmail.com", "password": "Gaurav@123" })  
  // const [Formdata, setFormdata] = React.useState({ "email": "raia6651@gmail.com", "password": "Abhishek@123" })  
  // const [Formdata, setFormdata] = React.useState({ "email": "rainilesh045@gmail.com", "password": "Nilesh@123" })  
  // const [Formdata, setFormdata] = React.useState({ "email": "prateekjnp2002@gmail.com", "password": "Prateek@0421" })  
  
  const [ReSetemail, setReSetemail] = React.useState('')
  const [IsReSetmodalvisible, setIsReSetmodalvisible] = React.useState(false)
  const [IsPassVisible, setIsPassVisible] = React.useState(true)
  const [RememberData, setRememberData] = React.useState(null)
  const [CurrentLongitude, setCurrentLongitude] = React.useState(0)
  const [CurrentLatitude, setCurrentLatitude] = React.useState(0)
  const [isChecked, setisChecked] = React.useState(false)
  const [isShowbiomatric, setisShowbiomatric] = React.useState(false)
  const [DeviceData, setDeviceData] = React.useState({})
  const [isVisibleVerifiedModal, setIsVisibleVerifiedModal] = React.useState(false)
  const { isSignin, isSigninFetching, isVerified, isVerifiedFetching, UsersigninData, isError, errorMessage, isForgotPassword, isForgotPasswordFetching, } = useSelector(CommonSelector);

  const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true, })
  //---------------
  React.useEffect(() => {
    if (IsFocused) {
      Getdata();
      GetDevicedata();
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
      return () => backHandler.remove()
    }
  }, [IsFocused])
  React.useEffect(() => {
    if (isError) {
      showMessage({
        icon: "danger",
        message: errorMessage,
        type: "danger",
        duration: 2000
      })
      dispatch(updateState({ isError: false, errorMessage: "" }))
      setReSetemail('')
      setIsReSetmodalvisible(false)
    }
  }, [isError])
  React.useEffect(() => {
    if (isSignin) {
      showMessage({
        icon: "success",
        message: `${t('messages.Welcome_back')}`,
        type: "success",
      })
      setdata()
    }
  }, [isSignin])

  React.useEffect(() => {
    if (isForgotPassword) {
      showMessage({
        icon: "success",
        message: `${t('messages.password_reset')}`,
        type: "success",
      })
      dispatch(updateState({ isForgotPassword: false, }))
      setReSetemail('')
      setIsReSetmodalvisible(false)
    }
  }, [isForgotPassword])

  //-----------------
  const setdata = async () => {
    console.log("calll")
    await Service.setRemember(UsersigninData)
    dispatch(updateState({ isSignin: false }))
    console.log("ischecked --->",isChecked)
    if (isChecked) {
      await Service.setisBiomatic('true')
    } else {
      await Service.setisBiomatic('false')
      await Service.setisFirstime('false')
    }
    // Navigation.navigate('home')
    // testing parpuse after romove it.
    Navigation.navigate('myTab')
    await Service.setisFirstime('true')
  }
  const Getdata = async () => {
    let isVerified = await Service.GetisVerified();
    if(!isVerified){
      setIsVisibleVerifiedModal(!isVerified)
    }
    let newdata = await Service.GetRemember();
    setRememberData(newdata);
    let data = await Service.GetisBiomatic();
    if(data && data === "true"){
      setisChecked(true)
      setFormdata(newdata)
    }
    setisShowbiomatric(data);
  }

  const GetDevicedata = async () => {
    Geolocation.getCurrentPosition((position) => {
      const currentLongitude = JSON.stringify(position.coords.longitude);
      setCurrentLongitude(currentLongitude)
      const currentLatitude = JSON.stringify(position.coords.latitude);
      setCurrentLatitude(currentLatitude)
    },
      (error) => {
        Service.OpenLocaitonbutton()
        console.log("error.message>>>", error.message)
      },
      { enableHighAccuracy: false, timeout: 60000, maximumAge: 0 }
    );
    let getIpAddress = await DeviceInfo.getIpAddress()
    let getAndroidId = await DeviceInfo.getAndroidId()
    let getBrand = DeviceInfo.getBrand()
    let getDevice = await DeviceInfo.getDevice()
    let getDeviceName = await DeviceInfo.getDeviceName()
    let getVersion = DeviceInfo.getVersion()
    let getSystemVersion = DeviceInfo.getSystemVersion()
    let getDeviceType = DeviceInfo.getDeviceType()
    let getUserAgent = await DeviceInfo.getUserAgent()
    let getApplicationName = DeviceInfo.getApplicationName()
    let getBaseOs = await DeviceInfo.getBaseOs()
    let getHardware = await DeviceInfo.getHardware()
    let getCodename = await DeviceInfo.getCodename()
    let getDeviceId = DeviceInfo.getDeviceId()
    let getFirstInstallTime = await DeviceInfo.getFirstInstallTime()
    let getLastUpdateTime = await DeviceInfo.getLastUpdateTime()
    let getProduct = await DeviceInfo.getProduct()
    // console.log("testing finction>>>>", await DeviceInfo.getSupportedMediaTypeList())
    // console.log("<<<<<----------------------->>>>>>>>>")
    const deviceDATA = {
      "devicePlateform": "mobile",
      "type": "mobile",
      "userAgent": String(getUserAgent),
      "browserName": "",
      "browserVersion": "",
      "platform": String(getDevice),
      "language": "",
      "appName": String(getApplicationName),
      "appVersion": String(getVersion),
      "appCodeName": String(getCodename),
      "vendor": "",
      "product": String(getProduct),
      "brand1": "",
      "version1": "",
      "brand2": "",
      "version2": "",
      "brand3": "",
      "version3": "",
      "mobile": "true",
      "platform1": "",
      "deviceMemory": "",
      "hardwareConcurrency": "",
      "os": String(getBaseOs),
      "browser": "",
      "screenWidth": String(Dimensions.get('window').width),
      "screenHeight": String(Dimensions.get('window').height),
      "latitude": String(CurrentLatitude),
      "longitude": String(CurrentLongitude),
      "hardware": String(getHardware),
      "devicetype": String(getDeviceType),
      "systemversion": String(getSystemVersion),
      "devicename": String(getDeviceName),
      "brand": String(getBrand),
      "androidId": String(getAndroidId),
      "ipaddress": String(getIpAddress),
      "deviceid": String(getDeviceId),
      "firstinstalltime": dayjs(getFirstInstallTime).format('DD-MM-YYYY'),
      "lastupdatetime": dayjs(getLastUpdateTime).format('DD-MM-YYYY'),
    }
    setDeviceData(deviceDATA)
  }
  const heandleonSignin = async () => {
    const formvalid = Validator.current.allValid();
    if (formvalid) {
      Validator.current.hideMessages();
      forceUpdate(0);
      dispatch(Usersignin({ ...DeviceData, "email": Formdata.email, "password": Formdata.password, }))
    } else {
      Validator.current.showMessages();
      forceUpdate(1);
    }
  }

  const BiometricLogin = async () => {
    const { biometryType } = await rnBiometrics.isSensorAvailable()
    if (biometryType == undefined) {
      dispatch(Usersignin({ ...DeviceData, "email": RememberData.email, "password": RememberData.password }))
    }
    if (biometryType === BiometryTypes.Biometrics) {
      const result = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate',
      })
      if (result.success) {
        dispatch(Usersignin({ ...DeviceData, "email": RememberData.email, "password": RememberData.password }))
      } else {
        console.log('Keys do not exist or were deleted')
      }
    }
  }
  const heandleonforgot = () => {
    const formvalid = ResetValidator.current.allValid();
    if (formvalid) {
      ResetValidator.current.hideMessages();
      ResetforceUpdate(0);      
      dispatch(ForgotPassword({ "email": ReSetemail }))      
    } else {
      ResetValidator.current.showMessages();
      ResetforceUpdate(1);
    }
  }
  const FacelockLogin = async () => {
    const { biometryType } = await rnBiometrics.isSensorAvailable()
    if (biometryType == BiometryTypes.FaceID) {
      const result = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate',
      })
      if (result.success) {
        dispatch(Usersignin({ "email": RememberData.email, "password": RememberData.password }))
      } else {
        console.log('Keys do not exist or were deleted')
      }
    }
  }

  const handleVerificationModal = async(secreatCode) => {
    if(isVisibleVerifiedModal && secreatCode && !isVerifiedFetching){
      setIsVisibleVerifiedModal(!isVisibleVerifiedModal)
      await Service.setisVerified('true')
    }
  }
return {
t,
Formdata,
Validator,
IsReSetmodalvisible, 
setFormdata,
IsPassVisible, 
setIsPassVisible,
isShowbiomatric, 
isForgotPasswordFetching,
setisShowbiomatric,
isChecked, 
setisChecked,
heandleonSignin,
BiometricLogin,    
heandleonforgot,
FacelockLogin,
isSigninFetching,
ReSetemail,
setReSetemail,
ResetValidator,
isVisibleVerifiedModal, 
handleVerificationModal,
setIsReSetmodalvisible
}
}