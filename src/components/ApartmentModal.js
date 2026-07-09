// src/components/ApartmentModal.js

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const wp = p => (width * p) / 100;
const hp = p => (height * p) / 100;
const rf = s => s * (width / 375);

const ApartmentModal = ({
  visible,
  onClose,
  onCamera,
  onFiles,
  onAgreement,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable onPress={() => {}}>
          <View style={styles.container}>
            {/* Camera */}
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.8}
              onPress={onCamera}>
              <Image
                source={require('../assets/icons/camera.png')}
                style={styles.icon}
              />
              <Text style={styles.text}>Upload via Camera</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Files */}
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.8}
              onPress={onFiles}>
              <Image
                source={require('../assets/icons/files.png')}
                style={styles.icon}
              />
              <Text style={styles.text}>Upload from Files</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Agreement */}
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.8}
              onPress={onAgreement}>
              <Image
                source={require('../assets/icons/agreements.png')}
                style={styles.icon}
              />
              <Text style={styles.text}>
                Upload from Agreement Section
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ApartmentModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(5),
  },

  container: {
    width: wp(78),
    backgroundColor: '#fff',
    borderRadius: wp(4),
    overflow: 'hidden',
    elevation: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
  },

  icon: {
    width: wp(6),
    height: wp(6),
    resizeMode: 'contain',
    tintColor: '#4A97C8',
    marginRight: wp(4),
  },

  text: {
    flex: 1,
    fontSize: rf(14),
    color: '#444',
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: '#ECECEC',
    marginLeft: wp(15),
  },
});