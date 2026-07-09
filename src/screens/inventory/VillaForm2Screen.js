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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scaleFactor = Math.min(SCREEN_WIDTH / 375, 1.35);
const s = n => PixelRatio.roundToNearestPixel(n * scaleFactor);
const sf = n => Math.round(s(n));
const ACCENT = '#2E8BCF';
const ERROR_COLOR = '#E74C3C';
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

// ---------------------------------------------------------------------------
// Regex patterns
// ---------------------------------------------------------------------------
const ADDRESS_REGEX = /^.{5,200}$/s; // 5-200 chars
const TEXT_REGEX = /^.{2,50}$/s; // generic free text, 2-50 chars
const WHOLE_NUMBER_REGEX = /^\d{1,5}$/; // e.g. width of road
const DECIMAL_NUMBER_REGEX = /^\d{1,9}(\.\d{1,2})?$/; // area, price - allows decimals
const DIMENSIONS_REGEX = /^\d+(\.\d+)?\s*[xX*]\s*\d+(\.\d+)?$/; // e.g. "30x40" or "30*40"

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
const validateRequired = (value, label) => {
  if (!value || !String(value).trim()) return `${label} is required`;
  return '';
};

const validateAddress = value => {
  if (!value || !value.trim()) return 'Address is required';
  if (!ADDRESS_REGEX.test(value.trim())) return 'Address must be 5-200 characters';
  return '';
};

const validateText = (value, label) => {
  const req = validateRequired(value, label);
  if (req) return req;
  if (!TEXT_REGEX.test(String(value).trim())) return `Enter a valid ${label.toLowerCase()}`;
  return '';
};

const validateWholeNumber = (value, label) => {
  const req = validateRequired(value, label);
  if (req) return req;
  if (!WHOLE_NUMBER_REGEX.test(String(value).trim())) return `Enter a valid number for ${label.toLowerCase()}`;
  return '';
};

const validateDecimalNumber = (value, label) => {
  const req = validateRequired(value, label);
  if (req) return req;
  if (!DECIMAL_NUMBER_REGEX.test(String(value).trim().replace(/,/g, ''))) {
    return `Enter a valid number for ${label.toLowerCase()}`;
  }
  return '';
};

const validateDimensions = value => {
  const req = validateRequired(value, 'Dimensions');
  if (req) return req;
  if (!DIMENSIONS_REGEX.test(String(value).trim())) return 'Use format like 30x40 or 30*40';
  return '';
};

