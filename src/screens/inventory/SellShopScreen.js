import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const wp = p => (width * p) / 100;
const hp = p => (height * p) / 100;
const rf = s => (width / 375) * s;

const data = [
  {
    id: '1',
    title: 'Rajouri Garden',
    beds: '3 Bed',
    baths: '3 Bath',
    area: '123 Sq.ft.',
    owner: 'Owner - Mr Anand',
    price: '₹1,00,000',
    image: require('../../assets/images/rajauri.png'),
  },
];

const ApartmentScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate('ApartmentdetailsScreen', {
          property: item,
        })
      }
    >
      <Image source={item.image} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>

        {/* Bed Bath Area */}

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Image
              source={require('../../assets/icons/bed.png')}
              style={styles.detailIcon}
            />
            <Text style={styles.detailText}>{item.beds}</Text>
          </View>

          <View style={styles.detailItem}>
            <Image
              source={require('../../assets/icons/bed.png')}
              style={styles.detailIcon}
            />
            <Text style={styles.detailText}>{item.baths}</Text>
          </View>

          <View style={styles.detailItem}>
            <Image
              source={require('../../assets/icons/area.png')}
              style={styles.detailIcon}
            />
            <Text style={styles.detailText}>{item.area}</Text>
          </View>
        </View>

        <Text style={styles.owner}>{item.owner}</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>{item.price}</Text>

          <View style={styles.iconRow}>
            <TouchableOpacity>
              <Image
                source={require('../../assets/icons/call.png')}
                style={styles.actionIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Image
                source={require('../../assets/icons/whatsapp.png')}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/icons/back.png')}
            style={styles.back}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Shop</Text>

        <View style={{ width: 25 }} />
      </View>

      {/* Search */}

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Image
            source={require('../../assets/icons/search.png')}
            style={styles.searchIcon}
          />

          <TextInput
            placeholder="Search"
            placeholderTextColor="#999"
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.filterBtn}>
          <Image
            source={require('../../assets/icons/filter.png')}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: hp(12),
        }}
      />
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('SellShopFormScreen')}
      >
        <Image
          source={require('../../assets/icons/add.png')}
          style={styles.addIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ApartmentScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(4),
    marginBottom: hp(2),
  },

  searchBox: {
    flex: 1,
    height: hp(5.5),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: hp(3),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    backgroundColor: '#FFF',
  },

  searchIcon: {
    width: wp(4.5),
    height: wp(4.5),
    tintColor: '#888',
    resizeMode: 'contain',
  },

  input: {
    flex: 1,
    marginLeft: wp(2),
    fontSize: rf(14),
    color: '#000',
  },

  filterBtn: {
    width: hp(5.5),
    height: hp(5.5),
    borderRadius: hp(2.75),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(2.5),
    backgroundColor: '#FFF',
  },

  filterIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#EEF8FF',
    marginHorizontal: wp(4),
    marginBottom: hp(1.8),
    borderRadius: wp(3),
    padding: wp(3),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },

  image: {
    width: wp(24),
    height: wp(24),
    borderRadius: wp(2),
  },

  content: {
    flex: 1,
    marginLeft: wp(3),
    justifyContent: 'space-between',
  },

  title: {
    fontSize: rf(16),
    fontWeight: '700',
    color: '#222',
  },

  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.7),
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(3),
  },

  detailIcon: {
    width: wp(3.8),
    height: wp(3.8),
    resizeMode: 'contain',
    marginRight: wp(1),
  },

  detailText: {
    fontSize: rf(11),
    color: '#666',
  },

  owner: {
    marginTop: hp(0.8),
    fontSize: rf(11),
    color: '#888',
  },

  bottomRow: {
    marginTop: hp(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  price: {
    fontSize: rf(16),
    fontWeight: '700',
    color: '#16A34A',
  },

  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionIcon: {
    width: wp(5.5),
    height: wp(5.5),
    resizeMode: 'contain',
    marginLeft: wp(3),
  },

  fab: {
    position: 'absolute',
    right: wp(5),
    bottom: hp(4),
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3.5),
    backgroundColor: '#68bfee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },

  addIcon: {
    width: 25,
    height: 25,
    tintColor: '#FFFFFF', // Remove this line if your PNG is already white
  },
});