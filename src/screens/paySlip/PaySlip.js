import React, { useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { usePaySlip } from './PaySlipController';
import { COLOR } from '../../theme/theme';
import { CommonView } from '../../utils/common';
import CommonHeader from '../../components/CommonHeader';
import { GlobalFonts } from '../../theme/typography';
import { FontSize } from '../../utils/metrics';
import Dropdown from '../../components/Dropdown';
const PaySlip = () => {
    const {
        YEARDATA,
        SelectedYear,
        setSelectedYear,
        slips,
        loading
    
    } = usePaySlip();

    return (
        <CommonView>
            <CommonHeader title='Pay Slip' />
            <View style={styles.filterContainer}>
                    <Dropdown
                        type="Attendance"
                        DropdownData={YEARDATA}
                        setSelecteditem={setSelectedYear}
                        Selecteditem={SelectedYear}
                    />
            </View>
            {loading ?
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={COLOR.Black1} />
                </View>
                :
                <FlatList
                    data={slips || []}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.container}
                    renderItem={({ item }) => <ShiftCard shift={item} />}
                    ListEmptyComponent={
                        <Text style={styles.empty}>No pay slips found</Text>
                    }
                    showsVerticalScrollIndicator={false}
                />}
        </CommonView>
    );
};



export default PaySlip;


const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
    },

    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    empty: {
        ...GlobalFonts.subtitle,
        textAlign: 'center',
        marginTop: 60,
        color: COLOR.TextPlaceholder,
    },
    filterContainer: {
        paddingHorizontal: 20,
        marginTop: 12,
        marginBottom: 8,
    },

});
