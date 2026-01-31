import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLOR } from '../theme/theme';
import { GlobalFonts } from '../theme/typography';
import { FontSize } from '../utils/metrics';

const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const NewMeetingModal = ({ t, visible, onClose, onCreateMeeting }) => {
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (endDate <= startDate) {
      const updatedEnd = new Date(startDate);
      updatedEnd.setMinutes(updatedEnd.getMinutes() + 30);
      setEndDate(updatedEnd);
    }
  }, [startDate]);

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
    setErrors({});
  };

  const formatDateTime = (date) => {
    const pad = (n) => (n < 10 ? `0${n}` : n);
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(
      date.getHours()
    )}:${pad(date.getMinutes())}:00`;
  };

  const calculateDuration = (start, end) =>
    Number(((end - start) / (1000 * 60 * 60)).toFixed(1));

  const validateForm = () => {
    const newErrors = {};

    if (!subject.trim()) newErrors.subject = t('Validation.subjectRequired');
    else if (subject.trim().length < 3)
      newErrors.subject = t('Validation.subjectShort');

    if (startDate <= new Date())
      newErrors.startDate = t('Validation.startPast');

    if (endDate <= startDate)
      newErrors.endDate = t('Validation.endBeforeStart');

    if (!location.trim())
      newErrors.location = t('Validation.locationRequired');

    if (!organizer.trim())
      newErrors.organizer = t('Validation.organizerRequired');

    if (description.length > 150)
      newErrors.description = t('Validation.descriptionTooLong');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateMeeting = () => {
    if (!validateForm()) return;

    const payload = {
      name: subject.trim(),
      start: formatDateTime(startDate),
      stop: formatDateTime(endDate),
      location: location.trim(),
      duration: calculateDuration(startDate, endDate),
      description: description.trim(),
      privacy: 'private',
    };

    onCreateMeeting(payload);
    resetForm();
    onClose();
  };

  const onChangePicker = (event, selectedDate) => {
    if (event.type === 'dismissed' || !selectedDate) {
      setPickerMode(null);
      return;
    }

    const now = new Date();

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
      updated.setHours(selectedDate.getHours(), selectedDate.getMinutes());

      if (isSameDay(updated, now) && updated < now) {
        setErrors({ startDate: t('Validation.startPast') });
        setPickerMode(null);
        return;
      }
      setStartDate(updated);
    }

    if (pickerMode === 'endDate') {
      const updated = new Date(endDate);
      updated.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );

      if (updated < startDate) {
        setErrors({ endDate: t('Validation.endBeforeStart') });
        setPickerMode(null);
        return;
      }
      setEndDate(updated);
    }

    if (pickerMode === 'endTime') {
      const updated = new Date(endDate);
      updated.setHours(selectedDate.getHours(), selectedDate.getMinutes());

      if (updated <= startDate) {
        setErrors({ endDate: t('Validation.endBeforeStart') });
        setPickerMode(null);
        return;
      }
      setEndDate(updated);
    }

    setErrors({});
    setPickerMode(null);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>New Meeting</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Subject */}
            <Text style={styles.label}>Meeting Subject</Text>
            <TextInput
              style={[styles.input, errors.subject && styles.errorInput]}
              placeholder="Enter meeting subject"
              value={subject}
              onChangeText={(text) => setSubject(text)}
            />
            {errors.subject && <Text style={styles.errorText}>{errors.subject}</Text>}

            {/* From */}
            <Text style={styles.label}>From</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.dateTimeBox} onPress={() => setPickerMode('startDate')}>
                <Text>{startDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dateTimeBox} onPress={() => setPickerMode('startTime')}>
                <Text>{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </TouchableOpacity>
            </View>
            {errors.startDate && <Text style={styles.errorText}>{errors.startDate}</Text>}

            {/* To */}
            <Text style={styles.label}>To</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.dateTimeBox} onPress={() => setPickerMode('endDate')}>
                <Text>{endDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dateTimeBox} onPress={() => setPickerMode('endTime')}>
                <Text>{endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </TouchableOpacity>
            </View>
            {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}

            {pickerMode && (
              <DateTimePicker
                value={pickerMode.includes('start') ? startDate : endDate}
                mode={pickerMode.includes('Date') ? 'date' : 'time'}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={
                  pickerMode.includes('start') ? new Date() : startDate
                }
                onChange={onChangePicker}
              />
            )}

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={[styles.input, errors.location && styles.errorInput]}
              placeholder="Enter location"
              value={location}
              onChangeText={setLocation}
            />
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

            <Text style={styles.label}>Organizer</Text>
            <TextInput
              style={[styles.input, errors.organizer && styles.errorInput]}
              placeholder="Enter organizer"
              value={organizer}
              onChangeText={setOrganizer}
            />
            {errors.organizer && <Text style={styles.errorText}>{errors.organizer}</Text>}

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              multiline
              maxLength={150}
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
            />
            <Text style={styles.charCount}>{description.length}/150</Text>
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
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        maxHeight: '90%',
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
    },
    closeBtn: {
        position: 'absolute',
        right: 0,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111',
    },
    label: {
        ...GlobalFonts.subtitle,
        fontSize: FontSize.Font16,
        color: COLOR.Black1,
        marginTop: 12,
        marginBottom: 6,
    },
    input: {
        ...GlobalFonts.subtitle,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
    },
    errorInput: {
        borderWidth: 1,
        borderColor: '#DC2626',
    },
    errorText: {
        color: '#DC2626',
        fontSize: 12,
        marginTop: 4,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
    },
    dateTimeBox: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    charCount: {
        alignSelf: 'flex-end',
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    createButton: {
        backgroundColor: '#111827',
        paddingVertical: 16,
        borderRadius: 18,
        marginTop: 12,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    close: {
        fontSize: 18,
        color: '#666',
    },
});
