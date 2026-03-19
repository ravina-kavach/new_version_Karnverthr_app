import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import { CommonView } from '../../utils/common';
import CommonHeader from '../../components/CommonHeader';
import useNotifications from './NotificationsController';

const Notifications = () => {
    const { GetAllNotificationData, isGetAllNotificationfeatching } = useNotifications();

    const notifications = GetAllNotificationData?.data || [];

    const getSectionTitle = (date) => {
        const mDate = moment(date);

        if (mDate.isSame(moment(), 'day')) return 'Today';
        if (mDate.isSame(moment().subtract(1, 'day'), 'day')) return 'Yesterday';

        return mDate.format('DD MMM YYYY');
    };

    const groupedData = notifications.reduce((acc, item) => {
        const section = getSectionTitle(item.created_on);
        if (!acc[section]) acc[section] = [];
        acc[section].push(item);
        return acc;
    }, {});

    const sections = Object.keys(groupedData).map((title) => ({
        title,
        data: groupedData[title],
    }));

    // 🔥 ICON + COLOR + BG
    const getEventMeta = (event) => {
        switch (event) {
            case 'support_ticket_created':
                return { icon: '🎫', color: '#4CAF50', bg: '#E8F5E9' };
            case 'support_ticket_stage_change':
                return { icon: '🔄', color: '#FF9800', bg: '#FFF3E0' };
            case 'approval_request_approved':
                return { icon: '✅', color: '#2196F3', bg: '#E3F2FD' };
            case 'create_leave_request':
                return { icon: '🌴', color: '#9C27B0', bg: '#F3E5F5' };
            case 'out_reminder':
                return { icon: '⏰', color: '#F44336', bg: '#FDECEA' };
            default:
                return { icon: '🔔', color: '#607D8B', bg: '#ECEFF1' };
        }
    };

    const renderItem = ({ item }) => {
        const meta = getEventMeta(item.event);

        return (
            <View style={[styles.card, { borderLeftColor: meta.color }]}>

                {/* ICON */}
                <View style={[styles.iconBox, { backgroundColor: meta.bg }]}>
                    <Text style={styles.icon}>{meta.icon}</Text>
                </View>

                {/* CONTENT */}
                <View style={styles.content}>

                    {/* TITLE + TIME */}
                    <View style={styles.row}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.time}>
                            {moment(item.created_on).format('hh:mm A')}
                        </Text>
                    </View>

                    {/* MESSAGE */}
                    <Text style={styles.message}>{item.message}</Text>
                </View>
            </View>
        );
    };

    if (isGetAllNotificationfeatching) {
        return (
            <CommonView>
                <CommonHeader title="Notifications" />
                <ActivityIndicator size="large" style={{ marginTop: 30 }} />
            </CommonView>
        );
    }

    return (
        <CommonView>
            <CommonHeader title="Notifications" />

            {sections.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>No Notifications Yet 🔔</Text>
                </View>
            ) : (
                <FlatList
                    data={sections}
                    keyExtractor={(item) => item.title}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View>
                            <Text style={styles.sectionTitle}>{item.title}</Text>

                            {item.data.map((notif) => (
                                <View key={notif.id}>
                                    {renderItem({ item: notif })}
                                </View>
                            ))}
                        </View>
                    )}
                />
            )}
        </CommonView>
    );
};

export default Notifications;

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginTop: 18,
        marginBottom: 8,
        marginHorizontal: 16,
        color: '#444',
    },

    card: {
        flexDirection: 'row',
        padding: 14,
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 14,
        backgroundColor: '#fff',
        borderLeftWidth: 4,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },

    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    icon: {
        fontSize: 18,
    },

    content: {
        flex: 1,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111',
        flex: 1,
        marginRight: 10,
    },

    message: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
        lineHeight: 18,
    },

    time: {
        fontSize: 11,
        color: '#999',
        fontWeight: '500',
    },

    empty: {
        alignItems: 'center',
        marginTop: 60,
    },

    emptyText: {
        fontSize: 15,
        color: '#999',
    },
});