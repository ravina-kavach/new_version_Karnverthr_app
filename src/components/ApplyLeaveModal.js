import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { COLOR } from '../theme/theme';
import Dropdown from './Dropdown';
import { GlobalFonts } from '../theme/typography';
import { FontSize } from '../utils/metrics';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const ApplyLeaveModal = ({
  UsersigninData,
  leaveTypeData,
  setSelectedLeaveType,
  selectedLeaveType,
  visible,
  onClose,
  onSave,
  selectStartDate,
  selectEndDate,
  openStartDataPicker,
  openEndDataPicker,
  onChangeStartDate,
  onChangeEndDate,
  setOpenStartDatePicker,
  setOpenEndDatePicker,
  resonText,
  setResonText,
  isPublicLeave,
  isOverTimeLeave,
  isEarnedLeave,
}) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!selectedLeaveType?.id) {
      newErrors.leaveType = 'Leave type is required';
    }

    if (!selectStartDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!selectEndDate) {
      newErrors.endDate = 'End date is required';
    }

    if (
      selectStartDate &&
      selectEndDate &&
      moment(selectEndDate).isBefore(selectStartDate)
    ) {
      newErrors.endDate = 'End date cannot be before start date';
    }

    if (!resonText || resonText.trim().length < 5) {
      newErrors.description = 'Minimum 5 characters required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAndSubmit = () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('employee_id', UsersigninData?.id);
    formData.append('leave_type_id', selectedLeaveType.id);
    formData.append(
      'start_date',
      moment(selectStartDate).format('YYYY-MM-DD')
    );
    formData.append(
      'end_date',
      moment(selectEndDate).format('YYYY-MM-DD')
    );
    formData.append('description', resonText);
    formData.append('include_public_holiday', isPublicLeave ? 1 : 0);
    formData.append('overtime_deductible', isOverTimeLeave ? 1 : 0);
    formData.append('earned_leave', isEarnedLeave ? 1 : 0);

    onSave(formData);
  };

  useEffect(() => {
    if (
      selectStartDate &&
      selectEndDate &&
      moment(selectEndDate).isBefore(selectStartDate)
    ) {
      setErrors((prev) => ({
        ...prev,
        endDate: 'End date cannot be before start date',
      }));
    } else {
      setErrors((prev) => ({ ...prev, endDate: null }));
    }
  }, [selectStartDate]);

  return (
    <Modal visible={visible} statusBarTranslucent transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Apply Leave</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Employee</Text>
          <View style={styles.userInput}>
            <Text style={styles.placeholder}>
              {UsersigninData?.full_name}
            </Text>
          </View>

          <Text style={styles.label}>Leave Type</Text>
          <View
            style={[
              styles.dropdownBox,
              errors.leaveType && styles.inputError,
            ]}
          >
            <Dropdown
              DropdownData={leaveTypeData}
              Selecteditem={selectedLeaveType}
              setSelecteditem={(item) => {
                setSelectedLeaveType(item);
                setErrors((prev) => ({ ...prev, leaveType: null }));
              }}
            />
          </View>
          {errors.leaveType && (
            <Text style={styles.errorText}>{errors.leaveType}</Text>
          )}

          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  errors.startDate && styles.inputError,
                ]}
                onPress={() => setOpenStartDatePicker(true)}
              >
                <Text style={styles.placeholder}>
                  {selectStartDate
                    ? moment(selectStartDate).format('DD/MM/YYYY')
                    : 'Select date'}
                </Text>
              </TouchableOpacity>
              {errors.startDate && (
                <Text style={styles.errorText}>{errors.startDate}</Text>
              )}
            </View>

            <View style={styles.flex}>
              <Text style={styles.label}>End Date</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  errors.endDate && styles.inputError,
                ]}
                onPress={() => setOpenEndDatePicker(true)}
              >
                <Text style={styles.placeholder}>
                  {selectEndDate
                    ? moment(selectEndDate).format('DD/MM/YYYY')
                    : 'Select date'}
                </Text>
              </TouchableOpacity>
              {errors.endDate && (
                <Text style={styles.errorText}>{errors.endDate}</Text>
              )}
            </View>
          </View>

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              errors.description && styles.inputError,
            ]}
            value={resonText}
            onChangeText={(text) => {
              setResonText(text);
              setErrors((prev) => ({ ...prev, description: null }));
            }}
            placeholder="Add a description..."
            placeholderTextColor="#999"
            multiline
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={validateAndSubmit}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {openStartDataPicker && (
          <DateTimePicker
            value={selectStartDate || new Date()}
            mode="date"
            onChange={onChangeStartDate}
            minimumDate={new Date()}
          />
        )}

        {openEndDataPicker && (
          <DateTimePicker
            value={selectEndDate || new Date()}
            mode="date"
            onChange={onChangeEndDate}
            minimumDate={selectStartDate || new Date()}
          />
        )}
      </View>
    </Modal>
  );
};

export default ApplyLeaveModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: { fontSize: 18, fontWeight: '600' },
  close: { fontSize: 18, color: '#666' },
  label: { marginTop: 10, marginBottom: 6, color: '#555' },

  dropdownBox: {
    backgroundColor: COLOR.White1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },

  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },

  inputError: {
    borderColor: '#E53935',
  },

  userInput: {
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: COLOR.White1,
  },

  placeholder: {
    color: COLOR.Secondary,
    ...GlobalFonts.normalText,
    fontSize: FontSize.Font14,
  },

  row: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
  textArea: { height: 80, textAlignVertical: 'top' },

  errorText: {
    color: '#E53935',
    fontSize: 12,
    marginTop: 4,
  },

  footer: {
    flexDirection: 'row',
    marginTop: 20,
  },

  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  saveBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: { color: '#333' },
  saveText: { color: '#fff', fontWeight: '600' },
});
