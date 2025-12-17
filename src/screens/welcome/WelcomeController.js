import React from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, BackHandler } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Service from '../../utils/service';

export const useWelcome = () => {
  const { t } = useTranslation();
  const Navigation = useNavigation();
  const IsFocused = useIsFocused();
  const logoOpacity = React.useRef(new Animated.Value(0)).current;
  const backgroundOpacity = React.useRef(new Animated.Value(0)).current;
  const textOpacity = React.useRef(new Animated.Value(0)).current;
  const rowOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (IsFocused) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );
      return () => backHandler.remove();
    }
  }, [IsFocused]);

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(rowOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoOpacity]);

  const navigateToWelcome2 = () => {
    Navigation.navigate('welcome2');
  };
  const navigateToWelcome3 = () => {
    Navigation.navigate('welcome3');
  };

  const navigateToSignIn = async() => {
    await Service.setisFirstime('true');
    Navigation.navigate('signInScreen');
  };

  return {
    t,
    logoOpacity,
    backgroundOpacity,
    textOpacity,
    rowOpacity,
    navigateToWelcome2,
    navigateToWelcome3,
    navigateToSignIn,
  };
};
