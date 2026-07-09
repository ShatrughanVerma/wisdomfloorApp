import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList,
} from 'react-native';

const icons = {
  back: require('../../assets/icons/back.png'),
};

const rentalData = [
  {
 id: '1',
    title: 'Builder Floor',
    icon: require('../../assets/icons/builder_floor.png'),
    screen: 'ResidentialRentBuilderScreen',
  },
  {
    id: '2',
    title: 'Apartment',
    icon: require('../../assets/icons/apartment.png'),
    screen: 'ResidentialRentApartmentScreen',
  },
  {
    id: '3',
    title: 'Villa',
    icon: require('../../assets/icons/villa.png'),
    screen: 'ResiRentVillaScreen',
  },
  {
    id: '4',
    title: 'Bungalow',
    icon: require('../../assets/icons/bungalow.png'),
    screen: 'ResiRentBungalowScreen',
  },
  {
    id: '5',
    title: 'Farm House',
    icon: require('../../assets/icons/farm_house.png'),
    screen:'ResiRentFarmHouseScreen'
  },
];

const ResidentialRentalScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.8}
    onPress={() => navigation.navigate(item.screen)}>
    <Image source={item.icon} style={styles.icon} />
    <Text style={styles.cardTitle}>{item.title}</Text>
  </TouchableOpacity>
);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image
            source={icons.back}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.heading}>Residential Rent</Text>

        <View style={styles.backButton} />
      </View>

      {/* Description */}
      <Text style={styles.description}>
        It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout.
      </Text>

      {/* List */}
      <FlatList
        data={rentalData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </SafeAreaView>
  );
};

export default ResidentialRentalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 25,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  backIcon: {
    width: 18,
    height: 18,
  },

  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },

  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 22,
    marginBottom: 18,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  icon: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
    marginRight: 18,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
});