import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import {
    CommonSelector,
    GetCalendarEvents,
    CreateNewMeeting,
} from '../../store/reducers/commonSlice';

export const useCalender = () => {
    const dispatch = useDispatch();
    const Navigation = useNavigation();

    const {
        GetCalendarEventsData,
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

    useFocusEffect(
        useCallback(() => {
            if (!UsersigninData?.user_id) return;
            fetchCalendar();
        }, [UsersigninData?.user_id, visibleMonth, visibleYear])
    );

    const fetchCalendar = () => {
        if (!UsersigninData?.user_id) return;
        dispatch(GetCalendarEvents({ id: UsersigninData.user_id }));
    };

    const onRefresh = useCallback(() => {
        fetchCalendar();
    }, [UsersigninData?.user_id]);

    useEffect(() => {
        setVisibleMonth(moment(currentDate).month() + 1);
        setVisibleYear(moment(currentDate).year());
    }, [currentDate]);

    useEffect(() => {
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

        setCalendarEvents(meetingEvents);
    }, [GetCalendarEventsData, currentDate]);

    useEffect(() => {
        const meetings = calendarEvents.filter(e =>
            e.attendanceType === 'meeting' &&
            moment(e.start).month() === moment(currentDate).month() &&
            moment(e.start).year() === moment(currentDate).year()
        );
        setRemaiderEvents(meetings);
    }, [calendarEvents, currentDate]);

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