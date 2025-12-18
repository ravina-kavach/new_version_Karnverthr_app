import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Animated,
} from 'react-native';
import CommonButton from '../../components/CommonButton';
import { welcome3Image, welcome_background } from '../../assets/images/index';
import { COLOR } from '../../theme/theme';
import { H5, H4, H3, CommonView } from '../../utils/common';
import { useWelcome } from '../welcome/WelcomeController.js';
import { responsiveHeight, responsiveWidth } from '../../utils/metrics.js';

const Welcome3 = () => {
  const {
    t,
    backgroundOpacity,
    logoOpacity,
    textOpacity,
    rowOpacity,
    navigateToSignIn,
  } = useWelcome();
  return (
    <CommonView statusBarColor={COLOR.OffRed}>
      <View style={styles.container}>
        <Animated.View style={{ opacity: backgroundOpacity }}>
          <ImageBackground
            style={styles.backroundImage}
            source={welcome_background}
          >
            <Animated.View style={{ opacity: logoOpacity }}>
              <Image style={styles.welcomeImage} source={welcome3Image} />
            </Animated.View>
          </ImageBackground>
        </Animated.View>

        <View style={styles.buttonContainer}>
          <Animated.View style={{ opacity: textOpacity }}>
            <View style={styles.titleContainer}>
              <H4 style={styles.titleText}>{t('Welcome3.title')}</H4>
              <H3 style={{ color: COLOR.Primary1 }}>
                {t('Welcome3.subtitle')}
              </H3>
              <H5>{t('Welcome3.dis')}</H5>
            </View>
          </Animated.View>
          <Animated.View opacity={rowOpacity}>
            <View style={styles.dotsContainer}>
              <View style={styles.inActiveDot} />
              <View style={[styles.inActiveDot, styles.dotsMargin]} />
              <View style={styles.activeDot} />
            </View>
            <CommonButton
              title={t('Button.Sign_In')}
              containerStyle={styles.buttonInnerContainer}
              gradientColors={[COLOR.grediant1, COLOR.grediant2]}
              onPress={navigateToSignIn}
            />
          </Animated.View>
        </View>
      </View>
    </CommonView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White1,
  },

  buttonInnerContainer:{
    width:responsiveWidth(90)
  },

  backroundImage: {
    resizeMode: 'contain',
    resizeMode: 'cover',
  },
  welcomeImage: {
    marginTop: responsiveHeight(6),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignContent: 'flex-end',
    paddingBottom: responsiveHeight(4),
  },
  titleContainer: { marginHorizontal: 20 },
  titleText: { paddingVertical: '2%' },
  dotsMargin: { marginHorizontal: '0.5%' },
  dotsContainer: {
    flexDirection: 'row',
    paddingVertical: responsiveHeight(3),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  activeDot: {
    backgroundColor: COLOR.Primary1,
    height: 8,
    width: 30,
    overflow: 'hidden',
    borderRadius: 50,
  },
  inActiveDot: {
    backgroundColor: COLOR.dark4,
    height: 8,
    width: 30,
    overflow: 'hidden',
    borderRadius: 50,
  },
});

export default Welcome3;
