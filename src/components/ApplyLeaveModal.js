import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import { COLOR } from '../theme/theme';
import Dropdown from './Dropdown';
import { GlobalFonts } from '../theme/typography';
import { FontSize } from '../utils/metrics';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { CheckBox, FillCheckbox } from '../assets/icons';

const ApplyLeaveModal = ({
  UsersigninData,
  leaveTypeData,
  setSelectedLeaveType,
  selectedLeaveType,
  departmentTypeData,
  setSelectedDeptType,
  selectedDeptType,
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
  setIsPublicLeave,
  isOverTimeLeave,
  setIsOverTimeLeave,
  isEarnedLeave,
  setIsEarnedLeave
}) => {

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Apply Leave</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Employee */}
          <Text style={styles.label}>Employee</Text>
          <View style={styles.input}>
            <Text style={styles.placeholder}>{UsersigninData?.full_name}</Text>
          </View>

          {/* Leave Type */}
          <Text style={styles.label}>Leave Type</Text>
          <View style={styles.dropdownBox}>
            <Dropdown
              DropdownData={leaveTypeData}
              setSelecteditem={setSelectedLeaveType}
              Selecteditem={selectedLeaveType}
            />
          </View>

          {/* Department */}
          {/* <Text style={styles.label}>Department Name</Text>
          <View style={styles.dropdownBox}>
            <Dropdown
              DropdownData={departmentTypeData}
              setSelecteditem={setSelectedDeptType}
              Selecteditem={selectedDeptType}
            />
          </View> */}

          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity style={styles.input} onPress={() => setOpenStartDatePicker(true)}>
                <Text style={styles.placeholder}>{moment(selectStartDate).format("DD/MM/YYYY")}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.flex}>
              <Text style={styles.label}>End Date</Text>
              <TouchableOpacity style={styles.input} onPress={() => setOpenEndDatePicker(true)}>
                <Text style={styles.placeholder}>{moment(selectEndDate).format("DD/MM/YYYY")}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={resonText}
            onChangeText={(text) => setResonText(text)}
            placeholder="Add a description..."
            placeholderTextColor="#999"
            multiline
          />

          {/* <TouchableOpacity activeOpacity={1} style={styles.leavetypeContainer} onPress={() => setIsPublicLeave(!isPublicLeave)}>
            <Image width={12} height={12} source={isPublicLeave ? FillCheckbox : CheckBox} />
            <Text style={styles.leaveTypeText}>Include Public Holiday</Text>
          </TouchableOpacity >
          <TouchableOpacity activeOpacity={1} style={styles.leavetypeContainer} onPress={() => setIsOverTimeLeave(!isOverTimeLeave)}>
            <Image width={12} height={12} source={isOverTimeLeave ? FillCheckbox : CheckBox} />
            <Text style={styles.leaveTypeText}>Overtime Deductible</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.leavetypeContainer} onPress={() => setIsEarnedLeave(!isEarnedLeave)}>
            <Image width={12} height={12} source={isEarnedLeave ? FillCheckbox : CheckBox} />
            <Text style={styles.leaveTypeText}>Eearned Leave</Text>
          </TouchableOpacity> */}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
        {openStartDataPicker && (
          <DateTimePicker
            value={selectStartDate || new Date()}
            mode="date"
            display="default"
            onChange={onChangeStartDate}
            minimumDate={new Date()}
            themeVariant="light"
          />
        )}

        {openEndDataPicker && (
          <DateTimePicker
            value={selectEndDate || new Date()}
            mode="date"
            display="default"
            onChange={onChangeEndDate}
            minimumDate={new Date()}
            themeVariant="light"
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownBox: {
    marginBottom: 10,
    backgroundColor: COLOR.White1,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
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
    marginBottom: 12,
  },
  leavetypeContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  close: {
    fontSize: 18,
    color: '#666',
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#E2E2E2',
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
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  flex: {
    flex: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelText: {
    color: '#333',
    fontWeight: '500',
  },
  leaveTypeText: {
    ...GlobalFonts.normalText,
    fontSize: FontSize.Font14,
    paddingLeft: 10
  },
  saveBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
});


export default ApplyLeaveModal;
