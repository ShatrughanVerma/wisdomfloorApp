import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

const ForgotPasswordModal = ({
  visible,
  onCancel,
  onForgotPassword,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* PNG Image */}
          <Image
            source={require('../assets/icons/warning.png')}
            style={styles.icon}
            resizeMode="contain"
          />

          {/* Message */}
          <Text style={styles.message}>
            Forgot your password?
            {'\n\n'}
            Tap the button below to reset your password using your registered email address.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={onForgotPassword}
            >
              <Text style={styles.actionText}>
                Forgot Password
              </Text>
            </TouchableOpacity>

          </View>

        </View>
      </View>
    </Modal>
  );
};

export default ForgotPasswordModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: 'center',
  },

  icon: {
    width: 70,
    height: 70,
    marginBottom: 25,
  },

  message: {
    textAlign: 'center',
    color: '#8A8A8A',
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 30,
  },

  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  cancelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelText: {
    color: '#FF0000',
    fontSize: 18,
    fontWeight: '500',
  },

  actionButton: {
    flex: 2,
    backgroundColor: '#4B94C2',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },

  actionText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});