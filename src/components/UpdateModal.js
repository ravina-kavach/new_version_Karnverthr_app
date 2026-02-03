import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Linking,
} from 'react-native';
import { GlobalFonts } from '../theme/typography';
import { FontSize } from '../utils/metrics';
import { COLOR } from '../theme/theme';

const UpdateModal = ({ visible, storeUrl }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Update Available</Text>

                    <Text style={styles.message}>
                        A new version of KonverHR is available.
                        Please update the app to continue.
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => Linking.openURL(storeUrl)}
                    >
                        <Text style={styles.buttonText}>Update Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default UpdateModal;

const styles = StyleSheet.create({
    overlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'center', 
        alignItems: 'center', 
    }, 
    container: { 
        width: '85%', 
        backgroundColor: '#fff', 
        borderRadius: 16, 
        padding: 24, 
        alignItems: 'center', 
    }, 
    title: {
        ...GlobalFonts.title, 
        fontSize: FontSize.Font20, 
        fontWeight: '700', 
        marginBottom: 10, 
    }, 
    message: {
        ...GlobalFonts.subtitle, 
        fontSize: 14, 
        color: COLOR.TextPlaceholder, 
        textAlign: 'center', 
        marginBottom: 24, 
    }, 
    button: { 
        width: '100%', 
        backgroundColor: COLOR.Black1, 
        paddingVertical: 14, 
        borderRadius: 12, 
    },   
    buttonText: { 
        ...GlobalFonts.subtitle, 
        color: COLOR.White1, 
        fontSize: 16, 
        fontWeight: '600', 
        textAlign: 'center', 
    },
});