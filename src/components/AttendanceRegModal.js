import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    ScrollView,
    Modal
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLOR } from '../theme/theme';
import { GlobalFonts } from '../theme/typography';
import { FontSize } from '../utils/metrics';
import Dropdown from './Dropdown';
import { useTranslation } from 'react-i18next';

const AttendanceRegModal = ({ data, visible, onClose, onCreateReq, loading }) => {
    const { t, i18n } = useTranslation();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [regCategories, setRegCategories] = useState('');
    const [description, setDescription] = useState('');
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState(null);
    const MIN_DESC_LENGTH = 10;
    const MAX_DESC_LENGTH = 250;

    const updatedData = data.map(({ type, ...rest }) => ({
        ...rest,
        name: type,
    }));
    useEffect(() => {
        if (endDate <= startDate) {
            const newEnd = new Date(startDate);
            newEnd.setMinutes(newEnd.getMinutes() + 30);
            setEndDate(newEnd);
        }
    }, [startDate]);

    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const formatTime = (date) => {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    };

    const handleCreateReg = () => {
        const payload = {
            from_date: formatDate(startDate),
            to_date: formatDate(endDate),
            reg_category: regCategories.id,
            reg_reason: description,
            check_in: formatTime(startDate),
            check_out: formatTime(endDate),
        };
        onCreateReq(payload);
    };

    const today = new Date();
    const maxSelectableDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59
    );
    const onChangePicker = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setPickerMode(null);
            return;
        }

        if (!selectedDate) return;

        if (selectedDate > maxSelectableDate) {
            setPickerMode(null);
            return;
        }

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
    const formatUIDate = (date) => {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    };

    return (
        <Modal
            visible={visible}
        >
            <View style={styles.overlay} >
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Attendance Regularization</Text>
                        <TouchableOpacity style={{ alignItems: 'flex-end' }} onPress={onClose}>
                            <Text style={styles.close}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                        {/* Meeting Subject */}
                        <Text style={styles.label}>Regularization</Text>
                        {updatedData?.length > 0 ? (
                            <Dropdown
                                DropdownData={updatedData}
                                setSelecteditem={setRegCategories}
                                Selecteditem={regCategories}
                            />
                        ) : (
                            <Text style={styles.noDataText}>
                                No Regularization available
                            </Text>
                        )}
                        <Text style={styles.label}>Check In</Text>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={styles.dateTimeBox}
                                onPress={() => setPickerMode('startDate')}
                            >
                                <Text style={styles.dateTimeText}>
                                    {formatUIDate(startDate)}
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
                                // dateFormat='day month year'
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
                        <Text style={styles.label}>Check Out</Text>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={styles.dateTimeBox}
                                onPress={() => setPickerMode('endDate')}
                            >
                                <Text style={styles.dateTimeText}>
                                    {formatUIDate(endDate)}
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
                                value={pickerMode.includes('start') ? startDate : endDate}
                                mode={pickerMode.includes('Date') ? 'date' : 'time'}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                maximumDate={pickerMode.includes('Date') ? maxSelectableDate : undefined}
                                onChange={onChangePicker}
                            />
                        )}

                        <Text style={styles.label}>Description</Text>

                        <TextInput
                            placeholder="Add a description"
                            value={description}
                            onChangeText={(text) => {
                                if (text.length <= MAX_DESC_LENGTH) {
                                    setDescription(text);
                                }
                            }}
                            style={[styles.input, { height: 80 }]}
                            multiline
                            maxLength={MAX_DESC_LENGTH}
                        />

                        <Text style={styles.charCount}>
                            {description.length}/{MAX_DESC_LENGTH}
                        </Text>

                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelText}>
                                {t('Button.Cancel')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={handleCreateReg}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.saveText}>
                                    {t('Button.Save')}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AttendanceRegModal;

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 20,
        maxHeight: '90%',
    },
    noDataText: {
        ...GlobalFonts.subtitle,
        marginTop: 10,
        color: COLOR.TextPlaceholder,
        fontSize: 14,
        textAlign: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15,
        textAlign: 'center',
    },
    charCount: {
        fontSize: 12,
        color: COLOR.TextSecondary,
        alignSelf: 'flex-end',
        marginTop: 4,
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
    close: {
        fontSize: 18,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 6,
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
    footer: {
        flexDirection: 'row',
        marginTop: 25,
    },

    cancelBtn: {
        ...GlobalFonts.buttonText,
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 10,
    },

    saveBtn: {
        ...GlobalFonts.buttonText,
        flex: 1,
        backgroundColor: '#000',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },

    cancelText: {
        fontWeight: '500',
        color: '#000',
    },

    saveText: {
        fontWeight: '600',
        color: '#fff',
    },
});

