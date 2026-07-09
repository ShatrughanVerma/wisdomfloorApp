import React, {useMemo} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  useWindowDimensions,
} from 'react-native';

const leadsData = [
  {
    id: '1',
    title: 'Fresh Leads',
    description:
      'It is a long established fact that a reader will be distracted.',
    screen: 'FreshLeads',
  },
  {
    id: '2',
    title: 'Follow Up Leads',
    description:
      'It is a long established fact that a reader will be distracted.',
    screen: 'FollowUpLeads',
  },
  {
    id: '3',
    title: 'Qualified Leads',
    description:
      'It is a long established fact that a reader will be distracted.',
    screen: 'QualifiedLeads',
  },
  {
    id: '4',
    title: 'Disqualified Leads',
    description:
      'It is a long established fact that a reader will be distracted.',
    screen: 'DisqualifiedLeads',
  },
];

// Design was based on a ~375pt-wide phone. Scale relative to that baseline,
// then clamp so text/icons don't blow up on tablets or shrink too far on
// small phones.
const BASE_WIDTH = 375;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const LeadsScreen = ({navigation}) => {
  const {width, height} = useWindowDimensions();

  // Recomputed on every rotation, fold, or split-screen resize because
  // useWindowDimensions triggers a re-render (unlike a static Dimensions.get
  // call made once outside the component).
  const {styles, numColumns} = useMemo(() => {
    const scale = clamp(width / BASE_WIDTH, 0.85, 1.6);
    const isTablet = width >= 768;
    const columns = isTablet ? 2 : 1;
    const cardGap = 12 * scale;

    const s = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: width * 0.045,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: height * 0.015,
        marginBottom: height * 0.025,
      },
      backIcon: {
        width: clamp(width * 0.05, 18, 28),
        height: clamp(width * 0.05, 18, 28),
        resizeMode: 'contain',
      },
      heading: {
        fontSize: clamp(width * 0.055, 18, 26),
        fontWeight: '700',
        color: '#111',
      },
      headerSpacer: {
        width: clamp(width * 0.06, 20, 30),
      },
      row: {
        justifyContent: 'space-between',
      },
      card: {
        flex: columns > 1 ? 1 / columns : undefined,
        backgroundColor: '#EDF6FC',
        borderRadius: 12 * scale,
        paddingHorizontal: 16 * scale,
        paddingVertical: 16 * scale,
        marginBottom: cardGap,
        marginRight: columns > 1 ? cardGap : 0,
        overflow: 'hidden',
        minHeight: 44, // comfortable touch target
      },
      circle: {
        position: 'absolute',
        width: 92 * scale,
        height: 92 * scale,
        borderRadius: 46 * scale,
        backgroundColor: '#DCECF8',
        right: -24 * scale,
        top: -24 * scale,
      },
      cardTitle: {
        fontSize: clamp(width * 0.04, 15, 19),
        fontWeight: '700',
        color: '#2C2C2C',
        marginBottom: 8 * scale,
      },
      cardDesc: {
        fontSize: clamp(width * 0.03, 12, 15),
        color: '#8C8C8C',
        lineHeight: 20 * scale,
        width: '85%',
      },
      listContent: {
        paddingBottom: height * 0.04,
      },
    });

    return {styles: s, numColumns: columns};
  }, [width, height]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate(item.screen)}>
      <View style={styles.circle} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content"
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/icons/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.heading}>Leads</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        // key forces FlatList to re-mount its layout engine when column
        // count changes (e.g. phone -> tablet), which RN requires.
        key={numColumns}
        data={leadsData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

export default LeadsScreen;