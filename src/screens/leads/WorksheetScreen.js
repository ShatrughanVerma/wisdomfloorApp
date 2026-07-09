import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import ApartmentModal from '../../components/ApartmentModal';
import CallStatusModal from '../../components/CallStatusModal';

const {width, height} = Dimensions.get('window');

const wp = p => (width * p) / 100;
const hp = p => (height * p) / 100;
const rf = s => s * (width / 375);

const WorksheetScreen = ({navigation}) => {
  const [showModal, setShowModal] = useState(false);
  const [showApartmentModal, setShowApartmentModal] = useState(false);

  const openCamera = async () => {
    setShowApartmentModal(false);
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: true,
    });
    if (result.didCancel || result.errorCode) return;
    // TODO: handle captured photo (result.assets[0])
  };

  const openGallery = async () => {
    setShowApartmentModal(false);
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });
    if (result.didCancel || result.errorCode) return;
    // TODO: handle selected photo (result.assets[0])
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/icons/back.png')}
            style={styles.back}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aryan Yadav</Text>
        <View style={{width: 30}} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp(4)}}>
        
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>S</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.name}>Subhash Singh</Text>
              <View style={styles.row}>
                <Image
                  source={require('../../assets/icons/location_icon.png')}
                  style={styles.smallIcon}
                />
                <Text style={styles.smallText}>Moti Nagar</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.smallText}>123 Sq.ft</Text>
              </View>
              <View style={styles.row}>
                <Image
                  source={require('../../assets/icons/bed.png')}
                  style={styles.smallIcon}
                />
                <Text style={styles.smallText}>3 BHK</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.smallText}>First Floor</Text>
              </View>
              <View style={styles.row}>
                <Image
                  source={require('../../assets/icons/apartment_key.png')}
                  style={styles.smallIcon}
                />
                <Text style={styles.smallText}>Apartment</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.price}>₹20,000</Text>
              </View>
            </View>
            <View style={styles.iconRow}>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => setShowModal(true)}>
                <Image
                  source={require('../../assets/icons/call.png')}
                  style={styles.callIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.circleBtn, {marginLeft: wp(2), backgroundColor: '#E7F8EC'}]}>
                <Image
                  source={require('../../assets/icons/whatsapp.png')}
                  style={styles.callIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Lead Status</Text>
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusText}>Qualified</Text>
            <Text style={styles.followText}>Call follow Up</Text>
          </View>
          <View style={styles.line} />
          <View style={styles.statusRow}>
            <Text style={styles.date}>12/09/2025</Text>
            <Text style={styles.date}>3:00 PM</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.inventoryCard}
            onPress={() => navigation.navigate('LeadInventoryScreen')}>
            <Image
              source={require('../../assets/icons/eye.png')}
              style={styles.actionIcon}
            />
            <Text style={styles.inventoryText}>See Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dashedCard}
            onPress={() => setShowApartmentModal(true)}>
            <Image
              source={require('../../assets/icons/add.png')}
              style={styles.plus}
            />
            <Text style={styles.addText}>Add Apartment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dashedCard}>
            <Image
              source={require('../../assets/icons/add.png')}
              style={styles.plus}
            />
            <Text style={styles.addText}>Upload</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.whiteCard}>
          <Text style={styles.cardHeading}>Latest Call Status</Text>
          <View style={styles.chatRow}>
            <View style={styles.greenCircle}>
              <Image
                source={require('../../assets/icons/answered_call.png')}
                style={styles.callWhite}
              />
            </View>
            <View style={styles.chatBubble}>
              <Text style={styles.chatText}>
                Will get in touch soon, asking to share pricing of property
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.whiteCard}>
          <View style={styles.historyRow}>
            <Text style={styles.cardHeading}>Call Status</Text>
            <TouchableOpacity style={styles.historyBtn}>
              <Text style={styles.historyTxt}>See call history</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.callStatusRow}>
            <View style={styles.statusBox}>
              <Image
                source={require('../../assets/icons/answered_call.png')}
                style={styles.statusIcon}
              />
              <Text style={styles.statusNumber}>21</Text>
            </View>
            <View style={styles.statusBox}>
              <Image
                source={require('../../assets/icons/rejected_call.png')}
                style={styles.statusIcon}
              />
              <Text style={styles.statusNumber}>4</Text>
            </View>
            <View style={styles.statusBox}>
              <Image
                source={require('../../assets/icons/missed_call.png')}
                style={styles.statusIcon}
              />
              <Text style={styles.statusNumber}>4</Text>
            </View>
            <View style={styles.statusBox}>
              <Image
                source={require('../../assets/icons/outgoing_call.png')}
                style={styles.statusIcon}
              />
              <Text style={styles.statusNumber}>4</Text>
            </View>
          </View>
        </View>

        <CallStatusModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onSave={() => setShowModal(false)}
        />

        <ApartmentModal
          visible={showApartmentModal}
          onClose={() => setShowApartmentModal(false)}
          onCamera={openCamera}
          onFiles={openGallery}
          onAgreement={() => setShowApartmentModal(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorksheetScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F7F9FC'},
  header: {
    height: hp(7),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    backgroundColor: '#fff',
  },
  back: {width: wp(5), height: wp(5), resizeMode: 'contain'},
  headerTitle: {fontSize: rf(18), fontWeight: '700', color: '#222'},
  card: {
    backgroundColor: '#EAF5FD',
    margin: wp(4),
    borderRadius: 15,
    padding: wp(4),
  },
  cardTop: {flexDirection: 'row', alignItems: 'center'},
  avatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: '#4A97C8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  avatarText: {color: '#fff', fontSize: rf(18), fontWeight: '700'},
  name: {fontSize: rf(15), fontWeight: '700', color: '#222', marginBottom: hp(0.6)},
  row: {flexDirection: 'row', alignItems: 'center', marginBottom: hp(0.5)},
  smallIcon: {
    width: wp(3.5),
    height: wp(3.5),
    resizeMode: 'contain',
    tintColor: '#777',
    marginRight: 5,
  },
  smallText: {color: '#666', fontSize: rf(11)},
  dot: {marginHorizontal: 6, color: '#999'},
  price: {color: '#4A97C8', fontWeight: '700', fontSize: rf(12)},
  iconRow: {flexDirection: 'row', alignItems: 'center', marginLeft: wp(2)},
  circleBtn: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: '#D7ECFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callIcon: {width: wp(5), height: wp(5), resizeMode: 'contain'},
  sectionTitle: {
    fontSize: rf(16),
    fontWeight: '700',
    marginHorizontal: wp(4),
    marginBottom: hp(1),
    color: '#222',
  },
  statusCard: {
    backgroundColor: '#fff',
    marginHorizontal: wp(4),
    borderRadius: 12,
    padding: wp(4),
    elevation: 2,
  },
  statusRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  statusText: {fontSize: rf(13), fontWeight: '700', color: '#7aaac7'},
  followText: {fontSize: rf(13), color: '#444'},
  line: {height: 1, backgroundColor: '#ECECEC', marginVertical: hp(1.5)},
  date: {color: '#777', fontSize: rf(12)},
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(4),
    marginTop: hp(2),
  },
  inventoryCard: {
    flex: 1,
    backgroundColor: '#4A97C8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(2),
    marginRight: 6,
  },
  dashedCard: {
    flex: 1,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#4A97C8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(2),
    marginLeft: 6,
  },
  actionIcon: {
    width: wp(7),
    height: wp(7),
    tintColor: '#fff',
    resizeMode: 'contain',
    marginBottom: 8,
  },
  inventoryText: {color: '#ddd7d7', fontWeight: '700', fontSize: rf(11)},
  plus: {
    width: wp(6),
    height: wp(6),
    tintColor: '#516b7b',
    resizeMode: 'contain',
    marginBottom: 8,
  },
  addText: {color: '#a3a8ac', fontWeight: '700', fontSize: rf(11)},
  whiteCard: {
    backgroundColor: '#fff',
    marginHorizontal: wp(4),
    marginTop: hp(2),
    borderRadius: 12,
    padding: wp(4),
    elevation: 2,
  },
  cardHeading: {fontSize: rf(15), fontWeight: '700', color: '#222', marginBottom: hp(1.5)},
  chatRow: {flexDirection: 'row', alignItems: 'flex-start'},
  greenCircle: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(8),
    justifyContent: 'center',
    backgroundColor:'#c6cbcf',
    alignItems: 'center',
    marginRight: wp(3),
  },
  callWhite: {
    width: wp(7),
    height: wp(7),
    tintColor: '#25b538',
    resizeMode: 'contain',
  },
  chatBubble: {flex: 1, backgroundColor: '#F4F6F8', borderRadius: 12, padding: wp(3)},
  chatText: {fontSize: rf(12), color: '#555', lineHeight: hp(2.5)},
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  historyBtn: {
    backgroundColor: '#4A97C8',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: 20,
  },
  historyTxt: {color: '#fff', fontWeight: '600', fontSize: rf(11)},
  callStatusRow: {flexDirection: 'row', justifyContent: 'space-between'},
  statusBox: {
    width: wp(20),
    backgroundColor: '#F8F9FC',
    borderRadius: 10,
    paddingVertical: hp(2),
    alignItems: 'center',
  },
  statusIcon: {
    width: wp(7),
    height: wp(7),
    resizeMode: 'contain',
    marginBottom: hp(1),
  },
  statusNumber: {fontSize: rf(16), fontWeight: '700', color: '#858788'},
});