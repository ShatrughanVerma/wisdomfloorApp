import React, { useState, useRef } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const wp = (p) => (width * p) / 100;
const hp = (p) => (height * p) / 100;
const rf = (size) => size * (width / 375);

// ─── Lead summary card ─────────────────────────────────────────────────────────
const LeadCard = ({ lead }) => (
  <View style={styles.card}>
    <View style={styles.circleBg} />
    <View style={styles.cardRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{lead.name.charAt(0)}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.name} numberOfLines={1}>{lead.name}</Text>

        <View style={styles.infoRow}>
          <Image source={require('../../assets/icons/location_icon.png')} style={styles.icon} />
          <Text style={styles.infoText} numberOfLines={1}>{lead.location}</Text>
          <View style={styles.dot} />
          <Image source={require('../../assets/icons/area.png')} style={styles.icon} />
          <Text style={styles.infoText} numberOfLines={1}>{lead.area}</Text>
        </View>

        <View style={styles.infoRow}>
          <Image source={require('../../assets/icons/bed.png')} style={styles.icon} />
          <Text style={styles.infoText} numberOfLines={1}>{lead.bhk} • {lead.floor}</Text>
        </View>

        <View style={styles.infoRow}>
          <Image source={require('../../assets/icons/apartment_key.png')} style={styles.icon} />
          <Text style={styles.infoText}>{lead.property}</Text>
          <View style={styles.dot} />
          <Text style={styles.price}>{lead.price}</Text>
        </View>
      </View>

      <View style={styles.actionCol}>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75}>
          <Image source={require('../../assets/icons/call.png')} style={styles.actionIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.whatsappBtn]} activeOpacity={0.75}>
          <Image source={require('../../assets/icons/whatsapp.png')} style={styles.actionIcon} />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// ─── Dropdown field ──────────────────────────────────────────────────────────
const DropdownField = ({ value, placeholder, rightIcon }) => (
  <TouchableOpacity style={styles.dropdownBox} activeOpacity={0.75}>
    <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
      {value || placeholder}
    </Text>
    <Image
      source={rightIcon || require('../../assets/icons/down_arrow.png')}
      style={styles.arrowIcon}
    />
  </TouchableOpacity>
);

// ─── Scrollable Tab bar ──────────────────────────────────────────────────────
const TABS = ['Scheduled', 'Visited', "What's App Shared", 'Shortlist'];

