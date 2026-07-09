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
// Responsive scaling helpers — identical pattern to the other property forms
// so every screen in the app feels consistent across device sizes.
// ---------------------------------------------------------------------------
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_WIDTH = 375;
const MAX_SCALE = 1.35;
const widthScale = Math.min(SCREEN_WIDTH / BASE_WIDTH, MAX_SCALE);

const scale = (size) => PixelRatio.roundToNearestPixel(size * widthScale);
const scaleFont = (size) => Math.round(PixelRatio.roundToNearestPixel(size * widthScale));

const ACCENT = '#2E8BCF';

const AREA_UNIT_OPTIONS = ['Sq. ft', 'Sq. yd', 'Sq. m', 'Acre'];
const UNIT_TYPE_OPTIONS = ['Standalone', 'Co-working', 'Business Park', 'IT Park'];
const YES_NO_OPTIONS = ['Yes', 'No'];

// ---------------------------------------------------------------------------
// Reusable field building blocks
// ---------------------------------------------------------------------------

const FieldLabel = ({ children }) => <Text style={styles.label}>{children}</Text>;

const Row = ({ children }) => <View style={styles.row}>{children}</View>;
const Col = ({ children, style }) => <View style={[styles.col, style]}>{children}</View>;

const LabeledInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}) => (
  <View style={styles.fieldGroup}>
    {label ? <FieldLabel>{label}</FieldLabel> : null}
    <View style={styles.input}>
      <TextInput
        style={styles.inputText}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B5B5B5"
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

const LabeledTextArea = ({ label, value, onChangeText, placeholder }) => (
  <View style={styles.fieldGroup}>
    {label ? <FieldLabel>{label}</FieldLabel> : null}
    <TextInput
      style={[styles.input, styles.textArea]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#B5B5B5"
      multiline
      textAlignVertical="top"
    />
  </View>
);

// Location field with a "Moti Nagar" style area pill
const LocationInput = ({ value, onChangeText, area, onPressPin }) => (
  <View style={styles.fieldGroup}>
    <FieldLabel>Location</FieldLabel>
    <View style={styles.addressRow}>
      <TextInput
        style={[styles.inputText, styles.addressText]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter location"
        placeholderTextColor="#B5B5B5"
      />
      <TouchableOpacity style={styles.addressPill} onPress={onPressPin} activeOpacity={0.7}>
        <Text style={styles.addressPillText} numberOfLines={1}>
          {area}
        </Text>
        <Image
          source={require('../../assets/icons/location_icon.png')}
          style={styles.pinIcon}
        />
      </TouchableOpacity>
    </View>
  </View>
);

const LabeledDropdown = ({ label, value, options, onSelect, placeholder }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      <TouchableOpacity style={styles.input} activeOpacity={0.7} onPress={() => setOpen(true)}>
        <Text style={value ? styles.dropdownValue : styles.dropdownPlaceholder}>
          {value || placeholder || 'Select'}
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
            <Text style={styles.modalTitle}>{label || 'Select'}</Text>
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

// Upload Field
const UploadField = ({ label, onPress, fileName }) => (
  <View style={styles.fieldGroup}>
    <FieldLabel>{label}</FieldLabel>
    <TouchableOpacity style={styles.input} activeOpacity={0.7} onPress={onPress}>
      <Text style={fileName ? styles.dropdownValue : styles.dropdownPlaceholder} numberOfLines={1}>
        {fileName || 'Upload'}
      </Text>
      <Image
        source={require('../../assets/icons/upload.png')}
        style={styles.chevronIcon}
      />
    </TouchableOpacity>
  </View>
);

const IndustrialFloorFormScreen = ({ navigation }) => {
  const [location, setLocation] = useState('122 A, Moti Nagar, Delhi');
  const [buildingName, setBuildingName] = useState('');

  const [areaUnit, setAreaUnit] = useState('Sq. ft');
  const [areaValue, setAreaValue] = useState('');

  const [unitType, setUnitType] = useState('Standalone');
  const [floorNo, setFloorNo] = useState('12');

  const [askingPrice, setAskingPrice] = useState('2,11,299');
  const [facilities, setFacilities] = useState('Yes');

  const [lift, setLift] = useState('Yes');
  const [parking, setParking] = useState('Yes');

  const [toilets, setToilets] = useState('12');
  const [pantry, setPantry] = useState('Yes');

  const [gallery, setGallery] = useState(null);
  const [document, setDocumentFile] = useState(null);
  const [layout, setLayout] = useState(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    const payload = {
      location,
      buildingName,
      area: { unit: areaUnit, value: areaValue },
      unitType,
      floorNo,
      askingPrice,
      facilities,
      lift,
      parking,
      toilets,
      pantry,
      gallery,
      document,
      layout,
      notes,
    };
    console.log('Industrial floor form payload:', payload);
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Image
                source={require('../../assets/icons/back.png')}
                style={styles.backIcon}
              />
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>
                Shop
              </Text>
            </View>

            <View style={styles.headerRightPlaceholder} />
          </View>

          <Text style={styles.subtitle}>
            Add details about the Office to access it anytime
          </Text>

          <LocationInput
            value={location}
            onChangeText={setLocation}
            area="Moti Nagar"
            onPressPin={() => {}}
          />

          <LabeledInput
            label="Building Name"
            value={buildingName}
            onChangeText={setBuildingName}
            placeholder="Building Name"
          />

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <LabeledDropdown
                label="Area"
                value={areaUnit}
                options={AREA_UNIT_OPTIONS}
                onSelect={setAreaUnit}
              />
            </Col>
            <Col>
              <LabeledInput
                value={areaValue}
                onChangeText={setAreaValue}
                placeholder="Enter Area"
                keyboardType="numeric"
              />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <LabeledDropdown
                label="Unit Type"
                value={unitType}
                options={UNIT_TYPE_OPTIONS}
                onSelect={setUnitType}
              />
            </Col>
            <Col>
              <LabeledInput
                label="Floor No."
                value={floorNo}
                onChangeText={setFloorNo}
                keyboardType="numeric"
              />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <LabeledInput
                label="Asking Price"
                value={askingPrice}
                onChangeText={setAskingPrice}
                placeholder="₹ Enter amount"
                keyboardType="numeric"
              />
            </Col>
            <Col>
              <LabeledDropdown
                label="Facilities"
                value={facilities}
                options={YES_NO_OPTIONS}
                onSelect={setFacilities}
              />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <LabeledDropdown
                label="Lift"
                value={lift}
                options={YES_NO_OPTIONS}
                onSelect={setLift}
              />
            </Col>
            <Col>
              <LabeledDropdown
                label="Parking"
                value={parking}
                options={YES_NO_OPTIONS}
                onSelect={setParking}
              />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <LabeledInput
                label="No. of Toilet"
                value={toilets}
                onChangeText={setToilets}
                keyboardType="numeric"
              />
            </Col>
            <Col>
              <LabeledDropdown
                label="Pantry"
                value={pantry}
                options={YES_NO_OPTIONS}
                onSelect={setPantry}
              />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <UploadField label="Gallery" fileName={gallery} onPress={() => {}} />
            </Col>
            <Col>
              <UploadField label="Document" fileName={document} onPress={() => {}} />
            </Col>
          </Row>

          <UploadField label="Upload Layout" fileName={layout} onPress={() => {}} />

          <LabeledTextArea
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Enter Notes"
          />

          <TouchableOpacity
            style={styles.submitButton}
            activeOpacity={0.85}
            onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default IndustrialFloorFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -scale(20),
    paddingHorizontal: scale(18),
    paddingVertical: scale(14),
    marginBottom: scale(4),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    minHeight: scale(56),
    backgroundColor: '#fff',
  },

  backButton: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  backIcon: {
    width: scale(18),
    height: scale(18),
    resizeMode: 'contain',
    tintColor: '#222',
  },

  headerTitleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: scaleFont(17),
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    flexShrink: 1,
  },

  headerRightPlaceholder: {
    width: scale(24),
    height: scale(24),
  },

  scrollContent: {
    paddingHorizontal: scale(20),
    paddingTop: scale(16),
    paddingBottom: scale(30),
  },

  subtitle: {
    fontSize: scaleFont(14),
    color: '#8A8A8A',
    marginBottom: scale(18),
  },

  row: {
    flexDirection: 'row',
  },

  col: {
    flex: 1,
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
    backgroundColor: '#fff',
  },

  inputText: {
    flex: 1,
    fontSize: scaleFont(14),
    color: '#333',
    padding: 0,
  },

  textArea: {
    minHeight: scale(80),
    alignItems: 'flex-start',
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: scale(10),
    paddingHorizontal: scale(14),
    paddingVertical: scale(10),
  },

  addressText: {
    marginRight: scale(8),
  },

  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(16),
    backgroundColor: '#EAF4FB',
    maxWidth: scale(110),
  },

  addressPillText: {
    fontSize: scaleFont(12),
    color: '#333',
    marginRight: scale(4),
  },

  pinIcon: {
    width: scale(14),
    height: scale(14),
    resizeMode: 'contain',
    tintColor: ACCENT,
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

  submitButton: {
    backgroundColor: ACCENT,
    borderRadius: scale(12),
    paddingVertical: scale(15),
    alignItems: 'center',
    marginTop: scale(10),
  },

  submitButtonText: {
    color: '#fff',
    fontSize: scaleFont(15),
    fontWeight: '700',
  },
});