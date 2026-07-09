import React, { useState, useRef, useEffect } from 'react';
import { getFormConfig } from "../../services/api/subCategoryApi";
import { createInventory } from "../../services/api/InventryApi";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Image,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

// Simple scaling
const { width } = require('react-native').Dimensions.get('window');
const scale = (size) => (width / 375) * size;

const ACCENT = '#2E8BCF';

// ============ ICONS ============
const ICONS = {
  back: require('../../assets/icons/back.png'),
  address: require('../../assets/icons/location_icon.png'),
  property: require('../../assets/icons/warehouse.png'),
  rooms: require('../../assets/icons/bed.png'),
  features: require('../../assets/icons/construction.png'),
  apartment: require('../../assets/icons/apartment.png'),
  commercial: require('../../assets/icons/bungalow.png'),
  plot: require('../../assets/icons/plot.png'),
  documents: require('../../assets/icons/upload.png'),
  upload: require('../../assets/icons/upload.png'),
  dropdownArrow: require('../../assets/icons/down_arrow.png'),
  charges: require('../../assets/icons/cash.png'),
  contact: require('../../assets/icons/call.png'),
  addCircle: require('../../assets/icons/add.png'),
};

// Options
const YES_NO = ['Yes', 'No'];
const AREA_UNITS = ['Sq. ft', 'Sq. yd', 'Sq. m', 'Acre'];
const STATUS_OPTIONS = ['Lease hold', 'Free hold', 'Vacant', 'Occupied'];
const AGE_OPTIONS = ['New', '1-5 years', '5-10 years', '10+ years'];
const FLOOR_OPTIONS = ['UG', 'Ground', '1st', '2nd', '3rd', 'Top'];
const SIDES_OPTIONS = ['1 Side', '2 Side Corner', '3 Side', '4 Side'];
const OVERLOOKING_OPTIONS = ['Pool', 'Park', 'Road', 'Garden', 'Club'];
const TYPE_OPTIONS = ['Duplex', 'Simplex', 'Triplex', 'Penthouse'];
const PRICE_UNIT_OPTIONS = ['Per Sq.ft', 'Per Sq.yd', 'Per Sq.m', 'Total Price'];
const SPECIFIER_OPTIONS = ['Owner', 'Tenant', 'Broker/Agent', 'Builder'];
const ADDRESS_TYPE_OPTIONS = ['House', 'Apartment', 'Villa', 'Office', 'Shop'];
const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

// ============ REGEX VALIDATION ============
const REGEX = {
  // Indian mobile numbers: 10 digits, starting 6-9. Adjust if you support other countries.
  phone: /^[6-9]\d{9}$/,
  pincode: /^\d{6}$/,
  // integer or decimal, e.g. 1200 or 1200.5
  numeric: /^\d+(\.\d+)?$/,
  // letters/spaces only (city, state, names)
  alpha: /^[A-Za-z\s]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

const isValidPhone = (v) => REGEX.phone.test(String(v).trim());
const isValidPincode = (v) => REGEX.pincode.test(String(v).trim());
const isValidNumeric = (v) => REGEX.numeric.test(String(v).trim());

let uid = 0;
const nextId = () => `id_${Date.now()}_${uid++}`;

// ============================================================
// STANDALONE PRESENTATIONAL COMPONENTS
// ------------------------------------------------------------
// IMPORTANT: These are declared OUTSIDE UnifiedForm on purpose.
// If they were declared inside UnifiedForm's function body, every
// keystroke (state update) would recreate them as brand-new
// component types, forcing React to unmount/remount the inputs —
// which is exactly what was closing the keyboard on every character.
// Keeping them at module scope keeps their identity stable across
// re-renders, so TextInput keeps focus and the keyboard stays open.
// ============================================================

const Dropdown = ({ label, value, options, onSelect }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.input} onPress={() => setOpen(true)}>
        <Text style={value ? styles.inputText : styles.placeholder}>{value || 'Select'}</Text>
        <Image source={ICONS.dropdownArrow} style={styles.dropdownArrowIcon} resizeMode="contain" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <Text style={[styles.modalItemText, item === value && styles.modalItemActive]}>
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

const Input = ({ label, value, onChange, placeholder, keyboardType, multiline, error }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.textArea, error && styles.inputError]}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#B5B5B5"
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const Row = ({ children }) => <View style={styles.row}>{children}</View>;
const Col = ({ children }) => <View style={styles.col}>{children}</View>;

const AddButton = ({ label, onPress }) => (
  <TouchableOpacity style={styles.addButtonRow} onPress={onPress}>
    <Image source={ICONS.addCircle} style={styles.addButtonIcon} resizeMode="contain" />
    <Text style={styles.addButtonText}>{label}</Text>
  </TouchableOpacity>
);

const RemoveButton = ({ onPress }) => (
  <TouchableOpacity style={styles.removeBtn} onPress={onPress}>
    <Text style={styles.removeBtnText}>✕</Text>
  </TouchableOpacity>
);

