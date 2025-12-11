import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, ImageBackground,View, Image } from 'react-native';
import GlobalStyle from '../../theme/globalstyle';
import { splash_background, splash_logo } from '../../assets/images/index';
import { responsiveHeight, responsiveWidth } from '../../utils/metrics';
import useSplash from '../splash/Splashcontroller'
const Splash = () => {
useSplash()
  return (
    <SafeAreaView style={GlobalStyle.flexContainer} edges={['left','right']}>
        <ImageBackground style={styles.backroundImage}  source={splash_background}>
          <Image style={styles.splashLogo} source={splash_logo} />
        </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  backroundImage: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
},
  splashLogo: {
    alignSelf: 'center',
    width:responsiveWidth(70),
    height:responsiveHeight(40),
    resizeMode:'contain'
  },
});

export default Splash;
