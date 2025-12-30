import React, { useState, useRef } from 'react';
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
import SimpleReactValidator from 'simple-react-validator';
import { showMessage } from 'react-native-flash-message';
import CommonButton from './CommonButton';
import Config from 'react-native-config';
import { Eye, EyeSlash } from '../assets/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GlobalFonts } from '../theme/typography';
import { FontSize } from '../utils/metrics';
const ForgotPasswordModal = ({
  visible,
  onClose,
}) => {

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [resetEmail, setResetEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tempIsPassVisible, setTempIsPassVisible] = React.useState(true);
  const [newIsPassVisible, setNewIsPassVisible] = React.useState(true);
  const [comIsPassVisible, setComIsPassVisible] = React.useState(true);
  const [, forceUpdate] = useState(0);

  const resetValidator = useRef(
    new SimpleReactValidator({
      autoForceUpdate: { forceUpdate },
    })
  );

  const onSendTempPassword = async () => {
    if (!resetValidator.current.allValid()) {
      resetValidator.current.showMessages();
      forceUpdate(n => n + 1)
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('USER_TOKEN');

      const response = await fetch(
        `${Config.BASE_URL}api/forgot-password/request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: resetEmail }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Failed to send password');
      }

      showMessage({
        message: 'Temporary password sent to your email',
        type: 'success',
      });

      setStep(2);
    } catch (error) {
      showMessage({
        message: error.message,
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async () => {

    if (!tempPassword || !newPassword || !confirmPassword) {
      showMessage({
        message: 'All fields are required',
        type: 'danger',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage({
        message: 'Passwords do not match',
        type: 'danger',
      });
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('USER_TOKEN');

      const response = await fetch(
        `${Config.BASE_URL}api/forgot-password/confirm`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            email: resetEmail,
            temp_password: tempPassword,
            new_password: newPassword,
            confirm_password: confirmPassword
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Password reset failed');
      }

      showMessage({
        message: 'Password reset successful',
        type: 'success',
      });

      handleClose();
    } catch (error) {
      showMessage({
        message: error.message,
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose()
    setStep(1);
    setResetEmail('');
    setTempPassword('');
    setNewPassword('');
    setConfirmPassword('');
    resetValidator.current.hideMessages();
    forceUpdate(n => n + 1);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      statusBarTranslucent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={handleClose}
      >
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={30}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}
        >

          <TouchableOpacity activeOpacity={1}>
            <View style={styles.mainCotainer}>

              <Text style={styles.forgotText}>
                {step === 1
                  ? t('SignIn.Reset_Password')
                  : t('SignIn.SetNewPAssword')}
              </Text>

              {step === 1 && (
                <>

                  <Text style={styles.description}>
                    {t('messages.password_reset')}
                  </Text>

                  <View style={styles.inputContainer}>
                    <CommonTextInput
                      value={resetEmail}
                      onChangeText={setResetEmail}
                      placeholder={t('placeholders.Enter_your_email')}
                      placeholderTextColor={COLOR.dark4}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      maxLength={100}
                      errorMassage={
                        resetValidator.current.message(
                          'email',
                          resetEmail,
                          'required|email'
                        )
                      }
                    />
                  </View>

                  <View style={styles.buttonContainer}>
                    <CommonButton
                      title={t('Button.SendTemporaryPassword')}
                      onPress={onSendTempPassword}
                      loading={loading}
                      gradientColors={[COLOR.grediant1, COLOR.grediant2]}
                    />
                  </View>
                </>
              )}

              {step === 2 && (
                <>                   
                  <View style={styles.inputContainer}>
                    <CommonTextInput
                      value={tempPassword}
                      onChangeText={setTempPassword}
                      placeholder={t("placeholders.Enter_temporary_password")}
                      secureTextEntry={tempIsPassVisible}
                      rightIcon={tempIsPassVisible ? EyeSlash : Eye}
                      rightIconPress={() => setTempIsPassVisible(!tempIsPassVisible)}
                    />
                  </View>

                  <View style={styles.mainTextContainer}>
                    <View style={styles.inputContainer}>
                      <CommonTextInput
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder={t("placeholders.Enter_new_password")}
                        secureTextEntry={newIsPassVisible}
                        rightIcon={newIsPassVisible ? EyeSlash : Eye}
                        rightIconPress={() => setNewIsPassVisible(!newIsPassVisible)}
                      />
                    </View>
                  </View>

                  <View style={styles.mainTextContainer}>
                    <View style={styles.inputContainer}>
                      <CommonTextInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder={t("placeholders.Enter_confirm_password")}
                        secureTextEntry={comIsPassVisible}
                        rightIcon={comIsPassVisible ? EyeSlash : Eye}
                        rightIconPress={() => setComIsPassVisible(!comIsPassVisible)}
                      />
                    </View>
                  </View>

                  <View style={styles.buttonContainer}>
                    <CommonButton
                      title={t('SignIn.Reset_Password')}
                      onPress={onResetPassword}
                      loading={loading}

                    />
                  </View>

                  <TouchableOpacity
                    style={{ marginTop: 15 }}
                    onPress={() => setStep(1)}
                  >
                    <Text style={styles.backText}>
                      {t('button.BackToMail')}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </TouchableOpacity>
    </Modal>
  );
};

export default ForgotPasswordModal;


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
    ...GlobalFonts.small,
    color: COLOR.Secondary,
    marginVertical: 12,
  },
  mainCotainer: {
    backgroundColor: COLOR.White1,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: Dimensions.get('window').width * 0.9,
    maxHeight: Dimensions.get('window').height * 0.8,

    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },

  forgotText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: COLOR.Black1,
    marginBottom: 20,
  },

  label: {
    fontWeight: '600',
    color: COLOR.Black1,
    marginBottom: 5,
  },

  inputContainer: {
    width: '100%',
    marginTop: 10,
  },

  buttonContainer: {
    paddingTop: 20,
  },

  mainTextContainer: {
    paddingTop: 15
  },

  backText: {
    textAlign: 'center',
    fontSize:FontSize.Font16,
    color: COLOR.Secondary,
    fontWeight: '500',
  },
});
