import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    TextInput,
    Image,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import RadioGroup from 'react-native-radio-buttons-group';
import { COLOR } from '../theme/theme';
import { GlobalFonts } from '../theme/typography';

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
    t,
}) => {

    return (
        <Modal animationType="fade" transparent visible={visible}>
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={closeModal}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.card}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.title}>{t('Expenses.Create_Expense')}</Text>
                            <Text style={styles.label}>{t('Expenses.Payment_Mode')}</Text>
                            <RadioGroup
                                radioButtons={[
                                    {
                                        id: 1,
                                        label: t('Expenses.Own_account'),
                                        value: 'own',
                                        color: COLOR.button,
                                    },
                                    {
                                        id: 2,
                                        label: t('Expenses.Compnay'),
                                        value: 'company',
                                        color: COLOR.button,
                                    },
                                ]}
                                onPress={setSelectedId}
                                selectedId={selectedId}
                                containerStyle={styles.radioRow}
                            />

                            <Text style={styles.label}>{t('Expenses.Upload_Document')}</Text>
                            <TouchableOpacity
                                style={styles.uploadBox}
                                onPress={heandleonCamera}
                            >
                                {FileObj?.base64 ? (
                                    <Text style={styles.placeholder}>
                                        {"Expense.png"}
                                    </Text>
                                ) : (
                                    <Text style={styles.placeholder}>
                                        {t('Expenses.Upload_Document')}
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <Text style={styles.label}>{t('Expenses.Expense_Name')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={t('placeholders.Enter_your_ExpenseName')}
                                placeholderTextColor="#999"
                                value={Formdata.ExpenseName}
                                onChangeText={(v) =>
                                    setFormdata({ ...Formdata, ExpenseName: v })
                                }
                            />

                            <Text style={styles.label}>{t('Expenses.Amount')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={t('placeholders.Enter_your_Amount')}
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                value={Formdata.Amount}
                                onChangeText={(v) =>
                                    setFormdata({ ...Formdata, Amount: v })
                                }
                            />

                            <Text style={styles.label}>{t('Expenses.Catagory')}</Text>
                            <Dropdown
                                DropdownData={CategoryListData}
                                setSelecteditem={setSelectedCategoryType}
                                Selecteditem={selectCategoryType}

                            />

                            <Text style={styles.label}>{t('Expenses.Account')}</Text>
                            <Dropdown
                                DropdownData={AccountListData}
                                setSelecteditem={setSelectedAccountType}
                                Selecteditem={selectAccountType}

                            />

                            <Text style={styles.label}>{t('Expenses.Expense_Date')}</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setIsStartdatepickeropen(true)}
                            >
                                <Text>
                                    {startDate
                                        ? moment(startDate).format('DD/MM/YYYY')
                                        : t('Expenses.Expense_Date')}
                                </Text>
                            </TouchableOpacity>

                            {IsStartdatepickeropen && (
                                <DateTimePicker
                                    value={startDate || new Date()}
                                    mode="date"
                                    maximumDate={new Date()}
                                    onChange={onChangeStartDate}
                                />
                            )}

                            <View style={styles.footer}>
                                <TouchableOpacity
                                    style={styles.cancelBtn}
                                    onPress={closeModal}
                                >
                                    <Text style={styles.cancelText}>
                                        {t('Button.Cancel')}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.saveBtn}
                                    onPress={SubmitExpense}
                                >
                                    {isCreateExpensesFetching ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.saveText}>
                                            {t('Button.Save')}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
};

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
        backgroundColor: '#fff',
    },

    radioRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    uploadBox: {
        height: 50,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },

    uploadImage: {
        height: 48,
        width: '100%',
        borderRadius: 8,
    },

    placeholder: {
        color: '#999',
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


export default AddExpenseModal;
