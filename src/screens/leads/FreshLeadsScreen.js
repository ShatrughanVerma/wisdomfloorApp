import React, { useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Image,
  useWindowDimensions,
  PixelRatio,
} from 'react-native';

/**
 * Responsive helpers
 * ------------------
 * Instead of a single static Dimensions.get('window') snapshot (which never
 * updates on rotation, split-screen, or foldable resize events), we build the
 * scaling helpers from the live useWindowDimensions() hook inside the
 * component. That means the whole screen re-renders and re-scales
 * automatically whenever the window size changes.
 *
 * rf() is also clamped so font sizes don't blow up on large tablets, and
 * uses PixelRatio.roundToNearestPixel for crisp text rendering.
 */
const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const guidelineBaseWidth = 375; // standard reference (iPhone X width)
    const scale = width / guidelineBaseWidth;

    const wp = (percent) => (width * percent) / 100;
    const hp = (percent) => (height * percent) / 100;

    // Clamp font scale so text doesn't get huge on tablets or tiny on
    // very small/narrow devices.
    const rf = (size) => {
      const newSize = size * scale;
      const clamped = Math.max(size * 0.85, Math.min(newSize, size * 1.3));
      return PixelRatio.roundToNearestPixel(clamped);
    };

    return { width, height, wp, hp, rf };
  }, [width, height]);
};

const leads = [
  {
    id: '1',
    name: 'Subhash Singh',
    location: 'Moti Nagar',
    area: '123 Sq.ft',
    bhk: '3 BHK',
    floor: 'First Floor',
    property: 'Apartment',
    price: '₹9,20,000',
  },
  {
    id: '2',
    name: 'Subhash Singh',
    location: 'Moti Nagar',
    area: '123 Sq.ft',
    bhk: '3 BHK',
    floor: 'First Floor',
    property: 'Apartment',
    price: '₹9,20,000',
  },
];

