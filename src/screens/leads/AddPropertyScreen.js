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
  TextInput,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const wp = (p) => (width * p) / 100;
const hp = (p) => (height * p) / 100;
const rf = (size) => size * (width / 375);

/* ─── DATA ───────────────────────── */
// 🔥 Replace with real data from your API/store
const PROPERTIES = [
  {
    id: '1',
    title: 'Rajouri Garden',
    bed: 3,
    bath: 3,
    area: '125 Sq.ft',
    owner: 'Mr Anand',
    price: '₹20,000',
    image: require('../../assets/images/rajauri.png'),
  },
  {
    id: '2',
    title: 'Rajouri Garden',
    bed: 3,
    bath: 3,
    area: '125 Sq.ft',
    owner: 'Mr Anand',
    price: '₹20,000',
    image: require('../../assets/images/rajauri.png'),
  },
];

/* ─── CARD ───────────────────────── */
const PropertyCard = ({ item, selected, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={[styles.card, selected && styles.cardSelected]}
  >
    <Image source={item.image} style={styles.thumb} />

    <View style={styles.cardInfo}>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>

      <View style={styles.infoRow}>
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

      <View style={styles.infoRow}>
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

/* ─── MAIN SCREEN ───────────────────────── */
const AddPropertyScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(PROPERTIES[0]?.id || null);

  const filtered = PROPERTIES.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  // Navigate to ScheduleScreen
  const handleSend = () => {
    navigation.navigate('ScheduleScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Image
            source={require('../../assets/icons/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.header}>Add Property</Text>
        <View style={{ width: wp(9) }} />
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Image
            source={require('../../assets/icons/search.png')}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <TouchableOpacity style={styles.filterBtn}>
          <Image
            source={require('../../assets/icons/filter.png')}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Property List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {filtered.map((item) => (
          <PropertyCard
            key={item.id}
            item={item}
            selected={item.id === selectedId}
            onPress={() => setSelectedId(item.id)}
          />
        ))}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.sendBtn, !selectedId && styles.sendBtnDisabled]}
          disabled={!selectedId}
          onPress={handleSend}
        >
          <Text style={styles.sendBtnText}>Send to Scheduled</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddPropertyScreen;

/* ─── STYLES ───────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* Header */
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

  backIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
  },

  header: {
    fontSize: rf(18),
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: 0.3,
  },

  /* Search + filter */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4.5),
    marginBottom: hp(2.2),
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: wp(7),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.3),
    backgroundColor: '#fafafa',
    marginRight: wp(2.5),
  },

  searchIcon: {
    width: wp(4),
    height: wp(4),
    resizeMode: 'contain',
    tintColor: '#999',
    marginRight: wp(2),
  },

  searchInput: {
    flex: 1,
    fontSize: rf(13),
    color: '#222',
    padding: 0,
  },

  filterBtn: {
    width: wp(10.5),
    height: wp(10.5),
    borderRadius: wp(5.25),
    borderWidth: 1,
    borderColor: '#e2e2e2',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },

  filterIcon: {
    width: wp(4.5),
    height: wp(4.5),
    resizeMode: 'contain',
    tintColor: '#4A97C8',
  },

  /* List */
  scrollContainer: {
    paddingHorizontal: wp(4.5),
    paddingBottom: hp(2),
  },

  emptyText: {
    textAlign: 'center',
    marginTop: hp(4),
    fontSize: rf(13),
    color: '#999',
  },

  /* Property card */
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: wp(3.5),
    borderWidth: 1.5,
    borderColor: '#e2e2e2',
    padding: wp(2.5),
    marginBottom: hp(1.6),
  },

  cardSelected: {
    borderColor: '#4A97C8',
    backgroundColor: '#EDF6FC',
  },

  thumb: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(2.5),
    resizeMode: 'cover',
    marginRight: wp(3),
  },

  cardInfo: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },

  cardTitle: {
    fontSize: rf(14),
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: hp(0.7),
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
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
    paddingHorizontal: wp(4.5),
    paddingTop: hp(1.2),
    paddingBottom: hp(2),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  sendBtn: {
    backgroundColor: '#3A8FA3',
    paddingVertical: hp(1.9),
    borderRadius: wp(7),
    alignItems: 'center',
    shadowColor: '#3A8FA3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  sendBtnDisabled: {
    backgroundColor: '#a8c5cf',
    shadowOpacity: 0,
    elevation: 0,
  },

  sendBtnText: {
    color: '#fff',
    fontSize: rf(14.5),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});