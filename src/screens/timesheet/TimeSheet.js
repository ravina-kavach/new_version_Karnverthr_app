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

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function TimeSheet() {
    const today = new Date().toDateString();

    const [tasks, setTasks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    // ✅ default current hour
    const [selectedHour, setSelectedHour] = useState(new Date().getHours());

    const [taskTitle, setTaskTitle] = useState("");
    const [duration, setDuration] = useState("");

    // LONG PRESS
    const onLongPressHour = (hour) => {
        setSelectedHour(hour ?? new Date().getHours());
        setModalVisible(true);
    };

    // ADD TASK
    const addTask = () => {
        if (!taskTitle) return;

        const parsedDuration = parseFloat(duration) || 1;

        setTasks([
            ...tasks,
            {
                title: taskTitle,
                hour: selectedHour,
                duration: parsedDuration,
            },
        ]);

        setTaskTitle("");
        setDuration("");
        setModalVisible(false);
    };

    // FORMAT TIME
    const formatHour = (h) => {
        const ampm = h >= 12 ? "PM" : "AM";
        const hour = h % 12 || 12;
        return `${hour}:00 ${ampm}`;
    };

    return (
        <CommonView>
            <CommonHeader title="Timesheet" />

            <View style={styles.container}>
                <Text style={styles.date}>{today}</Text>

                {/* TIMELINE */}
                <ScrollView>
                    {HOURS.map((hour) => (
                        <TouchableOpacity
                            key={hour}
                            style={styles.hourRow}
                            onLongPress={() => onLongPressHour(hour)}
                            delayLongPress={300}
                        >
                            <Text style={styles.hourText}>
                                {formatHour(hour)}
                            </Text>

                            <View style={styles.slot}>
                                {tasks
                                    .filter((t) => t.hour === hour)
                                    .map((task, i) => (
                                        <View
                                            key={i}
                                            style={[
                                                styles.taskBlock,
                                                {
                                                    height: task.duration * 50, // ✅ improved scaling
                                                },
                                            ]}
                                        >
                                            <Text style={styles.taskText}>
                                                {task.title} ({task.duration}h)
                                            </Text>
                                        </View>
                                    ))}
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* MODAL */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.bottomSheet}>

                        {/* HEADER */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Time Entry</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.close}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* START TIME */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Start Time</Text>
                            <View style={styles.timeBox}>
                                <Text style={styles.timeText}>
                                    {formatHour(selectedHour)}
                                </Text>
                            </View>
                        </View>

                        {/* TASK NAME */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Task</Text>
                            <TextInput
                                placeholder="What are you working on?"
                                placeholderTextColor="#aaa"
                                style={styles.modernInput}
                                value={taskTitle}
                                onChangeText={setTaskTitle}
                            />
                        </View>

                        {/* DURATION */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Duration</Text>

                            <View style={styles.durationRow}>
                                {[0.5, 1, 2, 3].map((d) => (
                                    <TouchableOpacity
                                        key={d}
                                        style={[
                                            styles.durationBtn,
                                            duration == d && styles.durationActive,
                                        ]}
                                        onPress={() => setDuration(String(d))}
                                    >
                                        <Text
                                            style={[
                                                styles.durationText,
                                                duration == d && { color: "#fff" },
                                            ]}
                                        >
                                            {d}h
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* ✅ CUSTOM INPUT */}
                            <TextInput
                                placeholder="Custom duration (e.g. 1.5)"
                                placeholderTextColor="#aaa"
                                keyboardType="numeric"
                                style={[styles.modernInput, { marginTop: 10 }]}
                                value={duration}
                                onChangeText={setDuration}
                            />
                        </View>

                        {/* NOTES */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Notes</Text>
                            <TextInput
                                placeholder="Optional description..."
                                multiline
                                numberOfLines={3}
                                style={styles.textArea}
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
                                <Text style={styles.btnText}>Save Entry</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </CommonView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        padding: 12,
    },

    date: {
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 10,
    },

    hourRow: {
        flexDirection: "row",
        minHeight: 70,
        borderBottomWidth: 1,
        borderColor: "#e5e5e5",
    },

    hourText: {
        width: 80,
        color: "#777",
        fontSize: 12,
        paddingTop: 8,
    },

    slot: {
        flex: 1,
        paddingVertical: 6,
    },

    taskBlock: {
        backgroundColor: "#cfe5f3",
        borderRadius: 8,
        padding: 8,
        marginBottom: 4,
    },

    taskText: {
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

    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
    },

    close: {
        fontSize: 18,
        color: "#999",
    },

    field: {
        marginBottom: 16,
    },

    label: {
        fontWeight: "600",
        marginBottom: 6,
    },

    modernInput: {
        backgroundColor: "#f6f7f9",
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
    },

    timeBox: {
        backgroundColor: "#f1f3f5",
        padding: 14,
        borderRadius: 12,
    },

    timeText: {
        fontWeight: "600",
        fontSize: 15,
    },

    durationRow: {
        flexDirection: "row",
        gap: 10,
    },

    durationBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "#f1f3f5",
    },

    durationActive: {
        backgroundColor: "#000",
    },

    durationText: {
        fontWeight: "600",
    },

    textArea: {
        backgroundColor: "#f6f7f9",
        borderRadius: 12,
        padding: 14,
        textAlignVertical: "top",
    },

    modalBtns: {
        flexDirection: "row",
        marginTop: 10,
    },

    cancelBtn: {
        flex: 1,
        backgroundColor: "#9aa0a6",
        padding: 14,
        borderRadius: 12,
        marginRight: 6,
        alignItems: "center",
    },

    saveBtn: {
        flex: 1,
        backgroundColor: "#000",
        padding: 14,
        borderRadius: 12,
        marginLeft: 6,
        alignItems: "center",
    },

    btnText: {
        color: "#fff",
        fontWeight: "600",
    },
});