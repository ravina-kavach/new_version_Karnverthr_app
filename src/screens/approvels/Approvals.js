import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { showMessage } from 'react-native-flash-message';
import CommonHeader from '../../components/CommonHeader';

import {
  ApprovalList,
  ApproveActionApprove,
  ApproveActionReject,
  CommonSelector,
  updateState,
} from '../../store/reducers/commonSlice';

import { APPROVALS, COLOR } from '../../theme/theme';
import NodataFound from '../../components/NodataFound';
import { CommonView, RowView, ColView, Label } from '../../utils/common';
import { responsiveHeight } from '../../utils/metrics';

export default function Approvals() {
  const { t,i18n } = useTranslation();
  const dispatch = useDispatch();
  const IsFocused = useIsFocused();
  
  const {
    UsersigninData,
    GetApprovalListData,
    isApproveAction,
    isGetApprovalListFetching,
  } = useSelector(CommonSelector);

  const [SelectedCatagory, setSelectedCatagory] = useState('All');
  const [Catagoryfilterdata, setCatagoryfilterdata] = useState([]);

  useEffect(async () => {
    if (IsFocused && UsersigninData.user_id) {
     await dispatch(ApprovalList({ id: Number(UsersigninData.user_id) }));
    }
  }, [IsFocused]);

//   useEffect(() => {
//     if (SelectedCatagory === 'All') {
//       setCatagoryfilterdata(GetApprovalListData);
//     } else {
//       const filtered = GetApprovalListData.filter(
//         i => i.category === SelectedCatagory
//       );
//       setCatagoryfilterdata(filtered);
//     }
//   }, [SelectedCatagory, GetApprovalListData]);

  useEffect(() => {
    if (isApproveAction) {
      showMessage({
        icon: 'success',
        message: t('messages.Approve_request'),
        type: 'success',
      });
      // dispatch(updateState({ isApproveAction: false }));
    }
  }, [isApproveAction]);

  const onRefresh = () => {
    dispatch(ApprovalList({ id: Number(UsersigninData?.user_id) }));
  };

  const columns = [
    { key: 'approval_subject', label: t('Approvals.Subject'), width: 120 },
    { key: 'request_owner', label: t('Approvals.Owner'), width: 120 },
    { key: 'category', label: t('Approvals.Category'), width: 140 },
    { key: 'request_start', label: t('Approvals.Start'), width: 100 },
    { key: 'request_to', label: t('Approvals.To'), width: 100 },
    { key: 'request_status', label: t('Approvals.Status'), width: 100 },
    { key: 'approval_action', label: t('Approvals.Action'), width: 100 },
    { key: 'user', label: t('Approvals.User'), width: 100 },
  ];

  const renderHeader = () => (
    <RowView style={styles.headerRow}>
      {columns.map(col => (
        <View key={col.key} style={[styles.headerCell, { width: col.width }]}>
          <Text style={styles.headerText}>{col.label}</Text>
        </View>
      ))}
    </RowView>
  );

  const handleOnApproveAction = async (id, status) => {
    if (status === '1') {
      await dispatch(
        ApproveActionApprove({
          approval_request_id: id,
          user_id: UsersigninData.user_id,
        })
      );
    } else {
      await dispatch(
        ApproveActionReject({
          approval_request_id: id,
          user_id: UsersigninData.user_id,
          remarks: 'Not eligible for this date',
        })
      );
    }
  };

  const renderTableRow = ({ item }) => (
    <View style={styles.row}>
      {columns.map(col => (
        <View key={col.key} style={[styles.cell, { width: col.width }]}>
          {col.key === 'request_status' ? (
            <Text
              style={[
                styles.statusBadge,
                { backgroundColor: APPROVALS[item.request_status] },
              ]}
            >
              {item.request_status}
            </Text>
          ) : (
            <Text style={styles.cellText}>{item[col.key]}</Text>
          )}

          {item.request_status === 'pending' &&
            col.key === 'approval_action' && (
              <RowView style={styles.actionRow}>
                <TouchableWithoutFeedback
                  onPress={() => handleOnApproveAction(item.id, '1')}
                >
                  <View style={styles.approveBtn} />
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() => handleOnApproveAction(item.id, '0')}
                >
                  <View style={styles.rejectBtn} />
                </TouchableWithoutFeedback>
              </RowView>
            )}
        </View>
      ))}
    </View>
  );

  return (
    <CommonView>
        <CommonHeader
          title={t('Approvals.Approvals')}
        />
      <View style={styles.tableContainer}>
        <ScrollView horizontal>
          <View>
            {renderHeader()}
            <FlatList
              data={GetApprovalListData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderTableRow}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={isGetApprovalListFetching}
                  onRefresh={onRefresh}
                />
              }
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <NodataFound />
                </View>
              )}
            />
          </View>
        </ScrollView>
      </View>
    </CommonView>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    flex: 1,
  },

  headerRow: {
    backgroundColor: COLOR.background1,
    flexDirection: 'row',
  },

  headerCell: {
    padding: 8,
    borderRightWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
  },

  headerText: {
    fontWeight: 'bold',
    color: COLOR.White1,
    textAlign: 'center',
  },

  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: COLOR.dark4,
    backgroundColor: COLOR.White1,
  },

  cell: {
    padding: 8,
    borderRightWidth: 1,
    borderColor: COLOR.dark5,
    justifyContent: 'center',
  },

  cellText: {
    color: COLOR.Black1,
  },

  statusBadge: {
    color: COLOR.White1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    textAlign: 'center',
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 4,
  },

  approveBtn: {
    backgroundColor: '#d3f2dc',
    padding: 6,
    borderRadius: 20,
    marginRight: 6,
  },

  rejectBtn: {
    backgroundColor: '#f2d3d3',
    padding: 6,
    borderRadius: 20,
  },

  listContent: {
    paddingVertical: 10,
  },

  emptyContainer: {
    // flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: responsiveHeight(30),
  },
});
