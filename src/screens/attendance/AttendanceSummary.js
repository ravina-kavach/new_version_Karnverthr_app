import React, { useState, useEffect, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    ScrollView,
    Pressable,
    Image
} from "react-native";
import { CommonView } from "../../utils/common";
import moment from "moment";
import { COLOR } from "../../theme/theme";
import { ProfileIcon } from "../../assets/svgs";

const { width } = Dimensions.get("window");

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const AttendanceSummary = ({ attendanceData, publicHolidayData, month, year }) => {

    const holidayMap = useMemo(() => {
        if (!publicHolidayData?.length) return {};

        const map = {};

        publicHolidayData.forEach(h => {
            const date = moment(h.date_to).format("YYYY-MM-DD");
            map[date] = h;
        });

        return map;
    }, [publicHolidayData]);

    const todayDate = new Date();

    const isCurrentMonth =
        Number(month) === todayDate.getMonth() + 1 &&
        Number(year) === todayDate.getFullYear();

    const today = isCurrentMonth ? todayDate.getDate() : null;

    const calendarData = useMemo(() => {
        if (!month || !year) return [];

        const monthIndex = Number(month) - 1;

        const firstDay = new Date(year, monthIndex, 1).getDay(); // 0=Sunday
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

        const data = [];

        for (let i = 0; i < firstDay; i++) {
            data.push({
                key: `empty-${i}`,
                status: "empty",
            });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, monthIndex, day);

            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            const found = attendanceData?.find(item => item.date === dateStr);
            const holiday = holidayMap[dateStr];

            const isFuture =
                year > todayDate.getFullYear() ||
                (year == todayDate.getFullYear() && monthIndex > todayDate.getMonth()) ||
                (year == todayDate.getFullYear() &&
                    monthIndex == todayDate.getMonth() &&
                    day > todayDate.getDate());

            // FUTURE
            if (isFuture) {
                data.push({ day, status: "future" });
                continue;
            }

            // PRESENT (highest priority)
            if (found) {
                data.push({
                    day,
                    status: "present",
                    checkIn: found.check_in || "--",
                    checkOut: found.check_out || "--",
                    checkInImage: found.check_in_image && found.check_in_image,
                    checkOutImage: found.check_out_image && found.check_out_image,
                    lateTime: found.late_time_display || "On Time",
                });
                continue;
            }

            // HOLIDAY
            if (holiday) {
                data.push({
                    day,
                    status: "holiday",
                    holidayName: holiday.name,
                });
                continue;
            }

            if (currentDate.getDay() === 0) {
                data.push({
                    day,
                    status: "weekoff",
                });
                continue;
            }

            // ABSENT
            data.push({
                day,
                status: "absent",
            });
        }

        return data;
    }, [attendanceData, holidayMap, month, year]);

    // ✅ SELECT DAY
    const [selectedDay, setSelectedDay] = useState(null);

    useEffect(() => {
        if (!calendarData.length) return;

        if (today) {
            const todayData = calendarData.find(d => d.day === today);
            setSelectedDay(todayData || calendarData[0]);
        } else {
            setSelectedDay(calendarData[0]);
        }
    }, [calendarData]);

    const monthName = moment(`${year}-${month}`, "YYYY-MM").format("MMMM YYYY");
    const getTodayDetails = () => {
        if (!isCurrentMonth) return null;

        const todayStr = moment().format("YYYY-MM-DD");
        const todayRecord = attendanceData?.find(
            item => item.date === todayStr
        );

        if (!todayRecord) return null;

        const checkIn = todayRecord.check_in
            ? moment(todayRecord.check_in)
            : null;

        const checkOut = todayRecord.check_out
            ? moment(todayRecord.check_out)
            : null;

        let workedHours = "00:00";

        if (checkIn) {
            const endTime = checkOut || moment();
            const diff = moment.duration(endTime.diff(checkIn));

            const hours = Math.floor(diff.asHours());
            const minutes = diff.minutes();

            workedHours = `${String(hours).padStart(2, "0")}:${String(
                minutes
            ).padStart(2, "0")}`;
        }

        return {
            checkIn: checkIn ? checkIn.toISOString() : "--",
            checkOut: checkOut ? checkOut.toISOString() : "--",
            checkInImage: todayRecord.check_in_image && todayRecord.check_in_image,
            checkOutImage: todayRecord.check_out_image && todayRecord.check_out_image,
            workedHours,
            lateTime: todayRecord.late_time_display || "On Time",
        };
    };

    const todayDetails = getTodayDetails();

    // ✅ LATE FORMAT
    const formatLateTime = (value) => {
        if (!value || value === "On Time") return "";

        const mins = parseInt(value);
        if (isNaN(mins)) return value;

        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;

        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };

    const getCardStyle = (status) => {
        switch (status) {
            case "present": return styles.present;
            case "holiday": return styles.holiday;
            case "weekoff": return styles.weekoff;
            case "absent": return styles.absent;
            default: return styles.empty;
        }
    };

    const getStatusTextStyle = (status, isLate, isPresent) => {
        if (isPresent && isLate) return styles.lateText;
        if (isPresent) return styles.presentText;

        switch (status) {
            case "holiday":
                return styles.holidayTextBadge;

            case "weekoff":
                return styles.weekTextBadge;

            case "absent":
                return styles.absentText;

            default:
                return {};
        }
    };

    const formatCheckTimeDisplay = (checkIn, checkOut, type = "in") => {
        if (!checkIn || checkIn === "--") return "--";

        const inMoment = moment(checkIn);
        const outMoment = checkOut && checkOut !== "--"
            ? moment(checkOut)
            : null;

        // CHECK-IN → always time
        if (type === "in") {
            return inMoment.local().format("hh:mm A");
        }

        // CHECK-OUT
        if (!outMoment) return "--";

        const isDifferentDate = !inMoment.isSame(outMoment, "day");

        // ✅ DIFFERENT DATE → SHOW DATE + TIME
        if (isDifferentDate) {
            return `${outMoment.local().format("h:mm A")} (${outMoment.local().format("DD MMM")})`;
        }

        // SAME DAY → TIME ONLY
        return outMoment.local().format("hh:mm A");
    };

    const ShowImage = ({ image }) => {
        if (!image) return (
            <View style={styles.borderImage}>
                <ProfileIcon width={22} height={22} />
            </View>

        )

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
        <CommonView>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.containerWrapper}>
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
                        keyExtractor={(item, index) =>
                            item.day ? item.day.toString() : item.key || index.toString()
                        }
                        renderItem={({ item }) => {
                            const isToday = today && item.day === today;
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
                                {selectedDay.day} {monthName}
                            </Text>

                            {(() => {
                                const lateValue =
                                    selectedDay.day === today
                                        ? todayDetails?.lateTime
                                        : selectedDay.lateTime;

                                const isLate = lateValue && lateValue !== "On Time";
                                const isPresent = selectedDay.status === "present";

                                return (
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            isPresent && !isLate && styles.present,
                                            isPresent && isLate && styles.lateBadge,
                                            !isPresent && getCardStyle(selectedDay.status),
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.statusBadgeText,
                                                getStatusTextStyle(selectedDay.status, isLate, isPresent),
                                            ]}
                                        >
                                            {isPresent
                                                ? isLate
                                                    ? `LATE ${formatLateTime(lateValue)}`
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
                                    <View style={styles.iconCircleGreen}>
                                        <ShowImage image={selectedDay?.checkInImage} />
                                    </View>
                                    <View>
                                        <Text style={styles.label}>Check-in</Text>
                                        <Text style={styles.value}>
                                            {selectedDay.day === today
                                                ? formatCheckTimeDisplay(todayDetails?.checkIn, todayDetails?.checkOut, "in")
                                                : formatCheckTimeDisplay(selectedDay.checkIn, selectedDay.checkOut, "in")}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.timeRow}>
                                    <View style={styles.iconCircleBlue}>
                                        <ShowImage image={selectedDay?.checkOutImage} />
                                    </View>
                                    <View>
                                        <Text style={styles.label}>Check-out</Text>
                                        <Text style={styles.value}>
                                            {selectedDay.day === today
                                                ? formatCheckTimeDisplay(todayDetails?.checkIn, todayDetails?.checkOut, "out")
                                                : formatCheckTimeDisplay(selectedDay.checkIn, selectedDay.checkOut, "out")}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {selectedDay.status === "holiday" && (
                            <View style={styles.centerRow}>
                                <Text style={styles.bigEmoji}>🎉</Text>
                                <Text style={styles.holidayName}>
                                    {selectedDay.holidayName || "Holiday"}
                                </Text>
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
                            {calendarData.filter(d => d.status === "present").length}
                        </Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text>Absent</Text>
                        <Text style={styles.red}>
                            {calendarData.filter(d => d.status === "absent").length}
                        </Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text>Week Off</Text>
                        <Text>
                            {calendarData.filter(d => d.status === "weekoff").length}
                        </Text>
                    </View>
                    <View style={styles.rowBetween}>
                        <Text>Holiday</Text>
                        <Text>
                            {calendarData.filter(d => d.status === "holiday").length}
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
    calendar: { backgroundColor: "#fff", marginTop: 20, borderRadius: 20, padding: 14, marginBottom: 16 },
    row: { flexDirection: "row", justifyContent: "space-between" },
    dayText: { width: boxSize, textAlign: "center", fontSize: 11, color: "#999" },

    containerWrapper: {
        paddingBottom: 100
    },

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
    todayBox: { backgroundColor: COLOR.Black1 },
    todayText: { color: COLOR.White1 },

    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "green", marginTop: 4 },

    holidayText: { fontSize: 10, color: "blue" },
    weekText: { fontSize: 10, color: "#888" },
    absentText: { fontSize: 10, color: "red", fontWeight: "700" },

    detailCardPremium: { backgroundColor: "#fff", borderRadius: 20, padding: 18, marginBottom: 16 },
    detailHeader: { flexDirection: "row", justifyContent: "space-between" },
    detailDate: { fontWeight: "700" },

    holidayTextBadge: {
        color: "#3b5bdb", // blue
        fontWeight: "700",
    },

    weekTextBadge: {
        color: "#666",
        fontWeight: "700",
    },

    statusBadge: { padding: 5, borderRadius: 8 },
    lateBadge: { backgroundColor: "#fff4cc" },

    statusBadgeText: { fontSize: 10 },

    detailContent: { marginTop: 10 },

    timeRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },

    iconCircleGreen: {

        marginRight: 10,
        justifyContent: "center", alignItems: "center",
    },

    iconCircleBlue: {
        marginRight: 10,
        justifyContent: "center",
        alignItems: "center",
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

    lateText: { color: "#ffb300", fontWeight: "700" },
    presentText: { color: "green", fontWeight: "700" },

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
    borderImage: {
        height: 34,
        width: 34,
        borderRadius: 6,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: COLOR.dark1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    innerImageContainer: {
        height: 32,
        width: 32,
        borderRadius: 6,
    },
});

export default AttendanceSummary;