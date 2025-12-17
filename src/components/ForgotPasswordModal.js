import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

const ForgotPasswordModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Background Overlay */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Modal Content */}
      <View style={styles.modalContainer}>
        <View style={styles.card}>
          {/* Icon */}
          <View style={styles.iconWrapper}>
            <Icon name="shield" size={26} color="#fff" />
          </View>

          <Text style={styles.title}>Forgot Password</Text>

          <Text style={styles.subtitle}>
            A verification code will be sent to your email to reset your password.
          </Text>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Icon name="mail" size={18} color="#FF6B6B" />
            <TextInput
              placeholder="My email"
              placeholderTextColor="#999"
              style={styles.input}
            />
          </View>

          {/* Button */}
          <TouchableOpacity activeOpacity={0.8}>
            <LinearGradient
              colors={['#FFB6B6', '#FF6B6B']}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                Send Verification Code
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ForgotPasswordModal;
