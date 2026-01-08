import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    Modal
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLOR } from '../theme/theme';
import { GlobalFonts } from '../theme/typography';
import { FontSize } from '../utils/metrics';

const { width } = Dimensions.get('window');

const NewMeetingModal = ({ visible, onClose, onCreateMeeting }) => {
    const [subject, setSubject] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [location, setLocation] = useState('');
    const [organizer, setOrganizer] = useState('');
    // const [notification, setNotification] = useState('5 min');
    const [description, setDescription] = useState('');
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState(null);


    useEffect(() => {
        if (endDate <= startDate) {
            const newEnd = new Date(startDate);
            newEnd.setMinutes(newEnd.getMinutes() + 30);
            setEndDate(newEnd);
        }
    }, [startDate]);

    const formatDateTime = (date) => {
        const pad = (n) => (n < 10 ? `0${n}` : n);

        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();

        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    const calculateDuration = (start, end) => {
        const diffMs = end - start;
        return +(diffMs / (1000 * 60 * 60)).toFixed(2); // hours
    };
    const handleCreateMeeting = () => {

        let payload = {
            name: subject,
            start: formatDateTime(startDate),
            stop: formatDateTime(endDate),
            location: location,
            duration: calculateDuration(startDate, endDate),
            description: description,
            privacy: 'private',
        };
        onCreateMeeting(payload)
    }

    const onChangePicker = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setPickerMode(null);
            return;
        }

        if (!selectedDate) return;

        if (pickerMode === 'startDate') {
            const updated = new Date(startDate);
            updated.setFullYear(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate()
            );
            setStartDate(updated);
        }

        if (pickerMode === 'startTime') {
            const updated = new Date(startDate);
            updated.setHours(
                selectedDate.getHours(),
                selectedDate.getMinutes()
            );
            setStartDate(updated);
        }

        if (pickerMode === 'endDate') {
            const updated = new Date(endDate);
            updated.setFullYear(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate()
            );
            setEndDate(updated);
        }

        if (pickerMode === 'endTime') {
            const updated = new Date(endDate);
            updated.setHours(
                selectedDate.getHours(),
                selectedDate.getMinutes()
            );
            setEndDate(updated);
        }

        setPickerMode(null);
    };


    return (
        <Modal
            visible={visible}
        >
            <View style={styles.overlay} >
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>New Meeting</Text>
                        <TouchableOpacity style={{ alignItems: 'flex-end'}} onPress={onClose}>
                            <Text style={styles.close}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                        {/* Meeting Subject */}
                        <Text style={styles.label}>Meeting Subject</Text>
                        <TextInput
                            placeholder="Enter Meeting Subject"
                            value={subject}
                            onChangeText={setSubject}
                            style={styles.input}
                        />

                        {/* Start Date & Time */}
                        <Text style={styles.label}>From</Text>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={styles.dateTimeBox}
                                onPress={() => setPickerMode('startDate')}
                            >
                                <Text style={styles.dateTimeText}>
                                    {startDate.toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dateTimeBox}
                                onPress={() => setPickerMode('startTime')}
                            >
                                <Text style={styles.dateTimeText}>
                                    {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {showStartPicker && (
                            <DateTimePicker
                                value={startDate}
                                mode="datetime"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    if (event.type === 'dismissed') {
                                        setShowStartPicker(false);
                                        return;
                                    }

                                    if (event.type === 'set' && selectedDate) {
                                        setShowStartPicker(false);
                                        setStartDate(selectedDate);
                                    }
                                }}
                            />
                        )}

                        {/* End Date & Time */}
                        <Text style={styles.label}>To</Text>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={styles.dateTimeBox}
                                onPress={() => setPickerMode('endDate')}
                            >
                                <Text style={styles.dateTimeText}>
                                    {endDate.toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dateTimeBox}
                                onPress={() => setPickerMode('endTime')}
                            >
                                <Text style={styles.dateTimeText}>
                                    {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {pickerMode && (
                            <DateTimePicker
                                value={
                                    pickerMode.includes('start') ? startDate : endDate
                                }
                                mode={pickerMode.includes('Date') ? 'date' : 'time'}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onChangePicker}
                            />
                        )}

                        {/* Location */}
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            placeholder="Add Location"
                            value={location}
                            onChangeText={setLocation}
                            style={styles.input}
                        />

                        {/* Organizer */}
                        <Text style={styles.label}>Organizer</Text>
                        <TextInput
                            placeholder="Organizer Name"
                            value={organizer}
                            onChangeText={setOrganizer}
                            style={styles.input}
                        />

                        {/* Notification */}
                        {/* <Text style={styles.label}>Notification</Text>
                        <View style={styles.pickerBox}>
                            <Picker
                                selectedValue={notification}
                                onValueChange={(itemValue) => setNotification(itemValue)}
                            >
                                <Picker.Item label="5 min" value="5 min" />
                                <Picker.Item label="10 min" value="10 min" />
                                <Picker.Item label="15 min" value="15 min" />
                                <Picker.Item label="30 min" value="30 min" />
                            </Picker>
                        </View> */}

                        {/* Description */}
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            placeholder="Add a description"
                            value={description}
                            onChangeText={setDescription}
                            style={[styles.input, { height: 80 }]}
                            multiline
                        />
                    </ScrollView>

                    <TouchableOpacity style={styles.createButton} onPress={() => handleCreateMeeting()}>
                        <Text style={styles.createButtonText}>Create New Meeting  +</Text>
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
        textAlign:'center',
        color: '#111',
    },
});

