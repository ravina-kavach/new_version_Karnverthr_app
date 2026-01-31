import React, { useEffect, useState, useRef, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import CommonHeader from "../../components/CommonHeader";
import { CommonView } from "../../utils/common";
import useProfile from "./ProfileController";
import { COLOR } from "../../theme/theme";
import { FontSize } from "../../utils/metrics";
import { GlobalFonts } from "../../theme/typography";

const Input = memo(
  ({ label, value, editable = true, onChangeText, placeholder, keyboardType, multiline }) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          { backgroundColor: !editable ? COLOR.dark5 : COLOR.White1 },
        ]}
        value={value}
        placeholder={placeholder}
        editable={editable}
        multiline={multiline}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCorrect={false}
      />
    </View>
  )
);

export default function EditProfile() {
  const {
    UserDetailsData,
    handleProfileUpdate,
    isProfileUpdate,
    isProfileUpdateFetching,
    isUserDetailsFetching,
  } = useProfile();

  const navigation = useNavigation();

  const [form, setForm] = useState({
    name: "",
    private_email: "",
    work_phone: "",
    present_address: "",
  });
  
  const isFormInitialized = useRef(false);

  useEffect(() => {
    if (UserDetailsData && !isFormInitialized.current) {
      setForm({
        name: UserDetailsData.name || "",
        private_email: UserDetailsData.private_email || "",
        work_phone: UserDetailsData.work_phone || "",
        present_address: UserDetailsData.present_address || "",
      });
      isFormInitialized.current = true;
    }
  }, [UserDetailsData]);

  useEffect(() => {
    if (isProfileUpdate) {
      navigation.goBack();
    }
  }, [isProfileUpdate, navigation]);

  const onSave = () => {
    handleProfileUpdate(form);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <CommonView keyboardShouldPersistTaps="handled">
        <CommonHeader title="Edit Profile" />

        {isUserDetailsFetching ? (
          <View style={{ flex: 1, marginTop: 80 }}>
            <ActivityIndicator size="large" color={COLOR.Black1} />
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <Input
                label="Employee Name"
                placeholder="Employee name"
                value={form.name}
                onChangeText={(text) =>
                  setForm((prev) => ({ ...prev, name: text }))
                }
              />

              <Input
                label="Email"
                placeholder="Email"
                editable={false}
                value={form.private_email}
                keyboardType="email-address"
                onChangeText={(text) =>
                  setForm((prev) => ({ ...prev, private_email: text }))
                }
              />

              <Input
                label="Phone Number"
                placeholder="Phone number"
                keyboardType="phone-pad"
                value={form.work_phone}
                onChangeText={(text) =>
                  setForm((prev) => ({ ...prev, work_phone: text }))
                }
              />

              <Input
                label="Address"
                placeholder="Address"
                multiline
                value={form.present_address}
                onChangeText={(text) =>
                  setForm((prev) => ({ ...prev, present_address: text }))
                }
              />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={onSave}
                disabled={isProfileUpdateFetching}
              >
                <Text style={[styles.buttonText, { color: COLOR.White1 }]}>
                  {isProfileUpdateFetching ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </CommonView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 16,
  },
  label: {
    ...GlobalFonts.subtitleText,
    fontSize: FontSize.Font14,
    color: COLOR.TextPlaceholder,
    marginBottom: 6,
  },
  input: {
    ...GlobalFonts.subtitleText,
    fontSize: FontSize.Font14,
    color: COLOR.Black1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginHorizontal: 20,
  },
  cancelBtn: {
    ...GlobalFonts.subtitleText,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 12,
    width: 120,
    alignItems: "center",
    borderRadius: 8,
  },
  saveBtn: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    width: 120,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    ...GlobalFonts.subtitleText,
    fontSize: FontSize.Font14,
    color: COLOR.Black1,
  },
  multilineInput: {
  height: 100,
  paddingTop: 12,
  textAlignVertical: "top",
},
});
