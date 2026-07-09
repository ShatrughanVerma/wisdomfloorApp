import React, { useState, useMemo } from 'react';
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
// Responsive scaling helpers (kept identical to the other Apartment/Builder
// forms so every screen in the flow feels consistent).
// ---------------------------------------------------------------------------
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_WIDTH = 375;
const MAX_SCALE = 1.35;
const widthScale = Math.min(SCREEN_WIDTH / BASE_WIDTH, MAX_SCALE);

const scale = (size) => PixelRatio.roundToNearestPixel(size * widthScale);
const scaleFont = (size) => Math.round(PixelRatio.roundToNearestPixel(size * widthScale));

const ACCENT = '#2E8BCF';

const YES_NO_OPTIONS = ['Yes', 'No'];
const AGE_OPTIONS = ['New', '1-5 years', '5-10 years', '10+ years'];
const TYPE_OPTIONS = ['Duplex', 'Simplex', 'Triplex', 'Penthouse'];
const CERTIFICATE_OPTIONS = ['OC', 'CC', 'Both', 'None'];
const STATUS_OPTIONS = ['Recieved', 'Pending', 'Applied'];

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
  editable = true,
}) => (
  <View style={styles.fieldGroup}>
    {label ? <FieldLabel>{label}</FieldLabel> : null}
    <View style={[styles.input, !editable && styles.inputDisabled]}>
      <TextInput
        style={styles.inputText}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B5B5B5"
        keyboardType={keyboardType}
        editable={editable}
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

const LabeledDropdown = ({ label, labelComponent, value, options, onSelect, placeholder }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      {labelComponent || (label ? <FieldLabel>{label}</FieldLabel> : null)}
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

const AddLinkButton = ({ label, onPress }) => (
  <TouchableOpacity style={styles.addLink} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.addLinkIcon}>
      <Text style={styles.addLinkIconText}>+</Text>
    </View>
    <Text style={styles.addLinkText}>{label}</Text>
  </TouchableOpacity>
);

const SectionTitle = ({ children }) => <Text style={styles.sectionTitle}>{children}</Text>;

// A single amenity field: the amenity's own name acts as an editable label
// (blue text, tap to rename), with its Yes/No dropdown directly beneath —
// reuses LabeledDropdown's modal instead of duplicating it.
const AmenityField = ({ amenity, onChangeName, onChangeValue }) => (
  <LabeledDropdown
    label={amenity.name}
    labelComponent={
      <TextInput
        style={styles.amenityLabelInput}
        value={amenity.name}
        onChangeText={onChangeName}
        placeholder="Name"
        placeholderTextColor="#9DC6E3"
      />
    }
    value={amenity.value}
    options={YES_NO_OPTIONS}
    onSelect={onChangeValue}
  />
);

const ApartmentForm2Screen = ({ navigation }) => {
  const [address, setAddress] = useState('122 A, Moti Nagar, Delhi');
  const [projectName, setProjectName] = useState('Ram Krishna Society');

  // Tower / unit details
  const [towerNo, setTowerNo] = useState('');
  const [apartmentPerFloor, setApartmentPerFloor] = useState('');
  const [apartmentNo, setApartmentNo] = useState('');
  const [apartmentFloor, setApartmentFloor] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [toilets, setToilets] = useState('');
  const [uploadPlan, setUploadPlan] = useState(null);
  const [servantQuarter, setServantQuarter] = useState('Yes');
  const [studyRoom, setStudyRoom] = useState('Yes');
  const [balconies, setBalconies] = useState('2');
  const [superArea, setSuperArea] = useState('122');
  const [coveredArea, setCoveredArea] = useState('102');
  const [balconyArea, setBalconyArea] = useState('26');
  const [ageOfProperty, setAgeOfProperty] = useState('New');
  const [type, setType] = useState('Duplex');
  const [certificate, setCertificate] = useState('OC');
  const [status, setStatus] = useState('Recieved');

  // Pricing
  const [pricePerSqft, setPricePerSqft] = useState('20,000');
  const [otherCharges, setOtherCharges] = useState('2000');
  const [notes, setNotes] = useState('');

  // Uploads
  const [gallery, setGallery] = useState(null);
  const [brochure, setBrochure] = useState(null);
  const [document, setDocumentFile] = useState(null);
  const [layout, setLayout] = useState(null);

  // Amenities — dynamic list, starts with the four shown in the design.
  const [amenities, setAmenities] = useState([
    { id: 1, name: 'Pool', value: 'Yes' },
    { id: 2, name: '', value: 'Yes' },
    { id: 3, name: '', value: 'Yes' },
    { id: 4, name: '', value: 'Yes' },
  ]);

  const updateAmenity = (id, field, val) => {
    setAmenities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: val } : a))
    );
  };

  const addAmenity = () =>
    setAmenities((prev) => [...prev, { id: Date.now(), name: '', value: 'Yes' }]);

  // Auto-calculated total asking price = price/sq.ft * super area.
  const totalAskingPrice = useMemo(() => {
    const price = parseFloat(String(pricePerSqft).replace(/,/g, '')) || 0;
    const area = parseFloat(String(superArea).replace(/,/g, '')) || 0;
    const total = price * area;
    return total ? total.toLocaleString('en-IN') : '';
  }, [pricePerSqft, superArea]);

  const handleSubmit = () => {
    const payload = {
      address,
      projectName,
      towerDetails: {
        towerNo,
        apartmentPerFloor,
        apartmentNo,
        apartmentFloor,
        bedrooms,
        toilets,
        uploadPlan,
        servantQuarter,
        studyRoom,
        balconies,
        superArea,
        coveredArea,
        balconyArea,
        ageOfProperty,
        type,
        certificate,
        status,
      },
      pricePerSqft,
      otherCharges,
      totalAskingPrice,
      notes,
      gallery,
      brochure,
      document,
      layout,
      amenities,
    };
    console.log('Apartment form 2 payload:', payload);
    navigation.navigate('ApartmentScreen');
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
                Apartment
              </Text>
            </View>

            <View style={styles.headerRightPlaceholder} />
          </View>

          <Text style={styles.subtitle}>
            Add details about the Apartment to access it anytime
          </Text>

          <AddressInput
            value={address}
            onChangeText={setAddress}
            area="Moti Nagar"
            onPressPin={() => {}}
          />

          <LabeledInput
            label="Project/Society Name"
            value={projectName}
            onChangeText={setProjectName}
            placeholder="Enter project/society name"
          />

          <SectionTitle>Tower Details</SectionTitle>

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <LabeledInput
                label="Tower no"
                value={towerNo}
                onChangeText={setTowerNo}
                placeholder="Enter No."
                keyboardType="numeric"
              />
            </Col>
            <Col>
              <LabeledInput
                label="Apartment per floor"
                value={apartmentPerFloor}
                onChangeText={setApartmentPerFloor}
                placeholder="Enter No."
                keyboardType="numeric"
              />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(12) }}>
              <LabeledInput
                label="Apartment No."
                value={apartmentNo}
                onChangeText={setApartmentNo}
                placeholder="Enter No."
                keyboardType="numeric"
              />
            </Col>
            <Col>
              <LabeledInput
                label="Apartment's floor"
                value={apartmentFloor}
                onChangeText={setApartmentFloor}
                placeholder="Enter No."
                keyboardType="numeric"
              />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(10) }}>
              <LabeledInput
                label="No. of bedroom"
                value={bedrooms}
                onChangeText={setBedrooms}
                placeholder="Enter No."
                keyboardType="numeric"
              />
            </Col>
            <Col style={{ marginRight: scale(10) }}>
              <LabeledInput
                label="No. of Toilet"
                value={toilets}
                onChangeText={setToilets}
                placeholder="Enter No."
                keyboardType="numeric"
              />
            </Col>
            <Col>
              <UploadField label="Upload Plan" fileName={uploadPlan} onPress={() => {}} />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(10) }}>
              <LabeledDropdown
                label="Servant Quarter"
                value={servantQuarter}
                options={YES_NO_OPTIONS}
                onSelect={setServantQuarter}
              />
            </Col>
            <Col style={{ marginRight: scale(10) }}>
              <LabeledDropdown
                label="Study room"
                value={studyRoom}
                options={YES_NO_OPTIONS}
                onSelect={setStudyRoom}
              />
            </Col>
            <Col>
              <LabeledInput
                label="No. of balconies"
                value={balconies}
                onChangeText={setBalconies}
                keyboardType="numeric"
              />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(10) }}>
              <LabeledInput
                label="Super Area"
                value={superArea}
                onChangeText={setSuperArea}
                placeholder="Sq. ft"
                keyboardType="numeric"
              />
            </Col>
            <Col style={{ marginRight: scale(10) }}>
              <LabeledInput
                label="Covered Area"
                value={coveredArea}
                onChangeText={setCoveredArea}
                placeholder="Sq. ft"
                keyboardType="numeric"
              />
            </Col>
            <Col>
              <LabeledInput
                label="Balcony Area"
                value={balconyArea}
                onChangeText={setBalconyArea}
                placeholder="Sq. ft"
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
            <Col style={{ marginRight: scale(10) }}>
              <LabeledDropdown
                label="Type"
                value={type}
                options={TYPE_OPTIONS}
                onSelect={setType}
              />
            </Col>
            <Col style={{ marginRight: scale(10) }}>
              <LabeledDropdown
                label="Certificate"
                value={certificate}
                options={CERTIFICATE_OPTIONS}
                onSelect={setCertificate}
              />
            </Col>
            <Col>
              <LabeledDropdown
                label="Status"
                value={status}
                options={STATUS_OPTIONS}
                onSelect={setStatus}
              />
            </Col>
          </Row>

          <Row>
            <Col style={{ marginRight: scale(20) }}>
              <AddLinkButton label="Add more tower" onPress={() => {}} />
            </Col>
            <Col>
              <AddLinkButton label="Add more unit" onPress={() => {}} />
            </Col>
          </Row>

          <LabeledInput
            label="Price/Sq ft"
            value={pricePerSqft}
            onChangeText={setPricePerSqft}
            placeholder="₹ Enter amount"
            keyboardType="numeric"
          />

          <LabeledInput
            label="Other Charges"
            value={otherCharges}
            onChangeText={setOtherCharges}
            placeholder="₹ Enter amount"
            keyboardType="numeric"
          />

          <LabeledInput
            label="Total Asking Price (Auto Calculate)"
            value={totalAskingPrice}
            editable={false}
          />

          <LabeledTextArea
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Write here"
          />

          <Row>
            <Col style={{ marginRight: scale(10) }}>
              <UploadField label="Gallery" fileName={gallery} onPress={() => {}} />
            </Col>
            <Col style={{ marginRight: scale(10) }}>
              <UploadField label="Brochure" fileName={brochure} onPress={() => {}} />
            </Col>
            <Col>
              <UploadField label="Document" fileName={document} onPress={() => {}} />
            </Col>
          </Row>

          <UploadField label="Upload Layout" fileName={layout} onPress={() => {}} />

          <SectionTitle>Add Amenities</SectionTitle>

          <View style={styles.amenitiesGrid}>
            {amenities.map((amenity) => (
              <View key={amenity.id} style={styles.amenityGridItem}>
                <AmenityField
                  amenity={amenity}
                  onChangeName={(t) => updateAmenity(amenity.id, 'name', t)}
                  onChangeValue={(v) => updateAmenity(amenity.id, 'value', v)}
                />
              </View>
            ))}
          </View>

          <AddLinkButton label="Add amenities name" onPress={addAmenity} />

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

export default ApartmentForm2Screen;

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
    paddingVertical: scale(1),
    marginBottom: scale(4),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    minHeight: scale(30),
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
    marginTop:'-12',
  },

  headerTitleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: scaleFont(20),
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    flexShrink: 1,
    marginTop:'-19',
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

  sectionTitle: {
    fontSize: scaleFont(15),
    fontWeight: '700',
    color: '#222',
    marginBottom: scale(12),
    marginTop: scale(4),
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

  inputDisabled: {
    backgroundColor: '#F7F7F7',
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

  amenityLabelInput: {
    fontSize: scaleFont(13),
    color: ACCENT,
    marginBottom: scale(6),
    padding: 0,
  },

  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  amenityGridItem: {
    width: '48%',
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