import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Modal,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLOR } from '../theme/theme';
import { GlobalFonts } from '../theme/typography';
import { FontSize } from '../utils/metrics';
import Dropdown from './Dropdown';
import { useTranslation } from 'react-i18next';

const AttendanceRegModal = ({ data, visible, onClose, onCreateReq, loading }) => {
    const { t } = useTranslation();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [regCategories, setRegCategories] = useState(null);
    const [description, setDescription] = useState('');
    const [pickerMode, setPickerMode] = useState(null);

    const [errors, setErrors] = useState({
        regCategory: '',
        description: '',
    });

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

    const today = new Date();
    const maxSelectableDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59
    );

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

    const formatUIDate = (date) => {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = { regCategory: '', description: '' };

        if (!regCategories || !regCategories.id) {
            newErrors.regCategory = 'Please select Regularization type';
            valid = false;
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
            valid = false;
        } else if (description.length < MIN_DESC_LENGTH) {
            newErrors.description = `Minimum ${MIN_DESC_LENGTH} characters required`;
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleCreateReg = () => {
        if (!validateForm()) return;

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

    const onChangePicker = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setPickerMode(null);
            return;
        }

        if (!selectedDate || selectedDate > maxSelectableDate) {
            setPickerMode(null);
            return;
        }

        const updateDateTime = (baseDate, setter) => {
            const updated = new Date(baseDate);
            if (pickerMode.includes('Date')) {
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
            setter(updated);
        };

        if (pickerMode.includes('start')) {
            updateDateTime(startDate, setStartDate);
        } else {
            updateDateTime(endDate, setEndDate);
        }

        setPickerMode(null);
    };

    return (
        <Modal visible={visible} statusBarTranslucent transparent>
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Attendance Regularization</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.close}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                        {/* Regularization */}
                        <Text style={styles.label}>Regularization</Text>

                        <View
                            style={[
                                styles.dropdownWrapper,
                                errors.regCategory && styles.errorBorder,
                            ]}
                        >
                            <Dropdown
                                DropdownData={updatedData}
                                Selecteditem={regCategories}
                                setSelecteditem={(item) => {
                                    setRegCategories(item);
                                    setErrors((prev) => ({
                                        ...prev,
                                        regCategory: '',
                                    }));
                                }}
                            />
                        </View>

                        {errors.regCategory ? (
                            <Text style={styles.errorText}>
                                {errors.regCategory}
                            </Text>
                        ) : null}

                        {/* Check In */}
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
                                    {startDate.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Check Out */}
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
                                    {endDate.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {pickerMode && (
                            <DateTimePicker
                                value={
                                    pickerMode.includes('start')
                                        ? startDate
                                        : endDate
                                }
                                mode={
                                    pickerMode.includes('Date')
                                        ? 'date'
                                        : 'time'
                                }
                                display={
                                    Platform.OS === 'ios'
                                        ? 'spinner'
                                        : 'default'
                                }
                                maximumDate={
                                    pickerMode.includes('Date')
                                        ? maxSelectableDate
                                        : undefined
                                }
                                is24Hour={false} 
                                onChange={onChangePicker} 
                            />
                        )}

                        {/* Description */}
                        <Text style={styles.label}>Description</Text>

                        <TextInput
                            placeholder="Add a description"
                            placeholderTextColor={COLOR.TextPlaceholder}
                            value={description}
                            onChangeText={(text) => {
                                if (text.length <= MAX_DESC_LENGTH) {
                                    setDescription(text);
                                    setErrors((prev) => ({
                                        ...prev,
                                        description: '',
                                    }));
                                }
                            }}
                            style={[
                                styles.input,
                                { height: 80 },
                                errors.description && styles.errorBorder,
                            ]}
                            multiline
                        />

                        {errors.description ? (
                            <Text style={styles.errorText}>
                                {errors.description}
                            </Text>
                        ) : null}

                        <Text style={styles.charCount}>
                            {description.length}/{MAX_DESC_LENGTH}
                        </Text>
                    </ScrollView>

                    {/* Footer */}
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
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 20,
        maxHeight: '90%',
        width: '90%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    close: {
        fontSize: 18,
        color: '#666',
    },
    label: {
        ...GlobalFonts.subtitle,
        fontSize: FontSize.Font15,
        color: COLOR.Black1,
        marginBottom: 6,
        marginTop: 10,
    },
    dropdownWrapper: {
        borderRadius: 12,
    },
    input: {
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
    footer: {
        flexDirection: 'row',
        marginTop: 25,
    },
    cancelBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 10,
    },
    saveBtn: {
        flex: 1,
        backgroundColor: '#000',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelText: {
        color: '#000',
        fontWeight: '500',
    },
    saveText: {
        color: '#fff',
        fontWeight: '600',
    },
    charCount: {
        fontSize: 12,
        color: COLOR.TextSecondary,
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
    errorBorder: {
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 12,
    },
});
