import React from 'react'
import { CommonView } from '../../../utils/common'
import { View, StyleSheet } from 'react-native'
import CommonList from '../../../components/CommonList'
import { userAdminEmployee } from './AdminEmployeeController'

const AdminEmployee = () => {
  const {EmployeeTypeData, navigation} = userAdminEmployee();
  return (
      <CommonView>
      <View style={styles.container}>
        <CommonList
          data={EmployeeTypeData}
          onPressItem={(item) => navigation.navigate(item.screen)}
        />
      </View>
    </CommonView>
  )
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
})

export default AdminEmployee