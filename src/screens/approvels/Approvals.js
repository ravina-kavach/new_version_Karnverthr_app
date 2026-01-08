import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { showMessage } from 'react-native-flash-message';

import CommonHeader from '../../components/CommonHeader';
import NodataFound from '../../components/NodataFound';
import { CommonView } from '../../utils/common';
import { GlobalFonts } from '../../theme/typography';

import {
  ApprovalList,
  ApproveActionApprove,
  ApproveActionReject,
  CommonSelector,
} from '../../store/reducers/commonSlice';
import { DateApproval } from '../../assets/svgs';
import { COLOR, APPROVALS } from '../../theme/theme';
import { FontSize, responsiveHeight } from '../../utils/metrics';

export default function Approvals() {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { t } = useTranslation();

  const {
    UsersigninData,
    GetApprovalListData,
    isGetApprovalListFetching,
    isApproveAction,
  } = useSelector(CommonSelector);
  
  const STATIC_APPROVAL_LIST = [
    {
      id: 101,
      request_owner: 'Rahul Sharma',
      request_status: 'Submitted',
      approval_subject: 'Leave Request (Casual Leave)',
      request_start: '12 Jan 2026',
    },
    {
      id: 102,
      request_owner: 'Priya Patel',
      request_status: 'Approved',
      approval_subject: 'Expense Approval – Travel',
      request_start: '10 Jan 2026',
    },
    {
      id: 103,
      request_owner: 'Amit Verma',
      request_status: 'Rejected',
      approval_subject: 'Work From Home Request',
      request_start: '08 Jan 2026',
    },
    {
      id: 104,
      request_owner: 'Neha Singh',
      request_status: 'Pending',
      approval_subject: 'Shift Change Request',
      request_start: '07 Jan 2026',
    },
  ];

  useEffect(() => {
    if (isFocused && UsersigninData?.user_id) {
      // dispatch(ApprovalList({ id: Number(UsersigninData.user_id) }));
    }
  }, [isFocused]);

  useEffect(() => {
    if (isApproveAction) {
      showMessage({
        icon: 'success',
        message: t('messages.Approve_request'),
        type: 'success',
      });
    }
  }, [isApproveAction]);

  const onRefresh = () => {
    dispatch(ApprovalList({ id: Number(UsersigninData?.user_id) }));
  };

  const getStatusLabel = (status) => {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'approved':
        return t('Approvals.Approved');
      case 'rejected':
        return t('Approvals.Rejected');
      case 'submitted':
        return t('Approvals.Submitted');
      case 'pending':
        return t('Approvals.Pending');
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return COLOR.Primary1;
    switch (status.toLowerCase()) {
      case 'approved':
        return APPROVALS.approved;
      case 'rejected':
        return APPROVALS.rejected;
      case 'submitted':
      case 'pending':
        return APPROVALS.submitted;
      default:
        return COLOR.Primary1;
    }
  };

  const handleApprove = (id) => {
    dispatch(
      ApproveActionApprove({
        approval_request_id: id,
        user_id: UsersigninData.user_id,
      })
    );
  };

  const handleReject = (id) => {
    dispatch(
      ApproveActionReject({
        approval_request_id: id,
        user_id: UsersigninData.user_id,
        remarks: 'Rejected by approver',
      })
    );
  };

  const renderItem = ({ item }) => {
    const status = item.request_status?.toLowerCase();
    const isPending = status === 'submitted' || status === 'pending';
    const isRejected = status === 'rejected';
    const statusColor = getStatusColor(item.request_status);

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{item.request_owner}</Text>
          <View style={styles.statusWrap}>
            <Text style={[styles.status, { color: statusColor }]}>
              {getStatusLabel(item.request_status)}
            </Text>
            <View style={[styles.dot, { backgroundColor: statusColor }]} />
          </View>
        </View>

        {/* Subject */}
        <Text numberOfLines={2} style={styles.desc}>{item.approval_subject}</Text>

        {/* Meta */}
        <View style={styles.meta}>
          <View style={styles.dateContainer}>
          <DateApproval/>
          <Text style={styles.date}>{item.request_start}</Text>
          </View>
          <Text style={styles.id}>ID: {item.id}</Text>
        </View>

        {isPending &&<View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.btn,
              styles.approveBtn,
            ]}
            onPress={() => handleApprove(item.id)}
          >
            <Text style={styles.approveText}>
              {t('Approvals.Approve')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btn,
              styles.rejectBtn,
            ]}
            onPress={() => handleReject(item.id)}
          >
            <Text
              style={[
                styles.rejectText,
              ]}
            >
              {t('Approvals.Reject')}
            </Text>
          </TouchableOpacity>
        </View>}
      </View>
    );
  };

  return (
    <CommonView>
      <CommonHeader title={t('Approvals.Approvals')} />
      
      <FlatList
        // data={GetApprovalListData}
        data={STATIC_APPROVAL_LIST}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isGetApprovalListFetching}
            onRefresh={onRefresh}
          />
        }
        ListHeaderComponent={()=><Text style={styles.section}>Approval Requests</Text>}
        ListEmptyComponent={
          <View style={{ paddingTop: responsiveHeight(30) }}>
            <NodataFound titleText={t('comman.No_records_found')} />
          </View>
        }
      />
    </CommonView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 20,
    paddingBottom: 30,
    marginHorizontal:20,
    borderRadius: 16,
    backgroundColor: COLOR.White1,
  },
  dateContainer:{flexDirection:'row',justifyContent:'center',alignItems:'center'},
  section: {
      ...GlobalFonts.subtitle,
      fontWeight: "600",
      color: COLOR.Black1,
      paddingHorizontal:20,
      paddingVertical:20,
      marginBottom: 8,
    },

  card: {
    backgroundColor: COLOR.White1,
    marginHorizontal:20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderColor:COLOR.Placeholder,
    borderWidth:0.5
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: {
    fontSize: FontSize.Font16,
    ...GlobalFonts.subtitle,
    fontWeight: '600',
    color: COLOR.Black1,
  },

  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  status: {
    fontSize: FontSize.Font12,
    marginRight: 6,
    fontWeight: '500',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  desc: {
    marginTop: 8,
    fontSize: FontSize.Font12,
    ...GlobalFonts.small,
    color: COLOR.TextPlaceholder,
  },

  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  date: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font14,
    color: COLOR.Black1,
    paddingLeft:5
  },

  id: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font14,
    color: COLOR.Black1,
  },

  actions: {
    flexDirection: 'row',
    marginTop: 16,
  },

  btn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  approveBtn: {
    borderWidth: 1,
    borderColor: COLOR.Black1,
    marginRight: 10,
  },

  rejectBtn: {
    backgroundColor: APPROVALS.rejected,
  },

  rejectFilled: {
    backgroundColor: COLOR.Danger,
  },

  approveText: {
    ...GlobalFonts.small,
    fontSize: FontSize.Font14,
    fontWeight: '500',
  },

  rejectText: {
    ...GlobalFonts.small,
    fontSize: FontSize.Font14,
    fontWeight: '500',
    color: COLOR.White1,
  },

  disabled: {
    opacity: 0.4,
  },
});
