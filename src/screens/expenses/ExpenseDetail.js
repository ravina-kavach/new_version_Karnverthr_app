import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import CommonHeader from '../../components/CommonHeader';
import { CommonView } from '../../utils/common';
import { STATE } from '../../theme/theme';
import { EXPENSE_STATUS } from '../../utils/metrics';

const ExpenseDetail = ({ route }) => {
  const { expense } = route.params;
  return (
    <CommonView>
      <CommonHeader title={"Expense Detail"} />
    <ScrollView style={styles.container}>
      <View style={styles.statusRow}>
        <View style={[styles.dot,{backgroundColor:STATE[expense.state]}]} />
        <Text style={[styles.statusText,{color:STATE[expense.state]}]}>
          {EXPENSE_STATUS[expense.state].toUpperCase()}
        </Text>
      </View>
      <View style={styles.amountBox}>
        <Text style={styles.amount}>
          ₹ {expense.total_amount}
        </Text>
        <Text style={styles.date}>{expense.date}</Text>
      </View>
      <View style={styles.card}>
        <DetailRow label="Employee Name" value={expense.name} />
        <DetailRow label="Attachment Id" value={expense.attachment_ids[0]?.id} />
        <DetailRow label="Product" value={expense.product_id?.[1]} />
        <DetailRow label="Account" value={expense.account_id?.[1]} />
        <DetailRow label="Payment Mode" value={expense.payment_mode} />
        <DetailRow label="Currency" value={expense.currency_id?.[1]} />
      </View>
      {expense.attachment_ids?.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Attachments</Text>

          {expense.attachment_ids.map(item => (
            <Image
              key={item.id}
              source={{ uri: `data:${item.mimetype};base64,${item.base64}` }}
              style={styles.attachment}
            />
          ))}
        </View>
      )}
    </ScrollView>
    </CommonView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

export default ExpenseDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    margin:20
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  statusText: {
    fontWeight: '500',
  },

  amountBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  amount: {
    fontSize: 24,
    fontWeight: '700',
  },

  date: {
    color: '#777',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  label: {
    color: '#777',
    fontSize: 14,
  },

  value: {
    fontSize: 14,
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },

  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },

  attachment: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
});
