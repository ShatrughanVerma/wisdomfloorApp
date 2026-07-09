import React, { useMemo, useEffect, useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  PixelRatio,
  Platform,
} from 'react-native';
import { getInventoryDetails } from '../../services/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BASE_WIDTH = 375;
const MAX_SCALE = 1.35;
const widthScale = Math.min(SCREEN_WIDTH / BASE_WIDTH, MAX_SCALE);

const scale = size => PixelRatio.roundToNearestPixel(size * widthScale);
const scaleFont = size =>
  Math.round(PixelRatio.roundToNearestPixel(size * widthScale));

const isTablet = SCREEN_WIDTH >= 768;

const DetailRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.leftText}>{label}</Text>
    <Text style={styles.rightText}>{value}</Text>
  </View>
);

const DetailSection = ({ title, data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>

    {data.map((item, index) => (
      <DetailRow
        key={`${title}-${index}`}
        label={item.label}
        value={item.value}
      />
    ))}
  </View>
);

const BuilderDetailsScreen = ({ navigation, route }) => {
  const { property } = route.params || {};

  const galleryImages = [
    require('../../assets/images/property1.png'),
    require('../../assets/images/property2.png'),
    require('../../assets/images/property3.png'),
  ];

  const sections = useMemo(() => {
    return [
      {
        title: 'Property Details',
        data: [
          {
            label: 'Bedrooms',
            value: property?.numberOfBedrooms ?? '-',
          },
          {
            label: 'Bathrooms',
            value: property?.numberOfBathrooms ?? '-',
          },
          {
            label: 'Area',
            value: property?.area
              ? `${property.area.value} ${property.area.unit}`
              : '-',
          },
          {
            label: 'Owner',
            value: property?.ownerName ?? '-',
          },
          {
            label: 'Property Type',
            value: property?.inventoryType?.name ?? '-',
          },
        ],
      },
    ];
  }, [property]);
    return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
  source={
    property?.image
      ? { uri: property.image }
      : require('../../assets/images/rajauri.png')
  }
  style={styles.mainImage}
/>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require('../../assets/icons/back.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>

          <FlatList
            horizontal
            data={galleryImages}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryContainer}
            style={styles.galleryOverlay}
            renderItem={({ item }) => (
              <Image source={item} style={styles.galleryImage} />
            )}
          />
        </View>

        {/* Property Information */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {property?.addressSnapshot?.locality || 'No Locality'}
              </Text>

              <Text style={styles.location}>
                {property?.addressSnapshot?.address},{' '}
                {property?.addressSnapshot?.city},{' '}
                {property?.addressSnapshot?.state}
              </Text>

              <Text style={styles.owner}>
                Owner : {property?.ownerName}
              </Text>
            </View>

            <Text style={styles.price}>
              ₹{property?.askingPrice}
            </Text>
          </View>
        </View>

        {sections.map(section => (
          <DetailSection
            key={section.title}
            title={section.title}
            data={section.data}
          />
        ))}

        <View style={{ height: scale(100) }} />
      </ScrollView>

      <View style={styles.floatingContainer}>
        <TouchableOpacity style={styles.floatingButton}>
          <Image
            source={require('../../assets/icons/share.png')}
            style={styles.floatingIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.floatingButton,
            { marginLeft: scale(12) },
          ]}
        >
          <Image
            source={require('../../assets/icons/location.png')}
            style={styles.floatingIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BuilderDetailsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  imageContainer: {
    height: Math.min(SCREEN_HEIGHT * 0.32, scale(280)),
    overflow: 'hidden',
    borderBottomLeftRadius: scale(30),
    borderBottomRightRadius: scale(30),
  },

  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? scale(45) : scale(30),
    left: scale(18),
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },

  backIcon: {
    width: scale(18),
    height: scale(18),
    tintColor: '#fff',
    resizeMode: 'contain',
  },

  galleryOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },

  galleryContainer: {
    paddingHorizontal: scale(50),
  },

  galleryImage: {
    width: scale(78),
    height: scale(80),
    borderRadius: scale(10),
    marginRight: scale(10),
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 6,
  },

  infoContainer: {
    paddingHorizontal: scale(20),
    marginTop: scale(15),
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  title: {
    fontSize: scaleFont(22),
    fontWeight: '700',
    color: '#222',
  },

  location: {
    marginTop: scale(5),
    fontSize: scaleFont(13),
    color: '#888',
  },

  owner: {
    marginTop: scale(8),
    fontSize: scaleFont(14),
    color: '#555',
  },

  price: {
    fontSize: scaleFont(22),
    fontWeight: '700',
    color: '#2E8BCF',
    marginLeft: scale(10),
  },
    section: {
    backgroundColor: '#fff',
    marginHorizontal: scale(15),
    marginTop: scale(15),
    padding: scale(18),
    borderRadius: scale(12),

    ...(isTablet
      ? {
          maxWidth: 700,
          alignSelf: 'center',
          width: '100%',
        }
      : {}),

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },

  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    color: '#222',
    marginBottom: scale(15),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(8),
  },

  leftText: {
    fontSize: scaleFont(14),
    color: '#8A8A8A',
  },

  rightText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#555',
  },

  floatingContainer: {
    position: 'absolute',
    right: scale(20),
    bottom: scale(25),
    flexDirection: 'row',
  },

  floatingButton: {
    width: scale(52),
    height: scale(52),
    borderRadius: scale(26),
    backgroundColor: '#2E8BCF',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8,
  },

  floatingIcon: {
    width: scale(24),
    height: scale(24),
    tintColor: '#fff',
    resizeMode: 'contain',
  },
});