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
// Responsive scaling helpers
// ---------------------------------------------------------------------------
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BASE_WIDTH = 375;
const MAX_SCALE = 1.35;
const widthScale = Math.min(SCREEN_WIDTH / BASE_WIDTH, MAX_SCALE);

const scale = (size) => PixelRatio.roundToNearestPixel(size * widthScale);
const scaleFont = (size) => Math.round(PixelRatio.roundToNearestPixel(size * widthScale));

const ACCENT = '#2E8BCF';

const GUEST_WASHROOM_OPTIONS = ['Yes', 'No'];
const SERVANT_ROOM_OPTIONS = ['Yes', 'No'];
const PROPERTY_STATUS_OPTIONS = ['Lease hold', 'Free hold'];
const DOCUMENT_TYPE_OPTIONS = ['GPA', 'Sale Deed', 'Registry', 'Other'];
const AREA_UNIT_OPTIONS = ['Sq. ft', 'Sq. yd', 'Sq. m', 'Acre'];
const AGE_OPTIONS = ['New', '1-5 years', '5-10 years', '10+ years'];
const OVERLOOKING_OPTIONS = ['Pool', 'Park', 'Road', 'Garden', 'Club'];
const FLOOR_AVAILABLE_OPTIONS = ['UG', 'Ground', '1st', '2nd', '3rd', 'Top'];
const AMENITIES_OPTIONS = ['Choose Amenities', 'Gym', 'Lift', 'Power Backup', 'Security'];
const SIDES_OPEN_OPTIONS = ['1 Side', '2 Side Corner', '3 Side', '4 Side'];

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

// Address field
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
          {value || placeholder || `Select`}
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

const AddLinkButton = ({ label, onPress }) => (
  <TouchableOpacity style={styles.addLink} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.addLinkIcon}>
      <Text style={styles.addLinkIconText}>+</Text>
    </View>
    <Text style={styles.addLinkText}>{label}</Text>
  </TouchableOpacity>
);

