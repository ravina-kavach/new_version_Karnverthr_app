import React from 'react'
import { StyleSheet, View } from 'react-native';
import { CommonView } from '../../../utils/common'
import CommonList from '../../../components/CommonList';
import {useAdminLeave} from './AdminLeaveController'

const AdminLeave = () => {
  const { AdminLeavesData, navigation } = useAdminLeave();
  return (
    <CommonView>
      <View style={styles.container}>
        <CommonList
          data={AdminLeavesData}
          onPressItem={(item) => navigation.navigate(item.screen)}
        />
      </View>
    </CommonView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
})
export default AdminLeave