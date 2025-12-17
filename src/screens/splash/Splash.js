import React from 'react';
import { useEffect } from 'react';
import { permission } from '../../utils/permission';
import Service from '../../utils/service';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, ImageBackground, View, Image } from 'react-native';
import GlobalStyle from '../../theme/globalstyle';
import { splash_background, splash_logo } from '../../assets/images/index';
import { responsiveHeight, responsiveWidth } from '../../utils/metrics';

const Splash = () => {
  const Navigation = useNavigation();
  const IsFocused = useIsFocused();
  useEffect(() => {
    if (IsFocused) {
      permission.requestLocationPermission();
      Getdata();
    }
  }, [IsFocused]);

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
    <SafeAreaView style={GlobalStyle.flexContainer} edges={['left', 'right']}>
      <ImageBackground style={styles.backroundImage} source={splash_background}>
        <Image style={styles.splashLogo} source={splash_logo} />
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    alignSelf: 'center',
    width: responsiveWidth(70),
    height: responsiveHeight(40),
    resizeMode: 'contain',
  },
});

export default Splash;
