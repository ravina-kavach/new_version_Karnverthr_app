import React from 'react';
import { View, Text } from 'react-native';

export default function EventListCard({ item }) {
  return (
    <View style={{
      backgroundColor: '#fff',
      margin: 12,
      padding: 14,
      borderRadius: 12,
      elevation: 3
    }}>
      <Text style={{ fontSize: 16, fontWeight: '700' }}>{item.name}</Text>
      <Text>Start: {item.start}</Text>
      <Text>End: {item.stop}</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
        {item.partner_ids.map(p => (
          <View key={p} style={{
            backgroundColor: '#E0E7FF',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 10,
            marginRight: 6,
            marginTop: 6
          }}>
            <Text>{p}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
