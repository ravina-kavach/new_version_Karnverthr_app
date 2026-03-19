import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
  Dimensions
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarView } from 'react-native-big-calendar';
import moment from 'moment';
import { CommonView } from '../../utils/common';
import { DayCalIcon, MonthCalIcon, WeekCalIcon } from '../../assets/svgs';
import { COLOR } from '../../theme/theme';
import NewMeetingModal from '../../components/CreateMeetingModal';
import { FontSize } from '../../utils/metrics';
import { GlobalFonts } from '../../theme/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCalender } from './CalenderController'

const COLORS = {
  bg: '#F3F4F6',
  card: '#FFFFFF',
  primary: '#000000',
  textMain: '#111827',
  textMuted: '#6B7280',
  accentBlue: '#E0F2FE',
  accentBlueText: '#0284C7',
  inputBg: '#F3F4F6',
  danger: '#EF4444',
};

const { width } = Dimensions.get('window');

export default function Calendar() {

  const { t, i18n } = useTranslation();
  const {
    mode,
    setMode,
    currentDate,
    setCurrentDate,
    meetingModal,
    setMeetingModal,
    calendarEvents,
    reminderEvents,
    onRefresh,
    onCreateMeeting,
    isGetCalendarEventsDataFetching,
    Navigation,
  } = useCalender();
  const insets = useSafeAreaInsets();
  const currentMonth = moment(currentDate).format('MMMM, YYYY');

  const renderIcon = (mode, isActive) => {
    if (mode === 'day') return <DayCalIcon color={isActive ? COLOR.Black1 : COLOR.Placeholder} />;
    if (mode === 'week') return <WeekCalIcon color={isActive ? COLOR.Black1 : COLOR.Placeholder} />;
    if (mode === 'month') return <MonthCalIcon color={isActive ? COLOR.Black1 : COLOR.Placeholder} />;
  };

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {[
        { key: 'day', label: 'Day' },
        { key: 'week', label: 'Week' },
        { key: 'month', label: 'Month' },
      ].map((item) => {
        const isActive = mode === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.tabItem}
            onPress={() => setMode(item.key)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {renderIcon(item.key, isActive)}
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {item.label}
              </Text>
            </View>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const formatDateRange = (start, end) => {
    const startMoment = moment(start);
    const endMoment = moment(end);
    return {
      dayRange: `${startMoment.format('DD MMM')} - ${endMoment.format('DD MMM')}`,
      timeRange: `${startMoment.format('hh:mm A')} - ${endMoment.format('hh:mm A')}`,
    };
  };

  const renderListItem = ({ item }) => {
    const { dayRange, timeRange } = formatDateRange(item.start, item.end);
    return (
      <View style={styles.listItemContainer}>
        <Text style={styles.listItemTitle}>{item.title || 'Meeting Invitation'}</Text>
        <View style={styles.cardBox}>
          <View style={{ flex: 1, }}>
            <Text style={styles.cardLabel}>From-To</Text>
            <Text style={styles.cardDate}>{dayRange}</Text>
            <Text style={styles.cardTime}>{timeRange}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardLabel, { paddingTop: 10 }]}>Description</Text>
              <Text style={styles.cardDate}>{item?.description.replace(/<[^>]+>/g, '')}</Text>
            </View>
          </View>
          {/* <View style={styles.linkIconContainer}>
            <Text style={styles.linkIcon}>🔗</Text>
          </View> */}
        </View>
      </View>
    );
  };

  const getWeekDates = (date) => {
    const startOfWeek = moment(date).startOf('week'); // Sunday
    return Array.from({ length: 7 }).map((_, i) => startOfWeek.clone().add(i, 'days'));
  };

  const renderWeek = () => {
    const weekDates = getWeekDates(currentDate);

    return (
      <View style={styles.weekContainer}>
        {/* Week day labels */}
        <View style={styles.weekDayRow}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <Text key={index} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>

        {/* Week dates */}
        <View style={styles.weekDateRow}>
          {weekDates.map(date => {
            const isSelected = moment(date).isSame(currentDate, 'day');

            const attendanceEvent = calendarEvents?.find(
              e =>
                moment(e.start).isSame(date, 'day') &&
                (e.attendanceType === 'late' ||
                  e.attendanceType === 'absent')
            );

            const hasMeetingEvent = calendarEvents?.some(
              e =>
                moment(e.start).isSame(date, 'day') &&
                e.attendanceType === 'meeting'
            );

            return (
              <TouchableOpacity
                key={date.format('YYYY-MM-DD')}
                style={styles.dateWrapper}
                activeOpacity={0.7}
                onPress={() => {
                  if (hasMeetingEvent) {
                    Navigation.navigate('calendarList');
                  }
                }}
              >
                {/* Date circle */}
                <View
                  style={[
                    styles.dateCircle,
                    isSelected && styles.activeDate,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateText,
                      isSelected && styles.activeDateText,
                    ]}
                  >
                    {date.date()}
                  </Text>
                </View>

                {/* Dots BELOW circle */}
                {(attendanceEvent || hasMeetingEvent) && (
                  <View style={styles.dotRow}>
                    {attendanceEvent && (
                      <View
                        style={[
                          styles.dot,
                          attendanceEvent.attendanceType === 'late'
                            ? styles.lateDot
                            : styles.absentDot,
                        ]}
                      />
                    )}
                    {hasMeetingEvent && (
                      <View style={[styles.dot, styles.meetingDot]} />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };


  const renderMonth = () => {
    const monthStart = moment(currentDate).startOf('month');
    const monthEnd = moment(currentDate).endOf('month');
    const startDate = monthStart.clone().startOf('week');
    const endDate = monthEnd.clone().endOf('week');

    const rows = [];
    let day = startDate.clone();
    const today = moment().startOf('day');

    while (day.isSameOrBefore(endDate, 'day')) {
      const weekDays = [];

      for (let i = 0; i < 7; i++) {
        const isCurrentMonth = day.month() === monthStart.month();
        const isSelected = day.isSame(currentDate, 'day');

        const attendanceEvent = calendarEvents?.find(
          e => moment(e.start).isSame(day, 'day') && (e.attendanceType === 'late' || e.attendanceType === 'absent')
        );

        const hasMeetingEvent = calendarEvents?.some(
          e => moment(e.start).isSame(day, 'day') && e.attendanceType === 'meeting'
        );

        weekDays.push(
          <TouchableOpacity
            key={day.format('YYYY-MM-DD')}
            style={styles.dateWrapper}
            onPress={() => {
              if (hasMeetingEvent) Navigation.navigate('calendarList');
            }}
          >
            <View
              style={[
                styles.dateCircle,
                isSelected && styles.activeDate,
                !isCurrentMonth && { opacity: 0.3 },
              ]}
            >
              <Text
                style={[
                  styles.dateText,
                  isSelected && styles.activeDateText,
                ]}
              >
                {day.date()}
              </Text>
            </View>

            {(attendanceEvent || hasMeetingEvent) && (
              <View style={styles.dotRow}>
                {attendanceEvent && (
                  <View
                    style={[
                      styles.dot,
                      attendanceEvent.attendanceType === 'late'
                        ? styles.lateDot
                        : styles.absentDot,
                    ]}
                  />
                )}
                {hasMeetingEvent && (
                  <View style={[styles.dot, styles.meetingDot]} />
                )}
              </View>
            )}
          </TouchableOpacity>

        );

        day.add(1, 'day');
      }

      rows.push(
        <View key={day.format('YYYY-MM-DD')} style={styles.weekDateRow}>
          {weekDays}
        </View>
      );
    }

    return (
      <View style={styles.weekContainer}>
        <View style={styles.weekDayRow}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <Text key={i} style={styles.weekDayText}>
              {d}
            </Text>
          ))}
        </View>
        {rows}
      </View>
    );
  };


  const calendarEventStyle = (event) => {
    if (event.attendanceType === 'late') return { backgroundColor: '#F59E0B', borderLeftColor: '#F59E0B', borderLeftWidth: 3 };
    if (event.attendanceType === 'absent') return { backgroundColor: '#EF4444', borderLeftColor: '#EF4444', borderLeftWidth: 3 };
    return { backgroundColor: COLORS.accentBlue, borderLeftColor: COLORS.danger, borderLeftWidth: 3 };
  };

  return (
    <CommonView>
      <FlatList
        data={reminderEvents}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderListItem}
        refreshControl={<RefreshControl refreshing={isGetCalendarEventsDataFetching} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 100, marginTop: 10 }}
        ListHeaderComponent={
          <>
            <View style={styles.calendarCard}>
              {renderTabs()}
              <Text style={styles.currentDateTitle}>{moment(currentDate).format('DD MMM YYYY')}</Text>
              {mode === 'week' ? renderWeek() : mode === 'month' ? renderMonth() :
                <CalendarView
                  events={calendarEvents}
                  height={250}
                  mode={mode}
                  date={currentDate}
                  onPressEvent={(event) => { if (event?.attendanceType === "meeting") Navigation.navigate("calendarList"); }}
                  swipeToChangeMonth
                  showTime={mode !== 'day'}
                  onSwipeEnd={setCurrentDate}
                  eventCellStyle={calendarEventStyle}
                  calendarCellStyle={{ borderColor: 'transparent' }}
                  headerContainerStyle={{ display: 'none' }}
                  nowIndicatorColor={COLORS.danger}
                  hourTextStyle={{ fontSize: 10, color: COLORS.textMuted }}
                />
              }
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, styles.absentDot]} />
                  <Text style={styles.legendText}>Absent</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, styles.lateDot]} />
                  <Text style={styles.legendText}>Late</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, styles.meetingDot]} />
                  <Text style={styles.legendText}>Events</Text>
                </View>
              </View>
            </View>
            <View style={styles.listHeaderRow}>
              <Text style={styles.sectionTitle}>{currentMonth}</Text>
            </View>
          </>
        }
      />

      <TouchableOpacity style={[styles.fab, { bottom: insets.bottom + 10 }]} activeOpacity={0.8} onPress={() => setMeetingModal(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <NewMeetingModal t={t} visible={meetingModal} onClose={() => setMeetingModal(false)} onCreateMeeting={onCreateMeeting} />
    </CommonView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },
  headerTitle: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font16,
    fontWeight: '600',
    color: COLORS.textMain,
  },

  calendarCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 20,
  },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 0,
    marginBottom: 16,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textMuted,
    paddingLeft: 5
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    width: '100%',
    height: 3,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  currentDateTitle: {
    ...GlobalFonts.subtitle,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 10,
  },


  calendarWrapper: {
    overflow: 'hidden',
  },

  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    ...GlobalFonts.subtitle,
  },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 10,
    width: 56,
    height: 56,
    backgroundColor: '#222', // Dark button
    borderRadius: 16, // Squircle shape
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 30,
    color: '#fff',
    marginTop: -2,
  },
  weekContainer: {
    marginTop: 10,
  },
  weekDayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  weekDayText: {
    ...GlobalFonts.title,
    fontSize: FontSize.Font14,
    color: COLOR.Black1,
    width: 40,
    textAlign: 'center',
  },
  dateWrapper: {
    width: 40,
    alignItems: 'center',
  },
  weekDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 8,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',

  },
  activeDate: {
    backgroundColor: '#1E1E1E',
  },
  dateText: {
    ...GlobalFonts.subtitle,
    fontSize: 14,
    color: '#333',
  },
  activeDateText: {
    color: '#FFF',
    fontWeight: '600',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  listItemContainer: {
    marginBottom: 16,
    paddingHorizontal: 20
  },

  listItemTitle: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111',
  },

  cardBox: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#111',
  },

  cardLabel: {
    fontSize: FontSize.Font14,
    color: '#6B7280',
    ...GlobalFonts.small,
    marginBottom: 4,
  },

  cardDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },

  cardTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  linkIconContainer: {
    paddingLeft: 10,
  },

  linkIcon: {
    fontSize: 18,
  },

  description: {
    marginTop: 8,
    color: '#111',
    ...GlobalFonts.small,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', // light gray
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#6B7280',
    ...GlobalFonts.small,
  },


  dotRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 4,

  },

  lateDot: {
    backgroundColor: '#F59E0B', // Yellow
  },

  absentDot: {
    backgroundColor: '#EF4444', // Red
  },

  meetingDot: {
    backgroundColor: '#2D7DFF', // Blue
  },

});