import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import {
    CommonSelector,
    GetCalendarEvents,
    CreateNewMeeting,
    GetAttandanceList,
} from '../../store/reducers/commonSlice';

export const useCalender = () => {
    const dispatch = useDispatch();
    const Navigation = useNavigation();

    const {
        GetCalendarEventsData,
        GetAttandanceListData,
        isGetCalendarEventsDataFetching,
        UsersigninData,
    } = useSelector(CommonSelector);

    const [mode, setMode] = useState('day');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [meetingModal, setMeetingModal] = useState(false);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [reminderEvents, setRemaiderEvents] = useState([]);
    const [visibleMonth, setVisibleMonth] = useState(moment().month() + 1);
    const [visibleYear, setVisibleYear] = useState(moment().year());

    // 🔹 Fetch on screen focus
    useFocusEffect(
        useCallback(() => {
            if (!UsersigninData?.user_id) return;

            const data = {
                id: Number(UsersigninData.user_id),
                month: Number(visibleMonth),
                year: Number(visibleYear),
            };

            dispatch(GetAttandanceList(data));
            fetchCalendar();
        }, [UsersigninData?.user_id, visibleMonth, visibleYear])
    );

    // 🔹 Fetch calendar events
    const fetchCalendar = () => {
        if (!UsersigninData?.user_id) return;
        dispatch(GetCalendarEvents({ id: UsersigninData.user_id }));
    };

    // 🔹 Refresh
    const onRefresh = useCallback(() => {
        fetchCalendar();
    }, [UsersigninData?.user_id]);

    // 🔹 Update visible month/year
    useEffect(() => {
        setVisibleMonth(moment(currentDate).month() + 1);
        setVisibleYear(moment(currentDate).year());
    }, [currentDate]);

    // 🔹 Build events
    useEffect(() => {
        let attendanceEvents = [];
        if (GetAttandanceListData?.attandancelist?.length) {
            attendanceEvents = buildAttendanceEvents(
                GetAttandanceListData.attandancelist
            );
        }

        let meetingEvents = [];
        if (GetCalendarEventsData?.length) {
            meetingEvents = GetCalendarEventsData.map(item => ({
                title: '',
                start: new Date(item.start.replace(' ', 'T')),
                end: new Date(item.stop.replace(' ', 'T')),
                attendanceType: 'meeting',
                description: item.description || '',
            }));
        }

        setCalendarEvents([...meetingEvents, ...attendanceEvents]);
    }, [GetCalendarEventsData, GetAttandanceListData, currentDate]);

    // 🔹 Reminder events (only meetings)
    useEffect(() => {
        const meetings = calendarEvents.filter(e =>
            e.attendanceType === 'meeting' &&
            moment(e.start).month() === moment(currentDate).month() &&
            moment(e.start).year() === moment(currentDate).year()
        );
        setRemaiderEvents(meetings);
    }, [calendarEvents, currentDate]);

    // 🔹 Attendance builder
    const buildAttendanceEvents = (attendanceList = []) => {
        const monthStart = moment({
            year: visibleYear,
            month: visibleMonth - 1,
        }).startOf('month');

        const monthEnd = moment({
            year: visibleYear,
            month: visibleMonth - 1,
        }).endOf('month');

        const today = moment().startOf('day');

        const map = {};
        attendanceList.forEach(item => {
            map[item.date] = item;
        });

        const events = [];
        let day = monthStart.clone();

        while (day.isSameOrBefore(monthEnd)) {
            const dateStr = day.format('YYYY-MM-DD');
            const attendance = map[dateStr];

            const isPast = day.isBefore(today, 'day');
            const isWeekend = day.day() === 0 || day.day() === 6;

            if (isWeekend) {
                day.add(1, 'day');
                continue;
            }

            if (attendance?.is_late_in) {
                events.push({
                    title: '',
                    start: day.toDate(),
                    end: day.clone().add(30, 'minutes').toDate(),
                    allDay: true,
                    attendanceType: 'late',
                    description: attendance.late_time_display,
                });
            } else if (!attendance && isPast) {
                events.push({
                    title: 'Absent',
                    start: day.toDate(),
                    end: day.clone().add(30, 'minutes').toDate(),
                    allDay: true,
                    attendanceType: 'absent',
                    description: 'Absent',
                });
            }

            day.add(1, 'day');
        }

        return events;
    };

    // 🔹 Create meeting
    const onCreateMeeting = async payload => {
        const result = await dispatch(
            CreateNewMeeting({
                id: UsersigninData.user_id,
                data: payload,
            })
        ).unwrap();

        if (result.success) {
            showMessage({
                icon: 'success',
                message: result.successMessage,
                type: 'success',
            });

            setMeetingModal(false);
            fetchCalendar();
        }
    };

    return {
        mode,
        setMode,
        currentDate,
        setCurrentDate,
        meetingModal,
        setMeetingModal,
        calendarEvents,
        reminderEvents,
        visibleMonth,
        visibleYear,
        onRefresh,
        onCreateMeeting,
        isGetCalendarEventsDataFetching,
        Navigation,
    };
};