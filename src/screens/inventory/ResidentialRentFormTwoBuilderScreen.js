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
// Responsive scaling helpers (kept identical to BuilderForm1Screen so every
// form screen in the flow feels consistent).
// ---------------------------------------------------------------------------
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_WIDTH = 375;
const MAX_SCALE = 1.35;
const widthScale = Math.min(SCREEN_WIDTH / BASE_WIDTH, MAX_SCALE);

const scale = (size) => PixelRatio.roundToNearestPixel(size * widthScale);
const scaleFont = (size) => Math.round(PixelRatio.roundToNearestPixel(size * widthScale));

const ACCENT = '#2E8BCF';

const AREA_UNIT_OPTIONS = ['Sq. Ft', 'Sq. Yard', 'Sq. Meter', 'Acre'];
const FLOOR_OPTIONS = ['1 Floor', '2 Floors', '3 Floors', '4 Floors', '5+ Floors'];
const FLOOR_AVAILABLE_OPTIONS = ['UG', 'Ground', '1st', '2nd', '3rd', '4th', '5th+'];
const FURNISHED_OPTIONS = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
const TYPE_OPTIONS = ['Duplex', 'Simplex', 'Triplex', 'Penthouse'];
const FACING_OPTIONS = ['Plot', 'Road', 'Park', 'Corner'];
const YES_NO_OPTIONS = ['Yes', 'No'];
const PROPERTY_STATUS_OPTIONS = ['Vacant', 'Occupied', 'Under Construction'];
const SIDES_OPEN_OPTIONS = ['1 Side', '1/2 Sidecorner', '2 Sides', '3 Sides', '4 Sides'];
const WIDTH_ROAD_OPTIONS = ['Feet/ Meter', '10-20 Feet', '20-30 Feet', '30+ Feet'];
const AGE_OPTIONS = ['Ready to move', 'Under Construction', '0-1 Year', '1-5 Years', '5+ Years'];

// ---------------------------------------------------------------------------
// Reusable field components — defined once so every field on the screen
// looks and behaves the same way.
// ---------------------------------------------------------------------------

const FieldLabel = ({ children }) => <Text style={styles.label}>{children}</Text>;

const LabeledInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  style,
}) => (
  <View style={[styles.fieldGroup, style]}>
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

// A tap-to-open dropdown. Dependency-free (no @react-native-picker
// requirement) using a bottom-anchored Modal + FlatList of options.
const LabeledDropdown = ({ label, value, options, onSelect, style }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={[styles.fieldGroup, style]}>
      <FieldLabel>{label}</FieldLabel>
      <TouchableOpacity
        style={styles.input}
        activeOpacity={0.7}
        onPress={() => setOpen(true)}>
        <Text
          style={value ? styles.dropdownValue : styles.dropdownPlaceholder}
          numberOfLines={1}>
          {value || `Select`}
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

// +/- counter used for Bedroom / Bathroom.
const StepperField = ({ label, value, onChange, style, min = 0 }) => (
  <View style={[styles.fieldGroup, style]}>
    <FieldLabel>{label}</FieldLabel>
    <View style={styles.stepperBox}>
      <TouchableOpacity
        style={styles.stepperBtn}
        activeOpacity={0.7}
        onPress={() => onChange(Math.max(min, value - 1))}>
        <Text style={styles.stepperBtnText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.stepperValue}>{value}</Text>
      <TouchableOpacity
        style={styles.stepperBtn}
        activeOpacity={0.7}
        onPress={() => onChange(value + 1)}>
        <Text style={styles.stepperBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Upload box used for Gallery / Document / Layout.
const UploadField = ({ label, fileName, onPress, style }) => (
  <View style={[styles.fieldGroup, style]}>
    <FieldLabel>{label}</FieldLabel>
    <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7} onPress={onPress}>
      <Text style={fileName ? styles.uploadTextActive : styles.uploadText} numberOfLines={1}>
        {fileName || 'Upload'}
      </Text>
      <Image
        source={require('../../assets/icons/upload.png')}
        style={styles.uploadIcon}
      />
    </TouchableOpacity>
  </View>
);

// Two / three field row wrapper — keeps consistent spacing between columns.
const Row = ({ children, style }) => <View style={[styles.row, style]}>{children}</View>;

const ResidentialRentFormBuilderScreen = ({ navigation }) => {
  // Address
  const [address, setAddress] = useState('122 A, Moti Nagar, Delhi');
  const [locality, setLocality] = useState('Moti Nagar');

  // Area
  const [areaUnit, setAreaUnit] = useState('Sq. Ft');
  const [areaValue, setAreaValue] = useState('');

  // Counts
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(3);

  // Floors
  const [totalFloors, setTotalFloors] = useState('3 Floors');
  const [floorAvailable, setFloorAvailable] = useState('UG');

  // Furnishing / type
  const [furnished, setFurnished] = useState('Semi-Furnished');
  const [propertyType, setPropertyType] = useState('Duplex');

  // Facing
  const [facingDirection, setFacingDirection] = useState('Plot');
  const [overLooking, setOverLooking] = useState('');

  // Amenities
  const [servantQuarter, setServantQuarter] = useState('Yes');
  const [parking, setParking] = useState('Yes');
  const [lift, setLift] = useState('Yes');

  // Status
  const [propertyStatus, setPropertyStatus] = useState('Vacant');

  // Plot details
  const [sidesOpen, setSidesOpen] = useState('1/2 Sidecorner');
  const [widthOfRoad, setWidthOfRoad] = useState('Feet/ Meter');
  const [ageOfProperty, setAgeOfProperty] = useState('Ready to move');

  // Rent details
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [maintenance, setMaintenance] = useState('');

  // Uploads
  const [gallery, setGallery] = useState(null);
  const [document, setDocument] = useState(null);
  const [layout, setLayout] = useState(null);

  const handleSubmit = () => {
    const payload = {
      address,
      locality,
      areaUnit,
      areaValue,
      bedrooms,
      bathrooms,
      totalFloors,
      floorAvailable,
      furnished,
      propertyType,
      facingDirection,
      overLooking,
      servantQuarter,
      parking,
      lift,
      propertyStatus,
      sidesOpen,
      widthOfRoad,
      ageOfProperty,
      monthlyRent,
      securityDeposit,
      maintenance,
      gallery,
      document,
      layout,
    };
    // Wire this up to your submit/API logic.
    console.log('Residential rent (builder) form payload:', payload);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Image
            source={require('../../assets/icons/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Builder Floor</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.subtitle}>
            Add details about the builder floor to access it anytime
          </Text>

          {/* Address */}
          <View style={styles.fieldGroup}>
            <FieldLabel>Address</FieldLabel>
            <View style={styles.addressBox}>
              <TextInput
                style={styles.addressInput}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter address"
                placeholderTextColor="#B5B5B5"
              />
              <View style={styles.addressDivider} />
              <TouchableOpacity style={styles.addressLocalityRow} activeOpacity={0.7}>
                <Text style={styles.addressLocalityText} numberOfLines={1}>
                  {locality || 'Select locality'}
                </Text>
                <Image
                  source={require('../../assets/icons/location.png')}
                  style={styles.locationIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Area */}
          <Row>
            <LabeledDropdown
              label="Area"
              value={areaUnit}
              options={AREA_UNIT_OPTIONS}
              onSelect={setAreaUnit}
              style={styles.halfField}
            />
            <LabeledInput
              label=" "
              value={areaValue}
              onChangeText={setAreaValue}
              placeholder="Enter Area"
              keyboardType="numeric"
              style={styles.halfField}
            />
          </Row>

          {/* Bedroom / Bathroom */}
          <Row>
            <StepperField
              label="No. of Bedroom"
              value={bedrooms}
              onChange={setBedrooms}
              style={styles.halfField}
            />
            <StepperField
              label="No. of Bathroom"
              value={bathrooms}
              onChange={setBathrooms}
              style={styles.halfField}
            />
          </Row>

          {/* Total Floors / Floor Available */}
          <Row>
            <LabeledDropdown
              label="Total Floors"
              value={totalFloors}
              options={FLOOR_OPTIONS}
              onSelect={setTotalFloors}
              style={styles.halfField}
            />
            <LabeledDropdown
              label="Floor Available"
              value={floorAvailable}
              options={FLOOR_AVAILABLE_OPTIONS}
              onSelect={setFloorAvailable}
              style={styles.halfField}
            />
          </Row>

          {/* Furnished */}
          <LabeledDropdown
            label="Furnished"
            value={furnished}
            options={FURNISHED_OPTIONS}
            onSelect={setFurnished}
          />

          {/* Type */}
          <LabeledDropdown
            label="Type"
            value={propertyType}
            options={TYPE_OPTIONS}
            onSelect={setPropertyType}
          />

          {/* Facing Direction / Over Looking */}
          <Row>
            <LabeledDropdown
              label="Facing Direction"
              value={facingDirection}
              options={FACING_OPTIONS}
              onSelect={setFacingDirection}
              style={styles.halfField}
            />
            <LabeledInput
              label="Over Looking"
              value={overLooking}
              onChangeText={setOverLooking}
              placeholder="Enter"
              style={styles.halfField}
            />
          </Row>

          {/* Servant Quarter / Parking / Lift */}
          <Row>
            <LabeledDropdown
              label="Servant Quarter"
              value={servantQuarter}
              options={YES_NO_OPTIONS}
              onSelect={setServantQuarter}
              style={styles.thirdField}
            />
            <LabeledDropdown
              label="Parking"
              value={parking}
              options={YES_NO_OPTIONS}
              onSelect={setParking}
              style={styles.thirdField}
            />
            <LabeledDropdown
              label="Lift"
              value={lift}
              options={YES_NO_OPTIONS}
              onSelect={setLift}
              style={styles.thirdField}
            />
          </Row>

          {/* Property Status */}
          <LabeledDropdown
            label="Property Status"
            value={propertyStatus}
            options={PROPERTY_STATUS_OPTIONS}
            onSelect={setPropertyStatus}
          />

          {/* Sides Open / Width of Road */}
          <Row>
            <LabeledDropdown
              label="Sides Open"
              value={sidesOpen}
              options={SIDES_OPEN_OPTIONS}
              onSelect={setSidesOpen}
              style={styles.halfField}
            />
            <LabeledDropdown
              label="Width of Road"
              value={widthOfRoad}
              options={WIDTH_ROAD_OPTIONS}
              onSelect={setWidthOfRoad}
              style={styles.halfField}
            />
          </Row>

          {/* Age of Property */}
          <LabeledDropdown
            label="Age of Property"
            value={ageOfProperty}
            options={AGE_OPTIONS}
            onSelect={setAgeOfProperty}
          />

          {/* Monthly Rent / Security Deposit / Maintenance */}
          <Row>
            <LabeledInput
              label="Monthly Rent"
              value={monthlyRent}
              onChangeText={setMonthlyRent}
              placeholder="Enter"
              keyboardType="numeric"
              style={styles.thirdField}
            />
            <LabeledInput
              label="Security Deposit"
              value={securityDeposit}
              onChangeText={setSecurityDeposit}
              placeholder="Enter"
              keyboardType="numeric"
              style={styles.thirdField}
            />
            <LabeledInput
              label="Maintenance"
              value={maintenance}
              onChangeText={setMaintenance}
              placeholder="Enter"
              keyboardType="numeric"
              style={styles.thirdField}
            />
          </Row>

          {/* Gallery / Document */}
          <Row>
            <UploadField
              label="Gallery"
              fileName={gallery}
              onPress={() => setGallery('image.jpg')}
              style={styles.halfField}
            />
            <UploadField
              label="Document"
              fileName={document}
              onPress={() => setDocument('document.pdf')}
              style={styles.halfField}
            />
          </Row>

          {/* Upload Layout */}
          <UploadField
            label="Upload Layout"
            fileName={layout}
            onPress={() => setLayout('layout.pdf')}
          />

          {/* Submit Button - Now inside ScrollView */}
          <View style={styles.submitWrapper}>
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.85}
              onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResidentialRentFormBuilderScreen;

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
    paddingHorizontal: scale(18),
    paddingVertical: scale(14),
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
    fontSize: scaleFont(18),
    fontWeight: '700',
    color: '#222',
  },

  // Balances the back icon so the title stays visually centered.
  headerSpacer: {
    width: scale(20),
  },

  scrollContent: {
    paddingHorizontal: scale(20),
    paddingTop: scale(16),
    paddingBottom: scale(30),
  },

  subtitle: {
    fontSize: scaleFont(13),
    color: '#8A8A8A',
    marginBottom: scale(18),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  halfField: {
    width: '48%',
  },

  thirdField: {
    width: '31%',
  },

  fieldGroup: {
    marginBottom: scale(16),
  },

  label: {
    fontSize: scaleFont(12),
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
    fontSize: scaleFont(13),
    color: '#333',
    backgroundColor: '#fff',
  },

  inputMultiline: {
    minHeight: scale(70),
    textAlignVertical: 'top',
  },

  dropdownValue: {
    fontSize: scaleFont(13),
    color: '#333',
    flexShrink: 1,
  },

  dropdownPlaceholder: {
    fontSize: scaleFont(13),
    color: '#B5B5B5',
  },

  chevronIcon: {
    width: scale(14),
    height: scale(14),
    resizeMode: 'contain',
    tintColor: '#999',
    marginLeft: scale(6),
  },

  // Address
  addressBox: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: scale(10),
    backgroundColor: '#fff',
    paddingHorizontal: scale(14),
    paddingVertical: scale(4),
  },

  addressInput: {
    fontSize: scaleFont(13),
    color: '#333',
    paddingVertical: scale(10),
  },

  addressDivider: {
    height: 1,
    backgroundColor: '#EFEFEF',
  },

  addressLocalityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
  },

  addressLocalityText: {
    fontSize: scaleFont(12),
    color: '#8A8A8A',
    flex: 1,
  },

  locationIcon: {
    width: scale(15),
    height: scale(15),
    resizeMode: 'contain',
    tintColor: ACCENT,
    marginLeft: scale(6),
  },

  // Stepper (Bedroom / Bathroom)
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: scale(10),
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    backgroundColor: '#fff',
  },

  stepperBtn: {
    width: scale(26),
    height: scale(26),
    borderRadius: scale(13),
    borderWidth: 1,
    borderColor: '#E3E3E3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  stepperBtnText: {
    fontSize: scaleFont(16),
    color: ACCENT,
    fontWeight: '700',
    lineHeight: scaleFont(18),
  },

  stepperValue: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#333',
  },

  // Upload
  uploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: scale(10),
    borderStyle: 'dashed',
    paddingHorizontal: scale(14),
    paddingVertical: scale(12),
    backgroundColor: '#fff',
  },

  uploadText: {
    fontSize: scaleFont(13),
    color: '#B5B5B5',
  },

  uploadTextActive: {
    fontSize: scaleFont(13),
    color: '#333',
    flex: 1,
    marginRight: scale(8),
  },

  uploadIcon: {
    width: scale(16),
    height: scale(16),
    resizeMode: 'contain',
    tintColor: ACCENT,
  },

  // Dropdown modal
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

  // Submit button wrapper - inside ScrollView
  submitWrapper: {
    marginTop: scale(20),
    marginBottom: scale(10),
  },

  submitButton: {
    backgroundColor: ACCENT,
    borderRadius: scale(12),
    paddingVertical: scale(15),
    alignItems: 'center',
    width: '100%',
  },

  submitButtonText: {
    color: '#fff',
    fontSize: scaleFont(15),
    fontWeight: '700',
  },
});