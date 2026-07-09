import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Platform,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import { getCategories } from '../../services/api/categoryApi';
import { getinventoryCategories, getSubCategories } from '../../services/api/subCategoryApi';
import { getImageUrl } from '../../services/api/api';

const icons = {
  back: require('../../assets/icons/back.png'),
};

const screenMap = {
  'residential sale': 'ResidentialSale',
  'residential rental': 'ResidentialRental',
  'commercial sale': 'CommercialSale',
  'commercial rental': 'CommercialRental',
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
};

const InventoryScreen = ({ navigation }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllSubCategories = useCallback(async (isRefresh = false) => {
    try {
      setError(null);
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // 1. Get all categories (needed only to get their IDs)
      const catRes = await getinventoryCategories();
      const categories = catRes.data || [];
      setSubCategories(categories);
      console.log('Parsed categories array:', categories.length, categories);

    } catch (err) {
      console.log('❌ fetchAllSubCategories error:', err.response?.data || err.message);
      setError('Failed to load subcategories');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllSubCategories();
  }, [fetchAllSubCategories]);

  const handleRefresh = useCallback(() => {
    fetchAllSubCategories(true);
  }, [fetchAllSubCategories]);

  // 👇 navigate to one of the four screens based on item.name
  const handleSubCategoryPress = (sub) => {
    // const key = sub.name?.trim().toLowerCase();
    // const screen = screenMap[key];
    // console.log('Subcategory pressed:', sub.name, '→ screen:', screen);
    // if (!screen) {
    //   console.warn('No screen mapped for:', sub.name);
    //   return;
    // }
    navigation.navigate("ResidentialSale", {
      subCategoryId: sub._id,
      subCategoryName: sub.name,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}>
          <Image source={icons.back} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>

        <Text style={styles.heading}>Inventory</Text>

        <View style={styles.backButton} />
      </View>

      <Text style={styles.description}>
        It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout.
      </Text>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {!loading && error && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => fetchAllSubCategories(false)} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={subCategories}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No subcategories found</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.card}
              onPress={() => handleSubCategoryPress(item)}>
              {item.icon && (
                <Image
                  source={{ uri: getImageUrl(item.icon) }}
                  style={styles.icon}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.cardTitle}>{item.name}</Text> 
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default InventoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  backIcon: { width: 18, height: 18 },
  heading: { fontSize: 20, fontWeight: '700', color: '#111' },
  description: { fontSize: 13, color: '#666', lineHeight: 20, marginBottom: 20 },
  centered: { paddingVertical: 30, alignItems: 'center' },
  errorText: { color: 'red', marginBottom: 10 },
  retryBtn: { padding: 10, backgroundColor: '#eee', borderRadius: 6 },
  retryText: { fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 30 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    paddingHorizontal: 18,
    height: 72,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: { width: 42, height: 42, marginRight: 16 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#222' },
});