import { View, Text, Modal, TouchableWithoutFeedback, Dimensions, Image, FlatList, RefreshControl, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { COLOR, STATE } from '../../theme/theme';
import moment from 'moment'
import Dropdown from '../../components/Dropdown'
import { useExpenses } from './ExpensesController'
import NodataFound from '../../components/NodataFound'
import { CommonView } from '../../utils/common'
import { PlusIcon,EmptyExpense } from '../../assets/svgs';
import AddExpenseModal from '../../components/AddExpenseModal'
import Config from 'react-native-config';
import ImagePickerSheet from '../../components/ImagePickerSheet';
import { GlobalFonts } from '../../theme/typography';
import { FontSize } from '../../utils/metrics';
import { COMMON_STATUS } from '../../utils/metrics'


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
    setIsStartdatepickeropen,
    setPreviewVisible,
    setFormdata,
    selectCategoryType,
    setSelectedCategoryType,
    selectAccountType,
    setSelectedAccountType,
    AccountListData,
    onImagePicked,
    isImagePickerVisible,
    setIsImagePickerVisible,
  } = useExpenses()

 const renderItem = ({ item }) => {
  const stateKey = item.state?.toLowerCase();

  const imageUri =
    item.attachment_ids?.length > 0 &&
    item.attachment_ids[0]?.base64
      ? `data:${item.attachment_ids[0].mimetype};base64,${item.attachment_ids[0].base64}`
      : null;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{item.name}</Text>

        <View style={styles.statusWrap}>
          <Text numberOfLines={1} style={[styles.statusText, { color: STATE[stateKey] }]}>
            {COMMON_STATUS[item.state] || item.state}
          </Text>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: STATE[stateKey] },
            ]}
          />
        </View>
      </View>
      <View style={styles.contentRow}>
        <View style={styles.imageBox}>
          {imageUri ? (
            <Pressable style={styles.imageBox} onPress={() => openImage(imageUri)}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            </Pressable>
          ) : (
            <View style={styles.placeholder}>
              <EmptyExpense color={COLOR.dark5} />
            </View>
          )}
        </View>

        <View style={styles.rightInfo}>
          <Text style={styles.amount}>
            ₹ {Number(item.total_amount).toFixed(2)}
          </Text>
          <Text style={styles.date}>
            {moment(item.date).format('DD-MM-YYYY')}
          </Text>
        </View>
      </View>
    </View>
  );
};




  return (
    <CommonView >
      <View style={styles.flexContainer}>
        <View style={styles.container}>
          <FlatList
            data={GetExpenseListData}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={isGetExpenseListFetching} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.contentContainer}
            // ListHeaderComponent={() => <Text style={styles.sectionTitle}>All Expenses</Text>}
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
              <PlusIcon width={28} height={28}/>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <AddExpenseModal
          visible={IsExoensemodal}
          closeModal={closeModal}
          SubmitExpense={SubmitExpense}
          isCreateExpensesFetching={isCreateExpensesFetching}
          FileObj={FileObj}
          heandleonCamera={() => setIsImagePickerVisible(true)}
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
          selectCategoryType={selectCategoryType}
          setSelectedCategoryType={setSelectedCategoryType}
          AccountListData={AccountListData}
          selectAccountType={selectAccountType}
          setSelectedAccountType={setSelectedAccountType}
        />
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
      {isImagePickerVisible &&
        <ImagePickerSheet
          visible={isImagePickerVisible}
          onClose={() => setIsImagePickerVisible(false)}
          onResult={onImagePicked}
        />}
    </CommonView>
  )
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLOR.White1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  flexContainer: { flex: 1 },
  iconContainer: { backgroundColor: COLOR.Black1, padding: 13, borderRadius: 14, overflow: 'hidden' },
  container: { marginHorizontal: 20 },
  contentContainer: { paddingTop: 30, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: COLOR.White1, borderRadius: 20 },
  labelText: {
    ...GlobalFonts.subtitle,
    fontWeight: '600',
    fontSize: 16,
    color: COLOR.Black1,
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  statusText: {
    fontSize: 13,
    marginRight: 6,
    fontWeight: '500',
    ...GlobalFonts.subtitle,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR.Black1,
    ...GlobalFonts.subtitle,
  },

  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  sectionTitle: {
    ...GlobalFonts.subtitle,
    fontWeight: '600',
    marginVertical: 10,
    marginBottom: 20,

  },

  plusContainer: { position: "absolute", right: 20, bottom: 30 },

  valueText: {
    color: COLOR.dark2,
    fontWeight: '500',
    textTransform: 'capitalize',
    ...GlobalFonts.subtitle,
  },

  description: {
    ...GlobalFonts.subtitle,
    fontSize: 14,
    color: '#444',
    marginVertical: 2,
  },

  amountText: {
    ...GlobalFonts.subtitle,
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
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginLeft: 5
  },

  rightColumn: {
    flex: 0,
  },

  dateText: {
    fontSize: 16,
    ...GlobalFonts.subtitle,
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
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  imageBox: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: COLOR.dark5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  placeholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightInfo: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 12,
  },

  amount: {
    ...GlobalFonts.subtitle,
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.Black1,
  },

  date: {
    ...GlobalFonts.subtitle,
    marginTop: 4,
    fontSize: FontSize.Font14,
    color: '#6B7280',
  },
});
