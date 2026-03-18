import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { CommonView } from '../../utils/common';
import CommonHeader from '../../components/CommonHeader';


const Notifications = () => {
    return (
        <CommonView>
            <CommonHeader title="Notifications" />
        </CommonView>
    );
};

export default Notifications;

