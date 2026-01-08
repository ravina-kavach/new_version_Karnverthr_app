import React from "react";
import { View, Text, StyleSheet } from "react-native";
import dayjs from "dayjs";
import { COLOR } from "../theme/theme";
import { CheckIn, CheckOut } from "../assets/svgs";
import { GlobalFonts } from "../theme/typography.js";
import { FontSize } from "../utils/metrics.js";

const AttendanceItem = ({ item, getDuration }) => {
  const dateTitle = item?.check_in
    ? dayjs(item.check_in, "YYYY-MM-DD HH:mm:ss").format("ddd DD MMMM")
    : "";

  const checkIn = item?.check_in
    ? dayjs(item.check_in, "YYYY-MM-DD HH:mm:ss").format("hh:mm A")
    : "00:00 AM";

  const checkOut = item?.check_out
    ? dayjs(item.check_out, "YYYY-MM-DD HH:mm:ss").format("hh:mm A")
    : "00:00 PM";

  const isAbsent = !item?.check_in && !item?.check_out;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.date}>{dateTitle}</Text>
        {isAbsent && <Text style={styles.absent}>Absent</Text>}
      </View>
      <View style={styles.card}>
        <View style={styles.left}>
          <View style={styles.timeRow}>
            <CheckIn />
            <Text style={styles.timeText}>{checkIn}</Text>
          </View>

          <View style={styles.timeRow}>
            <CheckOut style={styles.checkoutIcon}/>
            <Text style={styles.timeText}>{checkOut}</Text>
          </View>
        </View>

        {/* Right side (Hours) */}
        <View style={styles.right}>
          <Text style={styles.hours}>
            {getDuration(item?.check_in, item?.check_out)} hrs
          </Text>
          <Text style={styles.subText}>Total Hours</Text>
        </View>
      </View>
    </View>
  );
};

export default AttendanceItem;

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal:20,
    backgroundColor:COLOR.White1,
    borderRadius: 12,
    paddingVertical:20,
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom:10,
    paddingHorizontal: 4,
  },
  checkoutIcon:{paddingLeft:24},
  date: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  absent: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
  },

  /* Card */
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLOR.dark4,
    borderRadius: 12,
  },

  left: {
    gap: 10,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  timeText: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font15,
    fontWeight: "500",
    color: "#111827",
    marginLeft: 10,
  },

  right: {
    alignItems: "flex-end",
  },

  hours: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font15,
    fontWeight: "700",
    color: "#111827",
  },

  subText: {
    fontSize: 12,
    color: COLOR.TextPlaceholder,
    marginTop: 4,
     ...GlobalFonts.subtitle,
    fontSize: FontSize.Font15,
  },
});
