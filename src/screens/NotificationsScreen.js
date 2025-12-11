import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import { getData, saveData } from '../services/storageService';
import { COLORS, STORAGE_KEYS } from '../utils/constants';
import { SPACING, RADIUS, SHADOWS } from '../utils/gradients';

const NOTIFICATION_STORAGE_KEY = '@betterstreets_notifications';
const READ_NOTIFICATIONS_KEY = '@betterstreets_read_notifications';

const NotificationsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReadNotifications = async () => {
    try {
      const readIds = await getData(READ_NOTIFICATIONS_KEY);
      if (readIds) {
        setReadNotifications(new Set(readIds));
      }
    } catch (error) {
      console.error('Error loading read notifications:', error);
    }
  };

  const saveReadNotifications = async (readIds) => {
    try {
      await saveData(READ_NOTIFICATIONS_KEY, Array.from(readIds));
    } catch (error) {
      console.error('Error saving read notifications:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      // Fetch announcements
      const announcementsResponse = await apiService.get('/announcements');
      const announcements = announcementsResponse.announcements || [];

      // Fetch user's reports to get status updates
      const reportsResponse = await apiService.get('/reports/user');
      const userReports = reportsResponse.reports || [];

      // Create notification objects
      const notificationsList = [];

      // Add announcements as notifications
      announcements.forEach(announcement => {
        notificationsList.push({
          id: `announcement_${announcement._id}`,
          type: 'announcement',
          title: announcement.title,
          message: announcement.message,
          date: new Date(announcement.createdAt),
          priority: announcement.priority || 'normal',
          icon: 'megaphone',
          iconColor: announcement.priority === 'urgent' ? COLORS.error : COLORS.primary,
          data: announcement,
        });
      });

      // Add report status updates as notifications
      userReports.forEach(report => {
        if (report.statusHistory && report.statusHistory.length > 1) {
          // Get the latest status change (excluding the initial "Pending" status)
          const latestStatus = report.statusHistory[report.statusHistory.length - 1];
          
          notificationsList.push({
            id: `report_${report._id}_${latestStatus.timestamp}`,
            type: 'report_update',
            title: `Report Status Updated`,
            message: `Your report "${report.category}" is now ${latestStatus.status}`,
            date: new Date(latestStatus.timestamp),
            priority: 'normal',
            icon: getStatusIcon(latestStatus.status),
            iconColor: getStatusColor(latestStatus.status),
            data: { reportId: report._id, status: latestStatus.status },
          });
        }
      });

      // Sort by date (newest first)
      notificationsList.sort((a, b) => b.date - a.date);

      setNotifications(notificationsList);
      await saveData(NOTIFICATION_STORAGE_KEY, notificationsList);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Load from cache if available
      const cachedNotifications = await getData(NOTIFICATION_STORAGE_KEY);
      if (cachedNotifications) {
        setNotifications(cachedNotifications);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'construct';
      case 'resolved':
        return 'checkmark-circle';
      case 'rejected':
        return 'close-circle';
      default:
        return 'information-circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return COLORS.warning;
      case 'resolved':
        return COLORS.success;
      case 'rejected':
        return COLORS.error;
      default:
        return COLORS.primary;
    }
  };

  const markAsRead = async (notificationId) => {
    const newReadNotifications = new Set(readNotifications);
    newReadNotifications.add(notificationId);
    setReadNotifications(newReadNotifications);
    await saveReadNotifications(newReadNotifications);
  };

  const markAllAsRead = async () => {
    const allIds = notifications.map(n => n.id);
    const newReadNotifications = new Set(allIds);
    setReadNotifications(newReadNotifications);
    await saveReadNotifications(newReadNotifications);
    Alert.alert('Success', 'All notifications marked as read');
  };

  const handleNotificationPress = async (notification) => {
    // Mark as read
    await markAsRead(notification.id);

    // Navigate based on notification type
    if (notification.type === 'report_update') {
      navigation.navigate('ReportDetails', { reportId: notification.data.reportId });
    } else if (notification.type === 'announcement') {
      // Show full announcement
      Alert.alert(
        notification.title,
        notification.message,
        [{ text: 'OK' }]
      );
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  useEffect(() => {
    loadReadNotifications();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const getUnreadCount = () => {
    return notifications.filter(n => !readNotifications.has(n.id)).length;
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderNotification = ({ item }) => {
    const isRead = readNotifications.has(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !isRead && styles.unreadCard,
        ]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${item.iconColor}15` }]}>
          <Ionicons name={item.icon} size={24} color={item.iconColor} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, !isRead && styles.unreadTitle]} numberOfLines={1}>
              {item.title}
            </Text>
            {!isRead && <View style={styles.unreadDot} />}
          </View>

          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>

          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={80} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyText}>
        You'll see updates about your reports and community announcements here
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notifications.length > 0 && getUnreadCount() > 0 && (
        <View style={styles.headerBar}>
          <Text style={styles.unreadCount}>
            {getUnreadCount()} unread notification{getUnreadCount() !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllRead}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          notifications.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  unreadCount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  markAllRead: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  listContent: {
    padding: SPACING.lg,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  unreadCard: {
    backgroundColor: COLORS.white,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  contentContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default NotificationsScreen;
