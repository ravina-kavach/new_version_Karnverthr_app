import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
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
import { COLOR, STATE } from '../../theme/theme';
import { APPROVALS_STATUS, APPROVALS_STATUS_FILTER_OPTIONS, FontSize, responsiveHeight } from '../../utils/metrics';
import CommonFilterDropdown from '../../components/CommonFilterDropdown';
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


  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedApprovalId, setSelectedApprovalId] = useState(null);
  const [reasonError, setReasonError] = useState(false);
   const [selectedStatus, setSelectedStatus] = useState(
      APPROVALS_STATUS[0]
    );

  useEffect(() => {
    if (isFocused && UsersigninData?.user_id) {
      dispatch(ApprovalList({ id: Number(UsersigninData.user_id) }));
    }
  }, [isFocused]);

  useEffect(() => {
    if (isApproveAction) {
      showMessage({
        icon: 'success',
        message: t('messages.Approve_request'),
        type: 'success',
      });
      setRejectModalVisible(false);
    }
  }, [isApproveAction]);

  const onRefresh = () => {
    dispatch(ApprovalList({ id: Number(UsersigninData.user_id) }));
  };

  const getStatusLabel = (status) => {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'approved':
        return t('Approvals.Approved');
      case 'reject':
        return t('Approvals.Rejected');
      case 'submit':
        return t('Approvals.Submitted');
      case 'pending':
        return t('Approvals.Pending');
      case 'draft':
        return t('Approvals.Draft');
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return COLOR.Primary1;
    switch (status.toLowerCase()) {
      case 'approved':
        return STATE.approved;
      case 'reject':
        return STATE.rejected;
      case 'submit':
        return STATE.submitted;
      case 'pending':
        return STATE.pending;
      case 'draft':
        return STATE.draft;
      default:
        return COLOR.Primary1;
    }
  };

  const handleApprove = async (id) => {
    try {
      const payload = {
        approval_request_id: id,
        user_id: UsersigninData.user_id,
      };

      const result = await dispatch(
        ApproveActionApprove(payload)
      ).unwrap();

      if (result?.success) {
        showMessage({
          icon: 'success',
          message: result?.message || 'Approval successful',
          type: 'success',
        });

        dispatch(ApprovalList({ id: UsersigninData.user_id }));
      } else {
        showMessage({
          icon: 'danger',
          message: result?.message || 'Failed to approve request',
          type: 'danger',
        });
      }
    } catch (error) {
      showMessage({
        icon: 'danger',
        message:
          error?.message ||
          error?.error ||
          'Something went wrong. Please try again.',
        type: 'danger',
      });
    }
  };


  const handleRejectPress = (id) => {
    setSelectedApprovalId(id);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      setReasonError(true); // 👈 show red border
      return;
    }

    setReasonError(false);

    try {
      const payload = {
        approval_request_id: selectedApprovalId,
        user_id: UsersigninData.user_id,
        remarks: rejectReason,
      };

      const result = await dispatch(
        ApproveActionReject(payload)
      ).unwrap();

      if (result?.success) {
        showMessage({
          icon: 'success',
          message: result?.successMessage,
          type: 'success',
        });

        setRejectModalVisible(false);
        setRejectReason('');
        setReasonError(false);

        dispatch(ApprovalList({ id: UsersigninData.user_id }));
      }
    } catch (error) {
      showMessage({
        icon: 'danger',
        message:
          error?.message ||
          error?.error ||
          'Something went wrong. Please try again.',
        type: 'danger',
      });
    }
  };

  const filteredApprovals = useMemo(() => {
      if (!selectedStatus || selectedStatus.id === 'all') {
        return GetApprovalListData;
      }
      return GetApprovalListData?.filter(item => {
        const itemLabel = APPROVALS_STATUS[item.state]; 
        return itemLabel === selectedStatus.name;
      });
    }, [GetApprovalListData, selectedStatus]);

  const renderItem = ({ item }) => {
    const status = item.state?.toLowerCase();
    const isPending = status === 'submit';
    const statusColor = getStatusColor(item.state);
    const getApprovalType = (item) => {
      if (item.hr_leave_id) {
        return 'Leave';
      }
      if (item.hr_expense_id) {
        return 'Expense';
      }
      return 'Attendance Regularization';
    };
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name} numberOfLines={2}>
              {`${item.req_employee_id?.[0]} ${item.req_employee_id?.[1]}` || 'N/A'}
            </Text>
            <Text style={styles.type} numberOfLines={2}>
              {`Type : ${getApprovalType(item)}` || 'N/A'}
            </Text>
          </View>
          <View style={styles.statusWrap}>
            <Text style={[styles.status, { color: statusColor }]}>
              {getStatusLabel(item.state).toUpperCase()}
            </Text>
            <View style={[styles.dot, { backgroundColor: statusColor }]} />
          </View>
        </View>

        <Text numberOfLines={2} style={styles.desc}>
          {item.description}
        </Text>

        <View style={styles.meta}>
          <View style={styles.dateContainer}>
            <DateApproval />
            <Text style={[styles.id, { paddingLeft: 5 }]}>
              {item.description?.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '--'}
            </Text>
          </View>
          <Text style={styles.id}>ID: {item.name}</Text>
        </View>

        {isPending && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.approveBtn]}
              onPress={() => handleApprove(item.id)}
            >
              <Text style={styles.approveText}>{t('Approvals.Approve').toUpperCase()}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.rejectBtn]}
              onPress={() => handleRejectPress(item.id)}
            >
              <Text style={styles.rejectText}>{t('Approvals.Reject').toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  return (
    <CommonView>
      <CommonHeader title={t('Approvals.Approvals')} />
      <View style={styles.headerWrapper}>
            <Text style={styles.sectionTitle}>{t('Approvals.Approvals')}</Text>
            <CommonFilterDropdown
              data={APPROVALS_STATUS_FILTER_OPTIONS}
              selectedItem={selectedStatus}
              setSelectedItem={setSelectedStatus}
            />
          </View>
      <FlatList
        data={filteredApprovals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isGetApprovalListFetching}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <View style={{ paddingTop: responsiveHeight(30) }}>
            <NodataFound titleText={t('comman.No_records_found')} />
          </View>
        }
      />

      <Modal transparent animationType="fade" visible={rejectModalVisible}>
        <TouchableWithoutFeedback onPress={() => setRejectModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Reject Approval ?</Text>
                  <TouchableOpacity
                    onPress={() => setRejectModalVisible(false)}
                  >
                    <Text style={styles.closeIcon}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalDesc}>
                  Are you sure want to reject this action can’t be undone.
                </Text>

                <Text style={styles.reasonLabel}>Reason</Text>
                <TextInput
                  placeholder="Enter Reason"
                  value={rejectReason}
                  onChangeText={(text) => {
                    setRejectReason(text);
                    if (text.trim()) setReasonError(false);
                  }}
                  multiline
                  style={[
                    styles.reasonInput,
                    reasonError && { borderColor: 'red' },
                  ]}
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setRejectModalVisible(false)}
                  >
                    <Text style={styles.modalCloseText}>Close</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalRejectBtn}
                    onPress={confirmReject}
                  >
                    <Text style={styles.modalRejectText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </CommonView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 20,
    paddingBottom: 30,
  },

  section: {
    ...GlobalFonts.subtitle,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  card: {
    backgroundColor: COLOR.White1,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: COLOR.Placeholder,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font16,
    fontWeight: '600',
    maxWidth: 180,
  },
  type: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font14,
    color: COLOR.TextPlaceholder,
    fontWeight: '600',
    maxWidth: '100%',
  },

  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  status: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font14,
    marginRight: 6,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  desc: {
    marginTop: 8,
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font14,
    color: COLOR.TextPlaceholder,
  },

  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  date: {
    marginLeft: 6,
  },

  id: {
    ...GlobalFonts.subtitle,
    color: COLOR.Black1,
    fontSize: FontSize.Font14,
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
    marginRight: 10,
  },

  rejectBtn: {
    backgroundColor: STATE.rejected,
  },

  approveText: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font14,
  },

  rejectText: {
    color: COLOR.White1,
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '85%',
    backgroundColor: COLOR.White1,
    borderRadius: 16,
    padding: 20,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  modalTitle: {
    fontSize: FontSize.Font16,
    fontWeight: '600',
  },

  closeIcon: {
    fontSize: 18,
  },

  modalDesc: {
    marginTop: 10,
    ...GlobalFonts.normalText,
    fontSize: FontSize.Font15,
    color: COLOR.TextPlaceholder,
  },

  reasonLabel: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font14,
    marginTop: 16,
    fontWeight: '500',
  },

  reasonInput: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font14,
    height: 90,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    textAlignVertical: 'top',
  },

  modalActions: {
    flexDirection: 'row',
    marginTop: 20,
  },

  modalCloseBtn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  modalRejectBtn: {
    flex: 1,
    height: 44,
    backgroundColor: STATE.rejected,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCloseText: {
    ...GlobalFonts.buttonText,
    fontSize: FontSize.Font14,
  },

  modalRejectText: {
    ...GlobalFonts.buttonText,
    fontSize: FontSize.Font14,
    color: COLOR.White1,
  },
    headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    alignItems: 'center',
    zIndex: 2000,
    overflow: 'visible',
    backgroundColor: 'transparent',
  },

  sectionTitle: {
    ...GlobalFonts.subtitle,
    fontSize: 18,
    fontWeight: '600',
    color: COLOR.Black1,
  },
});