const Section = ({ title, icon }) => (
  <View style={styles.sectionRow}>
    {icon ? <Image source={icon} style={styles.sectionIcon} resizeMode="contain" /> : null}
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const Stepper = ({ label, value, onChange }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.stepper}>
      <TouchableOpacity style={styles.stepBtn} onPress={() => onChange(Math.max(0, value - 1))}>
        <Text style={styles.stepText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.stepValue}>{value}</Text>
      <TouchableOpacity style={styles.stepBtn} onPress={() => onChange(value + 1)}>
        <Text style={styles.stepText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const Upload = ({ label, file, onPress }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity style={[styles.input, styles.uploadBtn]} onPress={onPress}>
      <Text style={file ? styles.inputText : styles.placeholder}>
        {file?.name || 'Upload'}
      </Text>
      <Image source={ICONS.upload} style={styles.uploadIconImg} resizeMode="contain" />
    </TouchableOpacity>
  </View>
);

const UnifiedForm = ({ navigation, route }) => {
  const propertyName = route?.params?.propertyName || 'Property';
  const { categoryId, subCategoryId } = route.params;

  // Loading state
  const [loading, setLoading] = useState(false);

  // Form Config
  const [formConfig, setFormConfig] = useState([]);

  // Field-level validation errors
  const [errors, setErrors] = useState({});

  // Helper function to check if field exists in config
  const show = (fieldName) => {
    return formConfig.includes(fieldName);
  };

  const loadFormConfig = async (categoryId, subCategoryId) => {
    try {
      const res = await getFormConfig(categoryId, subCategoryId);
      if (res.success) {
        setFormConfig(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadFormConfig(categoryId, subCategoryId);
  }, [categoryId, subCategoryId]);

  // ============ CONTACT / SPECIFIER ============
  const [specifier, setSpecifier] = useState('Owner');
  const [owners, setOwners] = useState([{ id: nextId(), name: '', phone: '' }]);
  const [representatives, setRepresentatives] = useState([{ id: nextId(), name: '', phone: '' }]);
  const [addressType, setAddressType] = useState('House');

  // Scroll handling
  const scrollRef = useRef(null);
  const scrollOffsetRef = useRef(0);
  const handleScroll = (e) => {
    scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
  };
  const scrollDownABit = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: scrollOffsetRef.current + scale(140),
        animated: true,
      });
    }, 100);
  };

  const addOwner = () => {
    setOwners((prev) => [...prev, { id: nextId(), name: '', phone: '' }]);
    scrollDownABit();
  };
  const updateOwner = (id, field, value) =>
    setOwners((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: value } : o)));
  const removeOwner = (id) =>
    setOwners((prev) => (prev.length > 1 ? prev.filter((o) => o.id !== id) : prev));

  const addRepresentative = () => {
    setRepresentatives((prev) => [...prev, { id: nextId(), name: '', phone: '' }]);
    scrollDownABit();
  };
  const updateRepresentative = (id, field, value) =>
    setRepresentatives((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  const removeRepresentative = (id) =>
    setRepresentatives((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));

  // ============ ADDRESS ============
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [locality, setLocality] = useState('');

  // ============ BASIC DETAILS ============
  const [areaUnit, setAreaUnit] = useState('Sq. ft');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('Per Sq.ft');

  // ============ ROOMS ============
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [totalToilets, setTotalToilets] = useState(2);
  const [balconies, setBalconies] = useState(1);
  const [guestWashroom, setGuestWashroom] = useState('Yes');
  const [servantRoom, setServantRoom] = useState('No');

  // ============ PROPERTY ============
  const [status, setStatus] = useState('Lease hold');
  const [age, setAge] = useState('New');
  const [facing, setFacing] = useState('');
  const [overlooking, setOverlooking] = useState('Park');
  const [dimensions, setDimensions] = useState('');
  const [roadWidth, setRoadWidth] = useState('');
  const [totalFloors, setTotalFloors] = useState('');
  const [floorAvailable, setFloorAvailable] = useState('Ground');
  const [unitsPerFloor, setUnitsPerFloor] = useState('');
  const [sidesOpen, setSidesOpen] = useState('2 Side Corner');
  const [parking, setParking] = useState('');
  const [lift, setLift] = useState('Yes');

  // ============ CHARGES & DEPOSITS ============
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [maintenance, setMaintenance] = useState('');
  const [otherCharges, setOtherCharges] = useState('');

  // ============ APARTMENT ============
  const [projectName, setProjectName] = useState('');
  const [towerNo, setTowerNo] = useState('');
  const [apartmentNo, setApartmentNo] = useState('');
  const [apartmentFloor, setApartmentFloor] = useState('');
  const [superArea, setSuperArea] = useState('');
  const [coveredArea, setCoveredArea] = useState('');
  const [type, setType] = useState('Duplex');

  // ============ COMMERCIAL ============
  const [buildingName, setBuildingName] = useState('');
  const [unitType, setUnitType] = useState('Standalone');
  const [floorNo, setFloorNo] = useState('');
  const [furnishing, setFurnishing] = useState('Furnished');
  const [workStations, setWorkStations] = useState(0);
  const [cabins, setCabins] = useState(0);
  const [acCount, setAcCount] = useState(0);
  const [pantry, setPantry] = useState('Yes');
  const [facility, setFacility] = useState('Yes');

  // ============ PLOT ============
  const [dimension, setDimension] = useState('');
  const [category, setCategory] = useState('');
  const [authority, setAuthority] = useState('');

  // ============ UPLOADS ============
  const [gallery, setGallery] = useState([]);
  const [document, setDocument] = useState(null);
  const [layout, setLayout] = useState(null);
  const [brochure, setBrochure] = useState(null);
  const [rentAgreement, setRentAgreement] = useState(null);
  const [notes, setNotes] = useState('');

  // ============ VALIDATION ============
  const validateForm = () => {
    const newErrors = {};

    // Required-field presence checks
    const requiredFields = {
      specifier: specifier,
      address: address,
      city: city,
      state: state,
      pincode: pincode,
      areaValue: area,
      askingPrice: price,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (show(field) && !value) {
        newErrors[field] = 'This field is required';
      }
    }

    // Regex checks (only run when the field has a value, so "required"
    // errors above don't get overwritten by confusing format errors)
    if (show('pincode') && pincode && !isValidPincode(pincode)) {
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    }
    if (show('city') && city && !REGEX.alpha.test(city.trim())) {
      newErrors.city = 'City should contain letters only';
    }
    if (show('areaValue') && area && !isValidNumeric(area)) {
      newErrors.areaValue = 'Enter a valid number';
    }
    if (show('askingPrice') && price && !isValidNumeric(price)) {
      newErrors.askingPrice = 'Enter a valid amount';
    }
    if (show('roadWidth') && roadWidth && !isValidNumeric(roadWidth)) {
      newErrors.roadWidth = 'Enter a valid number';
    }
    if (show('securityDeposit') && securityDeposit && !isValidNumeric(securityDeposit)) {
      newErrors.securityDeposit = 'Enter a valid amount';
    }
    if (show('maintenance') && maintenance && !isValidNumeric(maintenance)) {
      newErrors.maintenance = 'Enter a valid amount';
    }

    // Owners: required + phone format
    if (show('owners')) {
      owners.forEach((owner, idx) => {
        if (!owner.name || !owner.phone) {
          newErrors[`owner_${idx}`] = 'Please fill all owner details';
        } else if (!isValidPhone(owner.phone)) {
          newErrors[`owner_${idx}`] = 'Enter a valid 10-digit phone number';
        }
      });
    }

    // Representatives: phone format only if provided
    if (show('representatives')) {
      representatives.forEach((rep, idx) => {
        if (rep.phone && !isValidPhone(rep.phone)) {
          newErrors[`rep_${idx}`] = 'Enter a valid 10-digit phone number';
        }
      });
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      Alert.alert('Validation Error', firstError);
      return false;
    }

    return true;
  };

  // ============ SUBMIT ============
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const formData = new FormData();

      // Required IDs
      formData.append('category', categoryId);
      formData.append('inventoryType', subCategoryId);
      formData.append('propertyName', propertyName);

      // Specifier
      if (show('specifier')) formData.append('specifier', specifier);

      // Owners — JSON array string
      const cleanOwners = owners.filter(o => o.name && o.phone).map(o => ({ name: o.name, phone: o.phone }));
      formData.append('owners', JSON.stringify(cleanOwners));

      // Representatives — JSON array string
      if (show('representatives')) {
        const cleanReps = representatives.filter(r => r.name).map(r => ({ name: r.name, phone: r.phone }));
        if (cleanReps.length > 0) formData.append('representatives', JSON.stringify(cleanReps));
      }

      // Address snapshot as flat multipart keys
      formData.append('addressSnapshot[address]', address);
      formData.append('addressSnapshot[city]', city);
      formData.append('addressSnapshot[state]', state);
      formData.append('addressSnapshot[pincode]', pincode);
      if (locality) formData.append('addressSnapshot[locality]', locality);

      // Area as flat multipart keys
      formData.append('area[value]', area);
      formData.append('area[unit]', areaUnit);

      // Price
      if (show('askingPrice')) formData.append('askingPrice', price);
      if (show('priceUnit')) formData.append('priceUnit', priceUnit);

      // Rooms
      if (show('numberOfBedrooms')) formData.append('numberOfBedrooms', String(bedrooms));
      if (show('numberOfBathrooms')) formData.append('numberOfBathrooms', String(bathrooms));
      if (show('totalToilets')) formData.append('totalToilets', String(totalToilets));
      if (show('balconies')) formData.append('balconies', String(balconies));
      if (show('guestWashroom')) formData.append('guestWashroom', guestWashroom === 'Yes' ? 'true' : 'false');
      if (show('servantRoom')) formData.append('servantRoom', servantRoom === 'Yes' ? 'true' : 'false');

      // Property features
      if (show('propertyStatus')) formData.append('propertyStatus', status);
      if (show('ageOfProperty')) formData.append('ageOfProperty', age);
      if (show('facingDirection') && facing) formData.append('facingDirection', facing);
      if (show('overlooking')) formData.append('overlooking', overlooking);
      if (show('roadWidth') && roadWidth) formData.append('roadWidth', roadWidth);
      if (show('totalFloors') && totalFloors) formData.append('totalFloors', totalFloors);
      if (show('floorAvailable')) formData.append('floorAvailable', floorAvailable);
      if (show('unitsPerFloor') && unitsPerFloor) formData.append('unitsPerFloor', unitsPerFloor);
      if (show('sidesOpen')) formData.append('sidesOpen', sidesOpen);
      if (show('parking') && parking) formData.append('parking', parking);
      if (show('lift')) formData.append('lift', lift === 'Yes' ? 'true' : 'false');
      if (show('dimensions') && dimensions) formData.append('dimensions', dimensions);

      // Charges
      if (show('securityDeposit') && securityDeposit) formData.append('securityDeposit', securityDeposit);
      if (show('maintenance') && maintenance) formData.append('maintenance', maintenance);
      if (show('otherCharges') && otherCharges) formData.append('otherCharges', otherCharges);

      // Apartment
      if (show('projectName') && projectName) formData.append('projectName', projectName);
      if (show('towerNo') && towerNo) formData.append('towerNo', towerNo);
      if (show('apartmentNo') && apartmentNo) formData.append('apartmentNo', apartmentNo);
      if (show('apartmentFloor') && apartmentFloor) formData.append('apartmentFloor', apartmentFloor);
      if (show('superArea') && superArea) formData.append('superArea', superArea);
      if (show('coveredArea') && coveredArea) formData.append('coveredArea', coveredArea);
      if (show('apartmentType')) formData.append('apartmentType', type);

      // Commercial
      if (show('buildingName') && buildingName) formData.append('buildingName', buildingName);
      if (show('unitType')) formData.append('unitType', unitType);
      if (show('floorNo') && floorNo) formData.append('floorNo', floorNo);
      if (show('furnishing')) formData.append('furnishing', furnishing);
      if (show('workStations')) formData.append('workStations', String(workStations));
      if (show('cabins')) formData.append('cabins', String(cabins));
      if (show('acCount')) formData.append('acCount', String(acCount));
      if (show('pantry')) formData.append('pantry', pantry === 'Yes' ? 'true' : 'false');
      if (show('facility')) formData.append('facility', facility === 'Yes' ? 'true' : 'false');

      // Plot
      if (show('plotDimension') && dimension) formData.append('plotDimension', dimension);
      if (show('plotCategory') && category) formData.append('plotCategory', category);
      if (show('authority') && authority) formData.append('authority', authority);

      // Notes
      if (show('notes') && notes) formData.append('notes', notes);

      // Files
      const appendFile = (key, file) => {
        if (file) formData.append(key, { uri: file.uri, type: file.type || 'image/jpeg', name: file.name || `${key}.jpg` });
      };
      if (show('gallery') && gallery.length > 0) {
        gallery.forEach(img => formData.append('gallery', { uri: img.uri, type: img.type || 'image/jpeg', name: img.name || 'gallery.jpg' }));
      }
      if (show('document')) appendFile('document', document);
      if (show('layout')) appendFile('layout', layout);
      if (show('brochure')) appendFile('brochure', brochure);
      if (show('rentAgreement')) appendFile('rentAgreement', rentAgreement);

      const response = await createInventory(formData);
      console.log('API Response:', response);
      Alert.alert('Success', `${propertyName} submitted successfully!`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', error.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============ IMAGE PICKER ============
  const pickImage = (setter) => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (res) => {
      if (!res.didCancel && res.assets) {
        const asset = res.assets[0];
        setter({ uri: asset.uri, name: asset.fileName || 'image.jpg', type: asset.type || 'image/jpeg' });
      }
    });
  };

  const pickMultipleImages = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8, selectionLimit: 0 }, (res) => {
      if (!res.didCancel && res.assets) {
        const newImages = res.assets.map(a => ({ uri: a.uri, name: a.fileName || 'image.jpg', type: a.type || 'image/jpeg' }));
        setGallery(prev => [...prev, ...newImages]);
      }
    });
  };

  const removeGalleryImage = (index) => {
    setGallery(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ICONS.back} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.title}>{propertyName}</Text>
          <View style={{ width: 30 }} />
        </View>

        <Text style={styles.subtitle}>Add details about your {propertyName.toLowerCase()}</Text>

        {/* ======== CONTACT / SPECIFIER ======== */}
        {(show('specifier') || show('owners') || show('representatives') || show('addressType')) && (
          <>
            <Section title="Contact & Specifier Details" icon={ICONS.contact} />

            {show('specifier') && (
              <Dropdown
                label="Specifier"
                value={specifier}
                options={SPECIFIER_OPTIONS}
                onSelect={setSpecifier}
              />
            )}

            {show('owners') && (
              <>
                {owners.slice(0, 1).map((owner, index) => (
                  <Row key={owner.id}>
                    <Col>
                      <Input
                        label="Name of owner"
                        value={owner.name}
                        onChange={(val) => updateOwner(owner.id, 'name', val)}
                        placeholder="Enter owner name"
                        error={errors[`owner_${index}`]}
                      />
                    </Col>
                    <Col>
                      <Input
                        label="Phone number"
                        value={owner.phone}
                        onChange={(val) => updateOwner(owner.id, 'phone', val.replace(/[^0-9]/g, '').slice(0, 10))}
                        placeholder="10-digit phone number"
                        keyboardType="numeric"
                      />
                    </Col>
                  </Row>
                ))}

                <AddButton label="Add Owner & Phone number" onPress={addOwner} />

                {owners.slice(1).map((owner, index) => (
                  <Row key={owner.id}>
                    <Col>
                      <Input
                        label={`Name of owner ${index + 2}`}
                        value={owner.name}
                        onChange={(val) => updateOwner(owner.id, 'name', val)}
                        placeholder="Enter owner name"
                        error={errors[`owner_${index + 1}`]}
                      />
                    </Col>
                    <Col>
                      <Input
                        label="Phone number"
                        value={owner.phone}
                        onChange={(val) => updateOwner(owner.id, 'phone', val.replace(/[^0-9]/g, '').slice(0, 10))}
                        placeholder="10-digit phone number"
                        keyboardType="numeric"
                      />
                    </Col>
                    <RemoveButton onPress={() => removeOwner(owner.id)} />
                  </Row>
                ))}
              </>
            )}

            {show('representatives') && (
              <>
                {representatives.slice(0, 1).map((rep, index) => (
                  <Row key={rep.id}>
                    <Col>
                      <Input
                        label="Name of the representative"
                        value={rep.name}
                        onChange={(val) => updateRepresentative(rep.id, 'name', val)}
                        placeholder="Enter representative name"
                      />
                    </Col>
                    <Col>
                      <Input
                        label="Phone number"
                        value={rep.phone}
                        onChange={(val) => updateRepresentative(rep.id, 'phone', val.replace(/[^0-9]/g, '').slice(0, 10))}
                        placeholder="10-digit phone number"
                        keyboardType="numeric"
                        error={errors[`rep_${index}`]}
                      />
                    </Col>
                  </Row>
                ))}

                <AddButton label="Add Representatives & Phone number" onPress={addRepresentative} />

                {representatives.slice(1).map((rep, index) => (
                  <Row key={rep.id}>
                    <Col>
                      <Input
                        label={`Name of representative ${index + 2}`}
                        value={rep.name}
                        onChange={(val) => updateRepresentative(rep.id, 'name', val)}
                        placeholder="Enter representative name"
                      />
                    </Col>
                    <Col>
                      <Input
                        label="Phone number"
                        value={rep.phone}
                        onChange={(val) => updateRepresentative(rep.id, 'phone', val.replace(/[^0-9]/g, '').slice(0, 10))}
                        placeholder="10-digit phone number"
                        keyboardType="numeric"
                        error={errors[`rep_${index + 1}`]}
                      />
                    </Col>
                    <RemoveButton onPress={() => removeRepresentative(rep.id)} />
                  </Row>
                ))}
              </>
            )}

            {show('addressType') && (
              <Dropdown
                label="Address Type"
                value={addressType}
                options={ADDRESS_TYPE_OPTIONS}
                onSelect={setAddressType}
              />
            )}
          </>
        )}

        {/* ======== ADDRESS ======== */}
        {(show('address') || show('city') || show('state') || show('pincode') || show('locality')) && (
          <>
            <Section title="Address Details" icon={ICONS.address} />

            {show('address') && (
              <Input
                label="Street Address"
                value={address}
                onChange={setAddress}
                placeholder="Enter street address"
                error={errors.address}
              />
            )}

            {(show('city') || show('state')) && (
              <Row>
                {show('city') && (
                  <Col>
                    <Input
                      label="City"
                      value={city}
                      onChange={setCity}
                      placeholder="Enter city"
                      error={errors.city}
                    />
                  </Col>
                )}
                {show('state') && (
                  <Col>
                    <Dropdown
                      label="State"
                      value={state}
                      options={INDIA_STATES}
                      onSelect={setState}
                    />
                  </Col>
                )}
              </Row>
            )}

            {(show('pincode') || show('locality')) && (
              <Row>
                {show('pincode') && (
                  <Col>
                    <Input
                      label="Pincode"
                      value={pincode}
                      onChange={(val) => setPincode(val.replace(/[^0-9]/g, '').slice(0, 6))}
                      placeholder="6-digit pincode"
                      keyboardType="numeric"
                      error={errors.pincode}
                    />
                  </Col>
                )}
                {show('locality') && (
                  <Col>
                    <Input
                      label="Locality"
                      value={locality}
                      onChange={setLocality}
                      placeholder="Enter locality"
                    />
                  </Col>
                )}
              </Row>
            )}
          </>
        )}

        {/* ======== BASIC DETAILS ======== */}
        {(show('areaValue') || show('areaUnit') || show('askingPrice') || show('priceUnit')) && (
          <>
            <Section title="Property Details" icon={ICONS.property} />

            {(show('areaValue') || show('areaUnit')) && (
              <Row>
                {show('areaUnit') && (
                  <Col>
                    <Dropdown
                      label="Area Unit"
                      value={areaUnit}
                      options={AREA_UNITS}
                      onSelect={setAreaUnit}
                    />
                  </Col>
                )}
                {show('areaValue') && (
                  <Col>
                    <Input
                      label="Area"
                      value={area}
                      onChange={setArea}
                      placeholder="Enter area"
                      keyboardType="numeric"
                      error={errors.areaValue}
                    />
                  </Col>
                )}
              </Row>
            )}

            {(show('askingPrice') || show('priceUnit')) && (
              <Row>
                {show('askingPrice') && (
                  <Col>
                    <Input
                      label="Asking Price"
                      value={price}
                      onChange={setPrice}
                      placeholder="₹ Enter amount"
                      keyboardType="numeric"
                      error={errors.askingPrice}
                    />
                  </Col>
                )}
                {show('priceUnit') && (
                  <Col>
                    <Dropdown
                      label="Price Unit"
                      value={priceUnit}
                      options={PRICE_UNIT_OPTIONS}
                      onSelect={setPriceUnit}
                    />
                  </Col>
                )}
              </Row>
            )}
          </>
        )}

        {/* ======== ROOMS ======== */}
        {(show('numberOfBedrooms') || show('numberOfBathrooms') || show('totalToilets') ||
          show('balconies') || show('guestWashroom') || show('servantRoom')) && (
          <>
            <Section title="Room Details" icon={ICONS.rooms} />

            {(show('numberOfBedrooms') || show('numberOfBathrooms')) && (
              <Row>
                {show('numberOfBedrooms') && (
                  <Col>
                    <Stepper label="Bedrooms" value={bedrooms} onChange={setBedrooms} />
                  </Col>
                )}
                {show('numberOfBathrooms') && (
                  <Col>
                    <Stepper label="Bathrooms" value={bathrooms} onChange={setBathrooms} />
                  </Col>
                )}
              </Row>
            )}

            {(show('totalToilets') || show('balconies')) && (
              <Row>
                {show('totalToilets') && (
                  <Col>
                    <Stepper label="Total No. of Toilets" value={totalToilets} onChange={setTotalToilets} />
                  </Col>
                )}
                {show('balconies') && (
                  <Col>
                    <Stepper label="No. of Balconies" value={balconies} onChange={setBalconies} />
                  </Col>
                )}
              </Row>
            )}

            {(show('guestWashroom') || show('servantRoom')) && (
              <Row>
                {show('guestWashroom') && (
                  <Col>
                    <Dropdown
                      label="Guest Washroom"
                      value={guestWashroom}
                      options={YES_NO}
                      onSelect={setGuestWashroom}
                    />
                  </Col>
                )}
                {show('servantRoom') && (
                  <Col>
                    <Dropdown
                      label="Servant Room"
                      value={servantRoom}
                      options={YES_NO}
                      onSelect={setServantRoom}
                    />
                  </Col>
                )}
              </Row>
            )}
          </>
        )}

        {/* ======== PROPERTY FEATURES ======== */}
        {(show('propertyStatus') || show('ageOfProperty') || show('facingDirection') ||
          show('overlooking') || show('dimensions') || show('roadWidth') || show('totalFloors') ||
          show('floorAvailable') || show('unitsPerFloor') || show('sidesOpen') || show('parking') ||
          show('lift')) && (
          <>
            <Section title="Property Features" icon={ICONS.features} />

            {(show('propertyStatus') || show('ageOfProperty')) && (
              <Row>
                {show('propertyStatus') && (
                  <Col>
                    <Dropdown
                      label="Property Status"
                      value={status}
                      options={STATUS_OPTIONS}
                      onSelect={setStatus}
                    />
                  </Col>
                )}
                {show('ageOfProperty') && (
                  <Col>
                    <Dropdown
                      label="Age of Property"
                      value={age}
                      options={AGE_OPTIONS}
                      onSelect={setAge}
                    />
                  </Col>
                )}
              </Row>
            )}

            {(show('facingDirection') || show('overlooking')) && (
              <Row>
                {show('facingDirection') && (
                  <Col>
                    <Input
                      label="Facing Direction"
                      value={facing}
                      onChange={setFacing}
                      placeholder="North/South/East/West"
                    />
                  </Col>
                )}
                {show('overlooking') && (
                  <Col>
                    <Dropdown
                      label="Overlooking"
                      value={overlooking}
                      options={OVERLOOKING_OPTIONS}
                      onSelect={setOverlooking}
                    />
                  </Col>
                )}
              </Row>
            )}

            {(show('dimensions') || show('roadWidth')) && (
              <Row>
                {show('dimensions') && (
                  <Col>
                    <Input
                      label="Plot Dimensions"
                      value={dimensions}
                      onChange={setDimensions}
                      placeholder="e.g. 30x40"
                    />
                  </Col>
                )}
                {show('roadWidth') && (
                  <Col>
                    <Input
                      label="Road Width"
                      value={roadWidth}
                      onChange={setRoadWidth}
                      placeholder="Feet/Meter"
                      keyboardType="numeric"
                      error={errors.roadWidth}
                    />
                  </Col>
                )}
              </Row>
            )}

            {(show('totalFloors') || show('floorAvailable')) && (
              <Row>
                {show('totalFloors') && (
                  <Col>
                    <Input
                      label="Total Floors"
                      value={totalFloors}
                      onChange={setTotalFloors}
                      placeholder="Enter"
                      keyboardType="numeric"
                    />
                  </Col>
                )}
                {show('floorAvailable') && (
                  <Col>
                    <Dropdown
                      label="Floor Available"
                      value={floorAvailable}
                      options={FLOOR_OPTIONS}
                      onSelect={setFloorAvailable}
                    />
                  </Col>
                )}
              </Row>
            )}

            {(show('unitsPerFloor') || show('sidesOpen')) && (
              <Row>
                {show('unitsPerFloor') && (
                  <Col>
                    <Input
                      label="Units per Floor"
                      value={unitsPerFloor}
                      onChange={setUnitsPerFloor}
                      placeholder="Enter"
                      keyboardType="numeric"
                    />
                  </Col>
                )}
                {show('sidesOpen') && (
                  <Col>
                    <Dropdown
                      label="Sides Open"
                      value={sidesOpen}
                      options={SIDES_OPTIONS}
                      onSelect={setSidesOpen}
                    />
                  </Col>
                )}
              </Row>
            )}

            {(show('parking') || show('lift')) && (
              <Row>
                {show('parking') && (
                  <Col>
                    <Input
                      label="Parking"
                      value={parking}
                      onChange={setParking}
                      placeholder="Yes/No"
                    />
                  </Col>
                )}
                {show('lift') && (
                  <Col>
                    <Dropdown
                      label="Lift"
                      value={lift}
                      options={YES_NO}
                      onSelect={setLift}
                    />
                  </Col>
                )}
              </Row>
            )}
          </>
        )}

        {/* ======== CHARGES & DEPOSITS ======== */}
        {(show('securityDeposit') || show('maintenance') || show('otherCharges')) && (
          <>
            <Section title="Charges & Deposits" icon={ICONS.charges} />

            {(show('securityDeposit') || show('maintenance')) && (
              <Row>
                {show('securityDeposit') && (
                  <Col>
                    <Input
                      label="Security Deposit"
                      value={securityDeposit}
                      onChange={setSecurityDeposit}
                      placeholder="₹ Enter amount"
                      keyboardType="numeric"
                      error={errors.securityDeposit}
                    />
                  </Col>
                )}
                {show('maintenance') && (
                  <Col>
                    <Input
                      label="Maintenance"
                      value={maintenance}
                      onChange={setMaintenance}
                      placeholder="₹ Per month"
                      keyboardType="numeric"
                      error={errors.maintenance}
                    />
                  </Col>
                )}
              </Row>
            )}

            {show('otherCharges') && (
              <Input
                label="Other Charges"
                value={otherCharges}
                onChange={setOtherCharges}
                placeholder="₹ Enter amount, if any"
                keyboardType="numeric"
              />
            )}
          </>
        )}

        {/* ======== APARTMENT ======== */}
        {(show('projectName') || show('towerNo') || show('apartmentNo') || show('apartmentFloor') ||
          show('superArea') || show('coveredArea') || show('apartmentType')) && (
          <>
            <Section title="Apartment Details" icon={ICONS.apartment} />

            {show('projectName') && (
              <Input
                label="Project/Society Name"
                value={projectName}
                onChange={setProjectName}
                placeholder="Enter project name"
              />
            )}

            {(show('towerNo') || show('apartmentNo')) && (
              <Row>
                {show('towerNo') && (
                  <Col>
                    <Input
                      label="Tower No."
                      value={towerNo}
                      onChange={setTowerNo}
                      placeholder="Enter"
                      keyboardType="numeric"
                    />
                  </Col>
                )}
                {show('apartmentNo') && (
                  <Col>
                    <Input
                      label="Apartment No."
                      value={apartmentNo}
                      onChange={setApartmentNo}
                      placeholder="Enter"
                      keyboardType="numeric"
                    />
                  </Col>
                )}
              </Row>
            )}

            {(show('apartmentFloor') || show('apartmentType')) && (
              <Row>
                {show('apartmentFloor') && (
                  <Col>
                    <Input
                      label="Apartment Floor"
                      value={apartmentFloor}
                      onChange={setApartmentFloor}
                      placeholder="Enter"
                      keyboardType="numeric"
                    />
                  </Col>
                )}
                {show('apartmentType') && (
                  <Col>
                    <Dropdown
                      label="Type"
                      value={type}
                      options={TYPE_OPTIONS}
                      onSelect={setType}
                    />
                  </Col>
                )}
              </Row>
            )}

            {(show('superArea') || show('coveredArea')) && (
              <Row>
                {show('superArea') && (
                  <Col>
                    <Input
                      label="Super Area"
                      value={superArea}
                      onChange={setSuperArea}
                      placeholder="Sq. ft"
                      keyboardType="numeric"
                    />
                  </Col>
                )}
                {show('coveredArea') && (
                  <Col>
                    <Input
                      label="Covered Area"
                      value={coveredArea}
                      onChange={setCoveredArea}
                      placeholder="Sq. ft"
                      keyboardType="numeric"
                    />
                  </Col>
                )}
              </Row>
            )}
          </>
        )}

        {/* ======== COMMERCIAL ======== */}
        {(show('buildingName') || show('unitType') || show('floorNo') || show('furnishing') ||
          show('workStations') || show('cabins') || show('acCount') || show('pantry') ||
          show('facility')) && (
          <>
            <Section title="Commercial Details" icon={ICONS.commercial} />

            {show('buildingName') && (
              <Input
                label="Building Name"
                value={buildingName}
                onChange={setBuildingName}
                placeholder="Enter building name"
              />
            )}

            {(show('unitType') || show('floorNo')) && (
              <Row>
                {show('unitType') && (
                  <Col>
                    <Dropdown
                      label="Unit Type"
                      value={unitType}
                      options={['Standalone', 'Co-working', 'Business Park', 'IT Park']}
                      onSelect={setUnitType}
                    />
                  </Col>
                )}
                {show('floorNo') && (
                  <Col>
                    <Input
                      label="Floor No."
                      value={floorNo}
                      onChange={setFloorNo}
                      placeholder="Enter"
                      keyboardType="numeric"
                    />
                  </Col>
                )}
              </Row>
            )}

            {show('furnishing') && (
              <Dropdown
                label="Furnishing"
                value={furnishing}
                options={['Furnished', 'Semi-Furnished', 'Unfurnished']}
                onSelect={setFurnishing}
              />
            )}

            {(show('workStations') || show('cabins')) && (
              <Row>
                {show('workStations') && (
                  <Col>
                    <Stepper label="No. of Work Stations" value={workStations} onChange={setWorkStations} />
                  </Col>
                )}
                {show('cabins') && (
                  <Col>
                    <Stepper label="No. of Cabins" value={cabins} onChange={setCabins} />
                  </Col>
                )}
              </Row>
            )}

            {(show('acCount') || show('pantry')) && (
              <Row>
                {show('acCount') && (
                  <Col>
                    <Stepper label="No. of AC" value={acCount} onChange={setAcCount} />
                  </Col>
                )}
                {show('pantry') && (
                  <Col>
                    <Dropdown
                      label="Pantry"
                      value={pantry}
                      options={YES_NO}
                      onSelect={setPantry}
                    />
                  </Col>
                )}
              </Row>
            )}

            {show('facility') && (
              <Dropdown
                label="Facility"
                value={facility}
                options={YES_NO}
                onSelect={setFacility}
              />
            )}
          </>
        )}

        {/* ======== PLOT ======== */}
        {(show('plotDimension') || show('plotCategory') || show('authority')) && (
          <>
            <Section title="Plot Details" icon={ICONS.plot} />

            {show('plotDimension') && (
              <Input
                label="Dimension"
                value={dimension}
                onChange={setDimension}
                placeholder="Enter dimension"
              />
            )}

            {(show('plotCategory') || show('authority')) && (
              <Row>
                {show('plotCategory') && (
                  <Col>
                    <Dropdown
                      label="Category"
                      value={category}
                      options={['Residential', 'Commercial', 'Agricultural', 'Industrial']}
                      onSelect={setCategory}
                    />
                  </Col>
                )}
                {show('authority') && (
                  <Col>
                    <Input
                      label="Authority"
                      value={authority}
                      onChange={setAuthority}
                      placeholder="Enter authority"
                    />
                  </Col>
                )}
              </Row>
            )}
          </>
        )}

        {/* ======== UPLOADS ======== */}
        {(show('gallery') || show('document') || show('layout') || show('brochure') ||
          show('rentAgreement') || show('notes')) && (
          <>
            <Section title="Documents & Media" icon={ICONS.documents} />

            {(show('gallery') || show('document')) && (
              <Row>
                {show('gallery') && (
                  <Col>
                    <View style={styles.field}>
                      <Text style={styles.label}>Gallery</Text>
                      <TouchableOpacity style={[styles.input, styles.uploadBtn]} onPress={pickMultipleImages}>
                        <Text style={gallery.length > 0 ? styles.inputText : styles.placeholder}>
                          {gallery.length > 0 ? `${gallery.length} image(s) selected` : 'Upload'}
                        </Text>
                        <Image source={ICONS.upload} style={styles.uploadIconImg} resizeMode="contain" />
                      </TouchableOpacity>
                      {gallery.length > 0 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryPreview}>
                          {gallery.map((img, index) => (
                            <View key={index} style={styles.galleryThumbWrap}>
                              <Image source={{ uri: img.uri }} style={styles.galleryThumb} />
                              <TouchableOpacity style={styles.galleryRemove} onPress={() => removeGalleryImage(index)}>
                                <Text style={styles.galleryRemoveText}>✕</Text>
                              </TouchableOpacity>
                            </View>
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  </Col>
                )}
                {show('document') && (
                  <Col>
                    <Upload label="Document" file={document} onPress={() => pickImage(setDocument)} />
                  </Col>
                )}
              </Row>
            )}

            {(show('layout') || show('brochure')) && (
              <Row>
                {show('layout') && (
                  <Col>
                    <Upload label="Layout" file={layout} onPress={() => pickImage(setLayout)} />
                  </Col>
                )}
                {show('brochure') && (
                  <Col>
                    <Upload label="Brochure" file={brochure} onPress={() => pickImage(setBrochure)} />
                  </Col>
                )}
              </Row>
            )}

            {show('rentAgreement') && (
              <Upload label="Rent Agreement" file={rentAgreement} onPress={() => pickImage(setRentAgreement)} />
            )}

            {show('notes') && (
              <Input
                label="Notes"
                value={notes}
                onChange={setNotes}
                placeholder="Any additional notes"
                multiline
              />
            )}
          </>
        )}

        {/* ======== SUBMIT ======== */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit {propertyName}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ STYLES ============
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 12,
  },
  backIcon: {
    width: scale(20),
    height: scale(20),
    tintColor: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  sectionIcon: {
    width: scale(18),
    height: scale(18),
    marginRight: 8,
    tintColor: ACCENT,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  col: {
    flex: 1,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: ACCENT,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputError: {
    borderColor: '#E24C4C',
  },
  errorText: {
    fontSize: 12,
    color: '#E24C4C',
    marginTop: 4,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  inputText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  placeholder: {
    fontSize: 14,
    color: '#B5B5B5',
    flex: 1,
  },
  dropdownArrowIcon: {
    width: scale(12),
    height: scale(12),
    tintColor: '#999',
  },
  uploadIconImg: {
    width: scale(18),
    height: scale(18),
    tintColor: ACCENT,
  },
  uploadBtn: {
    borderStyle: 'dashed',
  },
  addButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonIcon: {
    width: scale(20),
    height: scale(20),
    tintColor: ACCENT,
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT,
  },
  removeBtn: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale(22),
  },
  removeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E24C4C',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 15,
    color: '#444',
  },
  modalItemActive: {
    color: ACCENT,
    fontWeight: '700',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EAF4FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 18,
    fontWeight: '700',
    color: ACCENT,
  },
  stepValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  submitBtn: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  galleryPreview: {
    marginTop: 8,
  },
  galleryThumbWrap: {
    marginRight: 8,
    position: 'relative',
  },
  galleryThumb: {
    width: scale(70),
    height: scale(70),
    borderRadius: 8,
  },
  galleryRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E24C4C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryRemoveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default UnifiedForm;