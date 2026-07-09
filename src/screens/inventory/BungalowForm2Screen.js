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
  Alert,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scaleFactor = Math.min(SCREEN_WIDTH / 375, 1.35);
const s = n => PixelRatio.roundToNearestPixel(n * scaleFactor);
const sf = n => Math.round(s(n));
const ACCENT = '#2E8BCF';
const ERROR = '#E5484D';

const icon = name => {
  switch (name) {
    case 'back':
      return require('../../assets/icons/back.png');
    case 'down_arrow':
      return require('../../assets/icons/down_arrow.png');
    case 'upload':
      return require('../../assets/icons/upload.png');
    case 'location_icon':
      return require('../../assets/icons/location_icon.png');
    default:
      return require('../../assets/icons/back.png');
  }
};

// Validation rules for all fields EXCEPT gallery and document
const VALIDATORS = {
  dimensions: {
    regex: /^\d+(\.\d+)?\s*[xX×]\s*\d+(\.\d+)?(\s*[a-zA-Z]+)?$/,
    message: 'Enter dimensions like 30x40',
    required: true,
  },
  facingDirection: {
    regex: /.+/,
    message: 'Please select facing direction',
    required: true,
  },
  overLooking: {
    regex: /^[A-Za-z][A-Za-z\s.,&-]*$/,
    message: 'Letters only',
    required: true,
  },
  sidesOpen: {
    regex: /.+/,
    message: 'Please select sides open',
    required: true,
  },
  widthOfRoad: {
    regex: /^\d+(\.\d+)?$/,
    message: 'Numbers only (e.g. 30)',
    required: true,
  },
  askingPrice: {
    regex: /^\d{1,3}(,\d{2,3})*(\.\d+)?$|^\d+(\.\d+)?$/,
    message: 'Enter a valid amount',
    required: true,
  },
  category: {
    regex: /.+/,
    message: 'Please select a category',
    required: true,
  },
  authority: {
    regex: /^[A-Za-z][A-Za-z\s.&-]*$/,
    message: 'Letters only',
    required: true,
  },
  status: {
    regex: /.+/,
    message: 'Please select status',
    required: true,
  },
  areaUnit: {
    regex: /.+/,
    message: 'Please select area unit',
    required: true,
  },
  areaValue: {
    regex: /^\d+(\.\d+)?$/,
    message: 'Numbers only (e.g. 1200)',
    required: true,
  },
  documents: {
    regex: /^[A-Za-z0-9][A-Za-z0-9\s,.'-]*$/,
    message: 'Invalid characters',
    required: true,
  },
  certificates: {
    regex: /^[A-Za-z0-9][A-Za-z0-9\s,.'-]*$/,
    message: 'Invalid characters',
    required: true,
  },
  // gallery and document are NOT in VALIDATORS - they will not be validated
};

const ADDRESS_VALIDATOR = {
  regex: /^[A-Za-z0-9][A-Za-z0-9\s,./#-]{4,}$/,
  message: 'Enter a valid address (min 5 characters)',
  required: true,
};

const validateValue = (value, validator) => {
  if (!validator) return '';
  const trimmed = (value || '').toString().trim();
  if (!trimmed) {
    return validator.required ? 'This field is required' : '';
  }
  if (!validator.regex.test(trimmed)) {
    return validator.message;
  }
  return '';
};

// Picker sheet component
const OptionSheet = ({ visible, title, options, selected, onSelect, onClose }) => (
  <Modal visible={visible} transparent animationType="fade">
    <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>{title || 'Select'}</Text>
        <FlatList
          data={options}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              <Text style={[styles.optionText, item === selected && styles.optionTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </TouchableOpacity>
  </Modal>
);

// Form field component
const Field = ({ field, value, onChange, error }) => {
  const [open, setOpen] = useState(false);
  const { type, label, placeholder, keyboardType, options, unit, onUnitChange, unitOptions } = field;

  if (type === 'text') {
    return (
      <View style={styles.group}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View style={[styles.box, error && styles.boxError]}>
          <TextInput
            style={styles.boxText}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor="#B5B5B5"
            keyboardType={keyboardType}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }

  if (type === 'upload') {
    return (
      <View style={styles.group}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity 
          style={[styles.box, error && styles.boxError]} 
          activeOpacity={0.7}
          onPress={() => {
            // Handle file upload - for demo, set a dummy value
            onChange('File uploaded');
          }}
        >
          <Text style={value ? styles.boxValue : styles.boxPlaceholder}>
            {value || 'Upload'}
          </Text>
          <Image source={icon('upload')} style={styles.chevron} />
        </TouchableOpacity>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }

  if (type === 'amount') {
    return (
      <View style={styles.group}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View style={styles.amountRow}>
          <View style={[styles.box, { flex: 1, marginRight: s(10) }, error && styles.boxError]}>
            <TextInput
              style={styles.boxText}
              value={value}
              onChangeText={onChange}
              placeholder={placeholder}
              placeholderTextColor="#B5B5B5"
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={styles.unitPill} activeOpacity={0.7} onPress={() => setOpen(true)}>
            <Text style={styles.boxValue} numberOfLines={1}>{unit}</Text>
            <Image source={icon('down_arrow')} style={styles.chevron} />
          </TouchableOpacity>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <OptionSheet
          visible={open}
          title="Unit"
          options={unitOptions}
          selected={unit}
          onSelect={onUnitChange}
          onClose={() => setOpen(false)}
        />
      </View>
    );
  }

  // Dropdown (default)
  return (
    <View style={styles.group}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity 
        style={[styles.box, error && styles.boxError]} 
        activeOpacity={0.7} 
        onPress={() => setOpen(true)}
      >
        <Text style={value ? styles.boxValue : styles.boxPlaceholder}>
          {value || placeholder || 'Select'}
        </Text>
        <Image source={icon('down_arrow')} style={styles.chevron} />
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <OptionSheet
        visible={open}
        title={label}
        options={options}
        selected={value}
        onSelect={onChange}
        onClose={() => setOpen(false)}
      />
    </View>
  );
};

const BungalowForm2Screen = ({ navigation }) => {
  const [address, setAddress] = useState('');
  const [state, setState] = useState({
    dimensions: '',
    facingDirection: '',
    overLooking: '',
    sidesOpen: '',
    widthOfRoad: '',
    askingPrice: '',
    priceUnit: 'Sq mt.',
    category: '',
    authority: '',
    status: '',
    areaUnit: '',
    areaValue: '',
    documents: '',
    certificates: '',
    gallery: null,
    document: null,
  });
  const [errors, setErrors] = useState({});
  const [addressError, setAddressError] = useState('');

  const setField = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const formRows = [
    [{ key: 'dimensions', type: 'text', label: 'Dimensions', placeholder: 'Enter Units' }],
    [
      { key: 'facingDirection', label: 'Facing Direction', options: ['Plot', 'North', 'South', 'East', 'West'] },
      { key: 'overLooking', type: 'text', label: 'Over Looking', placeholder: 'Enter' },
    ],
    [
      { key: 'sidesOpen', label: 'Sides Open', options: ['1 Side', '2 Side', '3 Side', '1/2 Sidecorner', '4 Side'] },
      { key: 'widthOfRoad', type: 'text', label: 'Width of Road', placeholder: 'Feet/ Meter', keyboardType: 'numeric' },
    ],
    [{
      key: 'askingPrice',
      type: 'amount',
      label: 'Asking Price',
      placeholder: '₹ Enter amount',
      unit: state.priceUnit,
      onUnitChange: v => setField('priceUnit', v),
      unitOptions: ['Sq mt.', 'Sq ft.', 'Acre'],
    }],
    [
      { key: 'category', label: 'Category', options: ['Residential', 'Commercial', 'Agricultural', 'Industrial'] },
      { key: 'authority', type: 'text', label: 'Authority', placeholder: 'Enter' },
    ],
    [{ key: 'status', label: 'Status', options: ['Ready to move', 'Under Construction', 'New Launch'] }],
    [
      { key: 'areaUnit', label: 'Area', options: ['Sq ft', 'Sq mt', 'Acre'] },
      { key: 'areaValue', type: 'text', label: ' ', placeholder: 'Enter Area', keyboardType: 'numeric' },
    ],
    [
      { key: 'documents', type: 'text', label: 'Documents', placeholder: 'Manual Entry' },
      { key: 'certificates', type: 'text', label: 'Certificates', placeholder: 'Manual Entry' },
    ],
    [
      { key: 'gallery', type: 'upload', label: 'Gallery' },
      { key: 'document', type: 'upload', label: 'Document' },
    ],
  ];

  const runValidation = () => {
    const nextErrors = {};
    // Only validate fields that exist in VALIDATORS (gallery and document are excluded)
    Object.keys(VALIDATORS).forEach(key => {
      nextErrors[key] = validateValue(state[key], VALIDATORS[key]);
    });
    const nextAddressError = validateValue(address, ADDRESS_VALIDATOR);
    return { nextErrors, nextAddressError };
  };

  const handleSubmit = () => {
    const { nextErrors, nextAddressError } = runValidation();
    setErrors(nextErrors);
    setAddressError(nextAddressError);

    const hasErrors = !!nextAddressError || Object.values(nextErrors).some(Boolean);

    if (hasErrors) {
      Alert.alert('Validation Error', 'Please fix all highlighted fields before submitting.', [{ text: 'OK' }]);
      return;
    }

    console.log('Bungalow form 2 payload:', { address, ...state });
    navigation.navigate('BungalowScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Image source={icon('back')} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Bungalow</Text>
            <View style={{ width: s(24) }} />
          </View>

          <Text style={styles.subtitle}>
            Add details about the builder floor to access it anytime
          </Text>

          <View style={styles.group}>
            <Text style={styles.label}>Address *</Text>
            <View style={[styles.addressRow, addressError && styles.boxError]}>
              <TextInput
                style={[styles.boxText, { marginRight: s(8) }]}
                value={address}
                onChangeText={v => {
                  setAddress(v);
                  if (addressError) setAddressError('');
                }}
                placeholder="Enter address"
                placeholderTextColor="#B5B5B5"
              />
              <View style={styles.addressPill}>
                <Text style={styles.addressPillText} numberOfLines={1}>Moti Nagar</Text>
                <Image source={icon('location_icon')} style={[styles.chevron, { tintColor: ACCENT }]} />
              </View>
            </View>
            {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
          </View>

          {formRows.map((row, i) => (
            <View key={i} style={row.length > 1 ? styles.row : undefined}>
              {row.map((field, idx) => (
                <View
                  key={field.key}
                  style={row.length > 1 ? [styles.col, idx === 0 && { marginRight: s(12) }] : undefined}
                >
                  <Field
                    field={field}
                    value={state[field.key]}
                    onChange={v => setField(field.key, v)}
                    error={errors[field.key]}
                  />
                </View>
              ))}
            </View>
          ))}

          <TouchableOpacity style={styles.submit} activeOpacity={0.85} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BungalowForm2Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scroll: { paddingHorizontal: s(20), paddingTop: s(16), paddingBottom: s(30) },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: -s(20),
    paddingHorizontal: s(18),
    paddingVertical: s(14),
    marginBottom: s(4),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    minHeight: s(56),
  },
  backIcon: { width: s(20), height: s(20), resizeMode: 'contain', tintColor: '#222' },
  headerTitle: { fontSize: sf(17), fontWeight: '700', color: '#222' },
  subtitle: { fontSize: sf(14), color: '#8A8A8A', marginBottom: s(18) },
  row: { flexDirection: 'row' },
  col: { flex: 1 },
  group: { marginBottom: s(16) },
  label: { fontSize: sf(13), color: ACCENT, marginBottom: s(6) },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: s(10),
    paddingHorizontal: s(14),
    paddingVertical: s(12),
    backgroundColor: '#fff',
  },
  boxError: { borderColor: ERROR },
  errorText: { fontSize: sf(12), color: ERROR, marginTop: s(4) },
  boxText: { flex: 1, fontSize: sf(14), color: '#333', padding: 0 },
  boxValue: { fontSize: sf(14), color: '#333' },
  boxPlaceholder: { fontSize: sf(14), color: '#B5B5B5' },
  chevron: { width: s(14), height: s(14), resizeMode: 'contain', tintColor: '#999' },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: s(10),
    paddingHorizontal: s(14),
    paddingVertical: s(10),
  },
  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
    paddingVertical: s(6),
    borderRadius: s(16),
    backgroundColor: '#EAF4FB',
    maxWidth: s(110),
  },
  addressPillText: { fontSize: sf(12), color: '#333', marginRight: s(4) },
  amountRow: { flexDirection: 'row', alignItems: 'center' },
  unitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: s(10),
    paddingHorizontal: s(12),
    paddingVertical: s(12),
    minWidth: s(88),
    backgroundColor: '#fff',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: s(18),
    borderTopRightRadius: s(18),
    paddingHorizontal: s(20),
    paddingTop: s(16),
    paddingBottom: s(30),
    maxHeight: '60%',
  },
  sheetTitle: { fontSize: sf(15), fontWeight: '700', color: '#222', marginBottom: s(10) },
  option: {
    paddingVertical: s(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  optionText: { fontSize: sf(15), color: '#444' },
  optionTextActive: { color: ACCENT, fontWeight: '700' },
  submit: {
    backgroundColor: ACCENT,
    borderRadius: s(12),
    paddingVertical: s(15),
    alignItems: 'center',
    marginTop: s(10),
  },
  submitText: { color: '#fff', fontSize: sf(15), fontWeight: '700' },
});