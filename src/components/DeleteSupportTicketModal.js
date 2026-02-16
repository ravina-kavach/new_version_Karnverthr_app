import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { GlobalFonts } from '../theme/typography';
import { FontSize } from '../utils/metrics';
import { COLOR } from '../theme/theme';

const DeleteSupportTicketModal = ({ visible, onCancel, onDelete }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Delete Support Ticket</Text>

                    <Text style={styles.message}>
                        Are you sure you want to delete this support ticket?
                        This action cannot be undone.
                    </Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onCancel}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={onDelete}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default DeleteSupportTicketModal;

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
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        width: '48%',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLOR.Black1,
    },
    cancelText: {
        ...GlobalFonts.subtitle,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: COLOR.Black1,
    },
    deleteButton: {
        width: '48%',
        backgroundColor: COLOR.Error || '#FF3B30', // fallback red
        paddingVertical: 14,
        borderRadius: 12,
    },
    deleteText: {
        ...GlobalFonts.subtitle,
        color: COLOR.White1,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
