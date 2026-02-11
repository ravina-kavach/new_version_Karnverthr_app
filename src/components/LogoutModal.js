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

const LogoutModal = ({ visible, onCancel, onLogout }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Confirm Logout</Text>

          <Text style={styles.message}>
            Are you sure you want to logout from your account?
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
              style={styles.logoutButton}
              onPress={onLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;

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
  logoutButton: {
    width: '48%',
    backgroundColor: COLOR.Black1,
    paddingVertical: 14,
    borderRadius: 12,
  },
  logoutText: {
    ...GlobalFonts.subtitle,
    color: COLOR.White1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
