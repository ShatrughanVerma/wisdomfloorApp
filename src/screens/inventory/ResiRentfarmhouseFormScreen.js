import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Dimensions,
  PixelRatio,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

// ---------------------------------------------------------------------------
// Responsive scaling helpers (kept identical to BuilderDetailsScreen so the
// two screens feel consistent).
// ---------------------------------------------------------------------------
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_WIDTH = 375;
const MAX_SCALE = 1.35;
const widthScale = Math.min(SCREEN_WIDTH / BASE_WIDTH, MAX_SCALE);

const scale = (size) => PixelRatio.roundToNearestPixel(size * widthScale);
const scaleFont = (size) => Math.round(PixelRatio.roundToNearestPixel(size * widthScale));

const ACCENT = '#2E8BCF';

const SPECIFIER_OPTIONS = ['Owner', 'Builder', 'Broker', 'Tenant'];
const ADDRESS_TYPE_OPTIONS = ['House', 'Apartment', 'Villa', 'Plot'];

// ---------------------------------------------------------------------------
// Reusable field components — defined once so every field on the screen
// (and any future screen) looks and behaves the same way.
// ---------------------------------------------------------------------------

const FieldLabel = ({ children }) => (
  <Text style={styles.label}>{children}</Text>
);

const LabeledInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
}) => (
  <View style={styles.fieldGroup}>
    <FieldLabel>{label}</FieldLabel>
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#B5B5B5"
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </View>
);

