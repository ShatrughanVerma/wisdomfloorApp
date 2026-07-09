import { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  useWindowDimensions,
  PixelRatio,
  Platform,
  StatusBar,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// ---- PNG icon imports ----
// Adjust these relative paths based on where this file lives.
// Example assumes: src/screens/organizer/OrganizerScreen.js
// and icons live in: src/assets/icons/
const icons = {
  back: require('../../assets/icons/back.png'),
  call: require('../../assets/icons/call.png'),
  whatsapp: require('../../assets/icons/whatsapp.png'),
  bed: require('../../assets/icons/bed.png'),
  location: require('../../assets/icons/location_icon.png'),
  calendar: require('../../assets/icons/calendar.png'),

  chevronDown: require('../../assets/icons/down_arrow.png'),
};

// ---- Responsive scaling helpers ----
const GUIDELINE_BASE_WIDTH = 375;
const GUIDELINE_BASE_HEIGHT = 812;

function useResponsiveScale() {
  const { width, height, fontScale } = useWindowDimensions();

  const scale = (size) => (width / GUIDELINE_BASE_WIDTH) * size;
  const verticalScale = (size) => (height / GUIDELINE_BASE_HEIGHT) * size;
  const moderateScale = (size, factor = 0.5) =>
    size + (scale(size) - size) * factor;
  const fontSize = (size) => {
    const scaled = moderateScale(size);
    const capped = Math.min(scaled * fontScale, scaled * 1.3);
    return PixelRatio.roundToNearestPixel(capped);
  };

  return { width, height, scale, verticalScale, moderateScale, fontSize };
}

// ---- Dummy data (replace with API data / navigation params) ----
const LEADS = [
  {
    id: '1',
    name: 'Subhash Singh',
    location: 'Moti Nagar',
    bhk: '3 BHK',
    status: 'Completed',
    followUpType: 'Call Follow Up',
    date: '15/02/25',
    time: '16:00',
    initial: 'S',
  },
  {
    id: '2',
    name: 'Subhash Singh',
    location: 'Moti Nagar',
    bhk: '3 BHK',
    status: 'Completed',
    followUpType: 'Call Follow Up',
    date: '15/02/25',
    time: '16:00',
    initial: 'S',
  },
];

const INITIAL_TODOS = [
  {
    id: '1',
    date: '12/09/2025',
    time: '12:00 Pm.',
    description: 'It is a long established fab. It is a long established fab.',
    status: 'Completed',
    initial: 'S',
  },
  {
    id: '2',
    date: '12/09/2025',
    time: '12:00 Pm.',
    description: 'It is a long established fab. It is a long established fab.',
    status: 'Completed',
    initial: 'S',
  },
];

const TABS = [
  { key: 'lead', label: 'Lead' },
  { key: 'todo', label: 'To do list' },
];

export default function OrganizerScreen({ navigation }) {
  const { width, moderateScale, fontSize } = useResponsiveScale();
  const styles = createStyles({ moderateScale, fontSize });
  const isTablet = width >= 768;

  const [activeTab, setActiveTab] = useState('lead');
  const [followUpFilter] = useState('Call Follow Up');
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 12)); // 12/10/2025
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [todoItems, setTodoItems] = useState(INITIAL_TODOS);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskInput, setTaskInput] = useState('');

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'dismissed') {
      return;
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleAddTask = () => {
    const trimmed = taskInput.trim();
    if (!trimmed) {
      return;
    }
    const now = new Date();
    const newTodo = {
      id: Date.now().toString(),
      date: formatDate(now),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: trimmed,
      status: 'Pending',
      initial: 'S',
    };
    setTodoItems((prev) => [newTodo, ...prev]);
    setTaskInput('');
    setShowAddTaskModal(false);
  };

  const closeAddTaskModal = () => {
    setTaskInput('');
    setShowAddTaskModal(false);
  };

  const renderLead = ({ item }) => (
    <View style={styles.leadCard}>
      <View style={styles.leadCardTop}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{item.initial}</Text>
        </View>

        <View style={styles.leadInfo}>
          <Text style={styles.leadName}>{item.name}</Text>

          <View style={styles.leadStatsRow}>
            <View style={styles.statItem}>
              <Image source={icons.location} style={styles.statIcon} resizeMode="contain" />
              <Text style={styles.statText}>{item.location}</Text>
            </View>
            <View style={styles.statItem}>
              <Image source={icons.bed} style={styles.statIcon} resizeMode="contain" />
              <Text style={styles.statText}>{item.bhk}</Text>
            </View>
          </View>
        </View>

        <View style={styles.leadRightCol}>
          <View style={styles.actionIcons}>
            <TouchableOpacity
              style={styles.iconCircleBlue}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Image source={icons.call} style={styles.callIcon} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconCircleGreen}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Image source={icons.whatsapp} style={styles.whatsappIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          <Text style={styles.followUpType}>{item.followUpType}</Text>

          <View style={styles.dateTimeRow}>
            <Image source={icons.calendar} style={styles.metaIcon} resizeMode="contain" />
            <Text style={styles.metaText}>{item.date}</Text>
            <Image
              source={icons.calendar}
              style={[styles.metaIcon, { marginLeft: moderateScale(8) }]}
              resizeMode="contain"
            />
            <Text style={styles.metaText}>{item.time}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.statusPill} activeOpacity={0.8}>
        <Text style={styles.statusPillText}>{item.status}</Text>
        <Image source={icons.chevronDown} style={styles.chevronIcon} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );

  const renderTodo = ({ item }) => (
    <View style={styles.todoCard}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{item.initial}</Text>
      </View>

      <View style={styles.todoInfo}>
        <View style={styles.todoDateRow}>
          <Text style={styles.todoDate}>{item.date}</Text>
          <Text style={styles.todoTime}>{item.time}</Text>
        </View>

        <Text style={styles.todoDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <TouchableOpacity style={styles.statusPill} activeOpacity={0.8}>
          <Text style={styles.statusPillText}>{item.status}</Text>
          <Image source={icons.chevronDown} style={styles.chevronIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

      <View style={[styles.contentWrapper, isTablet && styles.contentWrapperTablet]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image source={icons.back} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Organizer</Text>
          <View style={{ width: moderateScale(26) }} />
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {TABS.map((tab, index) => {
            const isActive = tab.key === activeTab;
            const isLast = index === TABS.length - 1;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tabButton,
                  !isLast && styles.tabButtonSpacing,
                  isActive && styles.tabButtonActive,
                ]}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Filters */}
        {activeTab === 'lead' ? (
          <View style={styles.filtersRow}>
            <TouchableOpacity style={styles.filterPill} activeOpacity={0.8}>
              <Text style={styles.filterText}>{followUpFilter}</Text>
              <Image source={icons.chevronDown} style={styles.chevronIcon} resizeMode="contain" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterPill}
              activeOpacity={0.8}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.filterText}>{formatDate(selectedDate)}</Text>
              <Image source={icons.calendar} style={styles.metaIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.filtersRow, styles.filtersRowRight]}>
            <TouchableOpacity
              style={styles.filterPill}
              activeOpacity={0.8}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.filterText}>{formatDate(selectedDate)}</Text>
              <Image source={icons.calendar} style={styles.metaIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        )}

        {/* List */}
        {activeTab === 'lead' ? (
          <FlatList
            data={LEADS}
            keyExtractor={(item) => item.id}
            renderItem={renderLead}
            numColumns={isTablet ? 2 : 1}
            key={isTablet ? 'two-col-lead' : 'one-col-lead'}
            columnWrapperStyle={isTablet ? { gap: moderateScale(12) } : undefined}
            contentContainerStyle={{ paddingBottom: moderateScale(20) }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={todoItems}
            keyExtractor={(item) => item.id}
            renderItem={renderTodo}
            numColumns={isTablet ? 2 : 1}
            key={isTablet ? 'two-col-todo' : 'one-col-todo'}
            columnWrapperStyle={isTablet ? { gap: moderateScale(12) } : undefined}
            contentContainerStyle={{ paddingBottom: moderateScale(20) }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating add button (To do list only) */}
      {activeTab === 'todo' && (
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => setShowAddTaskModal(true)}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}

      {/* Add task modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showAddTaskModal}
        onRequestClose={closeAddTaskModal}
      >
        <KeyboardAvoidingView
          style={styles.addTaskOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={closeAddTaskModal}
          />

          <View style={styles.addTaskCard}>
            <Text style={styles.addTaskTitle}>To do list</Text>

            <Text style={styles.addTaskLabel}>Task</Text>
            <TextInput
              style={styles.addTaskInput}
              placeholder="Enter Task"
              placeholderTextColor="#9AA0A6"
              value={taskInput}
              onChangeText={setTaskInput}
              multiline
            />

            <TouchableOpacity
              style={styles.addTaskDoneButton}
              activeOpacity={0.85}
              onPress={handleAddTask}
            >
              <Text style={styles.addTaskDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Date picker */}
      {showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {showDatePicker && Platform.OS === 'ios' && (
        <Modal transparent animationType="fade" visible={showDatePicker}>
          <TouchableOpacity
            style={styles.datePickerOverlay}
            activeOpacity={1}
            onPress={() => setShowDatePicker(false)}
          >
            <TouchableOpacity activeOpacity={1} style={styles.datePickerSheet}>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
              <TouchableOpacity
                style={styles.datePickerDoneButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.datePickerDoneText}>Done</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const createStyles = ({ moderateScale, fontSize }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    contentWrapper: {
      flex: 1,
      paddingHorizontal: moderateScale(16),
      width: '100%',
    },
    contentWrapperTablet: {
      maxWidth: 720,
      alignSelf: 'center',
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: moderateScale(10),
      marginBottom:'20',
    },
    backIcon: {
      width: moderateScale(18),
      height: moderateScale(18),
    },
    headerTitle: {
      fontSize: fontSize(16),
      fontWeight: '700',
      color: '#1A1A1A',
    },

    // Tabs
    tabsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: moderateScale(14),
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: moderateScale(9),
      paddingHorizontal: moderateScale(18),
      borderRadius: moderateScale(20),
    },
    tabButtonSpacing: {
      marginRight: moderateScale(12),
    },
    tabButtonActive: {
      backgroundColor: '#3D8AB0',
    },
    tabText: {
      fontSize: fontSize(13),
      fontWeight: '600',
      color: '#59c7db',
    },
    tabTextActive: {
      color: '#FFFFFF',
    },

    // Filters
    filtersRow: {
      flexDirection: 'row',
      marginBottom: moderateScale(16),
    },
    filterPill: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: '#E3E6EC',
      borderRadius: moderateScale(10),
      paddingVertical: moderateScale(9),
      paddingHorizontal: moderateScale(12),
      marginRight: moderateScale(10),
      minWidth: moderateScale(130),
    },
    filtersRowRight: {
      justifyContent: 'flex-end',
    },
    filterText: {
      fontSize: fontSize(12),
      color: '#4A4A4A',
      marginRight: moderateScale(6),
    },
    chevronIcon: {
      width: moderateScale(10),
      height: moderateScale(10),
      tintColor: '#9AA0A6',
    },

    // Lead card
    leadCard: {
      backgroundColor: '#F0F5FF',
      borderRadius: moderateScale(14),
      padding: moderateScale(12),
      marginBottom: moderateScale(12),
      flex: 1,
    },
    leadCardTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: moderateScale(10),
    },
    avatarCircle: {
      width: moderateScale(34),
      height: moderateScale(34),
      borderRadius: moderateScale(17),
      backgroundColor: '#3D8AB0',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: moderateScale(10),
    },
    avatarText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: fontSize(14),
    },
    leadInfo: {
      flex: 1,
    },
    leadName: {
      fontSize: fontSize(14),
      fontWeight: '700',
      color: '#1A1A1A',
      marginBottom: moderateScale(4),
    },
    leadStatsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: moderateScale(12),
    },
    statIcon: {
      width: moderateScale(12),
      height: moderateScale(12),
      marginRight: moderateScale(4),
      tintColor: '#6B7280',
    },
    statText: {
      fontSize: fontSize(11),
      color: '#6B7280',
    },

    leadRightCol: {
      alignItems: 'flex-end',
    },
    actionIcons: {
      flexDirection: 'row',
      marginBottom: moderateScale(8),
    },
    iconCircleBlue: {
      width: moderateScale(26),
      height: moderateScale(26),
      borderRadius: moderateScale(13),
     
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: moderateScale(6),
    },
    iconCircleGreen: {
      width: moderateScale(26),
      height: moderateScale(26),
      borderRadius: moderateScale(13),
      
      alignItems: 'center',
      justifyContent: 'center',
    },
    callIcon: {
      width: moderateScale(16),
      height: moderateScale(16),
      
    },
    whatsappIcon: {
      width: moderateScale(16),
      height: moderateScale(16),
      
    },
    followUpType: {
      fontSize: fontSize(10),
      color: '#9AA0A6',
      marginBottom: moderateScale(4),
    },
    dateTimeRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaIcon: {
      width: moderateScale(11),
      height: moderateScale(11),
      marginRight: moderateScale(4),
      tintColor: '#6B7280',
    },
    metaText: {
      fontSize: fontSize(10),
      color: '#6B7280',
    },

    // Status pill
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      alignSelf: 'flex-start',
      backgroundColor: '#FFFFFF',
      borderRadius: moderateScale(8),
      paddingVertical: moderateScale(6),
      paddingHorizontal: moderateScale(12),
      minWidth: moderateScale(100),
    },
    statusPillText: {
      fontSize: fontSize(11),
      fontWeight: '600',
      color: '#1A1A1A',
      marginRight: moderateScale(8),
    },

    // To-do card
    todoCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: '#F0F5FF',
      borderRadius: moderateScale(14),
      padding: moderateScale(12),
      marginBottom: moderateScale(12),
      flex: 1,
    },
    todoInfo: {
      flex: 1,
      marginLeft: moderateScale(10),
    },
    todoDateRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: moderateScale(4),
    },
    todoDate: {
      fontSize: fontSize(13),
      fontWeight: '700',
      color: '#1A1A1A',
      marginRight: moderateScale(8),
    },
    todoTime: {
      fontSize: fontSize(11),
      color: '#9AA0A6',
    },
    todoDescription: {
      fontSize: fontSize(11),
      color: '#6B7280',
      marginBottom: moderateScale(10),
      lineHeight: moderateScale(16),
    },

    // Floating action button
    fab: {
      position: 'absolute',
      right: moderateScale(20),
      bottom: moderateScale(28),
      width: moderateScale(52),
      height: moderateScale(52),
      borderRadius: moderateScale(26),
      backgroundColor: '#2F6FED',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
    },
    fabIcon: {
      color: '#FFFFFF',
      fontSize: fontSize(26),
      fontWeight: '400',
      lineHeight: fontSize(28),
    },

    // Date picker (iOS modal)
    datePickerOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'flex-end',
    },
    datePickerSheet: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: moderateScale(16),
      borderTopRightRadius: moderateScale(16),
      paddingBottom: moderateScale(20),
    },
    datePickerDoneButton: {
      alignSelf: 'flex-end',
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(18),
    },
    datePickerDoneText: {
      fontSize: fontSize(14),
      fontWeight: '700',
      color: '#10768d',
    },

    // Add task modal
    addTaskOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: moderateScale(24),
    },
    addTaskCard: {
      width: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: moderateScale(16),
      padding: moderateScale(20),
    },
    addTaskTitle: {
      fontSize: fontSize(16),
      fontWeight: '700',
      color: '#1A1A1A',
      marginBottom: moderateScale(16),
    },
    addTaskLabel: {
      fontSize: fontSize(11),
      color: '#9AA0A6',
      marginBottom: moderateScale(6),
    },
    addTaskInput: {
      borderWidth: 1,
      borderColor: '#E3E6EC',
      borderRadius: moderateScale(10),
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(10),
      fontSize: fontSize(13),
      color: '#1A1A1A',
      minHeight: moderateScale(44),
      textAlignVertical: 'top',
      marginBottom: moderateScale(20),
    },
    addTaskDoneButton: {
      backgroundColor: '#3E7CB1',
      borderRadius: moderateScale(10),
      paddingVertical: moderateScale(13),
      alignItems: 'center',
      justifyContent: 'center',
    },
    addTaskDoneText: {
      fontSize: fontSize(14),
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });