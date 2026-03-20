import React from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl
} from 'react-native'
import { COLOR } from '../../theme/theme'
import { CommonView } from '../../utils/common'
import { useLeaves } from './LeavesController'
import { GlobalFonts } from '../../theme/typography'
import { FontSize, LEAVE_STATUS_FILTER_OPTIONS } from '../../utils/metrics'
import ApplyLeaveModal from '../../components/ApplyLeaveModal'
import NodataFound from '../../components/NodataFound'
import moment from 'moment'
import { LEAVE_STATUS } from '../../utils/metrics'
import CommonFilterDropdown from '../../components/CommonFilterDropdown'

const Leaves = () => {
  const {
    leavesSummary,
    getStatusColor,
    visibleModal,
    handleModal,
    saveLeave,
    GetLeavetypeData,
    UsersigninData,
    UserDetailsData,
    setSelectedLeaveType,
    selectedLeaveType,
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
    isGetLeaveListFetching,
    onRefresh,
    isPublicLeave,
    setIsPublicLeave,
    isOverTimeLeave,
    setIsOverTimeLeave,
    isEarnedLeave,
    setIsEarnedLeave,
    handleOpenModal,
    selectedStatus,
    setSelectedStatus,
    filteredLeaves
  } = useLeaves()

  const renderHeader = () => (
    <>
      {leavesSummary.length === 0 ? (
        <View style={styles.summaryEmpty}>
          <Text style={styles.summaryEmptyText}>
            No leave allocation available
          </Text>
        </View>
      ) : (
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>My Leaves</Text>

          <FlatList
            data={leavesSummary}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.leaveBox}>
                <Text numberOfLines={1} style={styles.leaveTitle}>
                  {item.title}
                </Text>

                <View style={styles.innerLeaveCotainer}>
                  <Text style={styles.leaveCount}>
                    {item.used}/{item.total}
                  </Text>

                  <Text style={styles.leaveCount}>
                    Left: {item.left}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      )}

      <View style={styles.headerWrapper}>
        <Text style={styles.sectionTitle}>Submitted Leaves</Text>

        <CommonFilterDropdown
          data={LEAVE_STATUS_FILTER_OPTIONS}
          selectedItem={selectedStatus}
          setSelectedItem={setSelectedStatus}
        />
      </View>
    </>
  )

  const renderItem = ({ item }) => (
    <View style={styles.leaveCard}>
      <View style={styles.headerRow}>
        <Text numberOfLines={2} style={styles.leaveType}>
          {item.leave_type_name}
        </Text>

        <View style={styles.statusBadge}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(item.status) }
            ]}
          />

          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.status) }
            ]}
          >
            {LEAVE_STATUS[item.status]?.toUpperCase() ||
              item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.innerBox}>
        <View>
          <Text style={styles.label}>From-To</Text>

          <Text style={styles.value}>
            {moment(item?.from).format('DD MMM')} -{' '}
            {moment(item?.to).format('DD MMM')}
          </Text>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.label}>Total</Text>

          <Text style={styles.days}>
            {item.days} {item.days > 1 ? 'Days' : 'Day'}
          </Text>
        </View>
      </View>

      <Text style={[styles.value, { paddingTop: 10 }]}>
        Reason : <Text style={styles.label}>{item.reason}</Text>
      </Text>
    </View>
  )

  return (
    <CommonView statusBarColor={COLOR.LightOrange}>
      <View style={styles.container}>
        <FlatList
          data={filteredLeaves}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl
              refreshing={isGetLeaveListFetching}
              onRefresh={onRefresh}
            />
          }
          ListEmptyComponent={() => (
            <View style={styles.placeHoldeContainer}>
              <NodataFound titleText="Add Leaves" />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 120 }}
        />

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={handleOpenModal}
        >
          <Text style={styles.fabText}>Apply Leave +</Text>
        </TouchableOpacity>
      </View>

      {visibleModal && (
        <ApplyLeaveModal
          UsersigninData={UsersigninData}
          UserDetailsData={UserDetailsData}
          leaveTypeData={GetLeavetypeData}
          setSelectedLeaveType={setSelectedLeaveType}
          selectedLeaveType={selectedLeaveType}
          selectStartDate={selectStartDate}
          selectEndDate={selectEndDate}
          openStartDataPicker={openStartDataPicker}
          openEndDataPicker={openEndDataPicker}
          onChangeStartDate={onChangeStartDate}
          onChangeEndDate={onChangeEndDate}
          visible={visibleModal}
          onClose={handleModal}
          setOpenStartDatePicker={setOpenStartDatePicker}
          setOpenEndDatePicker={setOpenEndDatePicker}
          resonText={resonText}
          setResonText={setResonText}
          onSave={saveLeave}
          isPublicLeave={isPublicLeave}
          setIsPublicLeave={setIsPublicLeave}
          isOverTimeLeave={isOverTimeLeave}
          setIsOverTimeLeave={setIsOverTimeLeave}
          isEarnedLeave={isEarnedLeave}
          setIsEarnedLeave={setIsEarnedLeave}
        />
      )}
    </CommonView>
  )
}

export default Leaves

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  sectionTitle: {
    ...GlobalFonts.subtitle,
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
    color: COLOR.Black1,
  },

  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginTop: 20,
    marginHorizontal: 20,
    padding: 15,
    elevation: 3,
  },

  summaryEmpty: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginTop: 20,
    marginHorizontal: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  summaryEmptyText: {
    fontSize: 14,
    color: COLOR.TextSecondary,
    ...GlobalFonts.subtitle,
  },

  leaveBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },

  leaveTitle: {
    ...GlobalFonts.subtitle,
    color: COLOR.Black1,
    fontSize: FontSize.Font14,
  },

  innerLeaveCotainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leaveCount: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font14,
    color: COLOR.TextSecondary,
    fontWeight: '700',
    marginTop: 10,
  },

  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 25,
    alignItems: 'center',
  },

  placeHoldeContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
  },

  leaveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    marginHorizontal: 20,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  leaveType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    maxWidth: 180,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  innerBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
  },

  label: {
    fontSize: 13,
    color: COLOR.TextSecondary,
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  totalBox: {
    alignItems: 'flex-end',
  },

  days: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  fab: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20,
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },

  fabText: {
    color: COLOR.White1,
    fontWeight: '600',
    fontSize: 15,
  },
})

