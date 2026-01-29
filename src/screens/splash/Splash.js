import React, { useEffect,useRef,useCallback } from 'react';
import { StyleSheet, Image, AppState } from 'react-native';
import { permission } from '../../utils/permission';
import Service from '../../utils/service';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { splash_logo } from '../../assets/images/index';
import { responsiveHeight, responsiveWidth } from '../../utils/metrics';

const Splash = () => {
  const Navigation = useNavigation();
  const IsFocused = useIsFocused();
  const appState = useRef(AppState.currentState);
  const hasCheckedPermission = useRef(false);

useEffect(
  useCallback(() => {
    const init = async () => {
      if (hasCheckedPermission.current) return;
      const hasPermission = await permission.checkLocationPermission();
      if (hasPermission) {
        permission.getLocation();
        Getdata();
        hasCheckedPermission.current = true;
        return;
      }

      const status = await permission.requestLocationPermission();

      if (status === true) {
        permission.getLocation();
        Getdata();
      } else if (status === 'blocked') {
        permission.showPermissionSettingsAlert();
      }

      hasCheckedPermission.current = true;
    };

    init();
  }, [])
);


useEffect(() => {
  const handleAppStateChange = async nextAppState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      const hasPermission = await permission.checkLocationPermission();

      if (hasPermission) {
        permission.getLocation();
        Getdata();
      } else {
        permission.showPermissionSettingsAlert();
      }
    }

    appState.current = nextAppState;
  };

  const subscription = AppState.addEventListener('change', handleAppStateChange);
  return () => subscription.remove();
}, []);




  const Getdata = async () => {
    let isFirstime = await Service.GetisFirstime();
    if (isFirstime) {
      setTimeout(() => {
        // Navigation.navigate('MyTabs')
        Navigation.navigate('signInScreen');
      }, 500);
    } else {
      setTimeout(() => {
        Navigation.navigate('welcome1');
      }, 500);
    }
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
    alignItems: 'center'
  },
  splashLogo: {
    alignSelf: 'center',
    width: responsiveWidth(70),
    height: responsiveHeight(40),
    resizeMode: 'contain',
  },
});

export default Splash;
