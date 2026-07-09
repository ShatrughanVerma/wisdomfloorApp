import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import { getSubCategories } from '../../services/api/subCategoryApi';
import { getImageUrl } from '../../services/api/api';

const icons = {
  back: require('../../assets/icons/back.png'),
};

const screenMap = {
  'apartment': 'ApartmentScreen',
  'builder floor': 'BuilderFloor',
  'villa': 'VillaScreen',
  'bungalow': 'BungalowScreen',
  'plot': 'PlotScreen',
  'farm house': 'FarmHouseScreen',
  'farmhouse': 'FarmHouseScreen',
  'office': 'CommercialofficeScreen',
  'godown': 'CommercialGodownScreen',
  'warehouse': 'CommercialWarehouseScreen',
  'industrial': 'CommercialIndustrialScreen',
  'industrial floor': 'IndustrialfloorScreen',
  'shop': 'SellShopScreen',
  'showroom': 'SellShowroomScreen',
  'residential rent apartment': 'ResidentialRentApartmentScreen',
  'residential rent builder': 'ResidentialRentBuilderScreen',
  'residential rent villa': 'ResiRentVillaScreen',
  'residential rent bungalow': 'ResiRentBungalowScreen',
  'residential rent farm house': 'ResiRentFarmHouseScreen',
};

const ResidentialSaleScreen = ({ navigation, route }) => {

  const { subCategoryId, subCategoryName } = route.params || {};
  const [data , setData] = useState([]);

 const loadCategories = async (id) => {
  try {
    const catRes = await getSubCategories(id);
    
    console.log("dsnjfsgvjkndjkfgnvksndfn------------------------------",catRes);
    if(catRes && catRes.data){
setData(catRes.data);
    }
    
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  loadCategories(subCategoryId);
}, [subCategoryId]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => {
        console.log("item---------oooooooooooooooooooooooooooo>",item._id, subCategoryId);
       navigation.navigate("ApartmentScreen", {categoryId: subCategoryId ,  subCategoryId: item._id, subCategoryName: item.name });
      }}>
      <Image
        source={{ uri: getImageUrl(item?.icon) }}
        style={styles.icon}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        {item?.name}
      </Text>
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
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={icons.back}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.heading}>
          {subCategoryName
            ? subCategoryName.charAt(0).toUpperCase() + subCategoryName.slice(1)
            : ""}
        </Text>

        <View style={styles.backButton} />

      </View>

      {/* Description */}

      <Text style={styles.description}>
        It is a long established fact that a reader
        will be distracted by the readable content
        of a page when looking at its layout.
      </Text>

      {/* List */}

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      />
    </SafeAreaView>
  );
};

export default ResidentialSaleScreen;
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
    marginBottom: 20,
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
    color: '#1E1E1E',
  },

  description: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 18,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 70,
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

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
  },
});