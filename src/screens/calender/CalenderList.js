import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import moment from 'moment';
import EventCard from '../../components/EventCard';
import { CommonView } from '../../utils/common';
import CommonHeader from '../../components/CommonHeader'
import { useSelector } from 'react-redux';
import { CommonSelector} from '../../store/reducers/commonSlice';

const CalendarList = () => {
const {GetCalendarEventsData } = useSelector(CommonSelector);
  const groupedData = useMemo(() => {
    const groups = {};

    GetCalendarEventsData.forEach(event => {
      const dateKey = moment(event.start).format('YYYY-MM-DD');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });

    return Object.keys(groups)
      .sort()
      .map(date => ({
        date,
        events: groups[date],
      }));
  }, [GetCalendarEventsData]);

  const renderDateSection = ({ item }) => (
    <View>
      {/* Date Header */}
      <Text style={styles.dateHeader}>
        {moment(item.date).format('DD MMMM, YYYY')}
      </Text>

      {/* Events */}
      {item.events.map(event => (
        <EventCard key={event.event_id} item={event} />
      ))}
    </View>
  );

  return (
    <CommonView>
        <CommonHeader
        title={"Calender Events"}
      />
    <FlatList
      data={groupedData}
      keyExtractor={(item) => item.date}
      renderItem={renderDateSection}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[]}
    />
    </CommonView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 10,
    marginTop: 12,
  },
});


export default CalendarList;
