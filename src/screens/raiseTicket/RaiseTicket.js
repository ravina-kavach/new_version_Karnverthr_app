import React from 'react'
import {
    View,
    ScrollView,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    RefreshControl
} from 'react-native'
import { COLOR } from '../../theme/theme'
import { CommonView } from '../../utils/common'
import { useRaiseTicket } from './RaiseTicketController'
import { GlobalFonts } from '../../theme/typography'
import { FontSize, responsiveHeight } from '../../utils/metrics'
import RaiseTicketModal from '../../components/RaiseTicketModal'
import NodataFound from '../../components/NodataFound'
import moment from 'moment'
import CommonHeader from "../../components/CommonHeader";

// import CommonFilterDropdown from '../../components/CommonFilterDropdown'

const RaiseTicket = () => {

    const {
        ticketSummary,
        ticketList,
        visibleModal,
        handleModal,
        handleOpenModal,
        saveTicket,
        selectedStatus,
        setSelectedStatus,
        filteredTickets,
        isFetching,
        onRefresh,
        getStatusColor
    } = useRaiseTicket()

    return (
        <CommonView statusBarColor={COLOR.LightOrange}>
            <CommonHeader title="Supoort Ticket" />

            <View style={styles.container}>
                {/* ===== Ticket List ===== */}
                <FlatList
                    nestedScrollEnabled
                    refreshControl={
                        <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
                    }
                    data={filteredTickets}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.ticketCard}>

                            <View style={styles.headerRow}>
                                <Text numberOfLines={2} style={styles.ticketTitle}>
                                    {item.title}
                                </Text>

                                <View style={styles.statusBadge}>
                                    <View
                                        style={[
                                            styles.statusDot,
                                            { backgroundColor: getStatusColor(item.status) }
                                        ]}
                                    />
                                    <Text
                                        style={[
                                            styles.statusText,
                                            { color: getStatusColor(item.status) }
                                        ]}
                                    >
                                        {item.status.toUpperCase()}
                                    </Text>
                                </View>
                            </View>

                            <Text numberOfLines={2} style={styles.description}>
                                {item.description}
                            </Text>

                            <View style={styles.footerRow}>
                                <Text style={styles.date}>
                                    {moment(item.created_at).format('DD MMM YYYY')}
                                </Text>
                                <Text style={styles.priority}>
                                    Priority: {item.priority}
                                </Text>
                            </View>

                        </View>
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.placeHoldeContainer}>
                            <NodataFound titleText="No Tickets Found" />
                        </View>
                    )}
                />

                {/* ===== Floating Button ===== */}
                <TouchableOpacity
                    style={styles.fab}
                    activeOpacity={0.8}
                    onPress={handleOpenModal}
                >
                    <Text style={styles.fabText}>Raise Ticket  + </Text>
                </TouchableOpacity>

            </View>

            {visibleModal && (
                <RaiseTicketModal
                    visible={visibleModal}
                    onClose={handleModal}
                    onSave={saveTicket}
                />
            )}
        </CommonView>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },

    sectionTitle: {
        ...GlobalFonts.subtitle,
        fontSize: 18,
        fontWeight: '600',
        color: COLOR.Black1,
    },

    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        marginTop: 20,
        marginHorizontal: 20,
        padding: 15,
        elevation: 4,
    },

    innerSummary: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10
    },

    summaryBox: {
        width: '48%',
        padding: 15,
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        marginBottom: 10,
    },

    summaryTitle: {
        fontSize: FontSize.Font14,
        color: COLOR.TextSecondary,
    },

    summaryCount: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 5,
        color: COLOR.Black1
    },

    summaryEmpty: {
        backgroundColor: '#fff',
        borderRadius: 14,
        marginTop: 20,
        marginHorizontal: 20,
        padding: 30,
        alignItems: 'center',
    },

    summaryEmptyText: {
        color: COLOR.TextSecondary,
    },

    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 25,
        marginBottom: 15,
        alignItems: 'center'
    },

    ticketCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        marginHorizontal: 20,
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    ticketTitle: {
        fontSize: 15,
        fontWeight: '600',
        maxWidth: 180,
        color: '#1F2937'
    },

    description: {
        fontSize: 14,
        color: COLOR.TextSecondary,
        marginBottom: 10,
    },

    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    date: {
        fontSize: 12,
        color: COLOR.TextSecondary
    },

    priority: {
        fontSize: 12,
        fontWeight: '600'
    },

    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
    },

    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },

    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },

    fab: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 20,
        backgroundColor: '#000',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },

    fabText: {
        color: COLOR.White1,
        fontWeight: '600',
        fontSize: 15,
    },

    placeHoldeContainer: {
        flex: 1,
        top: 100,
        height: 500,
    },

})

export default RaiseTicket
