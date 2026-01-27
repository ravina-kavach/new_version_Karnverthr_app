import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import { GlobalFonts } from '../theme/typography';
import { COLOR } from '../theme/theme';

const stripHtml = (html) =>
  html?.replace(/<\/?[^>]+(>|$)/g, '');

const EventCard = ({ item }) => {
  return (
    <View style={styles.card}>
      {/* Title */}
      <Text style={styles.title}>Event : {item.name}</Text>

      {/* Row 1 */}
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>From - To</Text>
          <Text style={styles.value}>
            {moment(item.start).format('DD MMM')} - {moment(item.stop).format('DD MMM')}
          </Text>
          <Text style={styles.time}>
            {moment(item.start).format('HH:mm')} - {moment(item.stop).format('HH:mm')}
          </Text>
        </View>

        <View style={styles.colRight}>
          <Text style={styles.label}>Duration</Text>
          <Text style={styles.bold}>
            {item.duration} Hrs
          </Text>
        </View>
      </View>

      {/* Row 2 */}
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Client</Text>
          <Text style={styles.bold}>
            {item.user_id?.name}
          </Text>
        </View>

        <View style={styles.colRight}>
          <Text style={styles.label}>Privacy</Text>
          <Text style={styles.bold}>
            {item.privacy || 'Public'}
          </Text>
        </View>
      </View>

      {/* Optional Row */}
      {(item.location || item.description) && (
        <View style={styles.divider}>
          {item.location && (
            <>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{item.location}</Text>
            </>
          )}

          {item.description && (
            <>
              <Text style={[styles.label, { marginTop: 6 }]}>Description</Text>
              <Text style={styles.value}>
                {stripHtml(item.description)}
              </Text>
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLOR.Black1,
    marginBottom: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOR.Black1,
    marginBottom: 10,
    ...GlobalFonts.subtitle,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  col: {
    flex: 1,
  },
  colRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    color: '#222',
  },
  time: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },
  bold: {
    // width:'100%',
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 8,
  },
});

export default EventCard;
