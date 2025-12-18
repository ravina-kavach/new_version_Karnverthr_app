import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { COLOR } from '../theme/theme';
import { responsiveHeight, responsiveWidth } from '../utils/metrics';
import LinearGradient from 'react-native-linear-gradient';
import { FontSize } from '../utils/metrics';
const CommonButton = props => {
  const { onPress, title, containerStyle, textStyle, gradientColors } = props;
  return (
    <>
      {gradientColors ? (
        <LinearGradient colors={gradientColors} style={[styles.containerStyle, containerStyle]}>
          <TouchableOpacity
            activeOpacity={0.5}
    
            onPress={() => onPress()}
          >
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
          </TouchableOpacity>
        </LinearGradient>
      ) : (
        <TouchableOpacity
          activeOpacity={0.5}
          style={[styles.containerStyle, containerStyle]}
          onPress={() => onPress()}
        >
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
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
    alignSelf:'center',
    textAlign:'center',
    fontWeight: '500',
    fontSize: FontSize.Font18,
    lineHeight: 20,
  },
});
export default CommonButton;
