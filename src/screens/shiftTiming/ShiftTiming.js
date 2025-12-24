import React from 'react'
import { View, Text,  TouchableOpacity, ScrollView, LayoutAnimation } from 'react-native'
import { COLOR } from '../../theme/theme';
import {useShiftTiming} from './ShiftTimingController'
import { CommonView, ColView, RowView} from '../../utils/common';
export default function ShiftTiming() {
    const { ShiftData} =useShiftTiming()
    const ShiftAccordion = ({ shift, expanded, onToggle }) => {
        const backgroundColor =
            shift.shifts.length > 0 ? '#a8d08d' : '#7a4dff';

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onToggle}
                style={{ borderRadius: 12, padding: 15, marginVertical: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, backgroundColor, }}>
                <RowView>
                    <ColView style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLOR.White1 }}>{shift.day} ({shift.weekday})</Text>
                    </ColView>
                    <ColView style={{ flex: 0 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: COLOR.White1, textAlign: 'right', }}>
                            {shift.shifts.length > 0 ? `${shift.shifts.length} Shifts` : 'Day Off'}
                        </Text>
                    </ColView>
                    <ColView style={{ flex: 0 }}>
                        <View style={{ justifyContent: 'flex-end' }}>
                            {/* <Entypo name={expanded ? "chevron-down" : "chevron-up"} color={COLOR.White1} size={24} /> */}
                        </View>
                    </ColView>
                </RowView>


                {expanded && shift.shifts.length > 0 && (
                    <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: COLOR.background2, paddingTop: 10 }}>
                        {shift.shifts.map((shiftDetail, index) => (
                            <View key={index} style={{ paddingVertical: 8, borderBottomWidth: 0.5 }}>
                                <Text style={{ color: COLOR.dark1, fontSize: 15 }}>
                                    {shiftDetail.name} ({shiftDetail.day_period})
                                </Text>
                                <Text style={{ color: COLOR.Black1, fontSize: 15 }}>
                                    <Text style={{ fontWeight: '500' }}>Shift Time: </Text>
                                    <Text >{shiftDetail.hour_from}:00 - {shiftDetail.hour_to}:00</Text>
                                </Text>
                                <Text style={{ color: COLOR.Black1, fontSize: 15 }}>
                                    <Text style={{ fontWeight: '500' }}>Break Time: </Text>
                                    <Text > {shiftDetail.day_period === 'lunch' ? `${shiftDetail.hour_from}:00 - ${shiftDetail.hour_to}:00` : 'No Break'}</Text>
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const toggleExpand = (id) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <CommonView edges={['left', 'right','bottom']}>
        <ScrollView  contentContainerStyle={{ paddingHorizontal: 20 }}>
            {ShiftData.length > 0 ? (
                ShiftData.map((shift) => (
                    <ShiftAccordion
                        key={shift.id}
                        shift={shift}
                        expanded={expandedId === shift.id}
                        onToggle={() => toggleExpand(shift.id)}
                    />
                ))
            ) : (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>No shifts available</Text>
            )}
        </ScrollView>
        </CommonView>
    )
}