import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from 'react-native';
import { COLOR } from '../theme/theme';
import { useTranslation } from 'react-i18next';
import { CommonTextInput } from './CommonTextInput';
import CommonButton from './CommonButton';


const ForgotPasswordModal = ({ resetValidator, resetEmail, visible, onClose, heandleonforgot, loading, setResetEmail }) => {
  const { t, i18n } = useTranslation();
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => onClose()}>
      <TouchableOpacity
        style={styles.modalContainer}
        onPress={() => onClose()}>

        <View
          style={styles.mainCotainer}>
          <View style={{ marginBottom: 10 }}>
            <Text
              style={styles.forgotText}>
              {t('SignIn.Reset_Password')}
            </Text>
          </View>
          <View style={{ position: 'relative' }}>
            <Text style={{ fontWeight: '600' }}>
              {t('SignIn.Email_Address')}
            </Text>
            <View style={styles.inputContainer}>
              <CommonTextInput
                value={resetEmail}
                cursorColor={COLOR.Black1}
                onChangeText={value => setResetEmail(value)}
                placeholder={t('placeholders.Enter_your_email')}
                placeholderTextColor={COLOR.dark4}
                autoCapitalize="none"
                maxLength={100}
                errorMassage={resetValidator.current.message(
                  'email',
                  resetEmail,
                  'required|email',
                )}
              />
            </View>
          </View>
          <CommonButton
            onPress={heandleonforgot}
            title={t('Button.Forgot_password')}
            loading={loading}
            gradientColors={[COLOR.grediant1, COLOR.grediant2]}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLOR.background2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCotainer: {
    backgroundColor: COLOR.White1,

    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: Dimensions.get('window').width - 40,
  },
  forgotText: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: COLOR.Black1,
  }
})

export default ForgotPasswordModal;