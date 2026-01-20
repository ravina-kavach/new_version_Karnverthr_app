import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator
} from "react-native";
import CommonHeader from "../../components/CommonHeader";
import { CommonView } from "../../utils/common";
import useProfile from "./ProfileController";
import { useNavigation } from "@react-navigation/native";
import { COLOR } from "../../theme/theme";
import { FontSize } from "../../utils/metrics";
import { GlobalFonts } from "../../theme/typography";

export default function EmergencyDetails() {
    const {
        UserDetailsData,
        handleProfileUpdate,
        isProfileUpdate,
        isProfileUpdateFetching,
        isUserDetailsFetching
    } = useProfile();

    const navigation = useNavigation();

    const [form, setForm] = useState({
        emergency_contact_mobile: "",
        emergency_contact_address: "",
        emergency_contact_name: "",
        emergency_contact_relation: "",
    });

    useEffect(() => {
        if (UserDetailsData) {
            setForm({
                emergency_contact_mobile: UserDetailsData.emergency_contact_mobile || "",
                emergency_contact_address: UserDetailsData.emergency_contact_address || "",
                emergency_contact_name: UserDetailsData.emergency_contact_name || "",
                emergency_contact_relation: UserDetailsData.emergency_contact_relation || "",
            });
        }
    }, [UserDetailsData]);

    useEffect(() => {
        if (isProfileUpdate) {
            navigation.goBack();
        }
    }, [isProfileUpdate]);

    const onSave = () => {
        handleProfileUpdate(form);
    };

    const Input = ({ label, value, editable = true, onChangeText, placeholder }) => (
        <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, { backgroundColor: !editable ? COLOR.dark5 : COLOR.White1 }]}
                value={value}
                placeholder={placeholder}
                editable={editable}
                onChangeText={onChangeText}
            />
        </View>
    );

    return (
        <CommonView>
            <CommonHeader title="Emergency Contact" />
            {isUserDetailsFetching ?
                <View style={{ flex: 1, marginTop: 80 }}>
                    <ActivityIndicator size="large" color={COLOR.Black1} />
                </View>
                :
                <>
                    <View style={styles.card}>
                        <Input
                            label="Phone Number"
                            placeholder={"Emergency phone number"}
                            value={form.emergency_contact_mobile}
                            onChangeText={(text) =>
                                setForm({ ...form, emergency_contact_mobile: text })
                            }
                        />

                        <Input
                            label="Address"
                            placeholder={"Emergency address"}
                            value={form.emergency_contact_address}
                            onChangeText={(text) =>
                                setForm({ ...form, emergency_contact_address: text })
                            }
                        />

                        <Input
                            label="Name"
                            placeholder={"Emergency name"}
                            value={form.emergency_contact_name}
                            onChangeText={(text) =>
                                setForm({ ...form, emergency_contact_name: text })
                            }
                        />

                        <Input
                            label="Relation"
                            placeholder={"Emergency relation"}
                            value={form.emergency_contact_relation}
                            onChangeText={(text) =>
                                setForm({ ...form, emergency_contact_relation: emergency_contact_relation })
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
                </>}
        </CommonView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F4F4F5",
        padding: 16,
    },
    header: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
    },
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
        justifyContent: 'space-between',
        marginTop: 24,
        marginHorizontal: 20,
    },
    cancelBtn: {
        ...GlobalFonts.subtitleText,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        paddingVertical: 12,
        width: 120,
        alignItems: 'center',
        borderRadius: 8,
    },
    saveBtn: {
        backgroundColor: "#111827",
        paddingVertical: 12,
        width: 120,
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        ...GlobalFonts.subtitleText,
        fontSize: FontSize.Font14,
        color: COLOR.Black1,
    },
});