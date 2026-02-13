import React from "react"
import { CommonView } from "../../../utils/common"
import { View, Text, StyleSheet } from 'react-native'
import CommonHeader from "../../../components/CommonHeader"
import { useAdminMaster } from './AdminAttendanceController'
const AdminAttendance = () => {
    return (
        <CommonView>
            <CommonHeader title="Attendance Management" />
            <View style={styles.container}>
                <Text>Admin Attendance</Text>
            </View>
        </CommonView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
})

export default AdminAttendance