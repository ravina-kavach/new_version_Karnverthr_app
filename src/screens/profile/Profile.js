import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { CommonView } from "../../utils/common";
import CommonHeader from "../../components/CommonHeader";
import GreetingHeader from "../../components/GreetingHeader";
import {
  ProfileIcon,
  ChangePwd,
  DepartIcon,
  EmryIcon,
  ReportMnrIcon,
  RoleIcon,
  RightArrow,
  JoiningDateIcon,
  TenureIcon
} from '../../assets/svgs/index';
import { GlobalFonts } from "../../theme/typography";
import { COLOR } from "../../theme/theme";
import { FontSize, responsiveHeight } from "../../utils/metrics";
import useProfile from './ProfileController';
import ImagePickerSheet from '../../components/ImagePickerSheet';
import ForgotPasswordModal from "../../components/ForgotPasswordModal";
import DeviceInfo from "react-native-device-info";

const ProfileItem = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.row} activeOpacity={1} onPress={onPress}>
    <View style={styles.icon}>{icon}</View>

    <View style={{ flex: 1 }}>
      <Text style={styles.rowTitle} numberOfLines={1}>{title}</Text>
      {subtitle ? (
        <Text style={styles.rowSub} numberOfLines={1}>{subtitle}</Text>
      ) : null}
    </View>

    {onPress && <RightArrow />}
  </TouchableOpacity>
);

export default function Profile() {
  const {
    UsersigninData,
    navigationEditProfile,
    navigationEmergencyDetails,
    UserDetailsData,
    handleOnLogout,
    handleProfileUpload,
    pickerVisible,
    setPickerVisible,
    avatar,
    IsReSetmodalvisible,
    setIsReSetmodalvisible
  } = useProfile();

  const safeValue = (value) => value ?? "—";

  return (
    <CommonView>
      <CommonHeader title="Profile" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profilecard}>
          <GreetingHeader
            editProfile={pickerVisible}
            containerStyle={styles.headerContainer}
            screenName={"editProfile"}
            desc={UsersigninData?.email ?? ""}
            avatar={avatar}
            onAvatarPress={() => setPickerVisible(true)}
          />
        </View>

        {/* Account & Identity */}
        <View style={styles.card}>
          <Text style={styles.section}>Account & Identity</Text>

          <ProfileItem
            icon={<ProfileIcon />}
            title="Edit Profile"
            subtitle="Change name, address, contact"
            onPress={navigationEditProfile}
          />

          <ProfileItem
            icon={<ChangePwd />}
            title="Change Password"
            subtitle="Change or update password"
            onPress={() => setIsReSetmodalvisible(!IsReSetmodalvisible)}
          />

          <ProfileItem
            icon={<EmryIcon />}
            title="Emergency Contact"
            subtitle="Change or update emergency contact"
            onPress={navigationEmergencyDetails}
          />
        </View>

        {/* Professional Information */}
        <View style={styles.card}>
          <Text style={styles.section}>Professional Information</Text>

          <ProfileItem
            icon={<RoleIcon />}
            title="Current Role"
            subtitle={safeValue(UserDetailsData?.job_id?.[1])}
          />

          <ProfileItem
            icon={<DepartIcon />}
            title="Department"
            subtitle={safeValue(UserDetailsData?.department_id?.[1])}
          />

          <ProfileItem
            icon={<ReportMnrIcon />}
            title="Reporting Manager"
            subtitle={safeValue(UserDetailsData?.reporting_manager_id?.[1])}
          />
        </View>

        {/* Employment History */}
        <Text style={styles.section}>Employment History</Text>
        <View style={styles.card}>
          <ProfileItem
            icon={<JoiningDateIcon />}
            title="Joining Date"
            subtitle={safeValue(UserDetailsData?.joining_date)}
          />

          <ProfileItem
            icon={<TenureIcon />}
            title="Job tenure"
            subtitle={
              UserDetailsData?.total_experiance
                ? `${UserDetailsData.total_experiance} Years`
                : "—"
            }
          />
        </View>

        {/* Logout */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleOnLogout}>
            <Text style={styles.text}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Picker */}
      <ImagePickerSheet
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onResult={handleProfileUpload}
      />

      {/* Reset Password Modal */}
      {IsReSetmodalvisible && (
        <ForgotPasswordModal
          visible={IsReSetmodalvisible}
          onClose={() => setIsReSetmodalvisible(false)}
        />
      )}

      {/* App Version */}
      <Text style={styles.verisonText}>
        {`version : ${DeviceInfo.getVersion()}`}
      </Text>
    </CommonView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F4F4F5",
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  profilecard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingBottom: 16,
    marginBottom: 20,
  },
  headerContainer: {
    marginTop: responsiveHeight(3),
  },
  section: {
    ...GlobalFonts.subtitle,
    fontWeight: "600",
    color: COLOR.Black1,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  icon: {
    width: 35,
    height: 35,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.dark5,
    marginRight: 12,
  },
  rowTitle: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font16,
  },
  rowSub: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font16,
    color: COLOR.Placeholder,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.Black1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: FontSize.Font18,
    fontWeight: '500',
    color: COLOR.Black1,
  },
  verisonText: {
    backgroundColor: COLOR.Primary1,
    fontSize: FontSize.Font16,
    textAlign: 'center',
    fontWeight: '500',
    paddingVertical: 20,
    color: COLOR.TextPlaceholder,
  },
});
