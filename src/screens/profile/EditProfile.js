import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import CommonHeader from "../../components/CommonHeader";
import { CommonView } from "../../utils/common";

const Input = ({ label, value }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} value={value} />
  </View>
);

export default function EditProfile() {
  return (
    <CommonView>
      <CommonHeader title="Edit Profile" />

      <View style={styles.card}>
        <Input label="First Name" value="Jane" />
        <Input label="Last Name" value="Carter" />
        <Input label="Email" value="janecarter234@gmail.com" />
        <Input label="Phone Number" value="(406) 555-0120" />
        <Input
          label="Address"
          value="6391 Elgin St. Celina, Delaware 10299"
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelBtn}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={{ color: "#fff" }}>Save Changes</Text>
        </TouchableOpacity>
      </View>
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
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  saveBtn: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});
