import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Dimensions
} from 'react-native';
import { Calendar as CalendarView } from 'react-native-big-calendar';
import moment from 'moment';
import { CommonView } from '../../utils/common';
import { DayCalIcon, MonthCalIcon, WeekCalIcon } from '../../assets/svgs';
import { COLOR } from '../../theme/theme';
import NewMeetingModal from '../../components/CreateMeetingModal'
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { CommonSelector, GetCalendarEvents, CreateNewMeeting } from '../../store/reducers/commonSlice';
import { showMessage } from 'react-native-flash-message';
import { FontSize } from '../../utils/metrics';
import { GlobalFonts } from '../../theme/typography';
// THEME CONSTANTS
const COLORS = {
  bg: '#F3F4F6', // Light gray background
  card: '#FFFFFF', // White card background
  primary: '#000000', // Active tab / Black
  textMain: '#111827', // Dark text
  textMuted: '#6B7280', // Gray text
  accentBlue: '#E0F2FE',// Event blue bg
  accentBlueText: '#0284C7', // Event blue text
  inputBg: '#F3F4F6', // Input/Card gray background
  danger: '#EF4444', // Red indicator
};

const { width } = Dimensions.get('window');

export default function Calendar() {
  const [mode, setMode] = useState('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meetingModal, setMeetingModal] = useState(false)
  const IsFocused = useIsFocused();
  const Navigation = useNavigation();
  const dispatch = useDispatch();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [reminderEvents, setRemaiderEvents] = useState([])
  const { GetCalendarEventsData, UsersigninData } = useSelector(CommonSelector);
  // Mock Data for the Calendar (Top)

  useEffect(() => {
    if (IsFocused) {
      const userData = {
        id: UsersigninData.user_id
      }
      dispatch(GetCalendarEvents(userData))
    }
  }, [IsFocused])

  useEffect(() => {
    if (GetCalendarEventsData) {
      const formattedEvents = GetCalendarEventsData.map(item => ({
        title: item.name,
        start: new Date(item.start.replace(' ', 'T')),
        end: new Date(item.stop.replace(' ', 'T')),
      }));
      setCalendarEvents(formattedEvents);

    }
  }, [GetCalendarEventsData])

  useEffect(() => {

    if (GetCalendarEventsData) {
      const reminderEvents = GetCalendarEventsData
        .filter(item =>
          moment(item.start).month() === moment().month() &&
          moment(item.start).year() === moment().year()
        )
        .map((item, index) => ({
          id: String(index + 1),
          title: item.name,
          startDate: item.start,
          endDate: item.stop,
          type: item.location || 'Event',
          description: item.description
        }));
      setRemaiderEvents(reminderEvents)
    }
  }, [GetCalendarEventsData])

  const onCreateMeeting = async (payload) => {
    const userData = {
      id: UsersigninData.user_id,
      data: payload
    }
    const result = await dispatch(CreateNewMeeting(userData)).unwrap()
    if (result.success) {
      showMessage({
        icon: "success",
        message: result.successMessage,
        type: "success",
      })
      setMeetingModal(false)

    }
  }
  const currentMonth = moment().format('MMMM, YYYY');

  const renderIcon = (mode, isActive) => {
    if (mode === 'day') {
      <DayCalIcon color={isActive ? COLOR.Black1 : COLOR.Placeholder} />
    }
    if (mode === 'week') {
      <WeekCalIcon color={isActive ? COLOR.Black1 : COLOR.Placeholder} />
    }
    if (mode === 'month') {
      <MonthCalIcon color={isActive ? COLOR.Black1 : COLOR.Placeholder} />
    }
  }
  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {[
        { key: 'day', label: 'Day', icon: <DayCalIcon /> },
        { key: 'week', label: 'Week', icon: <WeekCalIcon /> },
        { key: 'month', label: 'Month', icon: <MonthCalIcon /> },
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
              {renderIcon(mode, isActive)}
              <DayCalIcon />
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
    const { dayRange, timeRange } = formatDateRange(
      item.startDate,
      item.endDate
    );

    return (
      <View style={styles.listItemContainer}>
        <Text style={styles.listItemTitle}>
          {item.title || 'Meeting Invitation'}
        </Text>
        <View style={styles.cardBox}>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardLabel}>From-To</Text>

            <Text style={styles.cardDate}>
              {dayRange}
            </Text>

            <Text style={styles.cardTime}>
              {timeRange}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardLabel, { paddingTop: 5 }]}>Description</Text>
              <Text style={styles.cardDate}>
                {item?.description.replace(/<[^>]+>/g, '')}
              </Text>
            </View>
          </View>

          <View style={styles.linkIconContainer}>
            <Text style={styles.linkIcon}>🔗</Text>
          </View>
        </View>

      </View>
    );
  };


  const getWeekDates = (date) => {
    const startOfWeek = moment(date).startOf('week'); // Sunday start
    return Array.from({ length: 7 }).map((_, i) =>
      startOfWeek.clone().add(i, 'days')
    );
  };

  const renderWeek = () => {
    const weekDates = getWeekDates(currentDate);

    return (
      <View style={styles.weekContainer}>
        {/* Day names */}
        <View style={styles.weekDayRow}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <Text key={`${day}-${index}`} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>

        {/* Dates */}
        <View style={styles.weekDateRow}>
          {weekDates.map(date => {
            const isSelected = moment(date).isSame(currentDate, 'day');
            const hasEvent = calendarEvents?.some(e =>
              moment(e.start).isSame(date, 'day')
            );

            return (
              <TouchableOpacity
                key={date.format('YYYY-MM-DD')}
                // onPress={() => setCurrentDate(date.toDate())}
                onPress={() => {
                  setCurrentDate(date.toDate());
                  Navigation.navigate("calendarList");
                }}
                style={[
                  styles.dateCircle,
                  isSelected && styles.activeDate
                ]}
              >
                <Text style={[
                  styles.dateText,
                  isSelected && styles.activeDateText
                ]}>
                  {date.date()}
                </Text>

                {hasEvent && <View style={styles.dot} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <CommonView>
      <FlatList
        data={reminderEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderListItem}
        contentContainerStyle={{ paddingBottom: 100, marginTop: 30 }}
        ListHeaderComponent={
          <>
            <View style={styles.calendarCard}>
              {renderTabs()}

              <Text style={styles.currentDateTitle}>
                {moment(currentDate).format('DD MMM YYYY')}
              </Text>

              {mode === 'week' ?
                renderWeek()
                :
                <CalendarView
                  events={calendarEvents}
                  height={250}
                  mode={mode}
                  date={currentDate}
                  onPressCell={() => Navigation.navigate("calendarList")}
                  swipeToChangeMonth
                  showTime={true}
                  onSwipeEnd={setCurrentDate}
                  eventCellStyle={styles.calendarEventStyle}
                  calendarCellStyle={{ borderColor: 'transparent' }} // Cleaner look
                  headerContainerStyle={{ display: 'none' }}
                  hideNowIndicator={false}
                  nowIndicatorColor={COLORS.danger}
                  hourTextStyle={{ fontSize: 10, color: COLORS.textMuted }}
                />
              }
              {/* </View> */}
            </View>

            {/* List Section Title */}
            <View style={styles.listHeaderRow}>
              <Text style={styles.sectionTitle}>{currentMonth}</Text>
            </View>
          </>
        }
      />


      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => setMeetingModal(true)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <NewMeetingModal
        visible={meetingModal}
        onClose={() => setMeetingModal(false)}
        onCreateMeeting={onCreateMeeting}
      />

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
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textMain,
  },

  calendarCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    marginHorizontal: 16,
    padding: 16,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
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
    bottom: -1, // Overlap the border
    width: '100%',
    height: 3,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  // Date Title
  currentDateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 10,
  },

  // Calendar Specifics
  calendarWrapper: {
    // marginTop:20,
    overflow: 'hidden', // Ensures events don't spill out
  },
  calendarEventStyle: {
    backgroundColor: COLORS.accentBlue,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.danger, // The red line on the left
    borderRadius: 4,
    opacity: 0.9,
  },

  // List Section
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
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
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
    paddingHorizontal: 12,
  },
  weekDayText: {
    fontSize: 12,
    color: '#999',
    width: 40,
    textAlign: 'center',
  },
  weekDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 6,
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDate: {
    backgroundColor: '#1E1E1E',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  activeDateText: {
    color: '#FFF',
    fontWeight: '600',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#2D7DFF',
    marginTop: 2,
  },

  listItemContainer: {
    marginBottom: 16,
    paddingHorizontal: 20
  },

  listItemTitle: {
    fontSize: FontSize.Font16,
    ...GlobalFonts.subtitle,
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
});