import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { CommonView, H4 } from '../../../utils/common';
import { useTranslation } from 'react-i18next';
import { CheckBox, FignerScan, Sms, Emp, Phone } from '../../../assets/icons/index.js';
import CommonButton from '../../../components/CommonButton';
import { COLOR } from '../../../theme/theme';
import { responsiveHeight, responsiveWidth } from '../../../utils/metrics';

export default function SignInScreen() {
  const { t } = useTranslation();
  // const {visibleModal}= useSig
  return (
    <CommonView>
      <ScrollView contentContainerStyle={styles.container}>
        <H4 style={styles.titleContainer}>{t('Button.Sign_In')}</H4>
        <View style={styles.inputContainer}>
          <Image source={Sms} />
          <TextInput
            placeholder={t("placeholders.Enter_your_registered_email")}
            placeholderTextColor={COLOR.TextSecondary}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Image source={FignerScan} />
          <TextInput
            placeholder={t("placeholders.Enter_your_password")}
            placeholderTextColor={COLOR.TextSecondary}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.row}>
            <Image source={CheckBox} />
            <Text style={styles.rememberText}>{t("SignIn.Remember_Me")}</Text>
          </View>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.forgotText}>{t("Button.Forgot_password")}</Text>
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity style={styles.signInBtn}> */}
        <CommonButton
          onPress= {()=>{}}
          title={t('Button.Sign_In')}
          gradientColors={[COLOR.grediant1, COLOR.grediant2]}
        />

        <Text style={styles.or}>OR</Text>

      <TouchableOpacity style={styles.outlineBtn}>
        <Image source={Emp} />
        <Text style={styles.outlineText}>Sign in With Employee ID</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.outlineBtn}>
        <Image source={Phone} />
        <Text style={styles.outlineText}>Sign in With Phone</Text>
      </TouchableOpacity>
      </ScrollView>
    </CommonView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White1,
    paddingHorizontal: 25,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: responsiveHeight(3),
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 35,
  },

  inputContainer: {
    width: '100%',
    height: 55,
    marginTop: responsiveHeight(2),
    borderWidth: 1.2,
    borderColor: '#DCDCDC',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 18,
  },

  leftIcon: {
    marginRight: 10,
    backgroundColor: 'green',
  },

  rightIcon: {
    position: 'absolute',
    right: 15,
  },

  input: {
    flex: 1,
    paddingHorizontal: responsiveWidth(2),
    fontSize: 15,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rememberText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#444',
  },

  forgotText: {
    fontSize: 14,
    color: '#FF6E83',
    fontWeight: '600',
  },

  signInBtn: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 20,
  },

  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  or: {
    fontSize: 15,
    color: '#888',
    marginVertical: 18,
  },

  outlineBtn: {
    width: '100%',
    height: 52,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FF6A8A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 8,
  },

  outlineText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF6A8A',
  },

  bottomText: {
    marginTop: 20,
    fontSize: 14,
    color: '#444',
  },
});
