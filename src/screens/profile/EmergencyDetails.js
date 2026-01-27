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
  ({ label, value, onChangeText, placeholder, keyboardType }) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCorrect={false}
      />
    </View>
  )
);

export default function EmergencyDetails() {
  const {
    UserDetailsData,
    handleProfileUpdate,
    isProfileUpdate,
    isProfileUpdateFetching,
    isUserDetailsFetching,
  } = useProfile();

  const navigation = useNavigation();

  const [form, setForm] = useState({
    emergency_contact_mobile: "",
    emergency_contact_address: "",
    emergency_contact_name: "",
    emergency_contact_relation: "",
  });

  const isFormInitialized = useRef(false);

  useEffect(() => {
    if (UserDetailsData && !isFormInitialized.current) {
      setForm({
        emergency_contact_mobile:
          UserDetailsData.emergency_contact_mobile || "",
        emergency_contact_address:
          UserDetailsData.emergency_contact_address || "",
        emergency_contact_name:
          UserDetailsData.emergency_contact_name || "",
        emergency_contact_relation:
          UserDetailsData.emergency_contact_relation || "",
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
        <CommonHeader title="Emergency Contact" />

        {isUserDetailsFetching ? (
          <View style={{ flex: 1, marginTop: 80 }}>
            <ActivityIndicator size="large" color={COLOR.Black1} />
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <Input
                label="Phone Number"
                placeholder="Emergency phone number"
                keyboardType="phone-pad"
                value={form.emergency_contact_mobile}
                onChangeText={(text) =>
                  setForm((prev) => ({
                    ...prev,
                    emergency_contact_mobile: text,
                  }))
                }
              />

              <Input
                label="Address"
                placeholder="Emergency address"
                value={form.emergency_contact_address}
                onChangeText={(text) =>
                  setForm((prev) => ({
                    ...prev,
                    emergency_contact_address: text,
                  }))
                }
              />

              <Input
                label="Name"
                placeholder="Emergency name"
                value={form.emergency_contact_name}
                onChangeText={(text) =>
                  setForm((prev) => ({
                    ...prev,
                    emergency_contact_name: text,
                  }))
                }
              />

              <Input
                label="Relation"
                placeholder="Emergency relation"
                value={form.emergency_contact_relation}
                onChangeText={(text) =>
                  setForm((prev) => ({
                    ...prev,
                    emergency_contact_relation: text,
                  }))
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
});
