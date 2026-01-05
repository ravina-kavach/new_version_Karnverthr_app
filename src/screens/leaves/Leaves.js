import React from 'react'
import { View, ScrollView, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native'
import { COLOR } from '../../theme/theme'
import { CommonView } from '../../utils/common'
import { useLeaves } from './LeavesController'
import { GlobalFonts } from '../../theme/typography'
import { FontSize, responsiveHeight, responsiveWidth } from '../../utils/metrics'
import ApplyLeaveModal from '../../components/ApplyLeaveModal'
import moment from 'moment'
const Leaves = () => {
  const { t,
    leavesSummary,
    getStatusColor,
    visibleModal,
    handleModal,
    saveLeave,
    GetLeavetypeData,
    GetDepartmentTypeData,
    setSelectedDeptType,
    selectedDeptType,
    UsersigninData,
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
    setIsEarnedLeave
  } = useLeaves();
  return (
    <CommonView statusBarColor={COLOR.LightOrange}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.summaryCard}>
            {leavesSummary.map((item, index) => (
              <View key={index} style={styles.leaveBox}>
                <Text style={styles.leaveTitle}>{item.title}</Text>
                <Text style={styles.leaveCount}>{item.used}/{item.total}</Text>
                <Text style={styles.leftText}>Left: {item.left}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Submitted Leaves</Text>

          <View style={styles.card}>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={isGetLeaveListFetching}
                  onRefresh={onRefresh}
                />
              }
              data={GetLeaveListData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.leaveItem}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.leaveType}>Leave Type - {item.leave_type_name}</Text>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                      {item.status}
                    </Text>
                  </View>
                  <View style={styles.dateRow}>
                    <View>
                      <Text style={styles.label}>From-To</Text>
                      <Text style={styles.value}>{moment(item?.validity?.from).format("DD-MM-YYYY")} - {moment(item?.validity?.to).format("DD-MM-YYYY")}</Text>
                    </View>

                    <View>
                      <Text style={styles.label}>Total</Text>
                      <Text style={styles.days}>{item.duration_days} Day</Text>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>

        </ScrollView>

        <TouchableOpacity style={styles.fab} onPress={handleModal}>
          <Text style={styles.fabText}>Apply Leave  +</Text>
        </TouchableOpacity>
      </View>
      {visibleModal &&
        <ApplyLeaveModal
          UsersigninData={UsersigninData}
          leaveTypeData={GetLeavetypeData}
          departmentTypeData={GetDepartmentTypeData}
          setSelectedDeptType={setSelectedDeptType}
          selectedDeptType={selectedDeptType}
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
        />}
    </CommonView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: responsiveHeight(3),
    color: COLOR.TextSecondary,
  },

  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    fontSize: FontSize.Font14,
    ...GlobalFonts.subtitle,
  },

  leaveCount: {
    fontSize: FontSize.Font24,
    ...GlobalFonts.small,
    fontWeight: '700',
    marginVertical: 4,
  },

  leftText: {
    ...GlobalFonts.small,
    fontSize: 13,
    color: COLOR.TextSecondary,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 80,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  leaveItem: {
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  leaveType: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    marginRight: 6,
  },

  statusText: {
    fontWeight: '600',
  },

  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  label: {
    fontSize: 13,
    ...GlobalFonts.subtitle,
    color: COLOR.TextSecondary,
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
  },

  days: {
    fontSize: 16,
    fontWeight: '700',
  },

  fab: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20,
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },

  fabText: {
    color: COLOR.White1,
    ...GlobalFonts.subtitle,
    fontWeight: '600',
    fontSize: 15,
  },
});


export default Leaves