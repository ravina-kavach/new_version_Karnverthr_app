import React from 'react'
import {
    View,
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
import RaiseTicketModal from '../../components/RaiseTicketModal'
import NodataFound from '../../components/NodataFound'
import moment from 'moment'
import CommonHeader from "../../components/CommonHeader";
import { DeleteIcon } from '../../assets/svgs'
import DeleteSupportTicketModal from '../../components/DeleteSupportTicketModal'

const RaiseTicket = () => {

    const {
        visibleModal,
        handleModal,
        handleOpenModal,
        deleteModalVisible,
        openDeleteModal,
        closeDeleteModal,
        confirmDeleteTicket,
        saveTicket,
        GetSupportListData,
        isFetching,
        onRefresh,
        getStatusColor,
    } = useRaiseTicket()

    return (
        <CommonView statusBarColor={COLOR.LightOrange}>
            <CommonHeader title="Support Ticket" />

            <View style={{ flex: 1 }}>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={isFetching}
                            onRefresh={onRefresh}
                        />
                    }
                    data={GetSupportListData}
                    keyExtractor={(item) => item.id?.toString()}
                    renderItem={({ item }) => {
                        const statusColor = getStatusColor(item.stage?.trim().toLowerCase());

                        return (
                            <View style={styles.ticketCard}>
                                <View style={styles.cardContent}>
                                    <View style={styles.headerRow}>
                                        <Text style={styles.ticketTitle}>
                                            {`#${item.id} ${item.name}`}
                                        </Text>

                                        <View style={[
                                            styles.statusBadge,
                                            { backgroundColor: `${statusColor}15` }
                                        ]}>
                                            <Text style={[styles.statusText, { color: statusColor }]}>
                                                {item.stage?.toUpperCase()}
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            onPress={() => openDeleteModal(item.id)}
                                        >
                                            <DeleteIcon width={24} height={24} />
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={styles.description}>
                                        {item.description}
                                    </Text>

                                    <Text style={styles.date}>
                                        {moment(item.create_date).format('DD MMM YYYY')}
                                    </Text>
                                </View>
                            </View>
                        );
                    }}
                    ListEmptyComponent={() => (
                        <NodataFound titleText="No Tickets Found" style={styles.emptyList} />
                    )}
                />

                <TouchableOpacity
                    style={styles.fab}
                    onPress={handleOpenModal}
                >
                    <Text style={styles.fabText}>Raise Ticket +</Text>
                </TouchableOpacity>
            </View>

            {visibleModal && (
                <RaiseTicketModal
                    visible={visibleModal}
                    onClose={handleModal}
                    onSave={saveTicket}
                />
            )}

            <DeleteSupportTicketModal
                visible={deleteModalVisible}
                onCancel={closeDeleteModal}
                onDelete={confirmDeleteTicket}
            />
        </CommonView>
    )
}

const styles = StyleSheet.create({
    ticketCard: {
        backgroundColor: COLOR.White1,
        margin: 15,
        borderRadius: 12,
        elevation: 3
    },
    cardContent: {
        padding: 20
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    ticketTitle: {
        ...GlobalFonts.subtitle,
        fontWeight: '600',
        flex: 1
    },
    description: {
        ...GlobalFonts.normalText,
        fontSize: 14,
        color: COLOR.TextPlaceholder,
        marginVertical: 10
    },
    date: {
        ...GlobalFonts.subtitle,
        fontSize: 12,
        color: COLOR.TextSecondary
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginHorizontal: 6
    },
    statusText: {
        ...GlobalFonts.subtitle,
        fontSize: 12
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: COLOR.Black1,
        padding: 12,
        borderRadius: 10
    },
    fabText: {
        ...GlobalFonts.subtitle,
        fontSize: 14,
        color: COLOR.White1
    },
    emptyList: {
        paddingTop: 150
    }
})

export default RaiseTicket
