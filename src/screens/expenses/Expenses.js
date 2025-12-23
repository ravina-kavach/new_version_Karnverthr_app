import { View, Text, ScrollView, TextInput, TouchableWithoutFeedback, ActivityIndicator, Image, Modal, TouchableOpacity, Dimensions, FlatList, RefreshControl, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { ColView, commonStyle, Label, RowView, Valide } from '../../utils/common'
import { COLOR,STATE } from '../../theme/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
// import RadioGroup from 'react-native-radio-buttons-group';
// import Entypo from 'react-native-vector-icons/dist/Entypo';
// import AntDesign from 'react-native-vector-icons/dist/AntDesign';
// import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
// import Feather from 'react-native-vector-icons/dist/Feather';
import moment from 'moment'
import Dropdown from '../../components/Dropdown'
import { useExpenses } from './ExpensesController'
import NodataFound from '../../components/NodataFound'
import { CommonView } from '../../utils/common'

export default function Expenses() {

  const {
    t,
    IsStartdatepickeropen,
    startDate,
    Catagory,
    selectedId,
    FileObj,
    Formdata,
    IsExoensemodal,
    PreviewVisible,
    PreviewImage,
    SubmitExpense,
    onChangeStartDate,
    closeModal,
    onRefresh,
    openImage,
    CategoryListData,
    isCreateExpensesFetching,
    GetExpenseListData,
    isGetExpenseListFetching,
    setSelectedId,
    Validator,
    setCatagory,
    setIsExoensemodal,
    heandleonCamera,
    setIsStartdatepickeropen,
    setPreviewVisible,
    setFormdata
  } = useExpenses()

  // ==========================

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <RowView>
        <ColView>
          <Text style={styles.labelText}>
            {t('Expenses.Name')}:{' '}
            <Text style={styles.valueText}>{item.name}</Text>
          </Text>

          <Text style={styles.labelText}>
            {t('Expenses.employee')}:{' '}
            <Text style={styles.valueText}>{item.employee}</Text>
          </Text>

          {item.description && (
            <Text style={styles.description}>{item.description}</Text>
          )}

          <Text style={styles.labelText}>
            {t('Expenses.Amount')}:{' '}
            <Text style={styles.amountText}>
              ₹ {item.total_amount.toFixed(2)}
            </Text>
          </Text>

          <View style={styles.statusRow}>
            <Text style={styles.labelText}>
              {t('Expenses.Status')}:
            </Text>
            <Text
              style={[
                styles.statusBadge,
                { backgroundColor: STATE[item.state] },
              ]}>
              {item.state}
            </Text>
          </View>
        </ColView>

        <ColView style={styles.rightColumn}>
          <Text style={styles.dateText}>
            {moment(item.date).format('DD-MM-yyyy')}
          </Text>

          {item.attachments?.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.attachmentScroll}>
              {item.attachments.map((img, idx) => {
                const uri = img.data
                  ? `data:${img.mimetype};base64,${img.data}`
                  : null;

                return (
                  uri && (
                    <TouchableWithoutFeedback
                      key={idx}
                      onPress={() => openImage(uri)}>
                      <Image
                        source={{ uri }}
                        resizeMode="cover"
                        style={styles.attachmentImage}
                      />
                    </TouchableWithoutFeedback>
                  )
                );
              })}
            </ScrollView>
          )}
        </ColView>
      </RowView>
    </View>
  );


  return (
    <CommonView edges={['left', 'right', 'bottom']}>
      <View style={styles.flexContainer}>
        <View style={styles.container}>
          <FlatList
            data={GetExpenseListData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={isGetExpenseListFetching} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.contentContainer}
            ListEmptyComponent={() => (
              <NodataFound />
            )}
          />
        </View>
        <TouchableWithoutFeedback onPress={() => setIsExoensemodal(true)}>
          <View style={styles.plusContainer}>
            <View style={styles.iconContainer}>
              {/* <AntDesign name="plus" color={COLOR.White1} size={24} /> */}
            </View>
          </View>
        </TouchableWithoutFeedback>
        {/* ----- create expense modal ------ */}
        <Modal
          animationType="none"
          transparent={true}
          visible={IsExoensemodal}
          onRequestClose={closeModal}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: COLOR.background2, justifyContent: 'center', alignItems: 'center', }} onPress={closeModal}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: 'rgba(232, 232, 232, 1)', padding: 5, borderRadius: 15, width: Dimensions.get('window').width - 40, }}>
                <ScrollView>
                  <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: 20, marginBottom: 10, color: COLOR.Black1, fontWeight: '600', textAlign: 'center' }}>{t('Expenses.Create_Expense')}</Text>
                    <RowView>
                      <ColView>
                        <View style={{}}>
                          <Text style={{ fontSize: 15, fontWeight: "500", color: COLOR.Black1, marginBottom: 5 }}>{t('Expenses.Payment_Mode')}</Text>
                          {/* <RadioGroup
                            radioButtons={[
                              {
                                id: 1, // acts as primary key, should be unique and non-empty string
                                label: `${t('Expenses.Own_account')}`,
                                value: 'own_account',
                                borderColor: COLOR.button,
                                color: COLOR.button,
                                labelStyle: { color: COLOR.Black1, },
                                containerStyle: { alignSelf: 'flex-start' }
                              },
                              {
                                id: 2,
                                label: `${t('Expenses.Compnay')}`,
                                value: 'company_account',
                                borderColor: COLOR.button,
                                color: COLOR.button,
                                labelStyle: { color: COLOR.Black1, },
                                containerStyle: { alignSelf: 'flex-start' }
                              }
                            ]}
                            onPress={setSelectedId}
                            selectedId={selectedId}
                            containerStyle={{ flexDirection: 'column', }}
                          /> */}
                        </View>
                      </ColView>
                      <ColView style={{ flex: 0 }}>
                        <View style={{ marginBottom: 10, alignItems: 'flex-end' }}>
                          <View style={{ borderRadius: 20, borderWidth: 1, height: 100, width: 100, justifyContent: 'center', overflow: 'hidden', }}>
                            {FileObj.base64 ? (
                              <Image source={{ uri: `data:image/png;base64,${FileObj?.base64}` }} style={{ height: 138, width: 138, }} resizeMode='cover' />
                            ) : (
                              <TouchableWithoutFeedback onPress={() => heandleonCamera()}>
                                <View style={{ borderRadius: 20, borderWidth: 1, height: 100, width: 100, justifyContent: 'center', alignItems: 'center', }}>
                                  {/* <Feather name="plus" color={COLOR.button} size={35} /> */}
                                </View>
                              </TouchableWithoutFeedback>
                            )}
                          </View>
                        </View>
                      </ColView>
                    </RowView>
                    <View style={{ position: 'relative', }}>
                      <Text style={{ fontSize: 15, fontWeight: "500", color: COLOR.dark2, marginBottom: 5 }}>{t('Expenses.Expense_Name')}</Text>
                      <TextInput
                        style={{ backgroundColor: COLOR.White1, color: COLOR.Black1, borderRadius: 10, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 5, padding: 10 }}
                        cursorColor={COLOR.button}
                        onChangeText={(value) => setFormdata({ ...Formdata, ExpenseName: value })}
                        value={Formdata.ExpenseName}
                        placeholder={t('placeholders.Enter_your_ExpenseName')}
                        placeholderTextColor={COLOR.dark4}
                        autoCapitalize="none"
                        maxLength={150}
                      />
                      <View style={{ position: 'absolute', bottom: 30, right: 10 }}>
                        {/* <Entypo name='add-to-list' size={24} color={COLOR.button} /> */}
                      </View>
                      <Valide>{Validator.current.message('Expense Name', Formdata.ExpenseName, 'required')}</Valide>
                    </View>
                    <View style={{ position: 'relative', }}>
                      <Text style={{ fontSize: 15, fontWeight: "500", color: COLOR.dark2, marginBottom: 5 }}>{t('Expenses.Amount')}</Text>
                      <TextInput
                        style={{ backgroundColor: COLOR.White1, color: COLOR.Black1, borderRadius: 10, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 5, padding: 10 }}
                        cursorColor={COLOR.button}
                        onChangeText={(value) => setFormdata({ ...Formdata, Amount: value })}
                        value={Formdata.Amount}
                        placeholder={t('placeholders.Enter_your_Amount')}
                        placeholderTextColor={COLOR.dark4}
                        keyboardType='numeric'
                        autoCapitalize="none"
                        maxLength={150}
                      />
                      <View style={{ position: 'absolute', bottom: 30, right: 10 }}>
                        {/* <MaterialIcons name='currency-rupee' size={24} color={COLOR.button} /> */}
                      </View>
                      <Valide>{Validator.current.message('Amount', Formdata.Amount, 'required')}</Valide>
                    </View>
                    <View style={{ marginBottom: 10, }}>
                      <Text style={{ fontSize: 15, fontWeight: "500", color: COLOR.dark2, marginBottom: 5 }}>{t('Expenses.Catagory')}</Text>
                      <Dropdown
                        DropdownData={CategoryListData}
                        setSelecteditem={setCatagory}
                        Selecteditem={Catagory}
                      />
                    </View>
                    <View style={{ marginBottom: 10, position: 'relative', }}>
                      <Text style={{ fontSize: 15, fontWeight: "500", color: COLOR.dark2, marginBottom: 5 }}>{t('Expenses.Expense_Date')}</Text>
                      <TouchableWithoutFeedback onPress={() => setIsStartdatepickeropen(true)}>
                        <View style={[commonStyle.input, { paddingRight: 0, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 5, borderWidth: 0, }]}>
                          <RowView>
                            <ColView>
                              <Text style={{ paddingEnd: 15, color: COLOR.Black1 }}>{startDate ? moment(startDate).format('DD-MM-YYYY') : `${t('Expenses.Expense_Date')}`}</Text>
                            </ColView>
                            <ColView style={{ flex: 0, paddingTop: 10, paddingRight: 15 }}>
                              {/* {IsStartdatepickeropen ? (
                                <Entypo name='chevron-up' color={COLOR.button} size={26} />
                              ) : (
                                <Entypo name='chevron-down' color={COLOR.button} size={26} />
                              )} */}
                            </ColView>
                          </RowView>
                        </View>
                      </TouchableWithoutFeedback>
                      {IsStartdatepickeropen && (
                        <DateTimePicker
                          value={startDate || new Date()}
                          mode="date"
                          display="default"
                          onChange={onChangeStartDate}
                          maximumDate={new Date()}
                          themeVariant="light"
                        />
                      )}
                    </View>
                    <View>
                      <TouchableWithoutFeedback onPress={() => SubmitExpense()} >
                        <View style={[commonStyle.btn_primary_round, { backgroundColor: COLOR.button, borderRadius: 10 }]}>
                          <View style={{ flexDirection: 'row' }}>
                            <Label style={{ color: COLOR.White1, marginBottom: 0, marginRight: 10 }}>{t('Button.Submit')}</Label>
                            {isCreateExpensesFetching && <ActivityIndicator animating={isCreateExpensesFetching} color={COLOR.White1} />}
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
        {/* Full-Screen Preview Modal */}
        <Modal visible={PreviewVisible} transparent={true}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center', }}>
            <Pressable onPress={() => setPreviewVisible(false)} style={{ position: 'absolute', top: 40, right: 20, zIndex: 1 }}>
              <Text style={{ color: COLOR.White1, fontSize: 18 }}>{t('Button.Close')} ✕</Text>
            </Pressable>
            {PreviewImage && (
              <Image
                source={{ uri: PreviewImage }}
                style={{ width: Dimensions.get('window').width - 40, height: Dimensions.get('window').height * 0.8, resizeMode: 'contain', }}
              />
            )}
          </View>
        </Modal>
      </View>
    </CommonView>
  )


  const styles = StyleSheet.create({
    card: {
      backgroundColor: COLOR.White1,
      borderRadius: 12,
      padding: 10,
      marginBottom: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    flexContainer: { flex: 1 },
    iconContainer: { backgroundColor: COLOR.primary1, padding: 5, borderRadius: 15 },
    container: { marginHorizontal: 10 },
    contentContainer: { paddingVertical: 10 },
    labelText: {
      fontWeight: '600',
      fontSize: 16,
      color: COLOR.Black1,
      marginBottom: 5,
      textTransform: 'capitalize',
    },

    plusContainer: { position: "absolute", right: 20, bottom: 30 },

    valueText: {
      color: COLOR.dark2,
      fontWeight: '500',
      textTransform: 'capitalize',
    },

    description: {
      fontSize: 14,
      color: '#444',
      marginVertical: 2,
    },

    amountText: {
      color: COLOR.button,
      fontWeight: '500',
    },

    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    statusBadge: {
      fontWeight: '500',
      color: COLOR.White1,
      paddingVertical: 3,
      paddingHorizontal: 7,
      borderRadius: 15,
    },

    rightColumn: {
      flex: 0,
    },

    dateText: {
      fontSize: 16,
      color: COLOR.Black1,
      textAlign: 'center',
      marginVertical: 2,
      fontWeight: '600',
    },

    attachmentScroll: {
      marginBottom: 10,
    },

    attachmentImage: {
      width: 80,
      height: 80,
      borderRadius: 10,
      marginRight: 8,
      backgroundColor: '#eee',
    },
  });

}