import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import CommonButton from './CommonButton';
import { COLOR } from '../theme/theme';
import { useTranslation } from 'react-i18next';
import { CommonTextInput } from '../components/CommonTextInput';
import SimpleReactValidator from 'simple-react-validator';

const EmailVerificationModal = ({ visible, onSubmit, onResend }) => {
  const { t, i18n } = useTranslation();
  const [textInput, setTextInput] = React.useState('');
  const [, forceUpdate] = React.useState(0);
  
  const Validator = React.useRef(
    new SimpleReactValidator({
      validators: {
        uuid: {
          message: 'Invalid key format.',
          rule: (val, params, validator) => {
            return validator.helpers.testRegex(
              val,
              /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
            );
          },
        },
      },
    }),
  );


  const onButtonPress = () => {
    if (Validator.current.allValid()) {
      onSubmit(textInput)
      Validator.current.hideMessages();
    } else {
      Validator.current.showMessages();
      forceUpdate(x => x + 1);
    }
  };

  return (
    <Modal
      statusBarTranslucent
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconWrapper}>
            <Text style={styles.icon}>✉️</Text>
          </View>
          <Text style={styles.title}>Email Verification Sent!</Text>

          <Text style={styles.description}>
            A verification code will be sent to the email{'\n'}
            for your account verification process.
          </Text>
          <View style={styles.otpContainer}>
            <CommonTextInput
              value={textInput}
              onChangeText={(value)=>setTextInput(value)}
              placeholder={"Enter your unique key"}
              errorMassage={Validator.current.message(
                'key',
                textInput,
                'required|uuid',
              )}
            />
          </View>

          <CommonButton
            onPress={() => onButtonPress()}
            title={t('Button.Submit')}
            gradientColors={[COLOR.grediant1, COLOR.grediant2]}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#FF9E9E',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    color: '#111',
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    color: COLOR.TextPrimary,
    marginVertical: 12,
    lineHeight: 18,
  },
  email: {
    fontWeight: '600',
    color: '#111',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  otpBox: {
    width: 42,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 4,
  },
  resendText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  resend: {
    color: '#7B4DFF',
    fontWeight: '600',
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default EmailVerificationModal;
