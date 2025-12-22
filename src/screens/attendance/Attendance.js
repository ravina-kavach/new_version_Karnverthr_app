import React from 'react';
import {View, FlatList, RefreshControl, StyleSheet} from 'react-native';
import Dropdown from '../../components/Dropdown'
import {COLOR} from '../../theme/theme';
import NodataFound from '../../components/NodataFound'
import {useAttendance} from './AttendanceController';
import {RowView, ColView, CommonView} from '../../utils/common';
import AttendanceItem from '../../components/AttendanceItem'

export default function Attendance() {
  const {
    t,
    months,
    Selectedmonth,
    SelectedYear,
    YEARDATA,
    GetAttandanceListData,
    isGetAttandanceListFetching,
    getDuration,
    onRefresh,
    setSelectedmonth,
    setSelectedYear,
  } = useAttendance();

  return (
    <CommonView>
      <View style={styles.filterContainer}>
        <RowView>
          <ColView>
            <View style={styles.dropdownBox}>
              <Dropdown
                DropdownData={months}
                setSelecteditem={setSelectedmonth}
                Selecteditem={Selectedmonth}
              />
            </View>
          </ColView>
          <ColView>
            <View style={styles.dropdownBox}>
              <Dropdown
                DropdownData={YEARDATA}
                setSelecteditem={setSelectedYear}
                Selecteditem={SelectedYear}
              />
            </View>
          </ColView>
        </RowView>
      </View>

      <FlatList
        data={GetAttandanceListData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
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
    </CommonView>
  );
}


const styles = StyleSheet.create ({
  filterContainer: {
    marginTop: 200,
    marginHorizontal: 20,
  },
  dropdownBox: {
    marginBottom: 10,
    backgroundColor: COLOR.White1,
    borderRadius: 10,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  listContent: {
    paddingVertical: 10,
  },
});
