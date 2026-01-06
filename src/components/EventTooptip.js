import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';

export default function EventTooltip({ event, onClose }) {
  if (!event) return null;

  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        padding: 14,
        borderRadius: 12,
        minWidth: 220,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 6 }}>
        {event.title}
      </Text>

      <Text style={{ color: '#6B7280', marginBottom: 8 }}>
        {moment(event.start).format('DD MMM YYYY, hh:mm A')}  
        {' - '}
        {moment(event.end).format('hh:mm A')}
      </Text>

      <TouchableOpacity
        onPress={onClose}
        style={{
          marginTop: 10,
          alignSelf: 'flex-end',
          backgroundColor: '#2563EB',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}
