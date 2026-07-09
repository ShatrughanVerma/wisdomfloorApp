import React, { useState, useRef } from 'react';
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
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

// ---------------------------------------------------------------------------
// Responsive scaling helpers
// ---------------------------------------------------------------------------
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_WIDTH = 375;
const MAX_SCALE = 1.35;
const widthScale = Math.min(SCREEN_WIDTH / BASE_WIDTH, MAX_SCALE);

const scale = (size) => PixelRatio.roundToNearestPixel(size * widthScale);
const scaleFont = (size) => Math.round(PixelRatio.roundToNearestPixel(size * widthScale));

const ACCENT = '#2E8BCF';
const ERROR_COLOR = '#E74C3C';

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
// Regex patterns
// ---------------------------------------------------------------------------
const ADDRESS_REGEX = /^.{5,200}$/s; // 5-200 chars
const WHOLE_NUMBER_REGEX = /^\d{1,5}$/; // e.g. floors, units, cars, road width
const DECIMAL_NUMBER_REGEX = /^\d{1,9}(\.\d{1,2})?$/; // area, price - allows decimals
const DIMENSIONS_REGEX = /^\d+(\.\d+)?\s*[xX*]\s*\d+(\.\d+)?$/; // e.g. "30x40" or "30*40"
const DIRECTION_REGEX = /^[A-Za-z\s-]{2,30}$/; // facing plot/entrance, e.g. "North East"

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
const validateAddress = (value) => {
  if (!value || !value.trim()) return 'Address is required';
  if (!ADDRESS_REGEX.test(value.trim())) return 'Address must be 5-200 characters';
  return '';
};

const validateWholeNumber = (value, label) => {
  if (!value || !value.trim()) return `${label} is required`;
  if (!WHOLE_NUMBER_REGEX.test(value.trim())) return `Enter a valid number for ${label.toLowerCase()}`;
  return '';
};

const validateDecimalNumber = (value, label) => {
  if (!value || !value.trim()) return `${label} is required`;
  if (!DECIMAL_NUMBER_REGEX.test(value.trim())) return `Enter a valid number for ${label.toLowerCase()}`;
  return '';
};

const validateDimensions = (value) => {
  if (!value || !value.trim()) return 'Plot dimensions are required';
  if (!DIMENSIONS_REGEX.test(value.trim())) return 'Use format like 30x40 or 30*40';
  return '';
};

const validateDirection = (value, label) => {
  if (!value || !value.trim()) return `${label} is required`;
  if (!DIRECTION_REGEX.test(value.trim())) return `Enter a valid direction for ${label.toLowerCase()}`;
  return '';
};

// ---------------------------------------------------------------------------
// Reusable field building blocks
// ---------------------------------------------------------------------------

const FieldLabel = ({ children }) => (
  <Text style={styles.label} numberOfLines={1}>
    {children}
  </Text>
);

const Row = ({ children }) => <View style={styles.row}>{children}</View>;
const Col = ({ children, style }) => <View style={[styles.col, style]}>{children}</View>;

const LabeledInput = React.forwardRef(({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  keyboardType,
  icon,
  error,
  returnKeyType,
  onSubmitEditing,
}, ref) => (
  <View style={styles.fieldGroup}>
    {label ? <FieldLabel>{label}</FieldLabel> : <Text style={styles.labelSpacer}> </Text>}
    <View style={[styles.input, error && styles.inputErrorBorder]}>
      <TextInput
        ref={ref}
        style={styles.inputText}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor="#B5B5B5"
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
      />
      {icon ? <Image source={icon} style={styles.inlineIcon} /> : null}
    </View>
    {!!error && <Text style={styles.errorText}>{error}</Text>}
  </View>
));

