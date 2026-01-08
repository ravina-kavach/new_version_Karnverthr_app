import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { COLOR } from '../theme/theme';

const BiometricModal = ({
  visible,
  onClose,
  isSigninFetching,
  onBiometricPress,
  title,
  icon,
}) => {

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={onBiometricPress}>
            <View style={styles.card}>
              <View style={styles.iconWrap}>
                {isSigninFetching ? (
                  <ActivityIndicator size="large" color={COLOR.Primary1} />
                ) : (
                  <Image source={icon} style={styles.icon} />
                )}
              </View>

              <Text style={styles.text}>{title}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default BiometricModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom:50
  },

  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 28,
    alignItems: 'center',
  },

  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  icon: {
    width: 26,
    height: 26,
    tintColor: '#fff',
  },

  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
});
