import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const wp = p => (width * p) / 100;
const hp = p => (height * p) / 100;
const rf = s => (width / 375) * s;

const PlotFormTwoScreen = ({ navigation }) => {
  const [addMoreUnits, setAddMoreUnits] = useState(false);

  const InputBox = ({ label, placeholder, icon }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputBox}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#999"
          style={styles.input}
        />

        {icon && (
          <Image
            source={icon}
            style={styles.rightIcon}
          />
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
      />

      {/* Header */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}>

          <Image
            source={require('../../assets/icons/back.png')}
            style={styles.back}
          />

        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Plot
        </Text>

        <View style={{ width: 25 }} />

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: hp(5),
        }}>

        <Text style={styles.info}>
          Add details about the Builder floor to access it anytime
        </Text>

        <InputBox
          label="Address"
          placeholder="122 A, Malviya, Delhi"
          icon={require('../../assets/icons/location.png')}
        />

        <InputBox
          label="Name of Society"
          placeholder="Anand Colony"
        />

        {/* Area */}

        <View style={styles.doubleRow}>

          <View style={{ width: '47%' }}>
            <InputBox
              label="Area"
              placeholder="Sq.ft"
              icon={require('../../assets/icons/down_arrow.png')}
            />
          </View>

          <View style={{ width: '47%' }}>
            <InputBox
              label=""
              placeholder="Enter Area"
            />
          </View>

        </View>

        <InputBox
          label="Dimension"
          placeholder="Enter Units"
        />

        {/* Facing */}

        <View style={styles.doubleRow}>

          <View style={{ width: '47%' }}>
            <InputBox
              label="Facing Direction"
              placeholder="North"
              icon={require('../../assets/icons/down_arrow.png')}
            />
          </View>

          <View style={{ width: '47%' }}>
            <InputBox
              label="Over Looking"
              placeholder="Park"
              icon={require('../../assets/icons/down_arrow.png')}
            />
          </View>

        </View>

        {/* Side Open */}

        <View style={styles.doubleRow}>

          <View style={{ width: '47%' }}>
            <InputBox
              label="Sides Open"
              placeholder="1/2 Sides"
              icon={require('../../assets/icons/down_arrow.png')}
            />
          </View>

          <View style={{ width: '47%' }}>
            <InputBox
              label="Width of Road"
              placeholder="Feet/Meter"
              icon={require('../../assets/icons/down_arrow.png')}
            />
          </View>

        </View>

        {/* Category */}

        <View style={styles.doubleRow}>

          <View style={{ width: '47%' }}>
            <InputBox
              label="Category"
              placeholder="Manual Entry"
              icon={require('../../assets/icons/down_arrow.png')}
            />
          </View>

          <View style={{ width: '47%' }}>
            <InputBox
              label="Authority"
              placeholder="Manual Entry"
              icon={require('../../assets/icons/down_arrow.png')}
            />
          </View>

        </View>

        {/* Units */}

        <View style={styles.doubleRow}>

          <View style={{ width: '47%' }}>
            <InputBox
              label="Units Available"
              placeholder="Enter"
            />
          </View>

          <View style={{ width: '47%' }}>
            <InputBox
              label="Possession date"
              placeholder="Enter"
              icon={require('../../assets/icons/calendar.png')}
            />
          </View>

        </View>

        {/* Checkbox */}

        <TouchableOpacity
          style={styles.checkRow}
          onPress={() => setAddMoreUnits(!addMoreUnits)}>

          <View style={[
            styles.checkbox,
            addMoreUnits && styles.checkboxActive,
          ]} />

          <Text style={styles.checkText}>
            Add more Units
          </Text>

        </TouchableOpacity>
                {/* Asking Price */}

        <InputBox
          label="Asking Price"
          placeholder="₹ 21,00,000"
        />

        {/* Ownership */}

        <View style={styles.doubleRow}>

          <View style={{ width: '47%' }}>
            <InputBox
              label="Ownership Status"
              placeholder="Lease Hold"
              icon={require('../../assets/icons/down_arrow.png')}
            />
          </View>

          <View style={{ width: '47%' }}>
            <InputBox
              label=""
              placeholder="Enter Text"
            />
          </View>

        </View>

        {/* Land Status */}

        <InputBox
          label="Land Status"
          placeholder="122 A, Malviya, Delhi"
        />

        {/* Documents */}

        <View style={styles.doubleRow}>

          <View style={{ width: '47%' }}>
            <InputBox
              label="Documents"
              placeholder="Manual Entry"
              icon={require('../../assets/icons/down_arrow.png')}
            />
          </View>

          <View style={{ width: '47%' }}>
            <InputBox
              label="Certificates"
              placeholder="Manual Entry"
              icon={require('../../assets/icons/down_arrow.png')}
            />
          </View>

        </View>

        {/* Upload Fields */}

        <View style={styles.doubleRow}>

          <TouchableOpacity style={styles.uploadBox}>
            <Text style={styles.uploadLabel}>Gallery</Text>

            <View style={styles.uploadInner}>
              <Text style={styles.uploadText}>Upload</Text>

              <Image
                source={require('../../assets/icons/upload.png')}
                style={styles.uploadIcon}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadBox}>
            <Text style={styles.uploadLabel}>Document</Text>

            <View style={styles.uploadInner}>
              <Text style={styles.uploadText}>Upload</Text>

              <Image
                source={require('../../assets/icons/upload.png')}
                style={styles.uploadIcon}
              />
            </View>
          </TouchableOpacity>

        </View>

        <TouchableOpacity style={styles.uploadSingle}>
          <Text style={styles.uploadLabel}>Upload Layout</Text>

          <View style={styles.uploadInner}>
            <Text style={styles.uploadText}>Upload</Text>

            <Image
              source={require('../../assets/icons/upload.png')}
              style={styles.uploadIcon}
            />
          </View>
        </TouchableOpacity>

        {/* Submit */}

        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.85}>
          <Text style={styles.submitText}>
            Submit
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
};

