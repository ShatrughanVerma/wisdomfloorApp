import React, { useCallback, useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { getCategories } from '../../services/api/categoryApi';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Image_BASE_URL } from '../../services/api/api';

// ─── Constants ────────────────────────────────────────────────────────────────
const TEAL_DARK = '#0D2B35';
const TEAL_MID = '#3A8FA3';
const BG = '#F0F4F8';
const CARD_BG = '#ffffff';
const TEXT_HEAD = '#1A2E35';
const TEXT_BODY = '#5e5f5f';

// ─── Local icon / screen mapping ─────────────────────────────────────────────
// The API returns `name`, `displayName`, `order`, etc. but `icon` is always
// an empty string right now, and route names in the app don't always match
// the API's `name` 1:1 (e.g. "lead" -> "Leads", "organizer" -> "Organiser").
// This map bridges API category -> local asset + navigation target.
const CATEGORY_META = {
  inventory: {
    screen: 'Inventory',
  },
  lead: {
    screen: 'Leads',
  },
  phonebook: {
    screen: 'Phonebook',
  },
  organizer: {
    screen: 'Organiser',
  },
  agreements: {
    screen: 'Agreements',
  },
  construction: {
    screen: 'Construction',
  },
};

const DEFAULT_META = {
  screen: null,
};
// ─── API helper ───────────────────────────────────────────────────────────────
// Thin wrapper around categoryApi.getCategories() that normalises the result:
// throws with a friendly message on failure, and returns just the category
// array on success.
async function fetchCategories() {
  const json = await getCategories();
console.log("------------------>>>>>>",json.data);
  if (!json || !json.success) {
    throw new Error((json && json.message) || 'Failed to load categories');
  }

  return json.data || [];
}

// Merges API categories with local icon/screen metadata, keeps only active
// ones, and sorts by the `order` field the API gives us.


// ─── Header ───────────────────────────────────────────────────────────────────
const Header = () => (
  <View>
    <ImageBackground
      source={require('../../assets/images/header_bg.png')}
      style={styles.header}
      imageStyle={styles.headerImage}
      resizeMode="cover"
    />

    <LinearGradient
      colors={['#55A3CA', '#436D82']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.welcomeCard}
    >
      <View style={styles.welcomeTop}>
        <View style={styles.leftContent}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.greeting}>Good Morning, Ravi</Text>

          <View style={styles.locationRow}>
            <Image
              source={require('../../assets/icons/location_icon.png')}
              style={styles.locationPin}
              resizeMode="contain"
            />

            <Text style={styles.locationText}>Moti Nagar, Delhi</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.notificationBtn}>
          <Image
            source={require('../../assets/icons/bell_icon.png')}
            style={styles.bellIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </View>
);

// ─── Dashboard Card ───────────────────────────────────────────────────────────
const DashboardCard = ({ item, onPress }) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.8}
    onPress={() => item.screen && onPress(item.screen)}
  >
    <View style={styles.cardIconWrap}>
      <Image
        source={{
          uri: `${Image_BASE_URL}${item.icon}`,
        }}
        style={styles.cardIcon}
        resizeMode="contain"
      />
    </View>

    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{item.title}</Text>

      <Text
        style={styles.cardDesc}
        numberOfLines={3}
      >
        {item.description}
      </Text>
    </View>
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  console.log("==================",items)


function mapCategoriesToDashboardItems(categories) {
  return categories
    .filter(cat => cat.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(cat => {
      const meta = CATEGORY_META[cat.name] || DEFAULT_META;

      return {
        id: cat._id,
        title: cat.displayName,
        description: cat.description,
        icon: cat.icon,        // <-- icon comes from API
        screen: meta.screen,   // <-- navigation comes from frontend
      };
    });
}

  const loadCategories = useCallback(async ({ isRefresh = false } = {}) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError('');

    try {
      const categories = await fetchCategories();
      console.log("category -------------------",categories );
      setItems(mapCategoriesToDashboardItems(categories));
    } catch (err) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;

      if (status === 401) {
        setError('Your session has expired. Please log in again.');
        if (navigation) {
          navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
        }
      } else {
        setError(serverMessage || err.message || 'Something went wrong. Pull down to retry.');
      }
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  }, [navigation]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleNavigate = screenName => {
    if (!screenName) return;
    if (navigation) {
      navigation.navigate(screenName);
    } else {
      console.log('Navigate to:', screenName);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadCategories({ isRefresh: true })}
            tintColor={TEAL_MID}
          />
        }
      >
        <Header />

        <Text style={styles.sectionLabel}>Dashboard</Text>

        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={TEAL_MID}
          />
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => loadCategories()}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          items.map(item => (
            <DashboardCard key={item.id} item={item} onPress={handleNavigate} />
          ))
        )}

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: TEAL_DARK,
  },
  scroll: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    flexGrow: 1,
  },

  header: {
    width: '100%',
    height: 150,
  },

  headerImage: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  welcomeCard: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: -35,
    backgroundColor: '#5BA8D6',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  welcomeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  logo: {
    width: 32,
    height: 32,
    marginBottom: 10,
  },

  notificationBtn: {
    width: 46,
    height: 46,

    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',

    // Android shadow
    elevation: 5,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  bellIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  leftContent: {
    flex: 1,
    marginRight: 12,
  },
  greeting: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  locationPin: {
    width: 14,
    height: 14,
    marginRight: 6,
  },

  locationText: {
    color: '#EAF6FD',
    fontSize: 13,
  },

  sectionLabel: {
    marginTop: 55,
    marginHorizontal: 20,
    marginBottom: 15,
    fontSize: 22,
    fontWeight: '700',
    color: '#4088ab', // Sky blue
  },

  loader: {
    marginTop: 20,
  },

  errorBox: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FCEAEA',
    alignItems: 'center',
  },
  errorText: {
    color: '#B3261E',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryBtn: {
    backgroundColor: TEAL_MID,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  // ── Card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF7FF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,

    height: 110, // <-- Add this

    shadowColor: '#3D8AB0',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 14,
    // 10% Sky Blue
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardIcon: {
    width: 37,
    height: 37,
    tintColor: TEAL_MID,
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_HEAD,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12.5,
    color: TEXT_BODY,
    lineHeight: 18,
    minHeight: 50, // Keeps all descriptions the same height
  },
  bottomPad: { height: 40 },
});