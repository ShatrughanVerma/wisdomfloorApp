import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// PNG Icons
const icons = {
  back: require('../../assets/icons/back.png'),
  search: require('../../assets/icons/search.png'),
  dropdown: require('../../assets/icons/down_arrow.png'),
  call: require('../../assets/icons/call.png'),
  whatsapp: require('../../assets/icons/whatsapp.png'),
};

const TABS = ['All', 'Owner', 'Broker', 'Builder'];

const CONTACTS = [
  { id: '1', name: 'Subhash Singh' },
  { id: '2', name: 'Subhash Singh' },
  { id: '3', name: 'Subhash Singh' },
  
];

export default function PhonebookScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [locality] = useState('Rajouri Garden');

  const renderContact = ({ item }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={styles.contactCard}
    onPress={() => navigation.navigate('ContactScreen')}>

    <View style={styles.leftSection}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.charAt(0)}
        </Text>
      </View>

      <Text style={styles.contactName}>
        {item.name}
      </Text>
    </View>

    <View style={styles.actionIcons}>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => console.log('Call')}>

        <Image
          source={icons.call}
          style={styles.smallIcon}
        />

      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        style={{marginLeft:12}}
        onPress={() => console.log('WhatsApp')}>

        <Image
          source={icons.whatsapp}
          style={styles.smallIcon}
        />

      </TouchableOpacity>

    </View>

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

        <Text style={styles.headerTitle}>
          Phonebook
        </Text>

        <View style={styles.backButton} />

      </View>

      {/* Search */}

      <View style={styles.searchWrapper}>

        <Image
          source={icons.search}
          style={styles.searchIcon}
          resizeMode="contain"
        />

        <TextInput
          placeholder="Search"
          placeholderTextColor="#9AA0A6"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

      </View>

      {/* Tabs */}

      <View style={styles.tabsRow}>
        {TABS.map(tab => {

          const active = activeTab === tab;

          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabButton,
                active && styles.tabButtonActive,
              ]}>

              <Text
                style={[
                  styles.tabText,
                  active && styles.tabTextActive,
                ]}>
                {tab}
              </Text>

            </TouchableOpacity>
          );
        })}
      </View>

      {/* Locality */}

      <Text style={styles.localityLabel}>
        Locality
      </Text>

      <TouchableOpacity style={styles.localityDropdown}>

        <Text style={styles.localityText}>
          {locality}
        </Text>

        <Image
          source={icons.dropdown}
          style={styles.smallIcon}
        />

      </TouchableOpacity>

      <Text style={styles.totalContacts}>
        Total Contacts ({CONTACTS.length})
      </Text>

      <FlatList
        data={CONTACTS}
        keyExtractor={item => item.id}
        renderItem={renderContact}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#FFFFFF',
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  paddingHorizontal: 16,
},

  /* ---------------- Header ---------------- */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 18,
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

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  /* ---------------- Search ---------------- */

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E4',
    borderRadius: 28,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 18,
  },

  searchIcon: {
    width: 18,
    height: 18,
    tintColor: '#8E8E93',
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },

  /* ---------------- Tabs ---------------- */

  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  tabButton: {
    width: (width - 60) / 4,
    height: 38,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabButtonActive: {
    backgroundColor: '#64A8D8',
    borderColor: '#64A8D8',
  },

  tabText: {
    fontSize: 12,
    color: '#8A8A8A',
    fontWeight: '500',
  },

  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* ---------------- Locality ---------------- */

  localityLabel: {
    fontSize: 12,
    color: '#5A9ED6',
    marginBottom: 6,
    marginLeft: 3,
    fontWeight: '500',
  },

  localityDropdown: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 18,
  },

  localityText: {
    fontSize: 14,
    color: '#7A7A7A',
  },

  /* ---------------- Count ---------------- */

  totalContacts: {
    color: '#5A9ED6',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },

  /* ---------------- Contact Card ---------------- */

  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EDF7FD',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5A9ED6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  contactName: {
    marginLeft: 12,
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
  },

  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconCircleBlue: {
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},

iconCircleGreen: {
  justifyContent: 'center',
  alignItems: 'center',
},

  smallIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});