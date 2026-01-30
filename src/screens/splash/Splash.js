import React, { useEffect, useRef } from 'react';
import { StyleSheet, Image, AppState } from 'react-native';
import { permission } from '../../utils/permission';
import Service from '../../utils/service';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { splash_logo } from '../../assets/images/index';
import { responsiveHeight, responsiveWidth } from '../../utils/metrics';

const Splash = () => {
  const navigation = useNavigation();

  const appState = useRef(AppState.currentState);
  const hasCheckedPermission = useRef(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (hasCheckedPermission.current) return;

      const hasPermission = await permission.checkLocationPermission();

      if (!hasPermission) {
        await permission.requestLocationPermission();
      }

      permission.getLocation();
      await navigateNext();

      hasCheckedPermission.current = true;
    };

    init();
  }, []);

  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const hasPermission = await permission.checkLocationPermission();
        if (hasPermission) {
          permission.getLocation();
        }
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  const navigateNext = async () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;

    const isFirstTime = await Service.GetisFirstime();

    setTimeout(() => {
      if (isFirstTime) {
        navigation.replace('signInScreen');
      } else {
        navigation.replace('welcome1');
      }
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Image style={styles.splashLogo} source={splash_logo} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    width: responsiveWidth(70),
    height: responsiveHeight(40),
    resizeMode: 'contain',
  },
});

export default Splash;
