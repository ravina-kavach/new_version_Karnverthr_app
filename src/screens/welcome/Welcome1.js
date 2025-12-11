import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlobalStyle from '../../theme/globalstyle';
import CommonButton from '../../components/CommonButton';
import { welcome1Image, welcome_background } from '../../assets/images/index';
import { COLOR } from '../../theme/theme';
import { H5, H4, H3 } from '../../utils/common';
import { useWelcome } from '../welcome/WelcomeController.js';

const Welcome1 = () => {
  const { t, backgroundOpacity, logoOpacity, textOpacity, rowOpacity,navigateToWelcome2 } =
    useWelcome();
  return (
    <SafeAreaView style={GlobalStyle.flexContainer} edges={['left', 'right']}>
      <View style={styles.container}>
        <Animated.View style={{ opacity: backgroundOpacity }}>
          <ImageBackground
            style={styles.backroundImage}
            source={welcome_background}
          >
            <Animated.View style={{ opacity: logoOpacity }}>
              <Image style={styles.welcomeImage} source={welcome1Image} />
            </Animated.View>
          </ImageBackground>
        </Animated.View>
        <Animated.View style={{ opacity: textOpacity }}>
          <View style={styles.titleContainer}>
            <H4 style={styles.titleText}>
              {t('Welcome1.title')}{' '}
              <H3 style={{ color: COLOR.Primary1 }}>
                {t('Welcome1.subtitle')}
              </H3>
            </H4>
            <H5>{t('Welcome1.dis')}</H5>
            <View style={styles.dotsContainer}>
              <View style={styles.activeDot} />
              <View style={[styles.inActiveDot, styles.dotsMargin]} />
              <View style={styles.inActiveDot} />
            </View>
          </View>
        </Animated.View>
        <View></View>
        <Animated.View style={styles.buttonContainer} opacity={rowOpacity}>
          <CommonButton title={t('Button.Next')} onPress={navigateToWelcome2}/>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White1,
  },

  backroundImage: {
    resizeMode: 'contain',
    resizeMode: 'cover',
  },
  welcomeImage: {
    top: '30%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignContent: 'flex-end',
    bottom: '5%',
  },
  titleContainer: { marginHorizontal: 20, top: '100%' },
  titleText: { paddingVertical: '2%' },
  dotsMargin: { marginHorizontal: '1%' },
  dotsContainer: {
    flexDirection: 'row',
    top: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDot: {
    backgroundColor: COLOR.Primary1,
    height: 8,
    width: 40,
    overflow: 'hidden',
    borderRadius: 30,
  },
  inActiveDot: {
    backgroundColor: COLOR.dark4,
    height: 8,
    width: 40,
    overflow: 'hidden',
    borderRadius: 30,
  },
});

export default Welcome1;
