import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import CommonHeader from '../../../../../components/CommonHeader';
import { CommonView } from '../../../../../utils/common';
import { useAttendancePolicy } from './AttendancePolicyController';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GlobalFonts } from '../../../../../theme/typography';
import { COLOR } from '../../../../../theme/theme';
import { FontSize } from '../../../../../utils/metrics';

const AttendancePolicy = () => {
  const { AttendancePolicyListData } = useAttendancePolicy();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const data = AttendancePolicyListData?.data || [];

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch =
        item.display_name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filterType === 'all' || item.type === filterType;

      return matchesSearch && matchesFilter;
    });
  }, [data, search, filterType]);

  const renderItem = ({ item }) => {
    const isRegular = item.type === 'regular';

    return (
      <View style={styles.card}>
        {/* Top Row */}
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.policyTitle}>
              {item.display_name}
            </Text>
            <Text style={styles.clientName}>
              {item.client_id?.[1]}
            </Text>
          </View>

          <View
            style={[
              styles.badge,
              { backgroundColor: isRegular ? '#DCFCE7' : '#DBEAFE' },
            ]}>
            <Text
              style={[
                styles.badgeText,
                { color: isRegular ? '#15803D' : '#1D4ED8' },
              ]}>
              {item.type.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Stats */}
        <View style={styles.grid}>
          <Stat icon="time-outline" label="Grace" value={`${item.grace_minutes}m`} />
          <Stat icon="log-in-outline" label="Late Ins" value={item.max_late_ins} />
          <Stat icon="calendar-outline" label="Half Day" value={`${item.half_day_minutes}m`} />
          <Stat icon="close-circle-outline" label="No Pay" value={`${item.no_pay_minutes}m`} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="create-outline" size={18} color={COLOR.Black1} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={18} color={COLOR.Red} />
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <CommonView style={{ backgroundColor: '#F5F7FB' }}>
      <CommonHeader title="Attendance Policy" />

      {/* Top Action Bar */}
      <View style={styles.topActionBar}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={COLOR.Placeholder} />
          <TextInput
            placeholder="Search policy..."
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={styles.createBtn}
          activeOpacity={0.8}>
          <Ionicons name="add" size={20} color={COLOR.White1} />
          <Text style={styles.createText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {['all', 'regular', 'accrual'].map(type => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilterType(type)}
            style={[
              styles.filterBtn,
              filterType === type && styles.activeFilter,
            ]}>
            <Text
              style={[
                styles.filterText,
                filterType === type && styles.activeFilterText,
              ]}>
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />
    </CommonView>
  );
};

const Stat = ({ icon, label, value }) => (
  <View style={styles.statBox}>
    <Ionicons name={icon} size={18} color="#4B5563" />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default AttendancePolicy;

const styles = StyleSheet.create({
  topActionBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
    alignItems: 'center',
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    height: 45,
    marginRight: 10,
    elevation: 2,
  },

  input: {
    flex: 1,
    marginLeft: 6,
  },

  createBtn: {
    flexDirection: 'row',
    backgroundColor: COLOR.Black1,
    paddingHorizontal: 14,
    height: 45,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  createText: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font14,
    color: COLOR.White1,
    fontWeight: 'bold',
    marginLeft: 4,
  },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 25,
    marginVertical: 10,
  },

  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLOR.White1,
    marginRight: 10,
  },

  activeFilter: {
    backgroundColor: COLOR.Black1,
  },

  filterText: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font12,
    fontWeight: '600',
    color: COLOR.TextPlaceholder,
  },

  activeFilterText: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font12,
    color: COLOR.White1,
  },

  card: {
    backgroundColor: COLOR.White1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    shadowColor: COLOR.Black1,
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  topRow: {
    flexDirection: 'row',
  },

  policyTitle: {
    ...GlobalFonts.subtitleText,
    fontSize: 16,
    fontWeight: '700',
    color: COLOR.Black1,
  },

  clientName: {
    ...GlobalFonts.normalText,
    fontSize: 12,
    color: COLOR.TextPlaceholder,
    marginTop: 3,
  },

  badge: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 30,
  },

  badgeText: {
    ...GlobalFonts.small,
    fontSize: 11,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: COLOR.White1,
    marginVertical: 14,
  },

  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statBox: {
    width: '23%',
    backgroundColor: COLOR.White1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },

  statValue: {
    ...GlobalFonts.small,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },

  statLabel: {
    ...GlobalFonts.normalText,
    fontSize: 10,
    color: COLOR.TextPlaceholder,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
  },

  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },

  editText: {
    ...GlobalFonts.small,
    marginLeft: 4,
    color: COLOR.Black1,
    fontWeight: '600',
  },

  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  deleteText: {
    ...GlobalFonts.small,
    marginLeft: 4,
    color: COLOR.Red,
    fontWeight: '600',
  },
});
