import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const wp = p => (width * p) / 100;
const hp = p => (height * p) / 100;
const rf = s => s * (width / 375);

/* ---------------------------------------------------------------------- */
/*  Tab bar                                                                */
/* ---------------------------------------------------------------------- */
const TABS = ['Scheduled', 'Visited', "What's App Shared", 'Shortlist'];

const TabBar = ({active, onChange}) => (
  <View style={styles.tabWrapper}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabRow}>
      {TABS.map(tab => {
        const isActive = tab === active;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onChange(tab)}
            activeOpacity={0.8}
            style={[styles.tabBtn, isActive && styles.tabBtnActive]}>
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

/* ---------------------------------------------------------------------- */
/*  Property card                                                          */
/* ---------------------------------------------------------------------- */
const PropertyCard = ({item, selected, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={[styles.card, selected && styles.cardSelected]}>
    <Image
      source={item.image}
      style={styles.thumb}
      defaultSource={require('../../assets/images/rajauri.png')}
    />
    <View style={styles.cardInfo}>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>

      <View style={styles.row}>
        <Image
          source={require('../../assets/icons/bed.png')}
          style={styles.icon}
        />
        <Text style={styles.infoText}>
          {item.bed} Bed / {item.bath} Bath
        </Text>
        <View style={styles.dot} />
        <Image
          source={require('../../assets/icons/area.png')}
          style={styles.icon}
        />
        <Text style={styles.infoText}>{item.area}</Text>
      </View>

      <View style={styles.row}>
        <Image
          source={require('../../assets/icons/user.png')}
          style={styles.icon}
        />
        <Text style={styles.infoText}>Owner - {item.owner}</Text>
        <View style={styles.dot} />
        <Image
          source={require('../../assets/icons/apartment_key.png')}
          style={styles.icon}
        />
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

/* ---------------------------------------------------------------------- */
/*  Default data                                                           */
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
const LeadInventoryScreen = ({navigation, route}) => {
  const [activeTab, setActiveTab] = useState('Scheduled');
  const [selectedId, setSelectedId] = useState(null);

  const properties = route?.params?.properties || DEFAULT_PROPERTIES;

  const handleMoveToVisited = () => {
    // 🔥 Hook up your "mark as visited" logic / API call here
    setActiveTab('Visited');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Image
            source={require('../../assets/icons/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory</Text>
        <View style={{width: wp(6)}} />
      </View>

      {/* Tab bar */}
      <TabBar active={activeTab} onChange={setActiveTab} />

      {/* Property list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}>
        {properties.length === 0 ? (
          <Text style={styles.emptyText}>No Properties Found</Text>
        ) : (
          properties.map(item => (
            <PropertyCard
              key={item.id}
              item={item}
              selected={item.id === selectedId}
              onPress={() => setSelectedId(item.id)}
            />
          ))
        )}
      </ScrollView>

      {/* Bottom button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.moveBtn}
          activeOpacity={0.85}
          onPress={handleMoveToVisited}>
          <Text style={styles.moveBtnText}>Move to Visited</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LeadInventoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },

  /* Header */
  header: {
    height: hp(7),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    backgroundColor: '#fff',
  },

  backIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
  },

  headerTitle: {
    fontSize: rf(18),
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: 0.3,
  },

  /* Tabs */
  tabWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },

  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
  },

  tabBtn: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
    backgroundColor: '#F0F0F0',
    marginRight: wp(2),
  },

  tabBtnActive: {
    backgroundColor: '#4A97C8',
  },

  tabText: {
    fontSize: rf(11.5),
    fontWeight: '600',
    color: '#888',
  },

  tabTextActive: {
    color: '#fff',
  },

  /* List */
  listContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(3),
  },

  emptyText: {
    textAlign: 'center',
    marginTop: hp(6),
    fontSize: rf(13),
    color: '#999',
  },

  /* Property card */
  card: {
    flexDirection: 'row',
    backgroundColor: '#EDF6FC',
    borderRadius: wp(3),
    padding: wp(3),
    marginBottom: hp(1.5),
    borderWidth: 1.5,
    borderColor: 'transparent',
  },

  cardSelected: {
    backgroundColor: '#DDECF7',
    borderColor: '#4A97C8',
  },

  thumb: {
    width: wp(22),
    height: wp(22),
    borderRadius: wp(2.5),
    resizeMode: 'cover',
    marginRight: wp(3),
    backgroundColor: '#DDECF7',
  },

  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  cardTitle: {
    fontSize: rf(13.5),
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: hp(0.6),
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.4),
    flexWrap: 'wrap',
  },

  icon: {
    width: wp(3),
    height: wp(3),
    resizeMode: 'contain',
    tintColor: '#808080',
    marginRight: wp(1),
  },

  infoText: {
    fontSize: rf(10.5),
    color: '#666',
    marginRight: wp(1),
  },

  dot: {
    width: wp(1),
    height: wp(1),
    borderRadius: wp(0.5),
    backgroundColor: '#bbb',
    marginHorizontal: wp(1.5),
  },

  price: {
    fontSize: rf(11),
    fontWeight: '700',
    color: '#3A8FA3',
  },

  /* Bottom bar */
  bottomBar: {
    paddingHorizontal: wp(5),
    paddingTop: hp(1.5),
    paddingBottom: hp(2.5),
    backgroundColor: '#F2F4F7',
  },

  moveBtn: {
    backgroundColor: '#4A97C8',
    paddingVertical: hp(2),
    borderRadius: wp(8),
    alignItems: 'center',
    shadowColor: '#4A97C8',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  moveBtnText: {
    color: '#fff',
    fontSize: rf(14),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});