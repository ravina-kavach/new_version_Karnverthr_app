import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
} from "react-native";
import CommonHeader from "../../components/CommonHeader";
import { CommonView } from "../../utils/common";
import { COLOR } from "../../theme/theme";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 90;
const PIXELS_PER_MINUTE = HOUR_HEIGHT / 60;

export default function TimeSheet() {

    const today = "Today";

    const [tasks, setTasks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [selectedHour, setSelectedHour] = useState(
        new Date().getHours()
    );
    const [selectedMinute, setSelectedMinute] = useState(0);

    const [taskTitle, setTaskTitle] = useState("");
    const [duration, setDuration] = useState("");

    /* ---------------- TIME FORMAT ---------------- */

    const formatTime = (totalMinutes) => {
        let h = Math.floor(totalMinutes / 60);
        let m = totalMinutes % 60;

        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;

        return `${String(h).padStart(2, "0")}:${String(m).padStart(
            2,
            "0"
        )} ${ampm}`;
    };

    /* ---------------- EVENTS ---------------- */

    const onLongPressHour = (hour) => {
        setSelectedHour(hour);
        setSelectedMinute(0);
        setModalVisible(true);
    };

    const addTask = () => {
        if (!taskTitle) return;

        const parsedDuration = parseFloat(duration) || 1;

        setTasks([
            ...tasks,
            {
                title: taskTitle,
                startMinutes:
                    selectedHour * 60 + selectedMinute,
                duration: parsedDuration * 60,
            },
        ]);

        setTaskTitle("");
        setDuration("");
        setModalVisible(false);
    };

    /* ---------------- UI ---------------- */

    return (
        <CommonView>
            <CommonHeader title="Time Sheet" />

            <View style={styles.container}>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.containerWrapper}>
                    <View style={styles.timelineBox}>
                        <Text style={styles.date}>{today}</Text>
                        <View style={styles.timelineWrapper}>

                            {/* HOURS */}
                            {HOURS.map((hour) => (
                                <TouchableOpacity
                                    key={hour}
                                    style={styles.hourRow}
                                    onLongPress={() =>
                                        onLongPressHour(hour)
                                    }
                                >
                                    <Text style={styles.hourText}>
                                        {formatTime(hour * 60)}
                                    </Text>
                                    <View style={styles.hourLine} />
                                </TouchableOpacity>
                            ))}

                            {/* TASKS */}
                            {tasks.map((task, i) => {
                                const top =
                                    task.startMinutes *
                                    PIXELS_PER_MINUTE;

                                const height =
                                    task.duration *
                                    PIXELS_PER_MINUTE;

                                return (
                                    <View
                                        key={i}
                                        style={[
                                            styles.taskCard,
                                            { top, height },
                                        ]}
                                    >
                                        <Text style={styles.taskTitle}>
                                            {task.title}
                                        </Text>

                                        <Text style={styles.taskTime}>
                                            {formatTime(
                                                task.startMinutes
                                            )}{" "}
                                            to{" "}
                                            {formatTime(
                                                task.startMinutes +
                                                task.duration
                                            )}
                                        </Text>
                                    </View>
                                );
                            })}

                            <Text style={styles.entryLabel}>
                                Office Entry Time
                            </Text>

                            <Text style={styles.endLabel}>
                                Day End
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>

            {/* ================= MODAL ================= */}

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.bottomSheet}>

                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Add Time Entry
                            </Text>

                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.close}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* START TIME PICKER */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Start Time</Text>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            >
                                {HOURS.map((h) => (
                                    <TouchableOpacity
                                        key={h}
                                        style={[
                                            styles.timeChip,
                                            selectedHour === h &&
                                            styles.timeChipActive,
                                        ]}
                                        onPress={() =>
                                            setSelectedHour(h)
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.timeChipText,
                                                selectedHour === h && {
                                                    color: "#fff",
                                                },
                                            ]}
                                        >
                                            {h}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                {[0, 15, 30, 45].map((m) => (
                                    <TouchableOpacity
                                        key={m}
                                        style={[
                                            styles.timeChip,
                                            selectedMinute === m &&
                                            styles.timeChipActive,
                                        ]}
                                        onPress={() =>
                                            setSelectedMinute(m)
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.timeChipText,
                                                selectedMinute === m && {
                                                    color: "#fff",
                                                },
                                            ]}
                                        >
                                            {String(m).padStart(2, "0")}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* TASK */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Task</Text>
                            <TextInput
                                placeholder="What are you working on?"
                                placeholderTextColor={COLOR.dark2}
                                style={styles.modernInput}
                                value={taskTitle}
                                onChangeText={setTaskTitle}
                            />
                        </View>

                        {/* DURATION */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Duration (hours)</Text>
                            <TextInput
                                keyboardType="numeric"
                                placeholder="1 / 1.5 / 2"
                                placeholderTextColor={COLOR.dark2}
                                style={styles.modernInput}
                                value={duration}
                                onChangeText={setDuration}
                            />
                        </View>

                        {/* BUTTONS */}
                        <View style={styles.modalBtns}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.saveBtn}
                                onPress={addTask}
                            >
                                <Text style={styles.btnText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </CommonView>
    );
}

const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: "#f4f4f4", padding: 12 },

    date: { fontSize: 25, fontWeight: "700", marginBottom: 12, margin: 20 },

    timelineBox: {
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingVertical: 10,
    },
    containerWrapper: { paddingBottom: 100 },

    timelineWrapper: {
        position: "relative",
        paddingLeft: 75,
        paddingRight: 14,
    },

    hourRow: { height: 80, justifyContent: "center" },

    hourText: {
        position: "absolute",
        left: -55,
        fontSize: 11,
        color: "#9aa0a6",
        fontWeight: "500",
    },

    hourLine: {
        height: 1,
        backgroundColor: "#f0f0f0",
        marginLeft: 10,
    },

    taskCard: {
        position: "absolute",
        left: 80,
        right: 12,
        backgroundColor: "#f5f5f5",
        borderRadius: 14,
        padding: 16,
        borderLeftWidth: 3,
        borderLeftColor: COLOR.LightOrange,
        elevation: 1,
    },

    taskTitle: { fontWeight: "700", fontSize: 15, color: "#222" },

    taskTime: { marginTop: 6, fontSize: 13, color: "#7a7a7a" },

    entryLabel: {
        position: "absolute",
        left: 80,
        color: COLOR.LightOrange,
        fontSize: 16,
        fontWeight: "600",
    },

    endLabel: {
        position: "absolute",
        bottom: 8,
        left: 80,
        color: COLOR.LightOrange,
        fontSize: 16,
        fontWeight: "600",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },

    bottomSheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },

    modalTitle: { fontSize: 18, fontWeight: "700" },

    close: { fontSize: 18, color: "#999" },

    field: { marginBottom: 16 },

    label: { fontWeight: "600", marginBottom: 6 },

    modernInput: {
        backgroundColor: "#f6f7f9",
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
    },

    timeChip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: "#f1f3f5",
        borderRadius: 20,
        marginRight: 8,
    },

    timeChipActive: { backgroundColor: "#000" },

    timeChipText: { fontWeight: "600" },

    modalBtns: { flexDirection: "row", marginTop: 10 },

    cancelBtn: {
        flex: 1,
        backgroundColor: COLOR.Black1,
        padding: 14,
        borderRadius: 12,
        marginRight: 6,
        alignItems: "center",
    },

    saveBtn: {
        flex: 1,
        backgroundColor: COLOR.Black1,
        padding: 14,
        borderRadius: 12,
        marginLeft: 6,
        alignItems: "center",
    },

    btnText: { color: "#fff", fontWeight: "600" },

});