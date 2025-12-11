import React from 'react';
import { View, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../utils/constants';
import { GRADIENTS, RADIUS, SHADOWS } from '../utils/gradients';
import { getData } from '../services/storageService';
import HomeScreen from '../screens/HomeScreen';
import ReportNavigator from './ReportNavigator';
import MyReportsScreen from '../screens/MyReportsScreen';
import AllReportsScreen from '../screens/AllReportsScreen';
import AnnouncementsScreen from '../screens/AnnouncementsScreen';
import HeatmapScreen from '../screens/HeatmapScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const NOTIFICATION_STORAGE_KEY = '@betterstreets_notifications';
const READ_NOTIFICATIONS_KEY = '@betterstreets_read_notifications';

const TabNavigator = () => {
  const [unreadCount, setUnreadCount] = React.useState(0);

  const getUnreadCount = async () => {
    try {
      const notifications = await getData(NOTIFICATION_STORAGE_KEY);
      const readNotifications = await getData(READ_NOTIFICATIONS_KEY);
      
      if (!notifications) {
        setUnreadCount(0);
        return;
      }

      const readSet = new Set(readNotifications || []);
      const unread = notifications.filter(n => !readSet.has(n.id)).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error getting unread count:', error);
      setUnreadCount(0);
    }
  };

  // Update badge count when tab is focused
  useFocusEffect(
    React.useCallback(() => {
      getUnreadCount();
      const interval = setInterval(getUnreadCount, 10000); // Update every 10 seconds
      return () => clearInterval(interval);
    }, [])
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let isSpecial = route.name === 'ReportTab';

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ReportTab':
              iconName = 'add';
              break;
            case 'ReportsTab':
              iconName = focused ? 'document-text' : 'document-text-outline';
              break;
            case 'NotificationsTab':
              iconName = focused ? 'notifications' : 'notifications-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'alert-circle-outline';
          }

          if (isSpecial) {
            return (
              <View style={styles.specialButtonContainer}>
                <LinearGradient
                  colors={GRADIENTS.button.colors}
                  start={GRADIENTS.button.start}
                  end={GRADIENTS.button.end}
                  style={styles.specialButton}
                >
                  <Ionicons name={iconName} size={32} color={COLORS.white} />
                </LinearGradient>
              </View>
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          elevation: 12,
          backgroundColor: COLORS.white,
          borderRadius: RADIUS.xl,
          height: 68,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 0,
          ...SHADOWS.floating,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        headerStyle: {
          backgroundColor: COLORS.white,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: COLORS.primary,
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 22,
          color: COLORS.primary,
          letterSpacing: 0.5,
        },
        headerTitleAlign: 'center',
        headerLeftContainerStyle: {
          paddingLeft: 16,
        },
        headerRightContainerStyle: {
          paddingRight: 16,
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerTitle: 'BetterStreets',
          headerLeft: null,
        }}
      />
      <Tab.Screen
        name="ReportsTab"
        component={AllReportsScreen}
        options={({ navigation }) => ({
          title: 'Reports',
          headerShown: false,
        })}
      />
      <Tab.Screen
        name="ReportTab"
        component={ReportNavigator}
        options={{
          title: '',
          headerShown: false,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={({ navigation }) => ({
          title: 'Alerts',
          headerTitle: 'Notifications',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.error,
            color: COLORS.white,
            fontSize: 10,
            fontWeight: '700',
            minWidth: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: COLORS.white,
          },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('HomeTab')}
              style={{ marginLeft: 0 }}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          ),
        })}
        listeners={{
          tabPress: () => {
            setTimeout(() => getUnreadCount(), 500);
          },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: 'Profile',
          headerTitle: 'My Profile',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('HomeTab')}
              style={{ marginLeft: 0 }}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          ),
        })}
      />
      
      {/* Hidden Screens - Not in tab bar */}
      <Tab.Screen
        name="MyReportsTab"
        component={MyReportsScreen}
        options={{
          title: 'My Reports',
          headerShown: false,
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="HeatmapTab"
        component={HeatmapScreen}
        options={{
          title: 'Map',
          headerTitle: 'Issue Heatmap',
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="AnnouncementsTab"
        component={AnnouncementsScreen}
        options={{
          title: 'Updates',
          headerTitle: 'Announcements',
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  specialButtonContainer: {
    position: 'absolute',
    top: -25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specialButton: {
    width: 65,
    height: 65,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.floating,
    borderWidth: 5,
    borderColor: COLORS.white,
  },
});

export default TabNavigator;
