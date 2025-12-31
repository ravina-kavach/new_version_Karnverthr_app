import React from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import CommonButton from '../../components/CommonButton';
import { welcome2Image } from '../../assets/images/index';
import { COLOR } from '../../theme/theme';
import { H4, H3, CommonView, H5 } from '../../utils/common';
import { useWelcome } from '../welcome/WelcomeController.js';
import { responsiveHeight, responsiveWidth } from '../../utils/metrics.js';
import { GlobalFonts } from '../../theme/typography.js';
const Welcome2 = () => {
  const {
    t,
    navigateToWelcome3,
  } = useWelcome();
  const Subcomponent = ({ title, desc }) => {
    return (
      <View style={styles.subContainer}>
        <H4 style={styles.subtitleText}>
          {title}
        </H4>
        <H5 style={styles.descText}>{desc}</H5>
      </View>
    )
  }
  return (
    <CommonView statusBarColor={COLOR.Primary1}>
      <View style={styles.container}>
          <Image style={styles.welcomeImage} source={welcome2Image} />
        <View style={styles.dotsContainer}>
          <View style={styles.inActiveDot} />
          <View style={[styles.activeDot, styles.dotsMargin]} />
          <View style={styles.inActiveDot} />
        </View>
        <View style={styles.titleContainer}>
          <H3 style={styles.titleText}>
            {t('Welcome2.title')}
          </H3>
          <Subcomponent title={t('Welcome2.subtitle1')} desc={t('Welcome2.dis1')} />
          <Subcomponent title={t('Welcome2.subtitle2')} desc={t('Welcome2.dis2')} />
          <Subcomponent title={t('Welcome2.subtitle3')} desc={t('Welcome2.dis3')} />
        </View>
        <View style={styles.buttonContainer}>
          <CommonButton
            containerStyle={styles.buttonInnerContainer}
            title={t('Button.Continue')}
            onPress={navigateToWelcome3}
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
    color: COLOR.Gray
  },

  welcomeImage: {
    alignSelf: 'center',
    resizeMode: 'contain',
   marginTop:responsiveHeight(10),
    marginBottom:responsiveHeight(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitleText: {
    color: COLOR.Secondary,
    ...GlobalFonts.subtitle,
    textAlign: 'center'
  },
  subContainer:{
    paddingBottom:responsiveHeight(1.5)
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

export default Welcome2;
