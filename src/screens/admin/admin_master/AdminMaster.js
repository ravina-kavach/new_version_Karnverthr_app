import React from "react"
import { CommonView } from "../../../utils/common"
import { StyleSheet,View,Text } from "react-native"
import { GlobalFonts } from "../../../theme/typography"
import { COLOR } from "../../../theme/theme"
const AdminMaster = () => {
return(
    <CommonView>
        <View style={styles.flexContainer}>
        <View style={styles.headerWrapper}>
            <Text style={styles.sectionTitle}>Master</Text>
          </View>
        </View>
    </CommonView>
)
}

const styles = StyleSheet.create({
     flexContainer: { flex: 1 },
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal:10,
        alignItems: 'center',
        zIndex: 2000,
        elevation: 20,
        overflow: 'visible',
        backgroundColor: 'transparent',
        marginBottom:30,
      },
    
      sectionTitle: {
        ...GlobalFonts.subtitle,
        fontSize: 18,
        fontWeight: '600',
        color: COLOR.Black1,
      },
})

export default AdminMaster