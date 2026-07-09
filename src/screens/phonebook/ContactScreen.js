import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  useWindowDimensions,
  PixelRatio,
  Platform,
  StatusBar,
} from 'react-native';

// ---- PNG icon imports ----
// Adjust these relative paths based on where this file lives.
// Example assumes: src/screens/contactDetails/ContactDetailsScreen.js
// and icons live in: src/assets/icons/
const icons = {
  back: require('../../assets/icons/back.png'),
  call: require('../../assets/icons/call.png'),
  whatsapp: require('../../assets/icons/whatsapp.png'),
  bed: require('../../assets/icons/bed.png'),
  bath: require('../../assets/icons/plot.png'),
  area: require('../../assets/icons/area.png'),
  owner: require('../../assets/icons/apartment.png'),
  price: require('../../assets/icons/cash.png'),
};

// ---- Responsive scaling helpers ----
const GUIDELINE_BASE_WIDTH = 375;
const GUIDELINE_BASE_HEIGHT = 812;

function useResponsiveScale() {
  const { width, height, fontScale } = useWindowDimensions();

  const scale = (size) => (width / GUIDELINE_BASE_WIDTH) * size;
  const verticalScale = (size) => (height / GUIDELINE_BASE_HEIGHT) * size;
  const moderateScale = (size, factor = 0.5) =>
    size + (scale(size) - size) * factor;
  const fontSize = (size) => {
    const scaled = moderateScale(size);
    const capped = Math.min(scaled * fontScale, scaled * 1.3);
    return PixelRatio.roundToNearestPixel(capped);
  };

  return { width, height, scale, verticalScale, moderateScale, fontSize };
}

// ---- Dummy data (replace with API data / navigation params) ----
const CONTACT = {
  name: 'Subhash Singh',
  role: 'Broker',
  initial: 'S',
};

const INVENTORY = [
  {
    id: '1',
    title: 'Rajouri Garden',
    beds: 3,
    baths: 3,
    sqft: 123,
    owner: 'Mr Anand',
    price: '20,000',
    image: require('../../assets/images/rajauri.png'),
  },
  {
    id: '2',
    title: 'Rajouri Garden',
    beds: 3,
    baths: 3,
    sqft: 123,
    owner: 'Mr Anand',
    price: '20,000',
    image: require('../../assets/images/rajauri.png'),
  },
  {
    id: '3',
    title: 'Rajouri Garden',
    beds: 3,
    baths: 3,
    sqft: 123,
    owner: 'Mr Anand',
    price: '20,000',
    image: require('../../assets/images/rajauri.png'),
  },
];

