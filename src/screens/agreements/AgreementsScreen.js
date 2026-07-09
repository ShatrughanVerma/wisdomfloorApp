import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
} from 'react-native';

const icons = {
  back: require('../../assets/icons/back.png'),
  add: require('../../assets/icons/add.png'),
  nodata: require('../../assets/icons/no_data.png'),
};

export default function AgreementsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image source={icons.back} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Agreement</Text>

        <View style={styles.backButton} />
      </View>

      {/* Empty State */}
      <View style={styles.emptyContainer}>
        <Image
          source={icons.nodata}
          style={styles.emptyImage}
          resizeMode="contain"
        />

        <Text style={styles.emptyText}>
          NO DATA
        </Text>
      </View>

      {/* Floating Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.fab}
        onPress={() => console.log('Add Agreement')}>
        <Image
          source={icons.add}
          style={styles.fabIcon}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: '#222',
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 70,
  },

  emptyImage: {
    width: 130,
    height: 130,
    marginBottom: 12,
    opacity: 0.9,
  },

  emptyText: {
    fontSize: 13,
    color: '#8F8F8F',
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  fab: {
    position: 'absolute',
    right: 22,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#4A97C9',
    justifyContent: 'center',
    alignItems: 'center',

    elevation: 6,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },

  fabIcon: {
    width: 22,
    height: 22,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
});

