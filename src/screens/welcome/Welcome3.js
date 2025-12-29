import React from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import CommonButton from '../../components/CommonButton';
import { welcome3Image } from '../../assets/images/index';
import { COLOR } from '../../theme/theme';
import { H5, H4, H3, CommonView } from '../../utils/common';
import { useWelcome } from '../welcome/WelcomeController.js';
import { responsiveHeight, responsiveWidth } from '../../utils/metrics.js';
import { GlobalFonts } from '../../theme/typography.js';
import { WelCheck } from '../../assets/icons/index.js';

const Welcome3 = () => {
  const {
    t,
    navigateToSignIn,
  } = useWelcome();
   const Subcomponent = ({ title, desc }) => {
      return (
        <View style={styles.subContainer}>
          {/* <H4 style={styles.subtitleText}>
            {title}
          </H4> */}
          <Image source={WelCheck}/>
          <H5 style={styles.descText}>{title}</H5>
        </View>
      )
    }
  return (
       <CommonView statusBarColor={COLOR.Primary1}>
      <View style={styles.container}>
        <View style={styles.welcomeImage}>
          <Image style={styles.welcomeImage} source={welcome3Image} />
        </View>
        <View style={styles.dotsContainer}>
          <View style={styles.inActiveDot} />
          <View style={[styles.inActiveDot,styles.dotsMargin]} />
          <View style={styles.activeDot} />
        </View>
        <View style={styles.titleContainer}>
          <H3 style={styles.titleText}>
            {t('Welcome2.title')}
          </H3>
          <Subcomponent  title={t('Welcome2.dis1')} />
          <Subcomponent title={t('Welcome2.dis2')} />
          <Subcomponent title={t('Welcome2.dis3')} />
        </View>
        <View style={styles.buttonContainer}>
          <CommonButton
            containerStyle={styles.buttonInnerContainer}
            title={t('Button.Sign_In')}
            onPress={navigateToSignIn}
          />
        </View>
      </View>
    </CommonView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20
  },
  buttonInnerContainer: {
    width: responsiveWidth(90)
  },

  descText: {
    color: COLOR.Gray,
    paddingTop:4,
    paddingLeft:responsiveWidth(2)
  },

  welcomeImage: {
    alignSelf: 'center',
    resizeMode: 'contain',
    paddingTop: responsiveHeight(14),
    paddingBottom:responsiveHeight(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitleText: {
    color: COLOR.Secondary,
    ...GlobalFonts.subtitle,
    textAlign: 'center'
  },
  subContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'center',
    paddingBottom:responsiveHeight(1)
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignContent: 'flex-end',
    paddingBottom: responsiveHeight(4),
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: { paddingVertical: '2%', textAlign: 'center',paddingBottom:responsiveHeight(2) },
  dotsMargin: { marginHorizontal: '1%' },
  dotsContainer: {
    flexDirection: 'row',
    paddingVertical: responsiveHeight(3),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  activeDot: {
    backgroundColor: COLOR.Secondary,
    height: 10,
    width: 30,
    overflow: 'hidden',
    borderRadius: 50,
  },
  inActiveDot: {
    backgroundColor: COLOR.dark4,
    height: 10,
    width: 10,
    overflow: 'hidden',
    borderRadius: 50,
  },
});

export default Welcome3;
