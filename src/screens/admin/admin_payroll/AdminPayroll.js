import React from 'react'
import { View, StyleSheet } from 'react-native';
import { CommonView } from '../../../utils/common'
import CommonList from '../../../components/CommonList';
import { useAdminPayroll } from './AdminPayrollController';
import CommonHeader from '../../../components/CommonHeader';
const AdminPayroll = () => {
  const { AdminPayrollData, navigation } = useAdminPayroll();
  return (
    <CommonView>
      <CommonHeader title="Payroll" />
      <View style={styles.container}>
        <CommonList
          data={AdminPayrollData}
          onPressItem={(item) => navigation.navigate(item.screen)}
        />
      </View>
    </CommonView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
})

export default AdminPayroll