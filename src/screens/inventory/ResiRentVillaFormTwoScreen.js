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
// Responsive scaling helpers — identical pattern to the Builder/Apartment
// forms so every screen in the app feels consistent across device sizes.
// ---------------------------------------------------------------------------
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_WIDTH = 375;
const MAX_SCALE = 1.35;
const widthScale = Math.min(SCREEN_WIDTH / BASE_WIDTH, MAX_SCALE);

const scale = (size) => PixelRatio.roundToNearestPixel(size * widthScale);
const scaleFont = (size) => Math.round(PixelRatio.roundToNearestPixel(size * widthScale));

const ACCENT = '#2E8BCF';

const AREA_UNIT_OPTIONS = ['Sq. ft', 'Sq. yd', 'Sq. m', 'Acre'];
const TYPE_OPTIONS = ['Duplex', 'Simplex', 'Triplex', 'Bungalow'];
const YES_NO_OPTIONS = ['Yes', 'No'];
const OVERLOOKING_OPTIONS = ['Pool', 'Park', 'Road', 'Garden', 'Club'];
const SIDES_OPEN_OPTIONS = ['1/2 Sidecorner', '1 Side', '2 Side', '3 Side', '4 Side'];
const AGE_OPTIONS = ['New', '1-5 years', '5-10 years', '10+ years'];
const PROPERTY_STATUS_OPTIONS = ['Vacant', 'Occupied', 'Under Construction'];

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
  icon,
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
      {icon ? <Image source={icon} style={styles.inlineIcon} /> : null}
    </View>
  </View>
);

