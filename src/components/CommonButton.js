import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View, ActivityIndicator } from 'react-native';
import { COLOR } from '../theme/theme';
import { responsiveHeight, responsiveWidth } from '../utils/metrics';
import LinearGradient from 'react-native-linear-gradient';
import { FontSize } from '../utils/metrics';
const CommonButton = props => {
  const { onPress, title, containerStyle, textStyle, gradientColors, loading } = props;
  return (
    <>
      {gradientColors ? (
        <LinearGradient colors={gradientColors} style={[styles.containerStyle, containerStyle]}>
          <TouchableWithoutFeedback
            onPress={() => onPress()}
            disabled={loading}
          >
            <View style={styles.mainText}>
              <Text style={[styles.buttonText, textStyle]}>{title}</Text>
              {loading && (
                <ActivityIndicator
                  animating={loading}
                  color={COLOR.White1}
                  style={{ marginLeft: 10 }}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </LinearGradient>
      ) : (
        <TouchableWithoutFeedback
          activeOpacity={0.5}
          style={[styles.containerStyle, containerStyle]}
          onPress={() => onPress()}
        >
          <View style={styles.mainText}>
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
          {loading && (
            <ActivityIndicator
              animating={loading}
              color={COLOR.White1}
              style={styles.loaderContainer}
            />
          )}
          </View>
        </TouchableWithoutFeedback>
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
  loaderContainer: {
    marginLeft: 10
  },
  mainText: { flexDirection: 'row' },
  buttonText: {
    color: COLOR.White1,
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: FontSize.Font18,
    lineHeight: 20,
  },
});
export default CommonButton;
