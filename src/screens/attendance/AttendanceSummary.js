import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    ScrollView,
    Pressable,
} from "react-native";
import { CommonView } from "../../utils/common";

const { width } = Dimensions.get("window");

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const AttendanceSummary = ({ attendanceData }) => {

    const today = new Date().getDate();

    const [selectedDay, setSelectedDay] = useState(() => {
        const todayDate = new Date().getDate();
        return {
            day: todayDate,
            status: "present",
        };
    });

    const holidays = {
        "2026-01-14": "Makar Sankranti",
        "2026-01-26": "Republic Day",
        "2026-03-04": "Dhuleti",
        "2026-08-15": "Independence Day",
        "2026-08-28": "Raksha Bandhan",
        "2026-10-20": "Vijaya Dashami",
        "2026-11-09": "Diwali Break",
        "2026-11-10": "Diwali Break",
        "2026-11-11": "Diwali Break",
        "2026-11-12": "Diwali Break",
    };

    const formatCalendarData = () => {
        const year = 2026;
        const month = 2;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const todayDate = new Date();

        const data = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(year, month, i);

            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

            const found = attendanceData?.find(item => item.date === dateStr);
            const dayOfWeek = currentDate.getDay();

            if (currentDate > todayDate) {
                data.push({ day: i, status: "future" });
                continue;
            }

            if (dayOfWeek === 0) {
                data.push({ day: i, status: "weekoff" });
                continue;
            }

            if (holidays[dateStr]) {
                data.push({
                    day: i,
                    status: "holiday",
                    holidayName: holidays[dateStr],
                });
                continue;
            }

            if (found) {
                data.push({
                    day: i,
                    status: "present",
                    checkIn: found.check_in?.split(" ")[1]?.slice(0, 5) || "--",
                    checkOut: found.check_out?.split(" ")[1]?.slice(0, 5) || "--",
                    lateTime: found.late_time_display || "On Time",
                });
                continue;
            }

            data.push({ day: i, status: "absent" });
        }

        return data;
    };

    const calendarData = formatCalendarData();

    useEffect(() => {
        const todayData = calendarData.find(d => d.day === today);
        if (todayData) setSelectedDay(todayData);
    }, [attendanceData]);

    const getCardStyle = (status) => {
        switch (status) {
            case "present": return styles.present;
            case "holiday": return styles.holiday;
            case "weekoff": return styles.weekoff;
            case "absent": return styles.absent;
            default: return styles.empty;
        }
    };

    const getTodayDetails = () => {
        const todayDate = new Date();

        const todayStr = `${todayDate.getFullYear()}-${String(
            todayDate.getMonth() + 1
        ).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`;

        const todayRecord = attendanceData?.find(item => item.date === todayStr);
        if (!todayRecord) return null;

        const checkIn = todayRecord.check_in ? new Date(todayRecord.check_in) : null;
        const checkOut = todayRecord.check_out ? new Date(todayRecord.check_out) : null;

        let workedHours = "00:00";

        if (checkIn) {
            const endTime = checkOut || new Date();
            const diff = endTime - checkIn;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff / (1000 * 60)) % 60);

            workedHours = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        }

        return {
            checkIn: checkIn?.toTimeString().slice(0, 5) || "--",
            checkOut: checkOut?.toTimeString().slice(0, 5) || "--",
            workedHours,
            lateTime: todayRecord.late_time_display || "On Time",
        };
    };

    const todayDetails = getTodayDetails();

    return (
        <CommonView>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={styles.header}>March 2026</Text>

                {/* CALENDAR */}
                <View style={styles.calendar}>
                    <View style={styles.row}>
                        {days.map((d) => (
                            <Text key={d} style={styles.dayText}>{d}</Text>
                        ))}
                    </View>

                    <FlatList
                        data={calendarData}
                        numColumns={7}
                        scrollEnabled={false}
                        keyExtractor={(item) => item.day.toString()}
                        renderItem={({ item }) => {
                            const isToday = item.day === today;
                            const isLate = item.lateTime && item.lateTime !== "On Time";

                            return (
                                <Pressable
                                    onPress={() => setSelectedDay(item)}
                                    style={[
                                        styles.dateBox,
                                        getCardStyle(item.status),
                                        isToday && styles.todayBox,
                                        isLate && styles.lateBox
                                    ]}
                                >
                                    <Text style={[styles.dateText, isToday && styles.todayText]}>
                                        {item.day}
                                    </Text>

                                    {item.status === "present" && <View style={styles.dot} />}
                                    {item.status === "holiday" && <Text style={styles.holidayText}>H</Text>}
                                    {item.status === "weekoff" && <Text style={styles.weekText}>W</Text>}
                                    {item.status === "absent" && <Text style={styles.absentText}>A</Text>}
                                </Pressable>
                            );
                        }}
                    />
                </View>

                {/* DETAIL CARD */}
                {selectedDay && (
                    <View style={styles.detailCardPremium}>
                        <View style={styles.detailHeader}>
                            <Text style={styles.detailDate}>
                                {selectedDay.day} March 2026
                            </Text>

                            {/* ✅ UPDATED BADGE */}
                            {(() => {
                                const isTodaySelected = selectedDay.day === today;

                                const lateValue = isTodaySelected
                                    ? todayDetails?.lateTime
                                    : selectedDay.lateTime;

                                const isLate = lateValue && lateValue !== "On Time";

                                // ✅ CONVERT LATE TIME TO HOURS
                                const formatLateTime = (value) => {
                                    if (!value || value === "On Time") return "";

                                    const mins = parseInt(value); // assuming "15 min" or "15"
                                    if (isNaN(mins)) return value;

                                    const hours = Math.floor(mins / 60);
                                    const minutes = mins % 60;

                                    if (hours > 0) {
                                        return `${hours}h ${minutes}m`;
                                    }
                                    return `${minutes}m`;
                                };

                                return (
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            selectedDay.status === "present" && !isLate && styles.present,
                                            selectedDay.status === "present" && isLate && styles.lateBadge,
                                            selectedDay.status !== "present" && getCardStyle(selectedDay.status),
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.statusBadgeText,
                                                selectedDay.status === "present" && isLate && styles.lateText,
                                                selectedDay.status === "present" && !isLate && styles.presentText,
                                            ]}
                                        >
                                            {selectedDay.status === "present"
                                                ? isLate
                                                    ? `LATE ${formatLateTime(lateValue)}`  // ✅ UPDATED
                                                    : "PRESENT"
                                                : selectedDay.status.toUpperCase()}
                                        </Text>
                                    </View>
                                );
                            })()}
                        </View>

                        {selectedDay.status === "present" && (
                            <View style={styles.detailContent}>

                                {selectedDay.day === today && todayDetails && (
                                    <View style={{ marginBottom: 12 }}>
                                        <Text style={{ fontSize: 18, fontWeight: "700", color: "#ff7a00" }}>
                                            {todayDetails.workedHours} hrs
                                        </Text>
                                        <Text style={{ fontSize: 12, color: "#777" }}>
                                            Worked today
                                        </Text>
                                    </View>
                                )}

                                <View style={styles.timeRow}>
                                    <View style={styles.iconCircleGreen}><Text>⏱</Text></View>
                                    <View>
                                        <Text style={styles.label}>Check-in</Text>
                                        <Text style={styles.value}>
                                            {selectedDay.day === today
                                                ? todayDetails?.checkIn
                                                : selectedDay.checkIn}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.timeRow}>
                                    <View style={styles.iconCircleBlue}><Text>⏱</Text></View>
                                    <View>
                                        <Text style={styles.label}>Check-out</Text>
                                        <Text style={styles.value}>
                                            {selectedDay.day === today
                                                ? todayDetails?.checkOut
                                                : selectedDay.checkOut}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {selectedDay.status === "holiday" && (
                            <View style={styles.centerRow}>
                                <Text style={styles.bigEmoji}>🎉</Text>
                                <Text style={styles.holidayName}>{selectedDay.holidayName}</Text>
                            </View>
                        )}

                        {selectedDay.status === "weekoff" && (
                            <View style={styles.centerRow}>
                                <Text style={styles.bigEmoji}>🛌</Text>
                                <Text style={styles.holidayName}>Week Off</Text>
                            </View>
                        )}

                        {selectedDay.status === "absent" && (
                            <View style={styles.centerRow}>
                                <Text style={styles.bigEmoji}>❌</Text>
                                <Text style={styles.holidayName}>Absent</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* SUMMARY */}
                <View style={styles.card}>
                    <Text style={styles.title}>Attendance Summary</Text>

                    <View style={styles.rowBetween}>
                        <Text>Present</Text>
                        <Text style={styles.green}>
                            {calendarData.filter((d) => d.status === "present").length}
                        </Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text>Absent</Text>
                        <Text style={styles.red}>
                            {calendarData.filter((d) => d.status === "absent").length}
                        </Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text>Holiday</Text>
                        <Text>
                            {calendarData.filter((d) => d.status === "holiday").length}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </CommonView>
    );
};

const boxSize = width / 7 - 16;

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 14 },
    header: { fontSize: 24, fontWeight: "700", marginVertical: 12 },
    calendar: { backgroundColor: "#fff", borderRadius: 20, padding: 14, marginBottom: 16 },
    row: { flexDirection: "row", justifyContent: "space-between" },
    dayText: { width: boxSize, textAlign: "center", fontSize: 11, color: "#999" },

    dateBox: {
        width: boxSize,
        height: boxSize,
        margin: 4,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },

    present: { backgroundColor: "#e6f9ed" },
    holiday: { backgroundColor: "#e8edff" },
    weekoff: { backgroundColor: "#f1f1f1" },
    absent: { backgroundColor: "#ffe4e6" },
    empty: { backgroundColor: "#fafafa" },

    lateBox: { borderWidth: 2, borderColor: "#ffcc00" },

    dateText: { fontWeight: "600" },
    todayBox: { borderWidth: 2, borderColor: "#ff7a00" },
    todayText: { color: "#ff7a00" },

    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "green", marginTop: 4 },

    holidayText: { fontSize: 10, color: "blue" },
    weekText: { fontSize: 10, color: "#888" },
    absentText: { fontSize: 10, color: "red", fontWeight: "700" },

    detailCardPremium: { backgroundColor: "#fff", borderRadius: 20, padding: 18, marginBottom: 16 },
    detailHeader: { flexDirection: "row", justifyContent: "space-between" },
    detailDate: { fontWeight: "700" },

    statusBadge: { padding: 5, borderRadius: 8 },
    lateBadge: { backgroundColor: "#fff4cc" },

    statusBadgeText: { fontSize: 10 },

    detailContent: { marginTop: 10 },

    timeRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },

    iconCircleGreen: {
        width: 30, height: 30, borderRadius: 15,
        backgroundColor: "#dcfce7", marginRight: 10,
        justifyContent: "center", alignItems: "center",
    },

    iconCircleBlue: {
        width: 30, height: 30, borderRadius: 15,
        backgroundColor: "#e0e7ff", marginRight: 10,
        justifyContent: "center", alignItems: "center",
    },

    label: { fontSize: 12, color: "#777" },
    value: { fontWeight: "600" },

    centerRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
    bigEmoji: { fontSize: 24, marginRight: 8 },
    holidayName: { fontWeight: "600" },

    card: { backgroundColor: "#fff", padding: 16, borderRadius: 16 },
    title: { fontWeight: "700", marginBottom: 10 },

    rowBetween: { flexDirection: "row", justifyContent: "space-between", marginVertical: 5 },

    green: { color: "green" },
    red: { color: "red" },
    lateBadge: {
        backgroundColor: "#fff4cc",
    },

    lateText: {
        color: "#ffb300",
        fontWeight: "700",
    },

    presentText: {
        color: "green",
        fontWeight: "700",
    },
});

export default AttendanceSummary;