// Picker sheet shared by every dropdown-style field.
const OptionSheet = ({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <TouchableOpacity
      style={styles.backdrop}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>{title || 'Select'}</Text>
        <FlatList
          data={options}
          keyExtractor={i => i}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  item === selected && styles.optionTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </TouchableOpacity>
  </Modal>
);

// One component renders every field type this form needs: text, dropdown,
// upload, and an amount field with a docked unit dropdown.
const Field = ({ field, value, onChange, onBlur, error }) => {
  const [open, setOpen] = useState(false);
  const {
    type,
    label,
    placeholder,
    keyboardType,
    options,
    unit,
    onUnitChange,
    unitOptions,
  } = field;

  if (type === 'text') {
    return (
      <View style={styles.group}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View style={[styles.box, error && styles.boxErrorBorder]}>
          <TextInput
            style={styles.boxText}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor="#B5B5B5"
            keyboardType={keyboardType}
          />
        </View>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  if (type === 'upload') {
    return (
      <View style={styles.group}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={styles.box}
          activeOpacity={0.7}
          onPress={() => {}}
        >
          <Text style={value ? styles.boxValue : styles.boxPlaceholder}>
            {value || 'Upload'}
          </Text>
          <Image source={icon('upload')} style={styles.chevron} />
        </TouchableOpacity>
      </View>
    );
  }

  if (type === 'amount') {
    return (
      <View style={styles.group}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View style={styles.amountRow}>
          <View style={[styles.box, { flex: 1, marginRight: s(10) }, error && styles.boxErrorBorder]}>
            <TextInput
              style={styles.boxText}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              placeholderTextColor="#B5B5B5"
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity
            style={styles.unitPill}
            activeOpacity={0.7}
            onPress={() => setOpen(true)}
          >
            <Text style={styles.boxValue} numberOfLines={1}>
              {unit}
            </Text>
            <Image source={icon('down_arrow')} style={styles.chevron} />
          </TouchableOpacity>
        </View>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
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

  // dropdown (default)
  return (
    <View style={styles.group}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={styles.box}
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
      >
        <Text style={value ? styles.boxValue : styles.boxPlaceholder}>
          {value || placeholder || 'Select'}
        </Text>
        <Image source={icon('down_arrow')} style={styles.chevron} />
      </TouchableOpacity>
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

// Form layout: each entry is one row; each row holds 1-2 fields, laid side
// by side when there are two. `key` maps to state, so adding/removing a
// field only means editing this list. Text/amount fields carry a `validate`
// function; dropdowns are skipped since they always hold a default value.
const useFormRows = (state, setField) => [
  [
    {
      key: 'dimensions',
      type: 'text',
      label: 'Dimensions',
      placeholder: 'Enter Units',
      validate: v => validateDimensions(v),
    },
  ],
  [
    {
      key: 'facingDirection',
      label: 'Facing Direction',
      options: ['Plot', 'North', 'South', 'East', 'West'],
    },
    {
      key: 'overLooking',
      type: 'text',
      label: 'Over Looking',
      placeholder: 'Enter',
      validate: v => validateText(v, 'Over looking'),
    },
  ],
  [
    {
      key: 'sidesOpen',
      label: 'Sides Open',
      options: ['1 Side', '2 Side', '3 Side', '1/2 Sidecorner', '4 Side'],
    },
    {
      key: 'widthOfRoad',
      type: 'text',
      label: 'Width of Road',
      placeholder: 'Feet/ Meter',
      keyboardType: 'numeric',
      validate: v => validateWholeNumber(v, 'Width of road'),
    },
  ],
  [
    {
      key: 'askingPrice',
      type: 'amount',
      label: 'Asking Price',
      placeholder: '₹ Enter amount',
      unit: state.priceUnit,
      onUnitChange: v => setField('priceUnit', v),
      unitOptions: ['Sq mt.', 'Sq ft.', 'Acre'],
      validate: v => validateDecimalNumber(v, 'Asking price'),
    },
  ],
  [
    {
      key: 'category',
      label: 'Category',
      placeholder: 'Enter',
      options: ['Residential', 'Commercial', 'Agricultural', 'Industrial'],
    },
    {
      key: 'authority',
      type: 'text',
      label: 'Authority',
      placeholder: 'Enter',
      validate: v => validateText(v, 'Authority'),
    },
  ],
  [
    {
      key: 'status',
      label: 'Status',
      options: ['Ready to move', 'Under Construction', 'New Launch'],
    },
  ],
  [
    { key: 'areaUnit', label: 'Area', options: ['Sq ft', 'Sq mt', 'Acre'] },
    {
      key: 'areaValue',
      type: 'text',
      label: ' ',
      placeholder: 'Enter Area',
      keyboardType: 'numeric',
      validate: v => validateDecimalNumber(v, 'Area'),
    },
  ],
  [
    {
      key: 'documents',
      type: 'text',
      label: 'Documents',
      placeholder: 'Manual Entry',
    },
    {
      key: 'certificates',
      type: 'text',
      label: 'Certificates',
      placeholder: 'Manual Entry',
    },
  ],
  [
    { key: 'gallery', type: 'upload', label: 'Gallery' },
    { key: 'document', type: 'upload', label: 'Document' },
  ],
];

const VillaForm2Screen = ({ navigation }) => {
  const [address, setAddress] = useState('122 A, Moti Nagar, Delhi');
  const [state, setState] = useState({
    dimensions: '',
    facingDirection: 'Plot',
    overLooking: '',
    sidesOpen: '1/2 Sidecorner',
    widthOfRoad: '',
    askingPrice: '21,00,000',
    priceUnit: 'Sq mt.',
    category: '',
    authority: '',
    status: 'Ready to move',
    areaUnit: 'Sq ft',
    areaValue: '',
    documents: '',
    certificates: '',
    gallery: null,
    document: null,
  });
  const setField = (key, value) =>
    setState(prev => ({ ...prev, [key]: value }));

  const rows = useFormRows(state, setField);

  // ---- Error state, one per validated field ----
  const [errors, setErrors] = useState({});

  const setFieldError = (key, message) =>
    setErrors(prev => ({ ...prev, [key]: message }));

  const clearFieldErrorIfSet = key => {
    setErrors(prev => (prev[key] ? { ...prev, [key]: '' } : prev));
  };

  const handleChange = (field, v) => {
    setField(field.key, v);
    if (field.validate) clearFieldErrorIfSet(field.key);
  };

  const handleBlur = field => {
    if (field.validate) setFieldError(field.key, field.validate(state[field.key]));
  };

  const handleSubmit = () => {
    const newErrors = { address: validateAddress(address) };

    rows.forEach(row => {
      row.forEach(field => {
        if (field.validate) newErrors[field.key] = field.validate(state[field.key]);
      });
    });

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(msg => !!msg);
    if (hasError) return;

    console.log('Villa form 2 payload:', { address, ...state });
    navigation.navigate('VillaScreen');
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
            <Text style={styles.headerTitle}>Villa</Text>
            <View style={{ width: s(24) }} />
          </View>

          <Text style={styles.subtitle}>
            Add details about the builder floor to access it anytime
          </Text>

          <View style={styles.group}>
            <Text style={styles.label}>Address</Text>
            <View style={[styles.addressRow, errors.address && styles.boxErrorBorder]}>
              <TextInput
                style={[styles.boxText, { marginRight: s(8) }]}
                value={address}
                onChangeText={t => {
                  setAddress(t);
                  clearFieldErrorIfSet('address');
                }}
                onBlur={() => setFieldError('address', validateAddress(address))}
                placeholder="Enter address"
                placeholderTextColor="#B5B5B5"
              />
              <View style={styles.addressPill}>
                <Text style={styles.addressPillText} numberOfLines={1}>
                  Moti Nagar
                </Text>
                <Image
                  source={icon('location_icon')}
                  style={[styles.chevron, { tintColor: ACCENT }]}
                />
              </View>
            </View>
            {!!errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
          </View>

          {rows.map((row, i) => (
            <View key={i} style={row.length > 1 ? styles.row : undefined}>
              {row.map((field, idx) => (
                <View
                  key={field.key}
                  style={
                    row.length > 1
                      ? [styles.col, idx === 0 && { marginRight: s(12) }]
                      : undefined
                  }
                >
                  <Field
                    field={field}
                    value={state[field.key]}
                    onChange={v => handleChange(field, v)}
                    onBlur={() => handleBlur(field)}
                    error={errors[field.key]}
                  />
                </View>
              ))}
            </View>
          ))}

          <TouchableOpacity
            style={styles.submit}
            activeOpacity={0.85}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VillaForm2Screen;

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
  backIcon: {
    width: s(20),
    height: s(20),
    resizeMode: 'contain',
    tintColor: '#222',
  },
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
  boxErrorBorder: { borderColor: ERROR_COLOR },
  errorText: { fontSize: sf(12), color: ERROR_COLOR, marginTop: s(4) },
  boxText: { flex: 1, fontSize: sf(14), color: '#333', padding: 0 },
  boxValue: { fontSize: sf(14), color: '#333' },
  boxPlaceholder: { fontSize: sf(14), color: '#B5B5B5' },
  chevron: {
    width: s(14),
    height: s(14),
    resizeMode: 'contain',
    tintColor: '#999',
  },

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
  sheetTitle: {
    fontSize: sf(15),
    fontWeight: '700',
    color: '#222',
    marginBottom: s(10),
  },
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