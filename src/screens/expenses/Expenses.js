import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  FlatList,
  RefreshControl,
  Pressable,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { COLOR, STATE } from '../../theme/theme';
import moment from 'moment';
import Dropdown from '../../components/Dropdown';
import { useExpenses } from './ExpensesController';
import NodataFound from '../../components/NodataFound';
import { CommonView } from '../../utils/common';
import { PlusIcon, EmptyExpense } from '../../assets/svgs';
import AddExpenseModal from '../../components/AddExpenseModal';
import ImagePickerSheet from '../../components/ImagePickerSheet';
import { GlobalFonts } from '../../theme/typography';
import { FontSize } from '../../utils/metrics';
import { EXPENSE_STATUS, EXPENSE_STATUS_FILTER_OPTIONS } from '../../utils/metrics';
import CommonFilterDropdown from '../../components/CommonFilterDropdown';

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
    isGetExpenseListFetching,
    setSelectedId,
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
    filteredExpenses,
    selectedStatus,
    setSelectedStatus,
    NavigateExpenseDetail
  } = useExpenses();

  const renderItem = ({ item }) => {
    const stateKey = item.state?.toLowerCase();

    const imageUri =
      item.attachment_ids?.length > 0 &&
        item.attachment_ids[0]?.base64
        ? `data:${item.attachment_ids[0].mimetype};base64,${item.attachment_ids[0].base64}`
        : null;

    return (
      <TouchableWithoutFeedback  onPress={()=>NavigateExpenseDetail(item)}>
        <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text numberOfLines={2} style={styles.title}>{item.name}</Text>

          <View style={styles.statusWrap}>
            <Text
              numberOfLines={1}
              style={[styles.statusText, { color: STATE[stateKey] }]}
            >
              {EXPENSE_STATUS[item.state].toUpperCase()
              
              
              }
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
              <Pressable onPress={() => openImage(imageUri)}>
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
      </TouchableWithoutFeedback>
    );
  };

  return (
    <CommonView>
      <View style={styles.flexContainer}>
        <View style={styles.container}>

          <View style={styles.headerWrapper}>
            <Text style={styles.sectionTitle}>All Expenses</Text>
            <CommonFilterDropdown
              data={EXPENSE_STATUS_FILTER_OPTIONS}
              selectedItem={selectedStatus}
              setSelectedItem={setSelectedStatus}
            />
          </View>

          <FlatList
            data={filteredExpenses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isGetExpenseListFetching}
                onRefresh={onRefresh}
              />
            }
            contentContainerStyle={styles.contentContainer}
            ListEmptyComponent={() => (
              <View style={styles.placeHoldeContainer}>
                <NodataFound titleText="Add expenses" />
              </View>
            )}
          />
        </View>
        <TouchableWithoutFeedback onPress={() => setIsExoensemodal(true)}>
          <View style={styles.plusContainer}>
            <View style={styles.iconContainer}>
              <PlusIcon width={28} height={28} />
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

        {/* 🔍 Image Preview */}
        <Modal visible={PreviewVisible} transparent>
          <View style={styles.previewModal}>
            <Pressable
              onPress={() => setPreviewVisible(false)}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>

            {PreviewImage && (
              <Image
                source={{ uri: PreviewImage }}
                style={styles.previewImage}
              />
            )}
          </View>
        </Modal>

        {isImagePickerVisible && (
          <ImagePickerSheet
            visible={isImagePickerVisible}
            onClose={() => setIsImagePickerVisible(false)}
            onResult={onImagePicked}
          />
        )}
      </View>
    </CommonView>
  );
}

const styles = StyleSheet.create({
  flexContainer: { flex: 1 },

  container: {
    flex: 1,
    marginHorizontal: 20,
    overflow: 'visible',
  },

  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal:10,
    alignItems: 'center',
    zIndex: 2000,
    elevation: 20,
    overflow: 'visible',
    backgroundColor: 'transparent',
    marginBottom:30,
  },

  sectionTitle: {
    ...GlobalFonts.subtitle,
    fontSize: 18,
    fontWeight: '600',
    color: COLOR.Black1,
  },

  contentContainer: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: COLOR.White1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  title: {
    ...GlobalFonts.subtitle,
    maxWidth:180,
    fontSize: 16,
    fontWeight: '600',
  },

  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusText: {
    fontSize: 13,
    marginRight: 6,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  imageBox: {
    width: 56,
    height: 56,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLOR.dark5,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightInfo: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 12,
  },

  amount: {
    fontSize: 18,
    fontWeight: '700',
  },

  date: {
    marginTop: 4,
    fontSize: FontSize.Font14,
    color: '#6B7280',
  },

  plusContainer: {
    position: 'absolute',
    right: 20,
    bottom: 30,
  },

  iconContainer: {
    backgroundColor: COLOR.Black1,
    padding: 14,
    borderRadius: 16,
  },

  placeHoldeContainer: {
    marginTop: 120,
  },

  previewModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
  },

  closeText: {
    color: COLOR.White1,
    fontSize: 18,
  },

  previewImage: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height * 0.8,
    resizeMode: 'contain',
  },
});
