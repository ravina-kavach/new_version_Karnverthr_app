import React, { useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableWithoutFeedback
} from 'react-native';
import { usePaySlip } from './PaySlipController';
import { COLOR } from '../../theme/theme';
import { CommonView } from '../../utils/common';
import CommonHeader from '../../components/CommonHeader';
import { GlobalFonts } from '../../theme/typography';
import { FontSize } from '../../utils/metrics';
import Dropdown from '../../components/Dropdown';
import { RowView } from '../../utils/common';
import { DownloadIcon } from '../../assets/svgs';
const PaySlip = () => {
    const {
        YEARDATA,
        SelectedYear,
        setSelectedYear,
        months,
        Selectedmonth,
        setSelectedmonth,
        slips,
        getisPaySlipBase64Fetching

    } = usePaySlip();

    return (
        <CommonView>
            <CommonHeader title='Pay Slip' />
            <View style={styles.filterContainer}>
                <RowView style={styles.filterRow}>
                    <View style={styles.filterItem}>
                        <Dropdown
                            type="Attendance"
                            DropdownData={months}
                            setSelecteditem={setSelectedmonth}
                            Selecteditem={Selectedmonth}
                        />
                    </View>

                    <View style={styles.filterItem}>
                        <Dropdown
                            type="Attendance"
                            DropdownData={YEARDATA}
                            setSelecteditem={setSelectedYear}
                            Selecteditem={SelectedYear}
                        />
                    </View>
                </RowView>
            </View>
            {getisPaySlipBase64Fetching ?
                <View style={styles.loader}>
                    <ActivityIndicator animating={getisPaySlipBase64Fetching} size="large" color={COLOR.Black1} />
                </View>
                :
                // <FlatList
                //     data={slips || []}
                //     keyExtractor={(item) => String(item.id)}
                //     contentContainerStyle={styles.container}
                //     renderItem={({ item }) => <ShiftCard shift={item} />}
                //     ListEmptyComponent={
                //         <Text style={styles.empty}>No pay slips found</Text>
                //     }
                //     showsVerticalScrollIndicator={false}
                // />
                <View style={{flex:1}}>
                    <Text style={styles.empty}>No pay slips found</Text>
                    <TouchableWithoutFeedback>
                              <View style={styles.downloadContainer}>
                                <View style={styles.iconContainer}>
                                  <DownloadIcon width={28} height={28} />
                                </View>
                              </View>
                    </TouchableWithoutFeedback>
                </View>
                
                }
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
    filterRow: {
        justifyContent: "space-between",
    },
    filterItem: {
    width: "48%",
  },
   downloadContainer: {
    alignItems:'flex-end',
    justifyContent:'flex-end',
    alignItems:'flex-end',
    position: 'absolute',
    right: 50,
    bottom: 80,
  },

  iconContainer: {
    backgroundColor: COLOR.Black1,
    padding: 16,
    borderRadius: 16,
  },

});