const TabBar = ({ active, onChange }) => {
  const scrollViewRef = useRef(null);

  const handleTabPress = (tab, index) => {
    onChange(tab);
    scrollViewRef.current?.scrollTo({
      x: index * (wp(22) + wp(2)),
      animated: true,
    });
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tabScrollView}
      contentContainerStyle={styles.tabContentContainer}
    >
      {TABS.map((tab, index) => {
        const isActive = tab === active;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => handleTabPress(tab, index)}
            activeOpacity={0.8}
            style={[styles.tabBtn, isActive && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

// ─── Tab Content ──────────────────────────────────────────────────────────────
const TabContent = ({ activeTab }) => {
  const emptyState = (message) => (
    <View style={styles.contentBox}>
      <Image source={require('../../assets/icons/empty_home.png')} style={styles.emptyIcon} />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );

  const messages = {
    'Scheduled': 'No scheduled visits',
    'Visited': 'No visits yet',
    "What's App Shared": 'No WhatsApp shares',
    'Shortlist': 'No shortlisted items',
  };

  return <View style={styles.tabContentWrapper}>{emptyState(messages[activeTab] || '')}</View>;
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const SubhashScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Scheduled');

  const lead = {
    name: 'Subhash Singh',
    location: '125th St.',
    area: '5th Ave. / Flat-Room',
    bhk: '3 BHK',
    floor: 'First Floor',
    property: 'Apartment',
    price: '₹20,000',
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation?.goBack()} activeOpacity={0.7} style={styles.backBtn}>
          <Image source={require('../../assets/icons/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.header}>Aryan Yadav</Text>
        <View style={{ width: wp(9) }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <LeadCard lead={lead} />
        <DropdownField value="Outfitted" />
        <DropdownField value="Follow Up" rightIcon={require('../../assets/icons/calendar.png')} />
        <TabBar active={activeTab} onChange={setActiveTab} />
        <TabContent activeTab={activeTab} />

        <TouchableOpacity
  style={styles.addPropertiesBtn}
  activeOpacity={0.85}
  onPress={() => navigation.navigate('AddPropertyScreen')}
>
  <Image
    source={require('../../assets/icons/add.png')}
    style={styles.addIcon}
  />
  <Text style={styles.addPropertiesText}>Add Properties</Text>
</TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomBar}>
       <TouchableOpacity
  style={styles.worksheetBtn}
  activeOpacity={0.85}
  onPress={() => navigation.navigate('WorksheetScreen')}
>
  <Text style={styles.worksheetText}>Go to Worksheet</Text>
</TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SubhashScreen;

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { paddingHorizontal: wp(4.5), paddingBottom: hp(4) },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4.5),
    marginTop: hp(1.5),
    marginBottom: hp(2.5),
  },
  backBtn: { width: wp(9), height: wp(9), justifyContent: 'center', alignItems: 'center', borderRadius: wp(2) },
  backIcon: { width: wp(5), height: wp(5), resizeMode: 'contain' },
  header: { fontSize: rf(18), fontWeight: '700', color: '#1a1a2e', letterSpacing: 0.3 },

  card: {
    backgroundColor: '#EDF6FC',
    borderRadius: wp(3.5),
    padding: wp(3.5),
    marginBottom: hp(1.8),
    overflow: 'hidden',
  },
  circleBg: {
    position: 'absolute',
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    backgroundColor: '#DDECF7',
    right: -wp(5),
    top: -wp(5),
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: '#4A97C8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
    flexShrink: 0,
  },
  avatarText: { color: '#fff', fontSize: rf(14), fontWeight: '700' },
  infoBlock: { flex: 1, minWidth: 0 },
  name: { fontSize: rf(14), fontWeight: '700', color: '#1a1a2e', marginBottom: hp(0.5) },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(0.4) },
  icon: {
    width: wp(3),
    height: wp(3),
    resizeMode: 'contain',
    tintColor: '#808080',
    marginRight: wp(1),
    flexShrink: 0,
  },
  infoText: { fontSize: rf(10.5), color: '#666', flexShrink: 1, marginRight: wp(1) },
  dot: { width: wp(1), height: wp(1), borderRadius: wp(0.5), backgroundColor: '#bbb', marginHorizontal: wp(1.5), flexShrink: 0 },
  price: { fontSize: rf(11), fontWeight: '700', color: '#3A8FA3', flexShrink: 1 },
  actionCol: { flexDirection: 'row', alignItems: 'center', marginLeft: wp(2.5), flexShrink: 0 },
  actionBtn: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: '#D8EDF8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2),
  },
  whatsappBtn: { backgroundColor: '#D8F4DF', marginRight: 0 },
  actionIcon: { width: wp(4.5), height: wp(4.5), resizeMode: 'contain' },

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
    marginBottom: hp(1.6),
  },
  dropdownText: { flex: 1, fontSize: rf(13), color: '#222', fontWeight: '500' },
  placeholderText: { color: '#bbb', fontWeight: '400' },
  arrowIcon: { width: wp(3.5), height: wp(3.5), resizeMode: 'contain', tintColor: '#4A97C8' },

  tabScrollView: { marginTop: hp(0.5), marginBottom: hp(2) },
  tabContentContainer: { paddingHorizontal: wp(1) },
  tabBtn: {
    paddingVertical: hp(1.1),
    paddingHorizontal: wp(3.5),
    borderRadius: wp(2),
    backgroundColor: '#f5f5f5',
    marginRight: wp(2),
    minWidth: wp(22),
    alignItems: 'center',
  },
  tabBtnActive: { backgroundColor: '#4A97C8' },
  tabText: { fontSize: rf(11.5), fontWeight: '600', color: '#888' },
  tabTextActive: { color: '#fff' },

  tabContentWrapper: { flex: 1, minHeight: hp(28) },
  contentBox: {
    flex: 1,
    minHeight: hp(28),
    backgroundColor: '#f3f3f3',
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  emptyIcon: { width: wp(14), height: wp(14), resizeMode: 'contain', tintColor: '#c8c8c8' },
  emptyText: { marginTop: hp(1.5), fontSize: rf(13), color: '#999', fontWeight: '500' },

  addPropertiesBtn: {
    backgroundColor: '#4A97C8',
    paddingVertical: hp(1.7),
    borderRadius: wp(3),
    marginTop: hp(1),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addIcon: { width: wp(4), height: wp(4), resizeMode: 'contain', tintColor: '#fff', marginRight: wp(2) },
  addPropertiesText: { color: '#fff', fontSize: rf(13.5), fontWeight: '700', letterSpacing: 0.3 },

  bottomBar: {
    paddingHorizontal: wp(4.5),
    paddingTop: hp(1.2),
    paddingBottom: hp(2),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  worksheetBtn: {
    backgroundColor: '#4A97C8',
    paddingVertical: hp(1.9),
    borderRadius: wp(3),
    alignItems: 'center',
    shadowColor: '#3A8FA3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  worksheetText: { color: '#fff', fontSize: rf(15), fontWeight: '700', letterSpacing: 0.5 },
});