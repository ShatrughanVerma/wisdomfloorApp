import React, { useState } from 'react';
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

/* ---------------------------------------------------------------------- */
/*  Image source helper                                                   */
/* ---------------------------------------------------------------------- */
const PLACEHOLDER_IMG = { uri: 'https://placehold.co/200x200/EDF6FC/4A97C8?text=No+Image' };

const resolveImage = (img) => {
  if (!img) return PLACEHOLDER_IMG;
  if (typeof img === 'number') return img; // require(...) result
  if (typeof img === 'string') return { uri: img };
  if (typeof img === 'object' && img.uri) return img;
  return PLACEHOLDER_IMG;
};

const Icon = ({ name, style }) => {
  const ICONS = {
    bed: require('../../assets/icons/bed.png'),
    area: require('../../assets/icons/area.png'),
    user: require('../../assets/icons/user.png'),
    apartment: require('../../assets/icons/apartment_key.png'),
    back: require('../../assets/icons/back.png'),
    location: require('../../assets/icons/location_icon.png'),
    call: require('../../assets/icons/call.png'),
    whatsapp: require('../../assets/icons/whatsapp.png'),
    down: require('../../assets/icons/down_arrow.png'),
    calendar: require('../../assets/icons/calendar.png'),
  };
  return <Image source={ICONS[name]} style={style} />;
};

/* ---------------------------------------------------------------------- */
/*  Lead summary card                                                     */
/* ---------------------------------------------------------------------- */
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
          <Icon name="location" style={styles.icon} />
          <Text style={styles.infoText} numberOfLines={1}>{lead.location}</Text>
          <View style={styles.dot} />
          <Icon name="area" style={styles.icon} />
          <Text style={styles.infoText} numberOfLines={1}>{lead.area}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="bed" style={styles.icon} />
          <Text style={styles.infoText} numberOfLines={1}>{lead.bhk} • {lead.floor}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="apartment" style={styles.icon} />
          <Text style={styles.infoText}>{lead.property}</Text>
          <View style={styles.dot} />
          <Text style={styles.price}>{lead.price}</Text>
        </View>
      </View>
      <View style={styles.actionCol}>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75}>
          <Icon name="call" style={styles.actionIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.whatsappBtn]} activeOpacity={0.75}>
          <Icon name="whatsapp" style={styles.actionIcon} />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

/* ---------------------------------------------------------------------- */
/*  Dropdown field                                                        */
/* ---------------------------------------------------------------------- */
const DropdownField = ({ value, placeholder, leftIconName, rightIconName, onPress }) => (
  <TouchableOpacity style={styles.dropdownBox} activeOpacity={0.75} onPress={onPress}>
    <View style={styles.dropdownLeft}>
      {leftIconName && <Icon name={leftIconName} style={styles.dropdownLeftIcon} />}
      <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
        {value || placeholder}
      </Text>
    </View>
    <Icon name={rightIconName || 'down'} style={styles.arrowIcon} />
  </TouchableOpacity>
);

/* ---------------------------------------------------------------------- */
/*  Tab bar                                                                */
/* ---------------------------------------------------------------------- */
const TABS = ['Scheduled', 'Visited', "What's App Shared", 'Shortlist'];

