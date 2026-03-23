import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { COLOR } from '../../theme/theme';
import { useAttendance } from './AttendanceController';
import { CommonView } from '../../utils/common';
import CommonHeader from '../../components/CommonHeader';
import AttendanceRegModal from '../../components/AttendanceRegModal';
import { font, GlobalFonts } from '../../theme/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AttendanceSummary from './AttendanceSummary';
import { LeftIcon, RightIcon } from '../../assets/svgs';
import { FontSize } from '../../utils/metrics';

export default function Attendance() {
  const {
    t,
    Selectedmonth,
    SelectedYear,
    GetAttandanceListData,
    UserAttendanceRegcategoriesData,
    isFeatchAttendanceReguration,
    isGetAttandanceListFetching,
    GetPublicHolidayData,
    changeMonth,
    visible,
    handleModal,
    onCreateRegularization,
  } = useAttendance();
  const insets = useSafeAreaInsets();

  const attendanceList = GetAttandanceListData?.attandancelist || [];

  return (
    <CommonView statusBarColor={COLOR.LightOrange}>
      <CommonHeader title={t('Attendance.AttendanceList')} />

      {/* MONTH NAV */}
      <View style={styles.monthNavContainer}>

        {/* PREV BUTTON */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.navCircle,
          ]}
          onPress={() => changeMonth("prev")}
          disabled={isGetAttandanceListFetching}
        >
          <LeftIcon color="#333" />
        </TouchableOpacity>

        {/* MONTH DISPLAY */}
        <View style={styles.monthCard}>
          <Text style={styles.monthText}>
            {Selectedmonth?.name} {SelectedYear?.name}
          </Text>
        </View>

        {/* NEXT BUTTON */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.navCircle,
          ]}
          onPress={() => changeMonth("next")}
          disabled={isGetAttandanceListFetching}
        >
          <RightIcon color="#333" />
        </TouchableOpacity>

      </View>

      {/* CONTENT */}
      {isGetAttandanceListFetching ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLOR.Black1} />
          <Text style={styles.loadingText}>Loading attendance...</Text>
        </View>
      ) : attendanceList.length > 0 ? (
        <AttendanceSummary
          attendanceData={attendanceList}
          publicHolidayData={GetPublicHolidayData}
          month={Selectedmonth?.id}
          year={SelectedYear?.name}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No attendance data found</Text>
        </View>
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={handleModal}
      >
        <Text style={styles.fabText}>Attendance Regularization</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <AttendanceRegModal
        visible={visible}
        data={UserAttendanceRegcategoriesData}
        onClose={handleModal}
        onCreateReq={onCreateRegularization}
        loading={isFeatchAttendanceReguration}
      />
    </CommonView>
  );
}

const styles = StyleSheet.create({
  navBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
  },
  monthCenter: {
    flex: 1,
    alignItems: 'center',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    ...GlobalFonts.small,
    color: '#666',
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },

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
    ...GlobalFonts.buttonText,
    fontSize: 14,
    fontWeight: '600',
  },

  monthNavContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 14,
  },

  navCircle: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  monthCard: {
    flex: 1,
    marginHorizontal: 14,
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  monthText: {
    fontSize: FontSize.Font15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});