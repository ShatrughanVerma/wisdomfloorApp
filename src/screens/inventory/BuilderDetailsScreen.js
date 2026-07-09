import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  PixelRatio,
  Platform,
} from 'react-native';

// ---------------------------------------------------------------------------
// Responsive scaling helpers
// All sizes below are authored against a 375pt-wide design (standard phone
// baseline) and then scaled to the actual device width, so the layout holds
// its proportions on small phones, large phones, and tablets alike.
// Sizes are clamped so things don't balloon on wide/tablet screens.
// ---------------------------------------------------------------------------
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BASE_WIDTH = 375;
const MAX_SCALE = 1.35;
const widthScale = Math.min(SCREEN_WIDTH / BASE_WIDTH, MAX_SCALE);

const scale = (size) => PixelRatio.roundToNearestPixel(size * widthScale);
const scaleFont = (size) => Math.round(PixelRatio.roundToNearestPixel(size * widthScale));
const isTablet = SCREEN_WIDTH >= 768;

// ---------------------------------------------------------------------------
// Static section data lives outside the component so it isn't recreated
// (and can't accidentally be duplicated) on every render.
// ---------------------------------------------------------------------------
const FLOOR_DATA = [
  { label: 'Total Floors', value: '10' },
  { label: 'Floor Available', value: '5' },
  { label: 'Area', value: '1,200 sq. ft' },
];

const ROOM_DATA = [
  { label: 'Furnished', value: 'Semi' },
  { label: 'Side Opens', value: '2 Sides' },
  { label: 'Facing', value: 'North' },
  { label: 'Over Looking', value: 'Park' },
  { label: 'Width of Road', value: '12 Feet' },
  { label: 'Bedrooms', value: '3' },
  { label: 'Bathtubs', value: '2' },
];

const STATUS_DATA = [
  { label: 'Age', value: 'New' },
  { label: 'Status', value: 'Vacant' },
];

const FINANCE_DATA = [
  { label: 'Monthly Rent', value: '10,000' },
  { label: 'Security Deposit', value: '20,000' },
  { label: 'Maintenance', value: '5,000' },
];

const AMENITIES_DATA = [
  { label: 'Servant Quarter', value: 'Yes' },
  { label: 'Parking', value: 'Yes' },
  { label: 'Lift', value: 'Yes' },
];

// A single, reusable "detail row" — defined once, used by every section.
const DetailRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.leftText}>{label}</Text>
    <Text style={styles.rightText}>{value}</Text>
  </View>
);

// A single, reusable "section card" — this is the ONLY place that renders
// a section title + its rows, so no section can ever be accidentally
// rendered twice by copy-pasted JSX.
const DetailSection = ({ title, data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {data.map((item, index) => (
      <DetailRow key={`${title}-${index}`} label={item.label} value={item.value} />
    ))}
  </View>
);

// Ordered list of every section to render. To add/remove/reorder a
// section, edit this array only — there is nowhere else in the JSX that
// can introduce a duplicate.
const SECTIONS = [
  { title: 'Floors & Areas', data: FLOOR_DATA },
  { title: 'Room Details', data: ROOM_DATA },
  { title: 'Status', data: STATUS_DATA },
  { title: 'Finance', data: FINANCE_DATA },
  { title: 'Amenities', data: AMENITIES_DATA },
];

const BuilderDetailsScreen = ({ navigation }) => {
  const galleryImages = [
    require('../../assets/images/property1.png'),
    require('../../assets/images/property2.png'),
    require('../../assets/images/property3.png'),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/rajauri.png')}
            style={styles.mainImage}
          />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={require('../../assets/icons/back.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>

          {/* Gallery — overlaid on the header image itself, pinned to
              its bottom edge, instead of sitting below as a separate row. */}
          <FlatList
            horizontal
            data={galleryImages}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryContainer}
            style={styles.galleryOverlay}
            renderItem={({ item }) => (
              <Image source={item} style={styles.galleryImage} />
            )}
          />
        </View>

        {/* Property Info */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={2}>
                Rajouri Garden
              </Text>

              <Text style={styles.location} numberOfLines={2}>
                122/A block, Rajouri Garden
              </Text>
            </View>

            <Text style={styles.price} numberOfLines={1} adjustsFontSizeToFit>
              ₹1,00,000
            </Text>
          </View>
        </View>

        {/* All detail sections — driven entirely by the SECTIONS array
            above, so each one renders exactly once. */}
        {SECTIONS.map((section) => (
          <DetailSection
            key={section.title}
            title={section.title}
            data={section.data}
          />
        ))}

        {/* Bottom Space — clears the floating buttons */}
        <View style={{ height: scale(100) }} />
      </ScrollView>

      {/* Floating Buttons */}
      <View style={styles.floatingContainer}>
        <TouchableOpacity style={styles.floatingButton}>
          <Image
            source={require('../../assets/icons/share.png')}
            style={styles.floatingIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.floatingButton, { marginLeft: scale(12) }]}>
          <Image
            source={require('../../assets/icons/location.png')}
            style={styles.floatingIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BuilderDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  imageContainer: {
    // Hero height tracks screen height too, so it doesn't dominate on
    // short devices or shrink to nothing on tall ones.
    height: Math.min(SCREEN_HEIGHT * 0.32, scale(280)),
    overflow: 'hidden',
    borderBottomLeftRadius: scale(30),
    borderBottomRightRadius: scale(30),
  },

  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? scale(45) : scale(30),
    left: scale(18),
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    // Removed background color
    justifyContent: 'center',
    alignItems: 'left',
    
  },

  backIcon: {
    width: scale(18),
    height: scale(18),
    tintColor: '#fff',
    resizeMode: 'contain',
    marginBottom:'15',
  },

  galleryOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: scale(0),
  },

  galleryContainer: {
    paddingHorizontal: scale(50),
  },

  galleryImage: {
    width: scale(78),
    height: scale(80),
    borderRadius: scale(10),
    marginRight: scale(10),
    borderWidth: 2,
    borderColor: '#fff',

    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 6,
  },

  infoContainer: {
    paddingHorizontal: scale(20),
    marginTop: scale(15),
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: scaleFont(22),
    fontWeight: '700',
    color: '#222',
  },

  location: {
    marginTop: scale(4),
    fontSize: scaleFont(13),
    color: '#888',
  },

  price: {
    fontSize: scaleFont(24),
    fontWeight: '700',
    color: '#2E8BCF',
    marginLeft: scale(10),
  },

  section: {
    backgroundColor: '#fff',
    marginHorizontal: scale(15),
    marginTop: scale(15),
    padding: scale(18),
    borderRadius: scale(12),
    // Cap section width on tablets so rows don't stretch edge to edge.
    ...(isTablet ? { maxWidth: 700, alignSelf: 'center', width: '100%' } : {}),

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    color: '#222',
    marginBottom: scale(15),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(8),
  },

  leftText: {
    fontSize: scaleFont(14),
    color: '#8A8A8A',
  },

  rightText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#555',
  },

  floatingContainer: {
    position: 'absolute',
    right: scale(20),
    bottom: scale(25),
    flexDirection: 'row',
  },

  floatingButton: {
    width: scale(52),
    height: scale(52),
    borderRadius: scale(26),
    backgroundColor: '#2E8BCF',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 8,
  },

  floatingIcon: {
    width: scale(24),
    height: scale(24),
    tintColor: '#fff',
    resizeMode: 'contain',
  },
});