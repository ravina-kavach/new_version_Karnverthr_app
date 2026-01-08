import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import dayjs from "dayjs";
import { COLOR } from "../theme/theme";
import { RowView } from "../utils/common";
import { AttendancIcon } from "../assets/icons/index.js";
;
const AttendanceItem = ({ item, t, getDuration }) => {
  const dateTitle = item?.check_in
  ? dayjs(item.check_in, 'YYYY-MM-DD HH:mm:ss')
      .format('DD MMMM YYYY')
  : '';

const checkIn = item?.check_in
  ? dayjs(item.check_in, 'YYYY-MM-DD HH:mm:ss')
      .format('hh:mm A')
  : '--';

const checkOut = item?.check_out
  ? dayjs(item.check_out, 'YYYY-MM-DD HH:mm:ss')
      .format('hh:mm A')
  : '--';




  return (
    <View style={styles.wrapper}>

      <View style={styles.card}>
        <RowView style={styles.titleContainer}>
          <Image
            source={AttendancIcon}
            tintColor={COLOR.Placeholder}
          />
          <Text numberOfLines={1} style={styles.dateTitle}>{dateTitle}</Text>
        </RowView>
        <View style={styles.row}>
          <View style={styles.block}>
            <Text style={styles.label}>Total Hours</Text>
            <Text numberOfLines={1} style={styles.value}>
              {getDuration(item?.check_in, item?.check_out)} hrs
            </Text>
          </View>

          <View style={styles.block}>
            <Text style={styles.label}>Clock in & Out</Text>
            <Text numberOfLines={1} style={styles.value}>
              {checkIn} — {checkOut}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 14,
    marginVertical: 8,
  },

  dateTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    paddingLeft: 5,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 6,
  },

  card: {
    backgroundColor: COLOR.White1 || "#FFFFFF",
    borderRadius: 12,
    padding: 16,

    borderWidth: 1,
    borderColor: "#E5E7EB",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  block: {
    width: "48%",
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});

export default AttendanceItem;