const AddressInput = React.forwardRef(({
  value,
  onChangeText,
  onBlur,
  area,
  onPressPin,
  error,
  returnKeyType,
  onSubmitEditing,
}, ref) => (
  <View style={styles.fieldGroup}>
    <FieldLabel>Address</FieldLabel>
    <View style={[styles.addressRow, error && styles.inputErrorBorder]}>
      <TextInput
        ref={ref}
        style={[styles.inputText, styles.addressText]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder="Enter address"
        placeholderTextColor="#B5B5B5"
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
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
    {!!error && <Text style={styles.errorText}>{error}</Text>}
  </View>
));

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

  // ---- Error state, one per validated field ----
  const [errors, setErrors] = useState({});

  // ---- Refs for keyboard "Next" navigation sequence ----
  const addressRef = useRef(null);
  const propertyStatusNoteRef = useRef(null);
  const areaValueRef = useRef(null);
  const facingPlotRef = useRef(null);
  const facingEntranceRef = useRef(null);
  const plotDimensionsRef = useRef(null);
  const widthOfRoadRef = useRef(null);
  const totalFloorsRef = useRef(null);
  const unitsPerFloorRef = useRef(null);
  const numberOfCarsRef = useRef(null);
  const askingPriceRef = useRef(null);

  const setFieldError = (field, message) =>
    setErrors((prev) => ({ ...prev, [field]: message }));

  const clearFieldErrorIfSet = (field) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
  };

  // ---- File pickers ----
  const handlePickGallery = () => {
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 1, quality: 0.8 },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Could not open gallery');
          return;
        }
        const asset = response.assets && response.assets[0];
        if (asset) {
          setGallery({ uri: asset.uri, name: asset.fileName || 'photo.jpg' });
        }
      }
    );
  };

  const handleSubmit = () => {
    const newErrors = {
      address: validateAddress(address),
      areaValue: validateDecimalNumber(areaValue, 'Area'),
      plotDimensions: validateDimensions(plotDimensions),
      widthOfRoad: validateWholeNumber(widthOfRoad, 'Width of road'),
      totalFloors: validateWholeNumber(totalFloors, 'Total floors'),
      unitsPerFloor: validateWholeNumber(unitsPerFloor, 'Units per floor'),
      numberOfCars: validateWholeNumber(numberOfCars, 'Number of cars'),
      askingPrice: validateDecimalNumber(askingPrice, 'Asking price'),
      facingPlot: validateDirection(facingPlot, 'Facing plot'),
      facingEntrance: validateDirection(facingEntrance, 'Facing entrance'),
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((msg) => !!msg);
    if (hasError) return;

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
    };
    console.log('Builder floor form 2 payload:', payload);

    navigation.navigate('BuilderFloor');
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
            Builder Floor
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
            ref={addressRef}
            value={address}
            onChangeText={(t) => {
              setAddress(t);
              clearFieldErrorIfSet('address');
            }}
            onBlur={() => setFieldError('address', validateAddress(address))}
            area="Moti Nagar"
            onPressPin={() => {}}
            error={errors.address}
            returnKeyType="next"
            onSubmitEditing={() => propertyStatusNoteRef.current?.focus()}
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
                ref={propertyStatusNoteRef}
                value={propertyStatusNote}
                onChangeText={setPropertyStatusNote}
                placeholder="Enter Text"
                returnKeyType="next"
                onSubmitEditing={() => areaValueRef.current?.focus()}
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
                ref={areaValueRef}
                value={areaValue}
                onChangeText={(t) => {
                  setAreaValue(t);
                  clearFieldErrorIfSet('areaValue');
                }}
                onBlur={() =>
                  setFieldError('areaValue', validateDecimalNumber(areaValue, 'Area'))
                }
                placeholder="Enter Area"
                keyboardType="numeric"
                error={errors.areaValue}
                returnKeyType="next"
                onSubmitEditing={() => facingPlotRef.current?.focus()}
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
                ref={facingPlotRef}
                label="Facing Plot"
                value={facingPlot}
                onChangeText={(t) => {
                  setFacingPlot(t);
                  clearFieldErrorIfSet('facingPlot');
                }}
                onBlur={() =>
                  setFieldError('facingPlot', validateDirection(facingPlot, 'Facing plot'))
                }
                placeholder="Plot"
                icon={require('../../assets/icons/compass.png')}
                error={errors.facingPlot}
                returnKeyType="next"
                onSubmitEditing={() => facingEntranceRef.current?.focus()}
              />
            </Col>
            <Col>
              <LabeledInput
                ref={facingEntranceRef}
                label="Facing Entrance"
                value={facingEntrance}
                onChangeText={(t) => {
                  setFacingEntrance(t);
                  clearFieldErrorIfSet('facingEntrance');
                }}
                onBlur={() =>
                  setFieldError(
                    'facingEntrance',
                    validateDirection(facingEntrance, 'Facing entrance')
                  )
                }
                placeholder="Entrance"
                icon={require('../../assets/icons/compass.png')}
                error={errors.facingEntrance}
                returnKeyType="next"
                onSubmitEditing={() => plotDimensionsRef.current?.focus()}
              />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <LabeledInput
                ref={plotDimensionsRef}
                label="Plot* Dimensions"
                value={plotDimensions}
                onChangeText={(t) => {
                  setPlotDimensions(t);
                  clearFieldErrorIfSet('plotDimensions');
                }}
                onBlur={() =>
                  setFieldError('plotDimensions', validateDimensions(plotDimensions))
                }
                placeholder="e.g. 30x40"
                error={errors.plotDimensions}
                returnKeyType="next"
                onSubmitEditing={() => widthOfRoadRef.current?.focus()}
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
            ref={widthOfRoadRef}
            label="Width of road"
            value={widthOfRoad}
            onChangeText={(t) => {
              setWidthOfRoad(t);
              clearFieldErrorIfSet('widthOfRoad');
            }}
            onBlur={() =>
              setFieldError('widthOfRoad', validateWholeNumber(widthOfRoad, 'Width of road'))
            }
            placeholder="Enter width of road"
            keyboardType="numeric"
            error={errors.widthOfRoad}
            returnKeyType="next"
            onSubmitEditing={() => totalFloorsRef.current?.focus()}
          />

          <Row>
            <Col style={{ marginRight: scale(10) }}>
              <LabeledInput
                ref={totalFloorsRef}
                label="Total no. of floors"
                value={totalFloors}
                onChangeText={(t) => {
                  setTotalFloors(t);
                  clearFieldErrorIfSet('totalFloors');
                }}
                onBlur={() =>
                  setFieldError('totalFloors', validateWholeNumber(totalFloors, 'Total floors'))
                }
                placeholder="Enter"
                keyboardType="numeric"
                error={errors.totalFloors}
                returnKeyType="next"
                onSubmitEditing={() => unitsPerFloorRef.current?.focus()}
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
                ref={unitsPerFloorRef}
                label="Units per floor"
                value={unitsPerFloor}
                onChangeText={(t) => {
                  setUnitsPerFloor(t);
                  clearFieldErrorIfSet('unitsPerFloor');
                }}
                onBlur={() =>
                  setFieldError(
                    'unitsPerFloor',
                    validateWholeNumber(unitsPerFloor, 'Units per floor')
                  )
                }
                placeholder="Enter units"
                keyboardType="numeric"
                error={errors.unitsPerFloor}
                returnKeyType="next"
                onSubmitEditing={() => numberOfCarsRef.current?.focus()}
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
                ref={numberOfCarsRef}
                label="No. of cars"
                value={numberOfCars}
                onChangeText={(t) => {
                  setNumberOfCars(t);
                  clearFieldErrorIfSet('numberOfCars');
                }}
                onBlur={() =>
                  setFieldError(
                    'numberOfCars',
                    validateWholeNumber(numberOfCars, 'Number of cars')
                  )
                }
                placeholder="Enter no. of cars"
                keyboardType="numeric"
                error={errors.numberOfCars}
                returnKeyType="next"
                onSubmitEditing={() => askingPriceRef.current?.focus()}
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
                ref={askingPriceRef}
                label="Asking Price"
                value={askingPrice}
                onChangeText={(t) => {
                  setAskingPrice(t);
                  clearFieldErrorIfSet('askingPrice');
                }}
                onBlur={() =>
                  setFieldError('askingPrice', validateDecimalNumber(askingPrice, 'Asking price'))
                }
                placeholder="₹ Enter amount"
                keyboardType="numeric"
                error={errors.askingPrice}
                returnKeyType="done"
                onSubmitEditing={() => askingPriceRef.current?.blur()}
              />
            </Col>
          </Row>

          <UploadField
            label="Gallery"
            fileName={gallery?.name}
            onPress={handlePickGallery}
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

  labelSpacer: {
    fontSize: scaleFont(13),
    color: 'transparent',
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

  inputErrorBorder: {
    borderColor: ERROR_COLOR,
  },

  errorText: {
    fontSize: scaleFont(12),
    color: ERROR_COLOR,
    marginTop: scale(4),
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