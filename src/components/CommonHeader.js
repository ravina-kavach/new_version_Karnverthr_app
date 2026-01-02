import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { COLOR } from '../theme/theme';
import { CommonView } from '../utils/common';
import { BackIcon } from '../assets/svgs';
import { useNavigation } from '@react-navigation/native';
import { responsiveHeight } from '../utils/metrics';

const CommonHeader = ({
  title = '',
  leftIcon,
  leftIconPress,
  rightIcon,
  rightIconPress,
}) => {
  const navigation = useNavigation();

  return (
    <CommonView>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.left}
          onPress={leftIconPress || (() => navigation.goBack())}
        >
          {leftIcon || <BackIcon height={40} width={40} />}
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.right} onPress={rightIconPress}>
          {rightIcon || null}
        </TouchableOpacity>

      </View>
    </CommonView>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'android'? responsiveHeight(10): responsiveHeight(5),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GrayBorder,
    paddingBottom:Platform.OS ==='android'? 0 : 20
  },
  left: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
