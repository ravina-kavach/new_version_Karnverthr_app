import React from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import CommonButton from '../../components/CommonButton';
import { welcome1Image } from '../../assets/images/index';
import { COLOR } from '../../theme/theme';
import { H5, H4, H3, CommonView } from '../../utils/common';
import { useWelcome } from '../welcome/WelcomeController.js';
import { responsiveHeight, responsiveWidth } from '../../utils/metrics.js';
import { GlobalFonts } from '../../theme/typography.js';

const Welcome1 = () => {
  const {
    t,
    navigateToWelcome2,
  } = useWelcome();
  return (
    <CommonView statusBarColor={COLOR.Primary1}>
      <View style={styles.container}>
        <View style={styles.welcomeImage}>
          <Image style={styles.welcomeImage} source={welcome1Image} />
        </View>
        <View style={styles.dotsContainer}>
          <View style={styles.activeDot} />
          <View style={[styles.inActiveDot, styles.dotsMargin]} />
          <View style={styles.inActiveDot} />
        </View>
         <View style={styles.titleContainer}>
              <H3 style={styles.titleText}>
                {t('Welcome1.title')}
              </H3>
              <H4 style={styles.subtitleText}>
                {t('Welcome1.subtitle')}
              </H4>
          </View>
        <View style={styles.buttonContainer}>
            <CommonButton
              containerStyle={styles.buttonInnerContainer}
              title={t('Button.Continue')}
              // gradientColors={[COLOR.grediant1, COLOR.grediant2]}
              onPress={navigateToWelcome2}
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
    justifyContent:'space-around',
    paddingHorizontal: 20
  },
  buttonInnerContainer: {
    width: responsiveWidth(90)
  },

  welcomeImage: {
    alignSelf: 'center',
     resizeMode:'contain',
    paddingTop: responsiveHeight(14),
    paddingBottom:responsiveHeight(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitleText: {
    color: COLOR.Gray,
    ...GlobalFonts.normalText,
    textAlign:'center'
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignContent: 'flex-end',
    paddingBottom: responsiveHeight(4),
  },
  titleContainer: { 
    justifyContent:'center',
    alignItems:'center'
   },
  titleText: { paddingVertical: '2%',textAlign:'center' },
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

export default Welcome1;