const BuilderForm2Screen = ({ navigation }) => {
  const [address, setAddress] = useState('');
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(3);
  const [guestWashroom, setGuestWashroom] = useState('Yes');
  const [servantRoom, setServantRoom] = useState('Yes');
  const [propertyStatus, setPropertyStatus] = useState('Lease hold');
  const [propertyStatusNote, setPropertyStatusNote] = useState('');
  const [documentType, setDocumentType] = useState('GPA');
  const [areaUnit, setAreaUnit] = useState('Sq. ft');
  const [areaValue, setAreaValue] = useState('');
  const [ageOfProperty, setAgeOfProperty] = useState('New');
  const [facingPlot, setFacingPlot] = useState('');
  const [facingEntrance, setFacingEntrance] = useState('');
  const [plotDimensions, setPlotDimensions] = useState('');
  const [overlooking, setOverlooking] = useState('Pool');
  const [widthOfRoad, setWidthOfRoad] = useState('');

  const [totalFloors, setTotalFloors] = useState('');
  const [floorAvailable, setFloorAvailable] = useState('UG');
  const [unitsPerFloor, setUnitsPerFloor] = useState('');
  const [amenities, setAmenities] = useState('Choose Amenities');
  const [numberOfCars, setNumberOfCars] = useState('');
  const [sidesOpen, setSidesOpen] = useState('2 Side Corner');
  const [askingPrice, setAskingPrice] = useState('');

  const [gallery, setGallery] = useState(null);
  const [document, setDocumentFile] = useState(null);
  const [layout, setLayout] = useState(null);

  const handleSubmit = () => {
    const payload = {
      address,
      bedrooms,
      bathrooms,
      guestWashroom,
      servantRoom,
      propertyStatus,
      propertyStatusNote,
      documentType,
      area: { unit: areaUnit, value: areaValue },
      ageOfProperty,
      facingPlot,
      facingEntrance,
      plotDimensions,
      overlooking,
      widthOfRoad,
      totalFloors,
      floorAvailable,
      unitsPerFloor,
      amenities,
      numberOfCars,
      sidesOpen,
      askingPrice,
      gallery,
      document,
      layout,
    };
    console.log('Builder floor form 2 payload:', payload);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header - Fixed with better layout */}
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
          <Text 
            style={styles.headerTitle} 
            numberOfLines={1}
            adjustsFontSizeToFit>
            Farm House
          </Text>
        </View>
        
        <View style={styles.headerRightPlaceholder} />
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

          <AddressInput
            value={address}
            onChangeText={setAddress}
            area="Moti Nagar"
            onPressPin={() => {}}
          />

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <Stepper label="No. of Bedroom" value={bedrooms} onChange={setBedrooms} />
            </Col>
            <Col>
              <Stepper label="No. of Bathroom" value={bathrooms} onChange={setBathrooms} />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <LabeledDropdown
                label="Guest Washroom"
                value={guestWashroom}
                options={GUEST_WASHROOM_OPTIONS}
                onSelect={setGuestWashroom}
              />
            </Col>
            <Col>
              <LabeledDropdown
                label="Servant Room"
                value={servantRoom}
                options={SERVANT_ROOM_OPTIONS}
                onSelect={setServantRoom}
              />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <LabeledDropdown
                label="Property Status"
                value={propertyStatus}
                options={PROPERTY_STATUS_OPTIONS}
                onSelect={setPropertyStatus}
              />
            </Col>
            <Col>
              <LabeledInput
                value={propertyStatusNote}
                onChangeText={setPropertyStatusNote}
                placeholder="Enter Text"
              />
            </Col>
          </Row>

          <LabeledDropdown
            label="Document Type"
            value={documentType}
            options={DOCUMENT_TYPE_OPTIONS}
            onSelect={setDocumentType}
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

          <LabeledDropdown
            label="Age of Property"
            value={ageOfProperty}
            options={AGE_OPTIONS}
            onSelect={setAgeOfProperty}
          />

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <LabeledInput
                label="Facing Plot"
                value={facingPlot}
                onChangeText={setFacingPlot}
                placeholder="Plot"
                icon={require('../../assets/icons/compass.png')}
              />
            </Col>
            <Col>
              <LabeledInput
                label="Facing Entrance"
                value={facingEntrance}
                onChangeText={setFacingEntrance}
                placeholder="Entrance"
                icon={require('../../assets/icons/compass.png')}
              />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <LabeledInput
                label="Plot* Dimensions"
                value={plotDimensions}
                onChangeText={setPlotDimensions}
                placeholder="Dimensions"
              />
            </Col>
            <Col>
              <LabeledDropdown
                label="Overlooking"
                value={overlooking}
                options={OVERLOOKING_OPTIONS}
                onSelect={setOverlooking}
              />
            </Col>
          </Row>

          <LabeledInput
            label="Width of road"
            value={widthOfRoad}
            onChangeText={setWidthOfRoad}
            placeholder="Enter width of road"
            keyboardType="numeric"
          />

          <Row>
            <Col style={{ marginRight: scale(10) }}>
              <LabeledInput
                label="Total no. of floors"
                value={totalFloors}
                onChangeText={setTotalFloors}
                placeholder="Enter"
                keyboardType="numeric"
              />
            </Col>
            <Col style={{ marginRight: scale(10) }}>
              <LabeledDropdown
                label="Floor available"
                value={floorAvailable}
                options={FLOOR_AVAILABLE_OPTIONS}
                onSelect={setFloorAvailable}
              />
            </Col>
            <Col>
              <LabeledInput
                label="Units per floor"
                value={unitsPerFloor}
                onChangeText={setUnitsPerFloor}
                placeholder="Enter units"
                keyboardType="numeric"
              />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <LabeledDropdown
                label="Amenities"
                value={amenities}
                options={AMENITIES_OPTIONS}
                onSelect={setAmenities}
              />
            </Col>
            <Col>
              <LabeledInput
                label="No. of cars"
                value={numberOfCars}
                onChangeText={setNumberOfCars}
                placeholder="Enter no. of cars"
                keyboardType="numeric"
              />
            </Col>
          </Row>

          <AddLinkButton
            label="Add more facilities"
            onPress={() => {}}
          />

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
                label="Asking Price"
                value={askingPrice}
                onChangeText={setAskingPrice}
                placeholder="₹ Enter amount"
                keyboardType="numeric"
              />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <UploadField
                label="Gallery"
                fileName={gallery}
                onPress={() => {}}
              />
            </Col>
            <Col>
              <UploadField
                label="Document"
                fileName={document}
                onPress={() => {}}
              />
            </Col>
          </Row>

          <UploadField
            label="Upload Layout"
            fileName={layout}
            onPress={() => {}}
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

export default BuilderForm2Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(18),
    paddingVertical: scale(14),
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

  addLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(20),
  },

  addLinkIcon: {
    width: scale(18),
    height: scale(18),
    borderRadius: scale(9),
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

  footer: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#fff',
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