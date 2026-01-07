import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { CommonView } from "../../utils/common";
import CommonHeader from "../../components/CommonHeader";
import GreetingHeader from "../../components/GreetingHeader";
import {
  ProfileIcon,
  ChangePwd,
  DepartIcon,
  EmryIcon,
  GovIcon,
  EditIcon,
  ReportMnrIcon,
  RoleIcon,
  RightArrow,
} from '../../assets/svgs/index'
import { GlobalFonts } from "../../theme/typography";
import { COLOR } from "../../theme/theme";
import { FontSize } from "../../utils/metrics";
import useProfile from './ProfileController'

const ProfileItem = ({ icon, title, subtitle }) => (
  <View style={styles.row}>
    <View style={styles.icon}>
      {icon}
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.rowTitle}>{title}</Text>
      {subtitle && <Text style={styles.rowSub}>{subtitle}</Text>}
    </View>
    <TouchableOpacity activeOpacity={1}>
      <RightArrow />
    </TouchableOpacity>
  </View>
);

export default function Profile() {
  const { UsersigninData } = useProfile()
  // console.log("UsersigninData===>",UsersigninData)
  // { status: 'success', 
  //   message: 'You are logged in as an Employee User. Plan is active.', 
  //   user_id: 3138, 
  //   email: 'kevaltest@gmail.com', 
  //   full_name: 'Keval Testing', 
  //   user_role: 'EMPLOYEE_RELATED_OWN_USER', 
  //   plan_status: 'ACTIVE', 
  //   is_client_employee_user: true, 
  //   employee_id: 16626, 
  //   admin_user_id: 3145 
  // }
  return (
    <CommonView>
      <CommonHeader title="Profile" />
      <ScrollView style={styles.container}>
        <View style={styles.profilecard}>
          <GreetingHeader screenName={"editProfile"} desc={UsersigninData.email} />
        </View>

        {/* Account & Identity */}
        <View style={styles.card}>
          <Text style={styles.section}>Account & Identity</Text>
          <ProfileItem icon={<ProfileIcon />} title="Edit Profile" subtitle="Change name, photo, contact" />
          <ProfileItem icon={<GovIcon />} title="Government ID" subtitle="View Aadhaar, request update" />
          <ProfileItem icon={<ChangePwd />} title="Change Password" subtitle="Change or update password" />
        </View>

        {/* Professional Info */}
        {/* <Text style={styles.section}>Professional Information</Text>
        <View style={styles.card}>
          <ProfileItem title="Current Role" subtitle="Developer" />
          <ProfileItem title="Department" subtitle="Creative Administrative" />
          <ProfileItem title="Reporting Manager" subtitle="David" />
        </View> */}

        {/* Employment */}
        {/* <Text style={styles.section}>Employment History</Text>
        <View style={styles.card}>
          <ProfileItem title="Joining Date" subtitle="12/10/2020" />
          <ProfileItem title="Job tenure" subtitle="3 Years" />
        </View> */}
      </ScrollView>
    </CommonView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#F4F4F5", padding: 16 },
  header: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FBBF24",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: "#fff", fontWeight: "700" },
  name: { fontSize: 16, fontWeight: "600" },
  email: { color: "#6B7280", fontSize: 12 },
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
  rowTitle: { ...GlobalFonts.subtitle, fontSize: FontSize.Font16 },
  rowSub: { ...GlobalFonts.subtitle, fontSize: FontSize.Font16, color: COLOR.Placeholder }
});