const LeadCard = ({ item, onPress, wp, hp, rf }) => {
  const styles = useMemo(() => createStyles(wp, hp, rf), [wp, hp, rf]);

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={onPress}>
      <View style={styles.circleBg} />

      <View style={styles.row}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Image
            source={require('../../assets/icons/user.png')}
            style={styles.userIcon}
          />
        </View>

        {/* Info */}
        <View style={styles.flex}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={styles.infoRow}>
            <Image source={require('../../assets/icons/location_icon.png')} style={styles.icon} />
            <Text style={styles.infoText} numberOfLines={1}>{item.location}</Text>

            <Image source={require('../../assets/icons/area.png')} style={[styles.icon, styles.iconGapLeft]} />
            <Text style={styles.infoText} numberOfLines={1}>{item.area}</Text>
          </View>

          <View style={styles.infoRow}>
            <Image source={require('../../assets/icons/bed.png')} style={styles.icon} />
            <Text style={styles.infoText} numberOfLines={1}>{item.bhk} • {item.floor}</Text>
          </View>

          <View style={styles.infoRow}>
            <Image source={require('../../assets/icons/apartment_key.png')} style={styles.icon} />
            <Text style={styles.infoText} numberOfLines={1}>{item.property}</Text>
            <Text style={styles.price} numberOfLines={1}> {item.price}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionCol}>
          <TouchableOpacity style={styles.callBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Image source={require('../../assets/icons/call.png')} style={styles.actionIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.callBtn, styles.whatsappBtn]}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Image source={require('../../assets/icons/whatsapp.png')} style={styles.actionIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const FreshLeadsScreen = ({ navigation }) => {
  const { wp, hp, rf } = useResponsive();
  const styles = useMemo(() => createStyles(wp, hp, rf), [wp, hp, rf]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content"
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Image source={require('../../assets/icons/back.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.heading}>Fresh Leads</Text>
        <View style={{ width: wp(6) }} />
      </View>

      {/* Dropdown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Category</Text>

        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Residential Rent</Text>
          <Image source={require('../../assets/icons/down_arrow.png')} style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={leads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LeadCard
            item={item}
            wp={wp}
            hp={hp}
            rf={rf}
            onPress={() => navigation.navigate('SubhashScreen', { lead: item })}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(12) }}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddLeadScreen')}
      >
        <Image
          source={require('../../assets/icons/add.png')}
          style={styles.addIcon}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FreshLeadsScreen;

// Styles are built as a function of the live wp/hp/rf scalers so every
// numeric value in the sheet (including the small "gap" numbers that used
// to be hardcoded pixels) scales with the actual device/window size.
const createStyles = (wp, hp, rf) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: wp(4.5),
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: hp(2),
      marginBottom: hp(2),
    },

    backIcon: {
      width: wp(5),
      height: wp(5),
      resizeMode: 'contain',
    },

    heading: {
      fontSize: rf(20),
      fontWeight: '700',
      color: '#222',
    },

    dropdownContainer: {
      marginBottom: hp(2),
    },

    label: {
      position: 'absolute',
      top: -hp(1),
      left: wp(3),
      backgroundColor: '#fff',
      paddingHorizontal: wp(1.3),
      color: '#4C97C8',
      fontSize: rf(10),
      zIndex: 1,
    },

    dropdown: {
      height: hp(6),
      borderWidth: 1,
      borderColor: '#E2E2E2',
      borderRadius: wp(2),
      paddingHorizontal: wp(3),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    dropdownText: {
      fontSize: rf(13),
      color: '#777',
    },

    arrowIcon: {
      width: wp(4),
      height: wp(4),
      resizeMode: 'contain',
    },

    card: {
      backgroundColor: '#EDF6FC',
      borderRadius: wp(3),
      padding: wp(3.5),
      marginBottom: hp(1.5),
      overflow: 'hidden',
    },

    circleBg: {
      position: 'absolute',
      width: wp(25),
      height: wp(25),
      borderRadius: wp(12.5),
      backgroundColor: '#DDECF7',
      right: -wp(5),
      top: -wp(5),
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    flex: {
      flex: 1,
    },

    avatar: {
      width: wp(9),
      height: wp(9),
      borderRadius: wp(4.5),
      backgroundColor: '#4A97C8',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: wp(2),
    },

    // width/height must be numbers (or '%' strings) in React Native — using
    // wp() keeps the icon proportional to screen width instead of a fixed px.
    userIcon: {
      width: wp(4),
      height: wp(5),
      resizeMode: 'contain',
      tintColor: '#fff',
    },

    name: {
      fontSize: rf(14),
      fontWeight: '700',
      color: '#222',
      marginBottom: hp(0.5),
    },

    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: hp(0.4),
    },

    icon: {
      width: wp(3),
      height: wp(3),
      tintColor: '#808080',
      marginRight: wp(1),
      resizeMode: 'contain',
    },

    iconGapLeft: {
      marginLeft: wp(2),
    },

    infoText: {
      fontSize: rf(10),
      color: '#777',
      marginRight: wp(1.5),
      flexShrink: 1,
    },

    price: {
      fontSize: rf(11),
      fontWeight: '600',
      color: '#3A8FA3',
    },

    actionCol: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: wp(2),
    },

    callBtn: {
      width: wp(8),
      height: wp(8),
      borderRadius: wp(4),
      backgroundColor: '#D8EDF8',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: wp(1.5),
    },

    whatsappBtn: {
      backgroundColor: '#D8F4DF',
      marginRight: 0,
    },

    actionIcon: {
      width: wp(5),
      height: wp(5),
      resizeMode: 'contain',
    },

    fab: {
      position: 'absolute',
      right: wp(5),
      bottom: hp(3),
      width: wp(14),
      height: wp(14),
      borderRadius: wp(7),
      backgroundColor: '#4A97C8',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: wp(0.5) },
      shadowOpacity: 0.2,
      shadowRadius: wp(1.5),
    },

    addIcon: {
      width: wp(6),
      height: wp(6),
      resizeMode: 'contain',
      tintColor: '#fff',
    },
  });