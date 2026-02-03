import React, { useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useShiftTiming } from './ShiftTimingController';
import { COLOR } from '../../theme/theme';
import { CommonView } from '../../utils/common';
import CommonHeader from '../../components/CommonHeader';
import { GlobalFonts } from '../../theme/typography';
import { FontSize } from '../../utils/metrics';

const DAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

const PERIOD_COLORS = {
    morning: { bg: '#E3F2FD', text: '#1565C0' },
    lunch: { bg: '#FFF3E0', text: '#EF6C00' },
    afternoon: { bg: '#E8F5E9', text: '#2E7D32' },
};

const groupByDay = (attendances = []) =>
    attendances.reduce((acc, item) => {
        const day = DAYS[Number(item.dayofweek)];
        if (!acc[day]) acc[day] = [];
        acc[day].push(item);
        return acc;
    }, {});

const formatTime = (hour) => {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const formatted = hour % 12 || 12;
    return `${formatted}:00 ${suffix}`;
};


const ShiftTiming = () => {
    const { GetMonthlyShiftsData, isGetMonthlyShiftsFetching } = useShiftTiming();

    return (
        <CommonView>
            <CommonHeader title='Shift Time' />
            {isGetMonthlyShiftsFetching ?
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={COLOR.Black1} />
                </View>
                :
                <FlatList
                    data={GetMonthlyShiftsData || []}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.container}
                    renderItem={({ item }) => <ShiftCard shift={item} />}
                    ListEmptyComponent={
                        <Text style={styles.empty}>No shifts found</Text>
                    }
                    showsVerticalScrollIndicator={false}
                />}
        </CommonView>
    );
};

const ShiftCard = ({ shift }) => {
    const groupedAttendances = useMemo(
        () => groupByDay(shift.attendances),
        [shift.attendances]
    );

    return (
        <View style={[styles.card, shift.is_night_shift && styles.nightCard]}>

            <Text style={styles.title}>{shift.name}</Text>

            <Text style={styles.subTitle}>
                ⏰ {shift.hours_per_day} hrs/day • {shift.full_time_required_hours} hrs/week
            </Text>

            <View style={styles.badges}>
                {shift.flexible_hours && (
                    <Text style={styles.badge}>Flexible</Text>
                )}
                {shift.is_night_shift && (
                    <Text style={[styles.badge, styles.nightBadge]}>
                        🌙 Night Shift
                    </Text>
                )}
            </View>

            {/* Schedule */}
            {Object.entries(groupedAttendances).map(([day, slots]) => (
                <DayCard key={day} day={day} slots={slots} />
            ))}
        </View>
    );
};


const DayCard = ({ day, slots }) => (
    <View style={styles.dayCard}>
        <Text style={styles.day}>{day}</Text>
        <View style={styles.slotRow}>
            {slots.map((slot) => {
                const theme = PERIOD_COLORS[slot.day_period] || {};
                return (
                    <View
                        key={slot.id}
                        style={[
                            styles.timeChip,
                            { backgroundColor: theme.bg || '#F5F5F5' },
                        ]}
                    >
                        <Text style={[styles.period, { color: theme.text }]}>
                            {slot.day_period.toUpperCase()}
                        </Text>
                        <Text style={styles.time}>
                            {formatTime(slot.hour_from)} – {formatTime(slot.hour_to)}
                        </Text>
                    </View>
                );
            })}
        </View>
    </View>
);

export default ShiftTiming;


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
        textAlign: 'center',
        marginTop: 40,
        color: '#888',
    },

    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 22,
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
    },

    nightCard: {
        borderLeftWidth: 5,
        borderLeftColor: COLOR.Black1
    },

    title: {
        ...GlobalFonts.subtitle,
        fontSize: FontSize.Font16,
        fontWeight: '800',
        color: '#111',
    },

    subTitle: {
        ...GlobalFonts.subtitle,
        fontSize: FontSize.Font12,
        color: '#666',
        marginTop: 6,
    },

    badges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        marginBottom: 6,
        gap: 8,
    },

    badge: {
        backgroundColor: '#EEF2FF',
        color: '#3730A3',
        fontSize: 11,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        fontWeight: '600',
    },

    nightBadge: {
        backgroundColor: '#E0E7FF',
        color: '#4338CA',
    },

    dayCard: {
        backgroundColor: '#FAFAFA',
        borderRadius: 18,
        padding: 12,
        marginTop: 14,
        borderWidth: 1,
        borderColor: '#EEE',
    },

    day: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 10,
        color: '#222',
    },

    slotRow: {
        flexDirection: 'column',
        gap: 10,
    },

    timeChip: {
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 14,
        minWidth: '45%',
    },

    period: {
        ...GlobalFonts.subtitle,
        fontSize: FontSize.Font10,
        fontWeight: '700',
    },

    time: {
        ...GlobalFonts.subtitle,
        fontSize: FontSize.Font14,
        fontWeight: '800',
        marginTop: 4,
        color: '#111',
    },
});
