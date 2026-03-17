import React, { useState } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import Dropdown from '../../components/Dropdown';
import { COLOR } from '../../theme/theme';
import NodataFound from '../../components/NodataFound';
import { useAttendance } from './AttendanceController';
import { RowView, CommonView } from '../../utils/common';
import AttendanceItem from '../../components/AttendanceItem';
import CommonHeader from '../../components/CommonHeader';
import AttendanceRegModal from '../../components/AttendanceRegModal';
import { GlobalFonts } from '../../theme/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AttendanceSummary from './AttendanceSummary';

export default function Attendance() {
  const {
    t,
    months,
    Selectedmonth,
    SelectedYear,
    YEARDATA,
    GetAttandanceListData,
    isGetAttandanceListFetching,
    UserAttendanceRegcategoriesData,
    isFeatchAttendanceReguration,
    getDuration,
    onRefresh,
    setSelectedmonth,
    setSelectedYear,
    visible,
    handleModal,
    onCreateRegularization,
  } = useAttendance();

  const insets = useSafeAreaInsets();
  const [viewType, setViewType] = useState('calendar');

  return (
    <CommonView statusBarColor={COLOR.LightOrange}>
      <CommonHeader title={t('Attendance.AttendanceList')} />

      {/* FILTERS */}
      <View style={styles.filterContainer}>
        <RowView style={styles.filterRow}>
          <View style={styles.filterItem}>
            <Dropdown
              type="Attendance"
              DropdownData={months}
              setSelecteditem={setSelectedmonth}
              Selecteditem={Selectedmonth}
            />
          </View>

          <View style={styles.filterItem}>
            <Dropdown
              type="Attendance"
              DropdownData={YEARDATA}
              setSelecteditem={setSelectedYear}
              Selecteditem={SelectedYear}
            />
          </View>
        </RowView>
      </View>

      {/* 🔥 TOGGLE */}
      <View style={styles.toggleContainer}>


        <TouchableOpacity
          style={[
            styles.toggleBtn,
            viewType === 'calendar' && styles.activeToggle,
          ]}
          onPress={() => setViewType('calendar')}
        >
          <Text
            style={[
              styles.toggleText,
              viewType === 'calendar' && styles.activeText,
            ]}
          >
            Calendar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            viewType === 'list' && styles.activeToggle,
          ]}
          onPress={() => setViewType('list')}
        >
          <Text
            style={[
              styles.toggleText,
              viewType === 'list' && styles.activeText,
            ]}
          >
            List
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 CALENDAR VIEW */}
      {viewType === 'calendar' && (
        <AttendanceSummary attendanceData={GetAttandanceListData?.attandancelist} />
      )}

      {/* 🔥 LIST VIEW */}
      {viewType === 'list' && (
        <FlatList
          data={GetAttandanceListData?.attandancelist}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <AttendanceItem
              item={item}
              t={t}
              getDuration={getDuration}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isGetAttandanceListFetching}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => <NodataFound />}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        activeOpacity={0.8}
        onPress={() => handleModal()}
      >
        <Text style={styles.fabText}>Attendance Regularization</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <AttendanceRegModal
        visible={visible}
        data={UserAttendanceRegcategoriesData}
        onClose={() => handleModal()}
        onCreateReq={onCreateRegularization}
        loading={isFeatchAttendanceReguration}
      />
    </CommonView>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
  },

  filterRow: {
    justifyContent: 'space-between',
  },

  filterItem: {
    width: '48%',
  },

  /* 🔥 TOGGLE */
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },

  toggleBtn: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },

  activeToggle: {
    backgroundColor: '#000',
  },

  toggleText: {
    color: '#000',
    fontWeight: '600',
  },

  activeText: {
    color: '#fff',
  },

  /* 🔥 CALENDAR */
  calendar: {
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
  },

  dateBox: {
    flex: 1,
    height: 45,
    margin: 3,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },

  dateText: {
    fontWeight: '600',
  },

  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'green',
    marginTop: 3,
  },

  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'red',
    marginTop: 3,
  },

  holidayText: {
    fontSize: 10,
    color: 'blue',
  },

  /* LIST */
  listContent: {
    paddingVertical: 10,
    paddingBottom: 120,
  },

  /* FAB */
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#000',
    borderRadius: 10,
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