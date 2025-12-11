import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { COLORS, API_CONFIG, STORAGE_KEYS } from '../utils/constants';
import { RADIUS, SPACING, SHADOWS } from '../utils/gradients';
import { getData } from '../services/storageService';

const NotificationSettingsScreen = ({ navigation }) => {
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [settings, setSettings] = useState({
    statusUpdates: true,
    newAnnouncements: true,
    reportReminders: true,
    communityUpdates: false,
  });

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status);
  };

  const requestPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionStatus(status);

      if (status === 'granted') {
        Alert.alert('Success', 'Notification permissions granted!');
        
        // Register for push notifications
        const token = await registerForPushNotificationsAsync();
        if (token) {
          await updatePushToken(token);
        }
      } else {
        Alert.alert(
          'Permission Denied',
          'Please enable notifications in your device settings to receive updates.'
        );
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      Alert.alert('Error', 'Failed to request notification permissions');
    }
  };

  const registerForPushNotificationsAsync = async () => {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: COLORS.primary,
        });
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }

      const token = await Notifications.getExpoPushTokenAsync({ projectId });
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  };

  const updatePushToken = async (pushToken) => {
    try {
      const token = await getData(STORAGE_KEYS.USER_TOKEN);
      await fetch(`${API_CONFIG.BASE_URL}/auth/push-token`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ pushToken }),
      });
    } catch (error) {
      console.error('Error updating push token:', error);
    }
  };

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const SettingItem = ({ icon, title, description, value, onToggle, disabled }) => (
    <View style={[styles.settingItem, disabled && styles.settingItemDisabled]}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color={COLORS.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.lightGray, true: COLORS.primary + '80' }}
        thumbColor={value ? COLORS.primary : COLORS.gray}
        disabled={disabled}
      />
    </View>
  );

  const getPermissionStatusText = () => {
    switch (permissionStatus) {
      case 'granted':
        return { text: 'Enabled', color: COLORS.success };
      case 'denied':
        return { text: 'Denied', color: COLORS.error };
      default:
        return { text: 'Not Set', color: COLORS.warning };
    }
  };

  const statusInfo = getPermissionStatusText();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Permission Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Ionicons 
              name={permissionStatus === 'granted' ? 'checkmark-circle' : 'alert-circle'} 
              size={32} 
              color={statusInfo.color} 
            />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Notification Status</Text>
              <Text style={[styles.statusValue, { color: statusInfo.color }]}>
                {statusInfo.text}
              </Text>
            </View>
          </View>

          {permissionStatus !== 'granted' && (
            <TouchableOpacity style={styles.enableButton} onPress={requestPermission}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.white} />
              <Text style={styles.enableButtonText}>Enable Notifications</Text>
            </TouchableOpacity>
          )}

          {permissionStatus === 'denied' && (
            <Text style={styles.helpText}>
              To enable notifications, please go to your device Settings → BetterStreets → Notifications
            </Text>
          )}
        </View>

        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>

          <View style={styles.settingsGroup}>
            <SettingItem
              icon="sync-circle-outline"
              title="Status Updates"
              description="When your report status changes"
              value={settings.statusUpdates}
              onToggle={() => toggleSetting('statusUpdates')}
              disabled={permissionStatus !== 'granted'}
            />

            <SettingItem
              icon="megaphone-outline"
              title="New Announcements"
              description="Official barangay announcements"
              value={settings.newAnnouncements}
              onToggle={() => toggleSetting('newAnnouncements')}
              disabled={permissionStatus !== 'granted'}
            />

            <SettingItem
              icon="time-outline"
              title="Report Reminders"
              description="Reminders about your pending reports"
              value={settings.reportReminders}
              onToggle={() => toggleSetting('reportReminders')}
              disabled={permissionStatus !== 'granted'}
            />

            <SettingItem
              icon="people-outline"
              title="Community Updates"
              description="Updates about nearby reports"
              value={settings.communityUpdates}
              onToggle={() => toggleSetting('communityUpdates')}
              disabled={permissionStatus !== 'granted'}
            />
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
          <Text style={styles.infoText}>
            You'll receive notifications when barangay staff updates your reports with status changes, 
            agency assignments, and remarks.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  statusCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusTextContainer: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  enableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  enableButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  helpText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: SPACING.md,
    lineHeight: 18,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  settingsGroup: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingItemDisabled: {
    opacity: 0.5,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight + '15',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
    marginLeft: SPACING.sm,
  },
});

export default NotificationSettingsScreen;
