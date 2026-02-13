import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { useSignInScreen } from './SignInScreenController.js'
import { commonStyle, CommonView, H4, H3, Valide, Label } from '../../../utils/common';
import { CheckBox, FignerScan, Sms, Emp, Phone, Eye, EyeSlash, FillCheckbox, FaceIdIcon, BiometricIcon } from '../../../assets/icons/index.js';
import CommonButton from '../../../components/CommonButton';
import { COLOR } from '../../../theme/theme';
import { FontSize, responsiveHeight, responsiveWidth } from '../../../utils/metrics';
import EmailVerificationModal from '../../../components/EmailVerificationModal.js'
import ForgotPasswordModal from '../../../components/ForgotPasswordModal.js'
import { font, GlobalFonts } from '../../../theme/typography.js';
import { AppLogo } from '../../../assets/images/index.js';
import BiometricModal from '../../../components/BiometricModal.js'
import { EmailIcon, EyeCloseIcon, EyeIcon, KeyIcon } from '../../../assets/svgs/index.js';
function SignInScreen() {
  const {
    t,
    Formdata,
    Validator,
    IsReSetmodalvisible,
    setIsReSetmodalvisible,
    ReSetemail,
    setReSetemail,
    ResetValidator,
    setFormdata,
    IsPassVisible,
    setIsPassVisible,
    isShowbiomatric,
    setisShowbiomatric,
    isForgotPasswordFetching,
    isChecked,
    setisChecked,
    heandleonSignin,
    BiometricLogin,
    heandleonforgot,
    FacelockLogin,
    isSigninFetching,
    isVisibleVerifiedModal,
    handleVerificationModal,
    isVerifiedFetching,
    navigateTerms,
    navigatePrivacyPolicy
  } = useSignInScreen();
  return (
    <CommonView>
      <ScrollView contentContainerStyle={styles.container}>
        <Image style={styles.appLogo} source={AppLogo} />
        <H3 style={styles.titleContainer}>{t('Button.Sign_In')}</H3>
        <View style={[styles.inputContainer, { borderColor: Formdata.email && Validator.current.errorMessages?.email ? COLOR.Red : COLOR.GrayBorder }]}>
          <EmailIcon/>
          <TextInput
            placeholder={t("placeholders.Enter_your_registered_email")}
            placeholderTextColor={COLOR.TextPlaceholder}
            cursorColor={COLOR.Gray}
            style={styles.input}
            onChangeText={value =>
              setFormdata({ ...Formdata, email: value })
            }
            value={Formdata.email}
          />
        </View>
        <Valide style={styles.valid}>
          {Validator.current.message('email', Formdata.email, 'required')}
        </Valide>

        <View style={[styles.inputContainer, { borderColor: Formdata.password && Validator.current.errorMessages.password ? COLOR.Red : COLOR.GrayBorder }]}>
          <KeyIcon/>
          <TextInput
            placeholder={t("placeholders.Enter_your_password")}
            secureTextEntry={IsPassVisible}
            placeholderTextColor={COLOR.TextPlaceholder}
            style={styles.input}
            cursorColor={COLOR.Gray}
            onChangeText={value =>
              setFormdata({ ...Formdata, password: value })
            }
            maxLength={15}
            value={Formdata.password}
          />
          <TouchableOpacity onPress={() => { setIsPassVisible(!IsPassVisible) }}>
            {IsPassVisible?<EyeCloseIcon/>:<EyeIcon/>}
          </TouchableOpacity>
        </View>
        <Valide style={styles.valid}>
          {Validator.current.message(
            'password',
            Formdata.password,
            'required',
          )}
        </Valide>
        <View style={styles.rowContainer}>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => setisChecked(!isChecked)}>
              <Image source={isChecked ? FillCheckbox : CheckBox} />
            </TouchableOpacity>
            <Text style={styles.rememberText}>{t("SignIn.Remember_Me")}</Text>
          </View>
          <TouchableOpacity style={styles.colmnCotainer} onPress={() => setIsReSetmodalvisible(!IsReSetmodalvisible)}>
            <Text style={styles.forgotText}>{t("Button.Forgot_password")}</Text>
            <View style={styles.lineContainer} />
          </TouchableOpacity>
        </View>

        <CommonButton
          loading={!isShowbiomatric && isSigninFetching}
          onPress={() => heandleonSignin()}
          title={t('Button.Sign_In')}
        />

        {/* <Text style={styles.or}>OR</Text>
          <TouchableOpacity style={styles.outlineBtn}>
            <Image source={Emp} />
            <Text style={styles.outlineText}>Sign in With Employee ID</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineBtn}>
            <Image source={Phone} />
            <Text style={styles.outlineText}>Sign in With Phone</Text>
          </TouchableOpacity> */}
        {isVisibleVerifiedModal &&
          <EmailVerificationModal
            visible={isVisibleVerifiedModal}
            onSubmit={handleVerificationModal}
            isVerifiedFetching={isVerifiedFetching}
          />}
        {IsReSetmodalvisible &&
          <ForgotPasswordModal
            visible={IsReSetmodalvisible}
            onClose={() => setIsReSetmodalvisible(!IsReSetmodalvisible)}
          />}
      </ScrollView>
      <BiometricModal
        visible={isShowbiomatric}
        onClose={() => setisShowbiomatric(false)}
        isSigninFetching={isSigninFetching}
        onBiometricPress={() =>
          Platform.OS === 'android'
            ? BiometricLogin()
            : FacelockLogin()
        }
        icon={Platform.OS === 'android' ? BiometricIcon : FaceIdIcon}
        title={
          Platform.OS === 'android'
            ? t('Button.LoginWithFigerprint')
            : t('Button.LoginWithFaceId')
        }
      />
    <View style={styles.policyContainer}>
    <Text
      style={styles.linkText}
      onPress={() => navigateTerms()}
    >
      Terms of Use
    </Text>
    <Text style={styles.policyText}>and</Text>
    <Text
      style={styles.linkText}
      onPress={() => navigatePrivacyPolicy()}
    >
      Privacy Policy
    </Text>
</View>
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
    paddingTop: responsiveHeight(10),
  },
  appLogo: {
    width: responsiveWidth(50),
    height: responsiveHeight(20),
    alignSelf: 'center',
    resizeMode: 'contain',
    marginBottom: responsiveHeight(4),
  },
  titleContainer: {
    marginBottom: responsiveHeight(3),
  },
  biometricIcon: {
    width: 26,
    height: 26,
    tintColor: '#FFFFFF',
  },

  biometricText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },

  lineContainer: { backgroundColor: COLOR.TextPlaceholder, height: 1.5 },
  biometricContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLOR.Secondary,
    marginBottom: 6,
  },
  icon: { width: 25, height: 25, tintColor: COLOR.Secondary },
  valid: {
    color: COLOR.Red,

    marginHorizontal: 10,
    marginTop: 4,
    marginBottom: 10,
    alignSelf: 'flex-start'
  },
  subtitle: {
    fontSize: FontSize.Font14,
    color: COLOR.Gray,
    marginBottom: 35,
  },

  inputContainer: {
    width: '100%',
    height: 60,
    borderWidth: 1.2,
    borderColor: COLOR.GrayBorder,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
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
    fontFamily: font('Medium'),
    fontWeight: '500',
    fontSize: FontSize.Font16,
    color: COLOR.Secondary
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  colmnCotainer: {
    flexDirection: 'column',
    // alignItems: 'center',
    marginBottom: 25,
  },
  rowsContainer: {
    flexDirection: "row",
    marginHorizontal: 30,
    height: 50,
    alignItems: "center",
  },
  colContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  biometricCard: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 26,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },


  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rememberText: {
    marginLeft: 6,
    fontFamily: font('Medium'),
    fontWeight: '500',
    fontSize: FontSize.Font16,
    color: COLOR.TextPlaceholder,
    lineHeight: 22
  },

  forgotText: {
    fontFamily: font('Medium'),
    fontWeight: '500',
    fontSize: FontSize.Font16,
    color: COLOR.TextPlaceholder,
    lineHeight: 22
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
  policyContainer: {
  paddingBottom: 25,
  paddingHorizontal: 10,
  backgroundColor:COLOR.White1,
  justifyContent:'center',
  alignItems: 'center',
  flexDirection:'row'
},

policyText: {
  ...GlobalFonts.subtitleText,
  fontSize: FontSize.Font14,
  color: COLOR.TextPlaceholder,
  textAlign: 'center',
  paddingHorizontal:10,
  lineHeight: 20,
},

linkText: {
  ...GlobalFonts.subtitleText,
  fontSize:FontSize.Font14,
  color: COLOR.Black1,
  fontWeight: '600',
  textDecorationLine: 'underline',
},
});

export default SignInScreen;