export default PlotFormTwoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android'
      ? StatusBar.currentHeight
      : 0,
  },

  header: {
    height: hp(7),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
  },

  back: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
  },

  headerTitle: {
    fontSize: rf(18),
    fontWeight: '700',
    color: '#222',
  },

  info: {
    fontSize: rf(12),
    color: '#666',
    marginHorizontal: wp(5),
    marginBottom: hp(2),
  },

  inputContainer: {
    marginHorizontal: wp(5),
    marginBottom: hp(1.5),
  },

  label: {
    fontSize: rf(11),
    color: '#888',
    marginBottom: hp(0.5),
  },

  inputBox: {
    height: hp(5.5),
    borderWidth: 1,
    borderColor: '#D9E6F2',
    borderRadius: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    fontSize: rf(13),
    color: '#222',
  },

  rightIcon: {
    width: wp(4),
    height: wp(4),
    resizeMode: 'contain',
    tintColor: '#7AA9D8',
  },

  doubleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(5),
  },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(5),
    marginBottom: hp(2),
  },

  checkbox: {
    width: wp(4.5),
    height: wp(4.5),
    borderWidth: 1,
    borderColor: '#2E86C1',
    borderRadius: 4,
    marginRight: wp(2),
  },

  checkboxActive: {
    backgroundColor: '#2E86C1',
  },

  checkText: {
    fontSize: rf(12),
    color: '#444',
  },

  uploadBox: {
    width: '47%',
    marginBottom: hp(2),
  },

  uploadSingle: {
    marginHorizontal: wp(5),
    marginBottom: hp(3),
  },

  uploadLabel: {
    fontSize: rf(11),
    color: '#888',
    marginBottom: hp(0.5),
  },

  uploadInner: {
    height: hp(5.5),
    borderWidth: 1,
    borderColor: '#D9E6F2',
    borderRadius: wp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(3),
  },

  uploadText: {
    fontSize: rf(13),
    color: '#999',
  },

  uploadIcon: {
    width: wp(4.5),
    height: wp(4.5),
    resizeMode: 'contain',
    tintColor: '#7AA9D8',
  },

  submitBtn: {
    marginHorizontal: wp(5),
    height: hp(6),
    backgroundColor: '#4DA3D9',
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(2),
  },

  submitText: {
    color: '#fff',
    fontSize: rf(15),
    fontWeight: '700',
  },
});