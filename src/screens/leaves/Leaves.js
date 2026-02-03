import React from 'react'
import {
  View,
  ScrollView,
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
import { FontSize, LEAVE_STATUS_FILTER_OPTIONS, responsiveHeight } from '../../utils/metrics'
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
    GetLeaveListData,
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

  return (
    <CommonView statusBarColor={COLOR.LightOrange}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>

          {leavesSummary.length === 0 ? (
            <View style={styles.summaryEmpty}>
              <Text style={styles.summaryEmptyText}>
                No leave allocation available
              </Text>
            </View>
          ) : (
            <View style={styles.summaryCard}>
            <View>
            <Text style={styles.sectionTitle}>My Leaves</Text>
            </View>
            <View style={styles.innnerSummaryCard}>    
              {leavesSummary.map((item, index) => (
                <View key={index} style={styles.leaveBox}>
                  <Text numberOfLines={1} style={styles.leaveTitle}>{item.title}</Text>
                  <View style={styles.innerLeaveCotainer}>
                  <Text style={styles.leaveCount}>
                    {item.used}/{item.total}
                  </Text>
                  <Text style={styles.leaveCount}>Left: {item.left}</Text>
                  </View>
                </View>
              ))}
              </View>
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
          <FlatList
            nestedScrollEnabled
            refreshControl={
              <RefreshControl
                refreshing={isGetLeaveListFetching}
                onRefresh={onRefresh}
              />
            }
            data={filteredLeaves}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <View style={styles.leaveCard}>

                  <View style={styles.headerRow}>
                    <Text numberOfLines={2} style={styles.leaveType}>
                      {item.leave_type_name}
                    </Text>

                    <View style={styles.statusBadge}>
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: getStatusColor(item.status) },
                        ]}
                      />
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.statusText,
                          { color: getStatusColor(item.status) },
                        ]}
                      >
                        {LEAVE_STATUS[item.status].toUpperCase() || item.status.toUpperCase()}
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
                        {item.days}{' '}
                        {item.days > 1 ? 'Days' : 'Day'}
                      </Text>
                    </View>
                  </View>
                  <Text numberOfLines={2} style={[styles.value,{paddingTop:10}]}>Reason : <Text numberOfLines={2} style={styles.label}>{item.reason}</Text></Text>
                </View>
              )
            }}
            ListEmptyComponent={() => (
              <View style={styles.placeHoldeContainer}>
                <NodataFound titleText="Add Leaves" />
              </View>
            )}
          />
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={handleOpenModal}
        >
          <Text style={styles.fabText}>Apply Leave  + </Text>
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
    backgroundColor: '#F7F7F7',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: responsiveHeight(3),
    marginHorizontal: 20,
    color: COLOR.TextSecondary,
  },

  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginTop: 20,
    marginHorizontal: 20,
    padding: 15,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    elevation: 4,
  },

  innnerSummaryCard: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  innerLeaveCotainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  leaveBox: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },

  leaveTitle: {
    ...GlobalFonts.subtitle,
    color:COLOR.Black1,
    fontSize: FontSize.Font14,
  },

  leaveCount: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font14,
    color:COLOR.TextSecondary,
    fontWeight: '700',
    marginTop: 10,
  },

  leftText: {
    fontSize: 13,
    color: COLOR.TextSecondary,
  },

  placeHoldeContainer: {
    flex: 1,
    top: 100,
    height: 800,
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
    maxWidth:180,
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

  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 30,
    alignItems: 'center',
    zIndex: 2000,
    overflow: 'visible',
    backgroundColor: 'transparent',
    marginBottom: 30,
  },

  sectionTitle: {
    ...GlobalFonts.subtitle,
    fontSize: 18,
    fontWeight: '600',
    color: COLOR.Black1,
  },
})
