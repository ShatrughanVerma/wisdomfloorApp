import React, { useEffect, useState } from 'react';
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
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';

import { getInventories, deleteInventory } from '../../services/api/InventorydetailsApi';
import { getImageUrl } from '../../services/api/api';
const { width, height } = Dimensions.get('window');

const wp = p => (width * p) / 100;
const hp = p => (height * p) / 100;
const rf = s => (width / 375) * s;

const ApartmentScreen = ({ navigation, route }) => {
  const { subCategoryId, categoryId, subCategoryName } = route.params || {};
  console.log("--------------->>>>>>>>>>>>>>>>>>", subCategoryId, categoryId, subCategoryName);
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);
  // Tracks which item id is currently being deleted, so we can show a
  // small spinner on just that card's delete icon instead of blocking the
  // whole screen.
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  console.log("inventories-===================", inventories);

  const getInventry = async (categoryId, subCategoryId) => {
    try {
      setLoading(true);

      const res = await getInventories(categoryId, subCategoryId);

      console.log("Inventory Response:", res);

      if (res.success) {
        setInventories(res.data);   // or res.data.items if your API returns items
      }
    } catch (error) {
      console.log("Inventory Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInventry(categoryId, subCategoryId);
  }, [categoryId, subCategoryId]);

  // ============ DELETE ============
  const confirmDelete = (item) => {
    Alert.alert(
      'Delete Listing',
      `Are you sure you want to delete this ${item?.addressSnapshot?.city ? `listing in ${item.addressSnapshot.city}` : 'listing'}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(item) },
      ]
    );
  };

  const handleDelete = async (item) => {
    const id = item?._id || item?.id;
    if (!id) return;

    setDeletingId(id);
    try {
      const res = await deleteInventory(id);

      if (res?.success !== false) {
        // Remove locally so the list updates instantly without a refetch
        setInventories((prev) => prev.filter((inv) => (inv._id || inv.id) !== id));
      } else {
        Alert.alert('Error', res?.message || 'Failed to delete listing.');
      }
    } catch (error) {
      console.log('Delete Error:', error);
      Alert.alert('Error', error.message || 'Failed to delete listing. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // ============ CALL / WHATSAPP ============
  // Owner phone always comes from the first owner in the owners array,
  // set when the listing was created via UnifiedForm.
  const getOwnerPhone = (item) =>
    item?.ownerPhone ||
    item?.phone ||
    item?.owners?.[0]?.phone ||
    item?.ownerContact;

  const callOwner = (item) => {
    const phone = getOwnerPhone(item);
    if (!phone) {
      Alert.alert('No phone number', 'This listing has no contact number.');
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert('Error', 'Unable to open dialer')
    );
  };

  const openWhatsApp = (item) => {
    console.log('Full item:', JSON.stringify(item, null, 2));
    const phone = getOwnerPhone(item);
    console.log('Phone found:', phone);
    if (!phone) {
      Alert.alert('No phone number', 'This listing has no contact number.');
      return;
    }

    // wa.me needs digits only, in international format (no +, spaces, dashes)
    const cleanNumber = phone.toString().replace(/\D/g, '');
    const number = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`; // adjust country code if needed

    const message = `Hi, I'm interested in your property in ${item?.addressSnapshot?.city || ''}`;
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to open WhatsApp')
    );
  };

  const renderItem = ({ item }) => {
    const itemId = item?._id || item?.id;
    const isDeleting = deletingId === itemId;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate('ApartmentdetailsScreen', {
            property: item,
          })
        }
      >
        <Image source={{ uri: getImageUrl(item?.inventoryType?.icon) }} style={styles.image} />

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item?.addressSnapshot?.city}</Text>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => confirmDelete(item)}
              disabled={isDeleting}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#E24C4C" />
              ) : (
                <Image
                  source={require('../../assets/icons/delete.png')}
                  style={styles.deleteIcon}
                />
              )}
            </TouchableOpacity>
          </View>

          {/* Bed Bath Area */}

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Image
                source={require('../../assets/icons/home.png')}
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>{item?.numberOfBedrooms}bed</Text>
            </View>

            <View style={styles.detailItem}>
              <Image
                source={require('../../assets/icons/bed.png')}
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>{item?.numberOfBathrooms} bath</Text>
            </View>

            <View style={styles.detailItem}>
              <Image
                source={require('../../assets/icons/area.png')}
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>{item?.area?.value} {item?.area?.unit}</Text>
            </View>
          </View>

          <Text style={styles.owner}>{item?.ownerName}</Text>

          <View style={styles.bottomRow}>
            <Text style={styles.price}>{item?.askingPrice}</Text>

            <View style={styles.iconRow}>
              <TouchableOpacity
                onPress={(e) => { e.stopPropagation(); callOwner(item); }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image
                  source={require('../../assets/icons/call.png')}
                  style={styles.actionIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={(e) => { e.stopPropagation(); openWhatsApp(item); }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
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
  };

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

        <Text style={styles.headerTitle}>
          {subCategoryName}
        </Text>

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
            value={searchQuery}
            onChangeText={setSearchQuery}
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
        data={inventories.filter(item =>
          item?.addressSnapshot?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item?.ownerName?.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={item => item._id || item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: hp(12),
        }}
        refreshing={loading}
        onRefresh={() => getInventry(categoryId, subCategoryId)}
      />
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('UnifiedForm', {
            categoryId: categoryId,
            subCategoryId: subCategoryId,
            propertyName: subCategoryName,
          })
        }
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
    tintColor: '#0a6c75',
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

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: rf(16),
    fontWeight: '700',
    color: '#222',
  },

  deleteBtn: {
    padding: wp(1),
  },

  deleteIcon: {
    width: wp(5.5),
    height: wp(5.5),
    resizeMode: 'contain',
    
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
    tintColor: '#FFFFFF',
  },
});