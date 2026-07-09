import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  FlatList,
  Platform,
} from 'react-native';

const icons = {
  back: require('../../assets/icons/back.png'),
};

const commercialSaleData = [
  {
    id: '1',
    title: 'Office',
    icon: require('../../assets/icons/builder_floor.png'),
    screen: 'CommercialofficeScreen',
  },
  {
    id: '2',
    title: 'Godown',
    icon: require('../../assets/icons/godown.png'),
     screen: 'CommercialGodownScreen',
  },
  {
    id: '3',
    title: 'Warehouse',
    icon: require('../../assets/icons/warehouse.png'),
    screen: 'CommercialWarehouseScreen',
  },
  {
    id: '4',
    title: 'Industrial Shed',
    icon: require('../../assets/icons/industrial_shed.png'),
     screen: 'CommercialIndustrialScreen',
  },
  {
    id: '5',
    title: 'Industrial Floor',
    icon: require('../../assets/icons/industrial_floor.png'),
    screen: 'IndustrialfloorScreen',
  },
  {
    id: '6',
    title: 'Shop',
    icon: require('../../assets/icons/shop.png'),
    screen: 'SellShopScreen',
  },
  {
    id: '7',
    title: 'Showroom',
    icon: require('../../assets/icons/showroom.png'),
    screen: 'SellShowroomScreen',
  },
];

const CommercialSaleScreen = ({ navigation }) => {
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
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image
            source={icons.back}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.heading}>
          Commercial Sale
        </Text>

        <View style={styles.backButton} />
      </View>

      <FlatList
        data={commercialSaleData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <Text style={styles.description}>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default CommercialSaleScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
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
    resizeMode: 'contain',
  },

  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },

  description: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 18,
  },

  contentContainer: {
    paddingBottom: 30,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    height: 63,
    paddingHorizontal: 16,
    marginBottom: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  icon: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
    marginRight: 18,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
  },
});