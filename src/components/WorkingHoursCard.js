import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import CommonButton from './CommonButton'
import { useTranslation } from 'react-i18next';
import { COLOR } from "../theme/theme";
import { SelfieIcon } from '../assets/icons/index.js';
import dayjs from "dayjs";

const WorkingHoursCard = ({
  usersigninData,
  localAttendanceData,
  onPress,
  loading,
}) => {
  const { t, i18n } = useTranslation();
  const IsAttanced = localAttendanceData?.action === "CHECK_IN"
  const ShowImage = (props) => {
    return (
      <View style={styles.imageContainer}>
        {props.image ? (
          <Image
            source={{ uri: `data:image/png;base64,${props.image}` }}
            style={styles.innerImageContainer}
            resizeMode='cover'
          />
        ) : (
          <Image source={SelfieIcon} resizeMode='cover' style={{ height: 28,
    width: 28,}} />
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Home.Shift_Timings')}</Text>
      <Text style={styles.subtitle}>
        {usersigninData?.shift_timing}
      </Text>

      <View style={styles.hoursRow}>
        <View style={styles.hourBox}>
          <Text style={styles.label}>CHECK IN</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ShowImage image={localAttendanceData?.check_in_image} />
            <Text style={styles.hourText}>{localAttendanceData?.check_in_time ? dayjs(localAttendanceData?.check_in_time).format('hh:mm A') : '00:00'}</Text>
          </View>
        </View>

        <View style={styles.hourBox}>
          <Text style={styles.label}>CHECK OUT</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ShowImage image={localAttendanceData?.check_out_image} />
            <Text style={styles.hourText}>{localAttendanceData?.check_out_time ? dayjs(localAttendanceData?.check_out_time).format('hh:mm A') : '00:00'}</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonMainCotainer}>
        <CommonButton
          onPress={() => onPress(IsAttanced ? "CHECK_OUT" : "CHECK_IN")}
          title={IsAttanced ? t('Home.Check_out') : t('Home.Check_in')}
          loading={loading}
          gradientColors={[COLOR.grediant1, COLOR.grediant2]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 190,
    elevation: 4,
  },
  buttonMainCotainer: { justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 16,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  hourBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    width: "48%",
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
  },
  hourText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    paddingLeft: 5
  },
  imageContainer: {
    height: 35,
    width: 35,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 0.4,
    borderColor: COLOR?.Black1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerImageContainer: {
    height: 32,
    width: 32,
    borderRadius: 5
  },
  button: {
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});


export default WorkingHoursCard;
