import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

const CallStatusModal = ({visible, onClose, onSave}) => {
  const [selected, setSelected] = useState('');
  const [remarks, setRemarks] = useState('');

  const save = () => {
    onSave({
      status: selected,
      remarks,
    });

    setSelected('');
    setRemarks('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Select Call Status</Text>

          <View style={styles.iconRow}>
            {/* Answered */}
            <TouchableOpacity
              style={[
                styles.circle,
                selected === 'answered' && styles.active,
              ]}
              onPress={() => setSelected('answered')}>
              <Image
                source={require('../assets/icons/answered_call.png')}
                style={styles.icon}
              />
            </TouchableOpacity>

            {/* Missed */}
            <TouchableOpacity
              style={[
                styles.circle,
                selected === 'missed' && styles.active,
              ]}
              onPress={() => setSelected('missed')}>
              <Image
                source={require('../assets/icons/missed_call.png')}
                style={styles.icon}
              />
            </TouchableOpacity>

            {/* Rejected */}
            <TouchableOpacity
              style={[
                styles.circle,
                selected === 'rejected' && styles.active,
              ]}
              onPress={() => setSelected('rejected')}>
              <Image
                source={require('../assets/icons/rejected_call.png')}
                style={styles.icon}
              />
            </TouchableOpacity>

            {/* Outgoing */}
            <TouchableOpacity
              style={[
                styles.circle,
                selected === 'outgoing' && styles.active,
              ]}
              onPress={() => setSelected('outgoing')}>
              <Image
                source={require('../assets/icons/outgoing_call.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Enter Remarks</Text>

          <TextInput
            placeholder="Enter Remarks"
            placeholderTextColor="#000000"
            multiline
            value={remarks}
            onChangeText={setRemarks}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.save}
            onPress={save}>
            <Text style={styles.saveTxt}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CallStatusModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
  },

  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  circle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  active: {
    borderWidth: 2,
    borderColor: '#4A97C8',
    backgroundColor: '#EAF6FD',
  },

  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0c0c0c',
    marginBottom: 8,
  },

  input: {
    height: 100,
    backgroundColor: '#EEF5FA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 12,
    textAlignVertical: 'top',
    color: '#1c1b1b',
    fontSize: 14,
  },

  save: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#4A97C8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  saveTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  cancel: {
    marginTop: 15,
    textAlign: 'center',
    color: 'red',
    fontSize: 15,
    fontWeight: '600',
  },
});