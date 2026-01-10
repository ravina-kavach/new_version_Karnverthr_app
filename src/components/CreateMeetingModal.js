import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    Modal,
    Platform,
    Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLOR } from '../theme/theme';
import { GlobalFonts } from '../theme/typography';
import { FontSize } from '../utils/metrics';

const { width } = Dimensions.get('window');

const NewMeetingModal = ({ visible, onClose, onCreateMeeting }) => {
    const now = new Date();
    const initialEnd = new Date(now);
    initialEnd.setMinutes(initialEnd.getMinutes() + 30);

    const [subject, setSubject] = useState('');
    const [startDate, setStartDate] = useState(now);
    const [endDate, setEndDate] = useState(initialEnd);
    const [location, setLocation] = useState('');
    const [organizer, setOrganizer] = useState('');
    const [description, setDescription] = useState('');
    const [pickerMode, setPickerMode] = useState(null);

    /** 🔁 Keep end time always after start time */
    useEffect(() => {
        if (endDate <= startDate) {
            const updatedEnd = new Date(startDate);
            updatedEnd.setMinutes(updatedEnd.getMinutes() + 30);
            setEndDate(updatedEnd);
        }
    }, [startDate]);

    /** 🧹 Reset all states */
    const resetForm = () => {
        const resetNow = new Date();
        const resetEnd = new Date(resetNow);
        resetEnd.setMinutes(resetEnd.getMinutes() + 30);

        setSubject('');
        setLocation('');
        setOrganizer('');
        setDescription('');
        setStartDate(resetNow);
        setEndDate(resetEnd);
        setPickerMode(null);
    };

    const formatDateTime = (date) => {
        const pad = (n) => (n < 10 ? `0${n}` : n);
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}
      ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    const calculateDuration = (start, end) => {
        return +((end - start) / (1000 * 60 * 60)).toFixed(2);
    };

    /** 🚀 Create Meeting */
    const handleCreateMeeting = () => {
        if (!subject.trim()) {
            Alert.alert('Validation', 'Meeting subject is required');
            return;
        }

        if (startDate < new Date()) {
            Alert.alert('Invalid Time', 'Meeting cannot start in the past');
            return;
        }

        const payload = {
            name: subject,
            start: formatDateTime(startDate),
            stop: formatDateTime(endDate),
            location,
            duration: calculateDuration(startDate, endDate),
            description,
            privacy: 'private',
        };

        onCreateMeeting(payload);
        resetForm();
        onClose();
    };

    /** 📅 Picker handler */
    const onChangePicker = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setPickerMode(null);
            return;
        }

        if (!selectedDate) return;

        const currentTime = new Date();

        if (pickerMode === 'startDate' || pickerMode === 'startTime') {
            const updated = new Date(startDate);

            if (pickerMode === 'startDate') {
                updated.setFullYear(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate()
                );
            } else {
                updated.setHours(
                    selectedDate.getHours(),
                    selectedDate.getMinutes()
                );
            }

            if (updated < currentTime) {
                Alert.alert('Invalid Time', 'Cannot select past time');
                setPickerMode(null);
                return;
            }

            setStartDate(updated);
        }

        if (pickerMode === 'endDate' || pickerMode === 'endTime') {
            const updated = new Date(endDate);

            if (pickerMode === 'endDate') {
                updated.setFullYear(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate()
                );
            } else {
                updated.setHours(
                    selectedDate.getHours(),
                    selectedDate.getMinutes()
                );
            }

            if (updated <= startDate) {
                Alert.alert('Invalid Time', 'End time must be after start time');
                setPickerMode(null);
                return;
            }

            setEndDate(updated);
        }

        setPickerMode(null);
    };

    return (
        <Modal visible={visible} transparent>
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>New Meeting</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.close}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        <Text style={styles.label}>Meeting Subject</Text>
                        <TextInput
                            style={styles.input}
                            value={subject}
                            onChangeText={setSubject}
                            placeholder="Enter meeting subject"
                        />

                        <Text style={styles.label}>From</Text>
                        <View style={styles.row}>
                            <TouchableOpacity style={styles.dateTimeBox} onPress={() => setPickerMode('startDate')}>
                                <Text>{startDate.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dateTimeBox} onPress={() => setPickerMode('startTime')}>
                                <Text>{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>To</Text>
                        <View style={styles.row}>
                            <TouchableOpacity style={styles.dateTimeBox} onPress={() => setPickerMode('endDate')}>
                                <Text>{endDate.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dateTimeBox} onPress={() => setPickerMode('endTime')}>
                                <Text>{endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                            </TouchableOpacity>
                        </View>

                        {pickerMode && (
                            <DateTimePicker
                                value={pickerMode.includes('start') ? startDate : endDate}
                                mode={pickerMode.includes('Date') ? 'date' : 'time'}
                                minimumDate={pickerMode.includes('start') ? new Date() : startDate}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onChangePicker}
                            />
                        )}

                        <Text style={styles.label}>Location</Text>
                        <TextInput style={styles.input} placeholder='Enter Location' value={location} onChangeText={setLocation} />

                        <Text style={styles.label}>Organizer</Text>
                        <TextInput style={styles.input} value={organizer} placeholder='Enter Organizer' onChangeText={setOrganizer} />

                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, { height: 80 }]}
                            multiline
                            placeholder='Enter Description'
                            value={description}
                            onChangeText={setDescription}
                        />
                        <Text style={styles.charCount}>
                            {description.length}/150
                        </Text>
                    </ScrollView>

                    <TouchableOpacity style={styles.createButton} onPress={handleCreateMeeting}>
                        <Text style={styles.createButtonText}>Create New Meeting +</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default NewMeetingModal;

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: 'center',
        margin: 0,
    },
    charCount: {
        ...GlobalFonts.subtitle,
        alignSelf: 'flex-end',
        marginTop: 5,
        paddingRight:5,
        fontSize: 12,
        color: '#6B7280',
    },
    modalContent: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 20,
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15,
        textAlign: 'center',
    },
    label: {
        ...GlobalFonts.subtitle,
        fontSize: FontSize.Font16,
        color: COLOR.Black1,
        marginBottom: 6,
        marginTop: 10,
    },
    input: {
        ...GlobalFonts.subtitle,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateTimeBox: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginRight: 8,
    },
    dateTimeText: {
        fontSize: 15,
        color: '#111827',
    },
    pickerBox: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
    },
    createButton: {
        backgroundColor: '#111827',
        paddingVertical: 14,
        borderRadius: 16,
        marginTop: 10,
        alignItems: 'center',
    },
    createButtonText: {
        ...GlobalFonts.subtitle,
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    close: {
        fontSize: 18,
        color: '#666',
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 30,
        // marginBottom: 6,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: '#111',
    },
});