// Address field with a "Moti Nagar" style area pill
const AddressInput = ({ value, onChangeText, area, onPressPin }) => (
  <View style={styles.fieldGroup}>
    <FieldLabel>Address</FieldLabel>
    <View style={styles.addressRow}>
      <TextInput
        style={[styles.inputText, styles.addressText]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter address"
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

// Stepper
const Stepper = ({ label, value, onChange, min = 0 }) => (
  <View style={styles.fieldGroup}>
    <FieldLabel>{label}</FieldLabel>
    <View style={styles.stepperBox}>
      <TouchableOpacity
        style={styles.stepperButton}
        onPress={() => onChange(Math.max(min, value - 1))}
        activeOpacity={0.7}>
        <Text style={styles.stepperButtonText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.stepperValue}>{value}</Text>
      <TouchableOpacity
        style={styles.stepperButton}
        onPress={() => onChange(value + 1)}
        activeOpacity={0.7}>
        <Text style={styles.stepperButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

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

const VillaFormScreen = ({ navigation }) => {
  const [projectName, setProjectName] = useState('Ram Krishna Society');
  const [address, setAddress] = useState('122 A, Moti Nagar, Delhi');

  const [areaUnit, setAreaUnit] = useState('Sq. ft');
  const [areaValue, setAreaValue] = useState('');

  const [bedrooms, setBedrooms] = useState(3);
  const [floors, setFloors] = useState(3);

  const [facingPlot, setFacingPlot] = useState('');
  const [internalEntrance, setInternalEntrance] = useState('');

  const [type, setType] = useState('Duplex');

  const [parking, setParking] = useState('Yes');
  const [lift, setLift] = useState('Yes');

  const [facingDirection, setFacingDirection] = useState('');
  const [overlooking, setOverlooking] = useState('Park');

  const [sidesOpen, setSidesOpen] = useState('1/2 Sidecorner');
  const [widthOfRoad, setWidthOfRoad] = useState('');

  const [ageOfProperty, setAgeOfProperty] = useState('New');
  const [propertyStatus, setPropertyStatus] = useState('Vacant');

  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [maintenance, setMaintenance] = useState('');

  const [gallery, setGallery] = useState(null);
  const [document, setDocumentFile] = useState(null);
  const [layout, setLayout] = useState(null);

  const handleSubmit = () => {
    const payload = {
      projectName,
      address,
      area: { unit: areaUnit, value: areaValue },
      bedrooms,
      floors,
      facingPlot,
      internalEntrance,
      type,
      parking,
      lift,
      facingDirection,
      overlooking,
      sidesOpen,
      widthOfRoad,
      ageOfProperty,
      propertyStatus,
      monthlyRent,
      securityDeposit,
      maintenance,
      gallery,
      document,
      layout,
    };
    console.log('Villa form payload:', payload);
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
                Villa
              </Text>
            </View>

            <View style={styles.headerRightPlaceholder} />
          </View>

          <Text style={styles.subtitle}>
            Add details about the builder floor to access it anytime
          </Text>

          <LabeledInput
            label="Project/Society Name"
            value={projectName}
            onChangeText={setProjectName}
            placeholder="Enter project/society name"
          />

          <AddressInput
            value={address}
            onChangeText={setAddress}
            area="Moti Nagar"
            onPressPin={() => {}}
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
              <Stepper label="No. of Bedroom" value={bedrooms} onChange={setBedrooms} />
            </Col>
            <Col>
              <Stepper label="No. of Floors" value={floors} onChange={setFloors} />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <LabeledInput
                label="Facing Direction"
                value={facingPlot}
                onChangeText={setFacingPlot}
                placeholder="Plot"
                icon={require('../../assets/icons/compass.png')}
              />
            </Col>
            <Col>
              <LabeledInput
                label="Internal Entrance"
                value={internalEntrance}
                onChangeText={setInternalEntrance}
                placeholder="Entrance"
                icon={require('../../assets/icons/compass.png')}
              />
            </Col>
          </Row>

          <LabeledDropdown
            label="Type"
            value={type}
            options={TYPE_OPTIONS}
            onSelect={setType}
          />

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <LabeledDropdown
                label="Parking"
                value={parking}
                options={YES_NO_OPTIONS}
                onSelect={setParking}
              />
            </Col>
            <Col>
              <LabeledDropdown
                label="Lift"
                value={lift}
                options={YES_NO_OPTIONS}
                onSelect={setLift}
              />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <LabeledInput
                label="Facing Direction"
                value={facingDirection}
                onChangeText={setFacingDirection}
                placeholder="Plot"
                icon={require('../../assets/icons/compass.png')}
              />
            </Col>
            <Col>
              <LabeledDropdown
                label="Over Looking"
                value={overlooking}
                options={OVERLOOKING_OPTIONS}
                onSelect={setOverlooking}
              />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <LabeledDropdown
                label="Sides Open"
                value={sidesOpen}
                options={SIDES_OPEN_OPTIONS}
                onSelect={setSidesOpen}
              />
            </Col>
            <Col>
              <LabeledInput
                label="Width of Road"
                value={widthOfRoad}
                onChangeText={setWidthOfRoad}
                placeholder="Feet/ Meter"
                keyboardType="numeric"
              />
            </Col>
          </Row>

          <LabeledDropdown
            label="Age of Property"
            value={ageOfProperty}
            options={AGE_OPTIONS}
            onSelect={setAgeOfProperty}
          />

          <LabeledDropdown
            label="Property Status"
            value={propertyStatus}
            options={PROPERTY_STATUS_OPTIONS}
            onSelect={setPropertyStatus}
          />

          <Row>
            <Col style={{ marginRight: scale(10) }}>
              <LabeledInput
                label="Monthly Rent"
                value={monthlyRent}
                onChangeText={setMonthlyRent}
                placeholder="Enter"
                keyboardType="numeric"
              />
            </Col>
            <Col style={{ marginRight: scale(10) }}>
              <LabeledInput
                label="Security Deposit"
                value={securityDeposit}
                onChangeText={setSecurityDeposit}
                placeholder="Enter"
                keyboardType="numeric"
              />
            </Col>
            <Col>
              <LabeledInput
                label="Maintenance"
                value={maintenance}
                onChangeText={setMaintenance}
                placeholder="Enter"
                keyboardType="numeric"
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

export default VillaFormScreen;

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
    width: scale(20),
    height: scale(20),
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

  inlineIcon: {
    width: scale(16),
    height: scale(16),
    resizeMode: 'contain',
    tintColor: '#999',
    marginLeft: scale(8),
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

  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: scale(10),
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
  },

  stepperButton: {
    width: scale(26),
    height: scale(26),
    borderRadius: scale(13),
    backgroundColor: '#EAF4FB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  stepperButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    color: ACCENT,
    lineHeight: scaleFont(18),
  },

  stepperValue: {
    fontSize: scaleFont(15),
    fontWeight: '600',
    color: '#333',
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