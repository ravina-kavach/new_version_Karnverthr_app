import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import RadioGroup from 'react-native-radio-buttons-group';
import { GlobalFonts } from '../theme/typography';
import { COLOR } from '../theme/theme';
import ImagePickerSheet from './ImagePickerSheet';

export const AddExpenseModal = ({
  visible,
  closeModal,
  SubmitExpense,
  isCreateExpensesFetching,
  FileObj,
  heandleonCamera,
  CategoryListData,
  Dropdown,
  IsStartdatepickeropen,
  startDate,
  onChangeStartDate,
  setIsStartdatepickeropen,
  Formdata,
  setFormdata,
  selectedId,
  setSelectedId,
  selectCategoryType,
  setSelectedCategoryType,
  AccountListData,
  selectAccountType,
  setSelectedAccountType,
  isEditMode = false,
  isImagePickerVisible,
  setIsImagePickerVisible,
  onImagePicked,
  t,
}) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!selectedId)
      newErrors.paymentMode = t('Validation.Payment_Mode_Required');

    if (!isEditMode && !FileObj?.base64)
      newErrors.file = t('Validation.Document_Required');

    if (!selectCategoryType?.id)
      newErrors.category = t('Validation.Category_Required');

    if (!selectAccountType?.id)
      newErrors.account = t('Validation.Account_Required');

    if (!Formdata?.ExpenseName?.trim())
      newErrors.expenseName = t('Validation.Expense_Name_Required');

    if (!Formdata?.Amount)
      newErrors.amount = t('Validation.Amount_Required');
    else if (isNaN(Formdata.Amount))
      newErrors.amount = t('Validation.Amount_Invalid');

    if (!startDate)
      newErrors.date = t('Validation.Expense_Date_Required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = () => {
    if (!validateForm()) return;

    const data = new FormData();
    data.append('payment_mode', selectedId);
    data.append('expense_name', Formdata.ExpenseName);
    data.append('amount', Formdata.Amount);
    data.append('expense_date', moment(startDate).format('YYYY-MM-DD'));
    data.append('category_id', selectCategoryType.id);
    data.append('account_id', selectAccountType.id);

    if (FileObj?.uri) {
      data.append('document', {
        uri: FileObj.uri,
        name: FileObj.fileName || 'expense.jpg',
        type: FileObj.type || 'image/jpeg',
      });
    }

    SubmitExpense(data);
  };

  const handleClose = () => {
    setErrors({});
    closeModal();
  };

  return (
    <Modal animationType="fade" presentationStyle="overFullScreen" statusBarTranslucent transparent visible={visible}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose}>
        <TouchableWithoutFeedback>
          <View style={styles.card}>
            <ScrollView showsVerticalScrollIndicator={false}>

              <Text style={styles.title}>
                {isEditMode ? t('Expenses.Edit_Expense') : t('Expenses.Create_Expense')}
              </Text>

              <Text style={styles.label}>{t('Expenses.Payment_Mode')}</Text>
              <RadioGroup
                radioButtons={[
                  { id: 1, label: t('Expenses.Own_account'), value: 'own' },
                  { id: 2, label: t('Expenses.Compnay'), value: 'company' },
                ]}
                onPress={(id) => {
                  setSelectedId(id);
                  setErrors((p) => ({ ...p, paymentMode: null }));
                }}
                selectedId={selectedId}
                containerStyle={styles.radioRow}
              />
              {errors.paymentMode && <Text style={styles.errorText}>{errors.paymentMode}</Text>}

              <Text style={styles.label}>{t('Expenses.Upload_Document')}</Text>
              <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.uploadBox, errors.file && styles.errorBorder]}
                onPress={heandleonCamera}
              >
                <Text style={styles.placeholder}>
                  {FileObj?.base64 || isEditMode
                    ? t('Expenses.Document_Attached')
                    : t('Expenses.Upload_Document')}
                </Text>
              </TouchableOpacity>
              {errors.file && <Text style={styles.errorText}>{errors.file}</Text>}

              <Text style={styles.label}>{t('Expenses.Catagory')}</Text>
              <View style={[styles.dropdownWrapper, errors.category && styles.errorBorder]}>
                <Dropdown
                  DropdownData={CategoryListData}
                  Selecteditem={selectCategoryType}
                  setSelecteditem={(item) => {
                    setSelectedCategoryType(item);
                    setErrors((p) => ({ ...p, category: null }));
                  }}
                />
              </View>
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
              <Text style={styles.label}>{t('Expenses.Account')}</Text>
              <View style={[styles.dropdownWrapper, errors.account && styles.errorBorder]}>
                <Dropdown
                  DropdownData={AccountListData}
                  Selecteditem={selectAccountType}
                  setSelecteditem={(item) => {
                    setSelectedAccountType(item);
                    setErrors((p) => ({ ...p, account: null }));
                  }}
                />
              </View>
              {errors.account && <Text style={styles.errorText}>{errors.account}</Text>}

              <Text style={styles.label}>{t('Expenses.Expense_Name')}</Text>
              <TextInput
                style={[styles.input, errors.expenseName && styles.errorBorder]}
                placeholder='Expense name'
                placeholderTextColor={COLOR.TextPlaceholder}
                value={Formdata.ExpenseName}
                onChangeText={(v) => {
                  setFormdata({ ...Formdata, ExpenseName: v });
                  setErrors((p) => ({ ...p, expenseName: null }));
                }}
              />

              <Text style={styles.label}>{t('Expenses.Amount')}</Text>
              <TextInput
                style={[styles.input, errors.amount && styles.errorBorder]}
                placeholder='Amount'
                placeholderTextColor={COLOR.TextPlaceholder}
                keyboardType="numeric"
                value={Formdata.Amount}
                onChangeText={(v) => {
                  setFormdata({ ...Formdata, Amount: v });
                  setErrors((p) => ({ ...p, amount: null }));
                }}
              />
              <Text style={styles.label}>{t('Expenses.Expense_Date')}</Text>
              <TouchableOpacity
                style={[styles.input, errors.date && styles.errorBorder]}
                onPress={() => setIsStartdatepickeropen(true)}
              >
                <Text>
                  {startDate ? moment(startDate).format('DD/MM/YYYY') : t('Expenses.Expense_Date')}
                </Text>
              </TouchableOpacity>

              {IsStartdatepickeropen && (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={new Date()}
                  onChange={onChangeStartDate}
                />
              )}
              <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
                  <Text style={styles.cancelText}>{t('Button.Cancel')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={onSubmit}
                  disabled={isCreateExpensesFetching}
                >
                  {isCreateExpensesFetching ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveText}>{t('Button.Save')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
            {isImagePickerVisible && (
              <ImagePickerSheet
                visible={isImagePickerVisible}
                onClose={() => setIsImagePickerVisible(false)}
                onResult={onImagePicked}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default AddExpenseModal;


/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 16,
    padding: 20,
    maxHeight: '90%',
  },
  pickerContainer: {
    position:'absolute',
    backgroundColor: '#fff',
    borderColor:COLOR.Black1,
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  title: {
    ...GlobalFonts.subtitle,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    ...GlobalFonts.subtitle,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
  },
  uploadBox: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  dropdownWrapper: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  placeholder: {
    color: '#999',
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  errorBorder: {
    borderColor: 'red',
  },
});
