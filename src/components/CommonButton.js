import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLOR } from '../theme/theme';
import { responsiveHeight } from '../utils/metrics';
import { FontSize } from '../utils/metrics';

const CommonButton = ({
  onPress,
  title,
  containerStyle,
  textStyle,
  gradientColors,
  loading,
}) => {
  const ButtonContent = () => (
    <View style={styles.mainText}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      {loading && (
        <ActivityIndicator
          color={COLOR.White1}
          style={{ marginLeft: 10 }}
        />
      )}
    </View>
  );

  // if (gradientColors) {
  //   return (
  //     <TouchableOpacity
  //       activeOpacity={0.8}
  //       disabled={loading}
  //       onPress={onPress}
  //       style={[styles.containerStyle, containerStyle]}
  //     >
  //       <LinearGradient
  //         colors={gradientColors}
  //         style={styles.gradient}
  //       >
  //         <ButtonContent />
  //       </LinearGradient>
  //     </TouchableOpacity>
  //   );
  // }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={loading}
      onPress={onPress}
      style={[styles.containerStyle, containerStyle]}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
    height: responsiveHeight(7),
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor:COLOR.Secondary
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: COLOR.White1,
    fontWeight: '500',
    fontSize: FontSize.Font18,
    lineHeight: 20,
  },
});

export default CommonButton;