// A tap-to-open dropdown. Kept dependency-free (no @react-native-picker
// requirement) using a bottom-anchored Modal + FlatList of options.
const LabeledDropdown = ({ label, value, options, onSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      <FieldLabel>{label}</FieldLabel>
      <TouchableOpacity
        style={styles.input}
        activeOpacity={0.7}
        onPress={() => setOpen(true)}>
        <Text style={value ? styles.dropdownValue : styles.dropdownPlaceholder}>
          {value || `Select ${label.toLowerCase()}`}
        </Text>
        <Image
          source={require('../../assets/icons/down_arrow.png')}
          style={styles.chevronIcon}
        />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setOpen(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      item === value && styles.modalOptionTextActive,
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const AddLinkButton = ({ label, onPress }) => (
  <TouchableOpacity style={styles.addLink} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.addLinkIcon}>
      <Text style={styles.addLinkIconText}>+</Text>
    </View>
    <Text style={styles.addLinkText}>{label}</Text>
  </TouchableOpacity>
);

const BuilderForm1Screen = ({ navigation }) => {
  const [specifier, setSpecifier] = useState('Owner');
  const [addressType, setAddressType] = useState('House');
  const [address, setAddress] = useState('');

  // Each entry is a { id, name, phone } row. Starting with one of each,
  // matching the reference screenshot; "+ Add ..." appends another.
  const [owners, setOwners] = useState([{ id: 1, name: '', phone: '' }]);
  const [representatives, setRepresentatives] = useState([
    { id: 1, name: '', phone: '' },
  ]);

  const updateEntry = (list, setList, id, field, text) => {
    setList(list.map((e) => (e.id === id ? { ...e, [field]: text } : e)));
  };

  const addOwner = () =>
    setOwners((prev) => [...prev, { id: Date.now(), name: '', phone: '' }]);

  const addRepresentative = () =>
    setRepresentatives((prev) => [...prev, { id: Date.now(), name: '', phone: '' }]);

  const handleContinue = () => {
    const payload = { specifier, owners, representatives, addressType, address };
    // Wire this up to your submit/API logic.
    console.log('Builder floor form payload:', payload);
    navigation.navigate('ResiRentfarmhouseFormTwoScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* Header — now scrolls away with the rest of the content */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Image
                source={require('../../assets/icons/back.png')}
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Farm House</Text>
            <View style={styles.headerSpacer} />
          </View>

          <Text style={styles.subtitle}>
            Add Contact details of Specifier of the property
          </Text>

          <LabeledDropdown
            label="Specifier"
            value={specifier}
            options={SPECIFIER_OPTIONS}
            onSelect={setSpecifier}
          />

          {/* Owner entries */}
          {owners.map((owner, index) => (
            <React.Fragment key={owner.id}>
              <LabeledInput
                label={index === 0 ? 'Name of owner' : `Name of owner ${index + 1}`}
                value={owner.name}
                onChangeText={(t) => updateEntry(owners, setOwners, owner.id, 'name', t)}
                placeholder="Anand"
              />
              <LabeledInput
                label="Phone number"
                value={owner.phone}
                onChangeText={(t) => updateEntry(owners, setOwners, owner.id, 'phone', t)}
                placeholder="92892378292"
                keyboardType="phone-pad"
              />
            </React.Fragment>
          ))}

          <AddLinkButton label="Add Owner & Phone number" onPress={addOwner} />

          {/* Representative entries */}
          {representatives.map((rep, index) => (
            <React.Fragment key={rep.id}>
              <LabeledInput
                label={
                  index === 0
                    ? 'Name of the representative'
                    : `Name of the representative ${index + 1}`
                }
                value={rep.name}
                onChangeText={(t) =>
                  updateEntry(representatives, setRepresentatives, rep.id, 'name', t)
                }
                placeholder="Prashant"
              />
              <LabeledInput
                label="Phone number"
                value={rep.phone}
                onChangeText={(t) =>
                  updateEntry(representatives, setRepresentatives, rep.id, 'phone', t)
                }
                placeholder="92892378292"
                keyboardType="phone-pad"
              />
            </React.Fragment>
          ))}

          <AddLinkButton
            label="Add Representatives & Phone number"
            onPress={addRepresentative}
          />

          <LabeledDropdown
            label="Address Type"
            value={addressType}
            options={ADDRESS_TYPE_OPTIONS}
            onSelect={setAddressType}
          />

          <LabeledInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            placeholder="221/09, Moti nagar"
            multiline
          />

          {/* Continue button — now part of the scrollable content instead
              of a fixed footer, so it scrolls along with the form. */}
          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.85}
            onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BuilderForm1Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(4),
    paddingBottom: scale(14),
    marginBottom: scale(4),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  backIcon: {
    width: scale(18),
    height: scale(18),
    resizeMode: 'contain',
    tintColor: '#222',
  },

  headerTitle: {
    fontSize: scaleFont(20),
    fontWeight: '700',
    color: '#222',
    
    
  },

  // Balances the back icon so the title stays visually centered.
  headerSpacer: {
    width: scale(20),
  },

  scrollContent: {
    paddingHorizontal: scale(20),
    paddingTop: scale(8),
    paddingBottom: scale(30),
  },

  subtitle: {
    fontSize: scaleFont(14),
    color: '#8A8A8A',
    marginBottom: scale(18),
  },

  fieldGroup: {
    marginBottom: scale(16),
  },

  label: {
    fontSize: scaleFont(13),
    color: ACCENT,
    marginBottom: scale(6),
  },

  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: scale(10),
    paddingHorizontal: scale(14),
    paddingVertical: scale(12),
    fontSize: scaleFont(14),
    color: '#333',
    backgroundColor: '#fff',
  },

  inputMultiline: {
    minHeight: scale(70),
    textAlignVertical: 'top',
  },

  dropdownValue: {
    fontSize: scaleFont(14),
    color: '#333',
  },

  dropdownPlaceholder: {
    fontSize: scaleFont(14),
    color: '#B5B5B5',
  },

  chevronIcon: {
    width: scale(14),
    height: scale(14),
    resizeMode: 'contain',
    tintColor: '#999',
  },

  addLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(20),
  },

  addLinkIcon: {
    width: scale(18),
    height: scale(18),
    borderRadius: scale(4),
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(8),
  },

  addLinkIconText: {
    color: '#fff',
    fontSize: scaleFont(13),
    fontWeight: '700',
    lineHeight: scaleFont(14),
  },

  addLinkText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: ACCENT,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },

  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: scale(18),
    borderTopRightRadius: scale(18),
    paddingHorizontal: scale(20),
    paddingTop: scale(16),
    paddingBottom: scale(30),
    maxHeight: '60%',
  },

  modalTitle: {
    fontSize: scaleFont(15),
    fontWeight: '700',
    color: '#222',
    marginBottom: scale(10),
  },

  modalOption: {
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },

  modalOptionText: {
    fontSize: scaleFont(15),
    color: '#444',
  },

  modalOptionTextActive: {
    color: ACCENT,
    fontWeight: '700',
  },

  continueButton: {
    backgroundColor: ACCENT,
    borderRadius: scale(12),
    paddingVertical: scale(15),
    alignItems: 'center',
    marginTop: scale(10),
  },

  continueButtonText: {
    color: '#fff',
    fontSize: scaleFont(15),
    fontWeight: '700',
  },
});