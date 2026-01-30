import React from 'react';
import { BackHandler, Dimensions } from 'react-native';
import Service from '../../../utils/service';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import SimpleReactValidator from 'simple-react-validator';
import DeviceInfo from 'react-native-device-info';
import {
  CommonSelector,
  ForgotPassword,
  UserVerification,
  Usersignin,
  updateState,
  GetUserDetails
} from '../../../store/reducers/commonSlice';
import { useTranslation } from 'react-i18next';

export const useSignInScreen = () => {
  const { t, i18n } = useTranslation();
  const Navigation = useNavigation();
  const dispatch = useDispatch();
  const IsFocused = useIsFocused();

  const Validator = React.useRef(
    new SimpleReactValidator({
      validators: {
        pass: {
          message:
            'Password dose not match criteria.\nPassword must be 8+ chars with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
          rule: (val, params, validator) => {
            return validator.helpers.testRegex(
              val,
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
            );
          },
        },
      },
    }),
  );
  const [, forceUpdate] = React.useState();
  const ResetValidator = React.useRef(new SimpleReactValidator({}));
  const [, ResetforceUpdate] = React.useState();

  const [Formdata, setFormdata] = React.useState({});
  const [ReSetemail, setReSetemail] = React.useState('');
  const [IsReSetmodalvisible, setIsReSetmodalvisible] = React.useState(false);
  const [IsPassVisible, setIsPassVisible] = React.useState(true);
  const [RememberData, setRememberData] = React.useState(null);
  const [isChecked, setisChecked] = React.useState(false);
  const [isShowbiomatric, setisShowbiomatric] = React.useState(false);
  const [DeviceData, setDeviceData] = React.useState({});
  const [isVisibleVerifiedModal, setIsVisibleVerifiedModal] =
    React.useState(false);
  const {
    isSignin,
    isSigninFetching,
    isVerified,
    VerfiedUserData,
    isVerifiedFetching,
    isUserDetailsFetching,
    UsersigninData,
    isError,
    errorMessage,
    isForgotPassword,
    isForgotPasswordFetching,
  } = useSelector(CommonSelector);

    
  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  React.useEffect(() => {
    if (IsFocused) {
      Getdata();
      GetDevicedata();
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );
      return () => backHandler.remove();
    }
  }, [IsFocused]);

  React.useEffect(() => {
    if (isError && !isSignin) { 
      showMessage({
        icon: 'danger',
        message: errorMessage,
        type: 'danger',
        duration: 2000,
      });
      dispatch(updateState({ isError: false, errorMessage: '' }));
      setReSetemail('');
      setIsReSetmodalvisible(false);
    }
  }, [isError,isSignin]);
  
  React.useEffect(() => {
  if (!UsersigninData?.user_id) return;
  if (isSignin) {
    dispatch(GetUserDetails({ id: Number(UsersigninData.user_id) }));

    showMessage({
      icon: 'success',
      message: t('messages.Welcome_back'),
      type: 'success',
    });

    dispatch(updateState({ isSignin: false }));
    setdata()
    Navigation.navigate('myTab');
  }
}, [isSignin]);

  React.useEffect(() => {
    if (VerfiedUserData?.message) {
      showMessage({
        icon: 'success',
        message: VerfiedUserData?.message,
        type: 'success',
      });
      setFormdata({ ...Formdata, email: VerfiedUserData.private_email });
    }
  }, [VerfiedUserData?.message]);

  React.useEffect(() => {
    if (isForgotPassword) {
      showMessage({
        icon: 'success',
        message: `${t('messages.password_reset')}`,
        type: 'success',
      });
      dispatch(updateState({ isForgotPassword: false }));
      setReSetemail('');
      setIsReSetmodalvisible(false);
    }
  }, [isForgotPassword]);

  //-----------------
  const setdata = async () => {
  if (isChecked && Formdata?.email && Formdata?.password) {
    await Service.setRemember({
      email: Formdata.email,
      password: Formdata.password,
    });
    await Service.setisBiomatic('true');
  } else {
    await Service.setRemember(null);
    await Service.setisBiomatic('false');
  }

  dispatch(updateState({ isSignin: false }));

  if (!isUserDetailsFetching) {
    Navigation.navigate('myTab');
  }
  await Service.setisFirstime('true');
};

  const Getdata = async () => {
    const isVerifiedUser = await Service.GetisVerified();
    setIsVisibleVerifiedModal(!isVerifiedUser);

    const rememberedUser = await Service.GetRemember();
    setRememberData(rememberedUser);

    const biometricEnabled = await Service.GetisBiomatic();

    const shouldShowBiometric =
      biometricEnabled === 'true' &&
      rememberedUser?.email &&
      rememberedUser?.password;

    setisChecked(biometricEnabled === 'true');

    if (shouldShowBiometric) {
      setFormdata(rememberedUser);

      setTimeout(() => {
        setisShowbiomatric(true);
      }, 300);
    }
  };


  const GetDevicedata = async () => {
    let getDeviceId = DeviceInfo.getDeviceId();
    let getIpAddress = await DeviceInfo.getIpAddress();
    let getDevice = await DeviceInfo.getDevice();
    let getDeviceName = await DeviceInfo.getDeviceName();
    let getSystemVersion = DeviceInfo.getSystemVersion();
    let deviceUniqueId = await DeviceInfo.getUniqueId();

    const deviceDATA = {
      device_platform: String(getDevice),
      system_version: String(getSystemVersion),
      device_name: String(getDeviceName),
      ip_address: String(getIpAddress),
      device_id: String(getDeviceId),
      device_unique_id: String(deviceUniqueId)
    };
    setDeviceData(deviceDATA);
  };
  const heandleonSignin = async () => {
  dispatch(updateState({ isError: false, errorMessage: '' }));
  const formvalid = Validator.current.allValid();
  console.log("Formdata ===>", Formdata)
  if (formvalid) {
    Validator.current.hideMessages();
    forceUpdate(0);
    dispatch(
      Usersignin({ email: Formdata.email, password: Formdata.password })
    );
  } else {
    Validator.current.showMessages();
    forceUpdate(1);
  }
};

  const BiometricLogin = async () => {
    if (!RememberData?.email || !RememberData?.password) {
      showMessage({
        message: 'Please login manually first',
        type: 'warning',
      });
      return;
    }

    const { biometryType } = await rnBiometrics.isSensorAvailable();
    if (!biometryType) {
      dispatch(
        Usersignin({
          email: RememberData.email,
          password: RememberData.password,
        }),
      );
      return;
    }

    const result = await rnBiometrics.simplePrompt({
      promptMessage: 'Authenticate',
    });

    if (result.success) {
      dispatch(
        Usersignin({
          email: RememberData.email,
          password: RememberData.password,
        }),
      );
      setisShowbiomatric(false)
    }
  };



  const heandleonforgot = () => {
    const formvalid = ResetValidator.current.allValid();
    if (formvalid) {
      ResetValidator.current.hideMessages();
      ResetforceUpdate(0);
      dispatch(ForgotPassword({ email: ReSetemail }));
    } else {
      ResetValidator.current.showMessages();
      ResetforceUpdate(1);
    }
  };
  const FacelockLogin = async () => {
    const { biometryType } = await rnBiometrics.isSensorAvailable();
    if (biometryType == BiometryTypes.FaceID) {
      const result = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate',
      });
      if (result.success) {
        dispatch(
          Usersignin({
            email: RememberData.email,
            password: RememberData.password,
          }),
        );
        setisShowbiomatric(false)
      } else {
        console.log('Keys do not exist or were deleted');
      }
    }
  };

  const handleVerificationModal = async secreatCode => {

    if (isVisibleVerifiedModal) {
      const payloadObj = {
        ...DeviceData,
        random_code_for_reg: String(secreatCode),
      };
      try {
        const result = await dispatch(UserVerification(payloadObj)).unwrap();
        await Service.setisVerified(result);
        setIsVisibleVerifiedModal(!result);
      } catch (err) {
        console.log(err)
      }

    }
  };

  const navigateTerms = () => {
    Navigation.navigate('termsofuse')
  }
  const navigatePrivacyPolicy = () => {
    Navigation.navigate('privacyPolicy')
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
    setIsReSetmodalvisible,
    VerfiedUserData,
    isVerifiedFetching,
    navigateTerms,
    navigatePrivacyPolicy
  };
};
