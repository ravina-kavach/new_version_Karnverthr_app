import { View, Text, ScrollView, TextInput, TouchableWithoutFeedback, ActivityIndicator, Image, Modal, TouchableOpacity, Dimensions, FlatList, RefreshControl, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { ColView, commonStyle, Label, RowView, Valide } from '../../utils/common'
import { COLOR, STATE } from '../../theme/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import RadioGroup from 'react-native-radio-buttons-group';
// import Entypo from 'react-native-vector-icons/dist/Entypo';
// import AntDesign from 'react-native-vector-icons/dist/AntDesign';
// import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
// import Feather from 'react-native-vector-icons/dist/Feather';
import moment from 'moment'
import Dropdown from '../../components/Dropdown'
import { useExpenses } from './ExpensesController'
import NodataFound from '../../components/NodataFound'
import { CommonView } from '../../utils/common'
import { PlusIcon } from '../../assets/svgs';
import { ArrowDown } from '../../assets/icons';
import AddExpenseModal from '../../components/AddExpenseModal'

export default function Expenses() {

  const {
    t,
    IsStartdatepickeropen,
    startDate,
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
    setIsExoensemodal,
    heandleonCamera,
    setIsStartdatepickeropen,
    setPreviewVisible,
    setFormdata,
    selectCategoryType,
    setSelectedCategoryType
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
    <CommonView >
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
              <View style={styles.placeHoldeContainer}>
                <NodataFound titleText={"Add expenses"} />
              </View>
            )}
          />
        </View>
        <TouchableWithoutFeedback onPress={() => setIsExoensemodal(true)}>
          <View style={styles.plusContainer}>
            <View style={styles.iconContainer}>
              <PlusIcon />
            </View>
          </View>
        </TouchableWithoutFeedback>
        {/* ----- create expense modal ------ */}
        <AddExpenseModal
          visible={IsExoensemodal}
          closeModal={closeModal}
          SubmitExpense={SubmitExpense}
          isCreateExpensesFetching={isCreateExpensesFetching}
          FileObj={FileObj}
          heandleonCamera={heandleonCamera}
          CategoryListData={CategoryListData}
          Dropdown={Dropdown}
          COLOR={COLOR}
          t={t}
          IsStartdatepickeropen={IsStartdatepickeropen}
          startDate={startDate}
          onChangeStartDate={onChangeStartDate}
          setIsStartdatepickeropen={setIsStartdatepickeropen}
          Formdata={Formdata}
          setFormdata={setFormdata}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          selectCategoryType ={selectCategoryType}
          setSelectedCategoryType={setSelectedCategoryType}
        />
        {/* Full-Screen Preview Modal */}
        {/* <Modal visible={PreviewVisible} transparent={true}>
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
        </Modal> */}
      </View>
    </CommonView>
  )
}
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
  iconContainer: { backgroundColor: COLOR.Black1, padding: 12, borderRadius: 5, overflow: 'hidden' },
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
  placeHoldeContainer: {
    flex: 1,
    top: 200,
    height: 800
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