export default function ContactScreen({ navigation }) {
  const { width, moderateScale, fontSize } = useResponsiveScale();
  const styles = createStyles({ moderateScale, fontSize });
  const isTablet = width >= 768;

  const renderProperty = ({ item }) => (
    <TouchableOpacity style={styles.propertyCard} activeOpacity={0.8}>
      <Image source={item.image} style={styles.propertyImage} resizeMode="cover" />

      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle}>{item.title}</Text>

        <View style={styles.propertyStatsRow}>
          <View style={styles.statItem}>
            <Image source={icons.bed} style={styles.statIcon} resizeMode="contain" />
            <Text style={styles.statText}>{item.beds} Bed</Text>
          </View>
          <View style={styles.statItem}>
            <Image source={icons.bath} style={styles.statIcon} resizeMode="contain" />
            <Text style={styles.statText}>{item.baths} Bath</Text>
          </View>
          <View style={styles.statItem}>
            <Image source={icons.area} style={styles.statIcon} resizeMode="contain" />
            <Text style={styles.statText}>{item.sqft} Sqft.</Text>
          </View>
        </View>

        <View style={styles.propertyStatsRow}>
          <View style={styles.statItem}>
            <Image source={icons.owner} style={styles.statIcon} resizeMode="contain" />
            <Text style={styles.statText}>Owner - {item.owner}</Text>
          </View>
          <View style={styles.statItem}>
            <Image source={icons.price} style={styles.statIcon} resizeMode="contain" />
            <Text style={styles.statText}>₹{item.price}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      <View style={[styles.contentWrapper, isTablet && styles.contentWrapperTablet]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image source={icons.back} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{CONTACT.name}</Text>
          <View style={{ width: moderateScale(26) }} />
        </View>

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{CONTACT.initial}</Text>
          </View>
        </View>

        {/* Contact card */}
        <View style={styles.contactCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.contactName}>{CONTACT.name}</Text>
            <Text style={styles.contactRole}>{CONTACT.role}</Text>
          </View>

          <View style={styles.actionIcons}>
            <TouchableOpacity
              style={styles.iconCircleBlue}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Image source={icons.call} style={styles.callIcon} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconCircleGreen}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Image source={icons.whatsapp} style={styles.whatsappIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Inventory */}
        <Text style={styles.sectionTitle}>Inventory</Text>

        <FlatList
          data={INVENTORY}
          keyExtractor={(item) => item.id}
          renderItem={renderProperty}
          numColumns={isTablet ? 2 : 1}
          key={isTablet ? 'two-col' : 'one-col'}
          columnWrapperStyle={isTablet ? { gap: moderateScale(12) } : undefined}
          contentContainerStyle={{ paddingBottom: moderateScale(20) }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const createStyles = ({ moderateScale, fontSize }) =>
  StyleSheet.create({
    backIcon: {
      width: moderateScale(18),
      height: moderateScale(18),
    },
    callIcon: {
      width: moderateScale(16),
      height: moderateScale(16),
      tintColor: '#2F6FED',
    },
    whatsappIcon: {
      width: moderateScale(16),
      height: moderateScale(16),
      tintColor: '#25D366',
    },
    statIcon: {
      width: moderateScale(13),
      height: moderateScale(13),
      marginRight: moderateScale(4),
      tintColor: '#6B7280',
    },
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    contentWrapper: {
      flex: 1,
      paddingHorizontal: moderateScale(16),
      width: '100%',
    },
    contentWrapperTablet: {
      maxWidth: 720,
      alignSelf: 'center',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: moderateScale(12),
    },
    headerTitle: {
      fontSize: fontSize(16),
      fontWeight: '700',
      color: '#1A1A1A',
    },
    avatarWrapper: {
      alignItems: 'center',
      marginVertical: moderateScale(16),
    },
    avatarCircle: {
      width: moderateScale(100),
      height: moderateScale(100),
      borderRadius: moderateScale(50),
      backgroundColor: '#3E7CB1',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: fontSize(40),
    },
    contactCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F0F5FF',
      borderRadius: moderateScale(14),
      paddingVertical: moderateScale(14),
      paddingHorizontal: moderateScale(14),
      marginBottom: moderateScale(20),
    },
    contactName: {
      fontSize: fontSize(15),
      fontWeight: '600',
      color: '#1A1A1A',
      marginBottom: moderateScale(2),
    },
    contactRole: {
      fontSize: fontSize(12),
      color: '#9AA0A6',
    },
    actionIcons: {
      flexDirection: 'row',
    },
    iconCircleBlue: {
      width: moderateScale(30),
      height: moderateScale(30),
      borderRadius: moderateScale(15),
      backgroundColor: '#E4ECFD',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: moderateScale(8),
    },
    iconCircleGreen: {
      width: moderateScale(30),
      height: moderateScale(30),
      borderRadius: moderateScale(15),
      backgroundColor: '#E1F9E7',
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionTitle: {
      fontSize: fontSize(14),
      fontWeight: '700',
      color: '#1A1A1A',
      marginBottom: moderateScale(10),
    },
    propertyCard: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#F0F5FF',
      borderRadius: moderateScale(14),
      padding: moderateScale(10),
      marginBottom: moderateScale(10),
    },
    propertyImage: {
      width: moderateScale(70),
      height: moderateScale(70),
      borderRadius: moderateScale(10),
      marginRight: moderateScale(10),
      backgroundColor: '#E0E0E0',
    },
    propertyInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    propertyTitle: {
      fontSize: fontSize(14),
      fontWeight: '700',
      color: '#1A1A1A',
      marginBottom: moderateScale(6),
    },
    propertyStatsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: moderateScale(4),
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: moderateScale(12),
    },
    statText: {
      fontSize: fontSize(11),
      color: '#6B7280',
    },
  });