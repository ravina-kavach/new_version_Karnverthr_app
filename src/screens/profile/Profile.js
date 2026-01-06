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

const ProfileItem = ({ title, subtitle }) => (
  <View style={styles.row}>
    <View style={styles.icon} />
    <View style={{ flex: 1 }}>
      <Text style={styles.rowTitle}>{title}</Text>
      {subtitle && <Text style={styles.rowSub}>{subtitle}</Text>}
    </View>
    <Text style={styles.arrow}>›</Text>
  </View>
);

export default function Profile() {
  return (
    <CommonView>
      <CommonHeader title="Profile" />
      <ScrollView style={styles.container}>
        <View style={styles.profilecard}>
          <GreetingHeader />
        </View>

        {/* Account & Identity */}
        <Text style={styles.section}>Account & Identity</Text>
        <View style={styles.card}>
          <ProfileItem title="Edit Profile" subtitle="Change name, photo, contact" />
          <ProfileItem title="Government ID" subtitle="View Aadhaar, request update" />
          <ProfileItem title="Change Password" subtitle="Change or update password" />
        </View>

        {/* Professional Info */}
        <Text style={styles.section}>Professional Information</Text>
        <View style={styles.card}>
          <ProfileItem title="Current Role" subtitle="Developer" />
          <ProfileItem title="Department" subtitle="Creative Administrative" />
          <ProfileItem title="Reporting Manager" subtitle="David" />
        </View>

        {/* Employment */}
        <Text style={styles.section}>Employment History</Text>
        <View style={styles.card}>
          <ProfileItem title="Joining Date" subtitle="12/10/2020" />
          <ProfileItem title="Job tenure" subtitle="3 Years" />
        </View>
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
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    marginRight: 12,
  },
  rowTitle: { fontSize: 14, fontWeight: "500" },
  rowSub: { fontSize: 12, color: "#6B7280" },
  arrow: { fontSize: 22, color: "#9CA3AF" },
});
