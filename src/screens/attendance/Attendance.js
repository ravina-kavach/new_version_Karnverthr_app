import React from 'react';
import { View, FlatList, RefreshControl, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Dropdown from '../../components/Dropdown'
import { COLOR } from '../../theme/theme';
import NodataFound from '../../components/NodataFound'
import { useAttendance } from './AttendanceController';
import { RowView, CommonView } from '../../utils/common';
import AttendanceItem from '../../components/AttendanceItem'
import CommonHeader from '../../components/CommonHeader';
import AttendanceRegModal from '../../components/AttendanceRegModal'
import { GlobalFonts } from '../../theme/typography';

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
    onCreateRegularization
  } = useAttendance();

  return (
    <CommonView statusBarColor={COLOR.LightOrange}>
      <CommonHeader
        title={t('Attendance.AttendanceList')}
      />
      <View style={styles.filterContainer}>
        <RowView style={styles.filterRow}>
          <View style={styles.filterItem}>
            <Dropdown
              DropdownData={months}
              setSelecteditem={setSelectedmonth}
              Selecteditem={Selectedmonth}
            />
          </View>

          <View style={styles.filterItem}>
            <Dropdown
              DropdownData={YEARDATA}
              setSelecteditem={setSelectedYear}
              Selecteditem={SelectedYear}
            />
          </View>
        </RowView>
      </View>

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
      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => handleModal()}>
        <Text style={styles.fabText}>Attendance Regularization</Text>
      </TouchableOpacity>
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
  justifyContent: "space-between",
},
  dropdownBox: {
    marginBottom: 10,
    backgroundColor: COLOR.White1,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  filterItem: {
  width: "48%",
},

  fab: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 60,
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
  listContent: {
    paddingVertical: 10,
  },
});