const TabBar = ({ active, onChange }) => (
  <View style={styles.tabRow}>
    {TABS.map((tab) => {
      const isActive = tab === active;
      return (
        <TouchableOpacity
          key={tab}
          onPress={() => onChange(tab)}
          activeOpacity={0.8}
          style={[styles.tabBtn, isActive && styles.tabBtnActive]}
        >
          <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

/* ---------------------------------------------------------------------- */
/*  Property card (same visual language as ScheduleScreen's cards)        */
/* ---------------------------------------------------------------------- */
const WorksheetCard = ({ item, selected, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={[styles.propCard, selected && styles.propCardSelected]}
  >
    <Image
      source={resolveImage(item.image)}
      style={styles.thumb}
      defaultSource={PLACEHOLDER_IMG}
    />
    <View style={styles.propInfo}>
      <Text style={styles.propTitle} numberOfLines={1}>{item.title}</Text>
      <View style={styles.infoRow}>
        <Icon name="bed" style={styles.icon} />
        <Text style={styles.infoText}>{item.bed} Bed / {item.bath} Bath</Text>
        <View style={styles.dot} />
        <Icon name="area" style={styles.icon} />
        <Text style={styles.infoText} numberOfLines={1}>{item.area}</Text>
      </View>
      <View style={styles.infoRow}>
        <Icon name="user" style={styles.icon} />
        <Text style={styles.infoText}>Owner - {item.owner}</Text>
        <View style={styles.dot} />
        <Icon name="apartment" style={styles.icon} />
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

/* ---------------------------------------------------------------------- */
/*  Default placeholder data                                              */
/* ---------------------------------------------------------------------- */
const DEFAULT_PROPERTIES = [
  {
    id: '1',
    title: 'Rajouri Garden',
    bed: 3,
    bath: 3,
    area: '123 Sq.ft',
    owner: 'Mr Anand',
    price: '₹20,000',
    image: require('../../assets/images/rajauri.png'),
  },
  {
    id: '2',
    title: 'Rajouri Garden',
    bed: 3,
    bath: 3,
    area: '123 Sq.ft',
    owner: 'Mr Anand',
    price: '₹20,000',
    image: require('../../assets/images/rajauri.png'),
  },
  {
    id: '3',
    title: 'Rajouri Garden',
    bed: 3,
    bath: 3,
    area: '123 Sq.ft',
    owner: 'Mr Anand',
    price: '₹20,000',
    image: require('../../assets/images/rajauri.png'),
  },
];

/* ---------------------------------------------------------------------- */
/*  Main screen                                                            */
/* ---------------------------------------------------------------------- */
const ScheduleScreen = ({ navigation, route }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [status, setStatus] = useState('Qualified');
  const [followUp, setFollowUp] = useState('Call follow Up');
  const [activeTab, setActiveTab] = useState('Scheduled');

  const properties = route?.params?.properties || DEFAULT_PROPERTIES;

  const lead = route?.params?.lead || {
    name: 'Subhash Singh',
    location: 'Moti Nagar',
    area: '123 Sq.ft',
    bhk: '3 BHK',
    floor: 'First Floor',
    property: 'Apartment',
    price: '₹20,000',
  };

  const handleMoveToVisited = () => {
    // 🔥 Hook this up to your "mark as visited" logic / API call
  };

  const handleGoToWorksheet = () => {
    // 🔥 Hook this up to wherever this CTA should lead from here
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="back" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.header}>Aryan Yadav</Text>
        <View style={{ width: wp(9) }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <LeadCard lead={lead} />

        <DropdownField value={status} />

        <DropdownField value={followUp} rightIconName="calendar" />

        <TabBar active={activeTab} onChange={setActiveTab} />

        {properties.length === 0 ? (
          <Text style={styles.emptyText}>No Properties</Text>
        ) : (
          properties.map((item) => (
            <WorksheetCard
              key={item.id}
              item={item}
              selected={item.id === selectedId}
              onPress={() => setSelectedId(item.id)}
            />
          ))
        )}

        <TouchableOpacity
          style={styles.moveBtn}
          activeOpacity={0.85}
          onPress={handleMoveToVisited}
        >
          <Text style={styles.moveBtnText}>Move to Visited</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
  style={styles.worksheetBtn}
  activeOpacity={0.85}
  onPress={() => navigation.navigate('WorksheetScreen')}
>
  <Text style={styles.worksheetText}>
    Go to Worksheet
  </Text>
</TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ScheduleScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  scrollContainer: {
    paddingHorizontal: wp(4.5),
    paddingTop: hp(0.5),
    paddingBottom: hp(3),
    flexGrow: 1,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4.5),
    marginTop: hp(1.5),
    marginBottom: hp(2),
  },

  backBtn: {
    width: wp(9),
    height: wp(9),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(2),
  },

  backIcon: { width: wp(5), height: wp(5), resizeMode: 'contain' },

  header: {
    fontSize: rf(18),
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: 0.3,
  },

  /* Lead card */
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

  name: {
    fontSize: rf(14),
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: hp(0.5),
  },

  actionCol: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp(2.5),
    flexShrink: 0,
  },

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

  /* Dropdowns */
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

  dropdownLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },

  dropdownLeftIcon: {
    width: wp(4),
    height: wp(4),
    resizeMode: 'contain',
    marginRight: wp(2),
    tintColor: '#4A97C8',
  },

  dropdownText: { flex: 1, fontSize: rf(13), color: '#222', fontWeight: '500' },

  placeholderText: { color: '#bbb', fontWeight: '400' },

  arrowIcon: {
    width: wp(3.5),
    height: wp(3.5),
    resizeMode: 'contain',
    tintColor: '#4A97C8',
  },

  /* Tabs */
  tabRow: { flexDirection: 'row', marginTop: hp(0.5), marginBottom: hp(2) },

  tabBtn: {
    paddingVertical: hp(1.1),
    paddingHorizontal: wp(3.5),
    borderRadius: wp(2),
    backgroundColor: '#f5f5f5',
    marginRight: wp(2),
  },

  tabBtnActive: { backgroundColor: '#4A97C8' },

  tabText: { fontSize: rf(11.5), fontWeight: '600', color: '#888' },

  tabTextActive: { color: '#fff' },

  icon: {
    width: wp(3),
    height: wp(3),
    resizeMode: 'contain',
    tintColor: '#808080',
    marginRight: wp(1),
    flexShrink: 0,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.4),
    flexWrap: 'wrap',
  },

  infoText: {
    fontSize: rf(10.5),
    color: '#666',
    flexShrink: 1,
    marginRight: wp(1),
  },

  dot: {
    width: wp(1),
    height: wp(1),
    borderRadius: wp(0.5),
    backgroundColor: '#bbb',
    marginHorizontal: wp(1.5),
    flexShrink: 0,
  },

  price: {
    fontSize: rf(11),
    fontWeight: '700',
    color: '#3A8FA3',
    flexShrink: 1,
  },

  emptyText: {
    textAlign: 'center',
    marginVertical: hp(3),
    fontSize: rf(13),
    color: '#999',
  },

  propCard: {
    flexDirection: 'row',
    backgroundColor: '#EDF6FC',
    borderRadius: wp(3),
    padding: wp(2.8),
    marginBottom: hp(1.4),
    borderWidth: 1.5,
    borderColor: 'transparent',
  },

  propCardSelected: {
    backgroundColor: '#DDECF7',
    borderColor: '#4A97C8',
  },

  thumb: {
    width: wp(19),
    height: wp(15),
    borderRadius: wp(2),
    resizeMode: 'cover',
    marginRight: wp(3),
    backgroundColor: '#DDECF7',
  },

  propInfo: { flex: 1, justifyContent: 'center', minWidth: 0 },

  propTitle: {
    fontSize: rf(13),
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: hp(0.5),
  },

  moveBtn: {
    backgroundColor: '#4A97C8',
    paddingVertical: hp(1.7),
    borderRadius: wp(3),
    alignItems: 'center',
    marginTop: hp(2),
  },

  moveBtnText: {
    color: '#fff',
    fontSize: rf(13),
    fontWeight: '700',
    letterSpacing: 0.3,
  },

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

  worksheetText: {
    color: '#fff',
    fontSize: rf(15),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});