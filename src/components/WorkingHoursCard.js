import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import CommonButton from './CommonButton';
import { useTranslation } from 'react-i18next';
import { COLOR } from "../theme/theme";
import { CheckIn } from '../assets/svgs';
import dayjs from "dayjs";
import { GlobalFonts } from "../theme/typography";
import { FontSize, responsiveHeight } from "../utils/metrics";

const WorkingHoursCard = ({
  usersigninData,
  localAttendanceData,
  onPress,
  loading,
}) => {
  const { t } = useTranslation();

  const IsAttanced = localAttendanceData?.action === "CHECK_IN";

  const ShowImage = ({ image }) => {
    if (!image) return <CheckIn />;

    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `data:image/png;base64,${image}` }}
          style={styles.innerImageContainer}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t('Home.Shift_Timings')}</Text>
        <Text style={styles.weekText}>
          {usersigninData?.shift_timing}
        </Text>
      </View>
      <View style={styles.lineView}/>
      <View style={styles.timeRow}>
        <View style={styles.timeItem}>
          <Text style={styles.label}>{t('Home.Check_in')}</Text>
          <View style={styles.timeContent}>
            <ShowImage image={localAttendanceData?.check_in_image} />
            <Text style={styles.timeText}>
              {localAttendanceData?.check_in_time
                ? dayjs(localAttendanceData.check_in_time).format('hh:mm A')
                : '00:00'}
            </Text>
          </View>
        </View>
        <View style={[styles.timeItem]}>
          <Text style={styles.label}>{t('Home.Check_out')}</Text>
          <View style={styles.timeContent}>
            <ShowImage image={localAttendanceData?.check_out_image} />
            <Text style={styles.timeText}>
              {localAttendanceData?.check_out_time
                ? dayjs(localAttendanceData.check_out_time).format('hh:mm A')
                : '00:00'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonMainCotainer}>
        <CommonButton
          onPress={() => onPress(IsAttanced ? "CHECK_OUT" : "CHECK_IN")}
          title={IsAttanced ? t('Home.Check_out') : t('Home.Check_in')}
          loading={loading}
          textStyle={styles.textStyle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    paddingBottom: 30,
    paddingHorizontal:25,
    marginHorizontal: 10,
    marginVertical: 16
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  title: {
    fontSize: 15,
    ...GlobalFonts.buttonText,
    fontSize:FontSize.Font16,
    color: COLOR.Placeholder,
  },

  weekText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLOR.Secondary,
  },

  timeRow: {
    flexDirection: "row",
    justifyContent:'center',
    marginVertical:responsiveHeight(2)
  },

  timeItem: {
    width: "48%",
    alignItems:'center'
  },

  label: {
    fontSize: FontSize.Font12,
    color: COLOR.Placeholder,
    ...GlobalFonts.small,
    paddingHorizontal:15,
    alignSelf:'flex-start',
    marginBottom: 12,
  },

  timeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  timeText: {
    fontSize: FontSize.Font16,
    ...GlobalFonts.subtitle,
    color:COLOR.Secondary
  },

  imageContainer: {
    height: 34,
    width: 34,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: COLOR.Black1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  innerImageContainer: {
    height: 32,
    width: 32,
    borderRadius: 6,
  },

  buttonMainCotainer: {
    marginTop: 4,
  },
  textStyle:{
    ...GlobalFonts.normalText,
    color:COLOR.Primary1
  },
  lineView:{
    backgroundColor:COLOR.GrayBorder,
    height:1,
  }
});
export default WorkingHoursCard;
