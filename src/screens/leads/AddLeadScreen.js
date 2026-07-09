import React, { useState, useRef } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  PanResponder,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const wp = (p) => (width * p) / 100;
const hp = (p) => (height * p) / 100;
const rf = (size) => size * (width / 375);

// ─── Floating-label wrapper ────────────────────────────────────────────────────
const FieldWrapper = ({ label, children, style }) => (
  <View style={[styles.fieldWrapper, style]}>
    <Text style={styles.floatingLabel}>{label}</Text>
    {children}
  </View>
);

// ─── Reusable dropdown field ──────────────────────────────────────────────────
const DropdownField = ({ label, value, placeholder, style }) => (
  <FieldWrapper label={label} style={style}>
    <TouchableOpacity style={styles.dropdownBox} activeOpacity={0.7}>
      <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
        {value || placeholder}
      </Text>
      <Image
        source={require('../../assets/icons/down_arrow.png')}
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  </FieldWrapper>
);

// ─── Simple range slider ──────────────────────────────────────────────────────
const BudgetSlider = ({ value, min = 0, max = 500, onChange }) => {
  const trackRef = useRef(null);
  const trackX = useRef(0);
  const trackWidth = useRef(0);

  const [pressed, setPressed] = useState(false);
  const thumbScale = useRef(new Animated.Value(1)).current;

  const percent = Math.max(0, Math.min(1, (value - min) / (max - min)));

  const updateFromTouch = (pageX) => {
    if (trackWidth.current <= 0) return;
    const x = Math.max(0, Math.min(trackWidth.current, pageX - trackX.current));
    const newPercent = x / trackWidth.current;
    const newValue = Math.round((min + newPercent * (max - min)) / 5) * 5;
    onChange(Math.max(min, Math.min(max, newValue)));
  };

  const animateThumb = (toValue) => {
    Animated.spring(thumbScale, {
      toValue,
      useNativeDriver: true,
      friction: 5,
      tension: 120,
    }).start();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      setPressed(true);
      animateThumb(1.5);
      updateFromTouch(evt.nativeEvent.pageX);
    },
    onPanResponderMove: (evt, gestureState) => {
      updateFromTouch(gestureState.moveX);
    },
    onPanResponderRelease: () => {
      setPressed(false);
      animateThumb(1);
    },
    onPanResponderTerminate: () => {
      setPressed(false);
      animateThumb(1);
    },
  });

  return (
    <View style={styles.sliderRow}>
      <View
        ref={trackRef}
        style={styles.sliderTrackWrapper}
        {...panResponder.panHandlers}
        onLayout={() => {
          trackRef.current?.measure((fx, fy, w, h, pageX) => {
            trackWidth.current = w;
            trackX.current = pageX;
          });
        }}
      >
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${percent * 100}%` }]} />
        </View>

        <Animated.View
          style={[
            styles.sliderThumb,
            { left: `${percent * 100}%`, transform: [{ scale: thumbScale }] },
            pressed && styles.sliderThumbActive,
          ]}
        />
      </View>
      <Text style={styles.sliderValue}>₹{value} Cr</Text>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const AddNewLeadScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    leadDirection: 'Outbound',
    category: 'Residential Rent',
    source: '',
    name: '',
    contactNo: '',
    preferredLocation: '122 A, Moti Nagar, Delhi',
    locationTag: 'Moti Nagar',
    propertyType: 'Society',
    floorPreference: '',
    bhk: 3,
    area: '',
    areaUnit: 'Sqft',
    budget: 100,
  });

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── HEADER ── */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
              activeOpacity={0.7}
              style={styles.backBtn}
            >
              <Image
                source={require('../../assets/icons/back.png')}
                style={styles.backIcon}
              />
            </TouchableOpacity>

            <Text style={styles.header}>Add New Lead</Text>
            <View style={{ width: wp(9) }} />
          </View>

          {/* ── LEAD DIRECTION ── */}
          <DropdownField label="Lead Direction" value={formData.leadDirection} />

          {/* ── CATEGORY + SOURCE ── */}
          <View style={styles.row}>
            <DropdownField
              label="Category"
              value={formData.category}
              style={styles.half}
            />
            <DropdownField
              label="Source"
              value={formData.source}
              placeholder="Select Source"
              style={styles.half}
            />
          </View>

          {/* ── NAME + CONTACT ── */}
          <View style={styles.row}>
            <FieldWrapper label="Name" style={styles.half}>
              <TextInput
                style={styles.input}
                placeholder="Enter Name"
                placeholderTextColor="#bbb"
                onChangeText={(text) => handleInputChange('name', text)}
              />
            </FieldWrapper>

            <FieldWrapper label="Contact No." style={styles.half}>
              <TextInput
                style={styles.input}
                placeholder="Enter Contact"
                placeholderTextColor="#bbb"
                keyboardType="phone-pad"
                onChangeText={(text) => handleInputChange('contactNo', text)}
              />
            </FieldWrapper>
          </View>

          {/* ── SECTION HEADING ── */}
          <Text style={styles.section}>Requirements</Text>

          {/* ── LOCATION + TAG ── */}
          <View style={styles.row}>
            <FieldWrapper label="Preferred Location" style={styles.locationField}>
              <TextInput
                style={styles.input}
                value={formData.preferredLocation}
                onChangeText={(text) =>
                  handleInputChange('preferredLocation', text)
                }
              />
            </FieldWrapper>

            <View style={styles.tagPill}>
              <Text style={styles.tagPillText}>{formData.locationTag}</Text>
            </View>
          </View>

          {/* ── PROPERTY TYPE + FLOOR ── */}
          <View style={styles.row}>
            <DropdownField
              label="Property Type"
              value={formData.propertyType}
              style={styles.half}
            />

            <FieldWrapper label="Floor Preference" style={styles.half}>
              <TextInput
                style={styles.input}
                placeholder="Enter Floor"
                placeholderTextColor="#bbb"
                onChangeText={(text) =>
                  handleInputChange('floorPreference', text)
                }
              />
            </FieldWrapper>
          </View>

          {/* ── BHK + AREA ── */}
          <View style={styles.row}>
            <FieldWrapper label="BHK" style={styles.half}>
              <View style={styles.bhkBox}>
                <TouchableOpacity
                  onPress={() =>
                    handleInputChange('bhk', Math.max(1, formData.bhk - 1))
                  }
                >
                  <Text style={styles.bhkBtn}>−</Text>
                </TouchableOpacity>

                <Text style={styles.bhkValue}>{formData.bhk}</Text>

                <TouchableOpacity
                  onPress={() => handleInputChange('bhk', formData.bhk + 1)}
                >
                  <Text style={styles.bhkBtn}>+</Text>
                </TouchableOpacity>
              </View>
            </FieldWrapper>

            <FieldWrapper label="Area" style={styles.half}>
              <View style={styles.areaBox}>
                <TextInput
                  style={styles.areaInput}
                  placeholder="Enter Area"
                  placeholderTextColor="#bbb"
                  keyboardType="numeric"
                  onChangeText={(text) => handleInputChange('area', text)}
                />
                <TouchableOpacity style={styles.areaUnitBtn} activeOpacity={0.7}>
                  <Text style={styles.areaUnitText}>{formData.areaUnit}</Text>
                  <Image
                    source={require('../../assets/icons/down_arrow.png')}
                    style={styles.arrowIcon}
                  />
                </TouchableOpacity>
              </View>
            </FieldWrapper>
          </View>

          {/* ── BUDGET (SLIDER) ── */}
          <FieldWrapper label="Budget" style={{ marginTop: hp(1) }}>
            <BudgetSlider
              value={formData.budget}
              min={0}
              max={500}
              onChange={(v) => handleInputChange('budget', v)}
            />
          </FieldWrapper>

          {/* ── SAVE BUTTON ── */}
          <TouchableOpacity style={styles.button} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddNewLeadScreen;

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scrollContainer: {
    paddingHorizontal: wp(5),
    paddingTop: hp(3),
    paddingBottom: hp(10),
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(3),
    marginTop: hp(1),
  },

  backBtn: {
    width: wp(9),
    height: wp(9),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(2),
  },

  backIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
  },

  header: {
    fontSize: rf(20),
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: 0.3,
  },

  section: {
    fontSize: rf(16),
    fontWeight: '700',
    color: '#1a1a2e',
    marginTop: hp(2.5),
    marginBottom: hp(1.5),
  },

  fieldWrapper: {
    marginTop: hp(1.6),
    position: 'relative',
  },

  floatingLabel: {
    position: 'absolute',
    top: -hp(0.9),
    left: wp(3),
    zIndex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: wp(1),
    fontSize: rf(10),
    fontWeight: '600',
    color: '#4C97C8',
    letterSpacing: 0.2,
  },

  input: {
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: wp(2.5),
    paddingVertical: hp(1.6),
    paddingHorizontal: wp(3.5),
    fontSize: rf(13),
    color: '#222',
    backgroundColor: '#fff',
  },

  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: wp(2.5),
    paddingVertical: hp(1.6),
    paddingHorizontal: wp(3.5),
    backgroundColor: '#fff',
  },

  dropdownText: {
    flex: 1,
    fontSize: rf(13),
    color: '#222',
    fontWeight: '500',
  },

  placeholderText: {
    color: '#bbb',
    fontWeight: '400',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  half: {
    width: '48%',
  },

  locationField: {
    flex: 1,
    marginRight: wp(2.5),
  },

  tagPill: {
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1.6),
    borderRadius: wp(2.5),
    borderWidth: 1,
    borderColor: '#e2e2e2',
    backgroundColor: '#fafafa',
  },

  tagPillText: {
    fontSize: rf(12),
    color: '#888',
    fontWeight: '500',
  },

  bhkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: wp(2.5),
    paddingVertical: hp(1.3),
    paddingHorizontal: wp(3),
    backgroundColor: '#fff',
  },

  bhkBtn: {
    fontSize: rf(20),
    fontWeight: '700',
    color: '#4A97C8',
    lineHeight: rf(22),
    width: wp(6),
    textAlign: 'center',
  },

  bhkValue: {
    fontSize: rf(14),
    fontWeight: '600',
    color: '#222',
  },

  areaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: wp(2.5),
    backgroundColor: '#fff',
    overflow: 'hidden',
  },

  areaInput: {
    flex: 1,
    paddingVertical: hp(1.6),
    paddingHorizontal: wp(3.5),
    fontSize: rf(13),
    color: '#222',
  },

  areaUnitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(1.6),
    borderLeftWidth: 1,
    borderLeftColor: '#e2e2e2',
  },

  areaUnitText: {
    fontSize: rf(11),
    color: '#4A97C8',
    fontWeight: '600',
  },

  arrowIcon: {
    width: wp(3.5),
    height: wp(3.5),
    resizeMode: 'contain',
    tintColor: '#4A97C8',
  },

  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.6),
    paddingHorizontal: wp(3.5),
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: wp(2.5),
    backgroundColor: '#fff',
  },

  sliderTrackWrapper: {
    flex: 1,
    height: hp(4),
    justifyContent: 'center',
    marginRight: wp(3),
  },

  sliderTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: '#e2e2e2',
    overflow: 'hidden',
  },

  sliderFill: {
    height: '100%',
    backgroundColor: '#4A97C8',
    borderRadius: 2,
  },

  sliderThumb: {
    position: 'absolute',
    width: wp(4.5),
    height: wp(4.5),
    borderRadius: wp(2.25),
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4A97C8',
    marginLeft: -wp(2.25),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },

  sliderThumbActive: {
    borderColor: '#3A8FA3',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  sliderValue: {
    fontSize: rf(13),
    fontWeight: '700',
    color: '#222',
    minWidth: wp(14),
    textAlign: 'right',
  },

  button: {
    backgroundColor: '#4A97C8',
    paddingVertical: hp(1.9),
    borderRadius: wp(3),
    marginTop: hp(10),
    alignItems: 'center',
    shadowColor: '#4A97C8',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  buttonText: {
    color: '#fff',
    fontSize: rf(15),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});