import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
    Platform,
} from 'react-native';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

import { usePaySlip } from './PaySlipController';
import { COLOR } from '../../theme/theme';
import { CommonView, RowView } from '../../utils/common';
import CommonHeader from '../../components/CommonHeader';
import { GlobalFonts } from '../../theme/typography';
import Dropdown from '../../components/Dropdown';
import { DownloadIcon } from '../../assets/svgs';
import { showMessage } from 'react-native-flash-message';

const PaySlip = () => {
    const {
        YEARDATA,
        SelectedYear,
        setSelectedYear,
        months,
        Selectedmonth,
        setSelectedmonth,
        paySlip,
        isPaySlipBase64Fetching,
    } = usePaySlip();

    // Function to download PDF
    const handleDownload = async () => {
        try {
            if (!paySlip) return;

            // Path to save PDF
            const filePath = `${RNFS.DocumentDirectoryPath}/payslip_${Selectedmonth.name}_${SelectedYear.name}.pdf`;

            // Write base64 to file
            await RNFS.writeFile(filePath, paySlip, 'base64');

            // Open PDF
            await FileViewer.open(filePath);

        } catch (error) {
            console.log('Download error:', error);
            showMessage({
                message: 'Failed to download PDF',
                type: 'danger',
            });
        }
    };

    return (
        <CommonView style={{ flex: 1 }}>
            <CommonHeader title="Pay Slip" />

            {/* Filters */}
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

            {isPaySlipBase64Fetching ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={COLOR.Black1} />
                </View>
            ) : paySlip ? (
                <View style={{ flex: 1 }}>
                    <Pdf
                        source={{ uri: `data:application/pdf;base64,${paySlip}` }}
                        style={styles.pdf}
                        onError={(error) => {
                            console.log('PDF load error:', error);
                        }}
                    />

                    <TouchableOpacity
                        style={styles.downloadContainer}
                        onPress={handleDownload}
                        activeOpacity={0.8}
                    >
                        <View style={styles.iconContainer}>
                            <DownloadIcon width={28} height={28} />
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No pay slips found</Text>
                </View>
            )}
        </CommonView>
    );
};

export default PaySlip;

const styles = StyleSheet.create({
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    filterContainer: { paddingHorizontal: 20, marginTop: 12, marginBottom: 8 },
    filterRow: { justifyContent: 'space-between' },
    filterItem: { width: '48%' },
    pdf: { flex: 1, width: Dimensions.get('window').width },
    downloadContainer: {
        position: 'absolute',
        right: 24,
        bottom: 40,
    },
    iconContainer: {
        backgroundColor: COLOR.Black1,
        padding: 16,
        borderRadius: 16,
        elevation: 5,
    },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { ...GlobalFonts.subtitle, color: COLOR.TextPlaceholder },
});
