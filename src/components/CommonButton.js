import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { COLOR } from '../theme/theme';
import { responsiveHeight, responsiveWidth } from '../utils/metrics';
import {H5} from '../utils/common'
const CommonButton = props => {
  const { onPress, title, containerStyle, textStyle } = props;
  return (
    <TouchableOpacity
      style={[styles.containerStyle, containerStyle]}
      onPress={onPress}
    >
      <H5 style={[styles.buttonText,textStyle]}>{title}</H5>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    width: responsiveWidth(90),
    marginHorizontal: responsiveHeight(10),
    height: responsiveHeight(7),
    backgroundColor: COLOR.Primary1,
    borderRadius: 40,
  
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLOR.White1,
      paddingTop:'2%',
      fontWeight:'500'
  },
});
export default CommonButton;
