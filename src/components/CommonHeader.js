import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLOR } from '../theme/theme';
import { CommonView } from '../utils/common';

const CommonHeader = ({ title, subtitle, rightIcon }) => {
  return (
   <CommonView statusBarColor={COLOR.OffRed} >
    <LinearGradient
      colors={[COLOR.LightOrange, COLOR.LightYellow]}
      style={styles.container}
    >
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {rightIcon && (
        <Image source={rightIcon} style={styles.icon} resizeMode="contain" />
      )}
    </LinearGradient>
    </CommonView>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({
  container: {
    height: 160,
    paddingTop:30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
    // justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLOR.White1,
  },
  subtitle: {
    fontSize: 16,
    color: COLOR.White1,
    marginTop: 6,
    opacity: 0.9,
  },
  icon: {
    width: 90,
    height: 90,
  },
});
