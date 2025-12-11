import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import api from './apiService';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions and get push token
 * @returns {Promise<string|null>} Push token or null if failed
 */
export const registerForPushNotificationsAsync = async () => {
  try {
    let token;

    // Check if running in Expo Go
    const isExpoGo = Constants.appOwnership === 'expo';
    
    if (isExpoGo) {
      console.log('⚠️  Push notifications are not supported in Expo Go (SDK 53+)');
      console.log('📱 They will work in production build (EAS Build APK)');
      console.log('💡 To test now: use "eas build --profile development" or skip for now');
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10B981',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }
      
      // Get the push token
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId || 
                       Constants?.easConfig?.projectId;
      
      const tokenData = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      );
      
      token = tokenData.data;
      
      console.log('✅ Push token registered:', token);
    } else {
      console.log('Must use physical device for Push Notifications');
      return null;
    }

    return token;
  } catch (error) {
    // Gracefully handle Expo Go limitation
    if (error.message?.includes('expo-notifications') || error.message?.includes('Expo Go')) {
      console.log('⚠️  Push notifications not available in Expo Go');
      console.log('✅ Will work in production build (eas build)');
      return null;
    }
    
    console.error('Error registering for push notifications:', error);
    return null;
  }
};

/**
 * Send push token to backend
 * @param {string} pushToken - Expo push token
 * @returns {Promise<boolean>} Success status
 */
export const updatePushToken = async (pushToken) => {
  try {
    if (!pushToken) {
      return false;
    }

    const response = await api.put('/auth/push-token', { pushToken });
    
    if (response.data.success) {
      console.log('Push token updated successfully');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating push token:', error);
    return false;
  }
};

/**
 * Set up notification listener
 * @param {function} callback - Callback function when notification is received
 * @returns {function} Cleanup function
 */
export const setupNotificationListener = (callback) => {
  const subscription = Notifications.addNotificationReceivedListener((notification) => {
    console.log('Notification received:', notification);
    if (callback) {
      callback(notification);
    }
  });

  return () => subscription.remove();
};

/**
 * Set up notification response listener (when user taps notification)
 * @param {function} callback - Callback function with notification response
 * @returns {function} Cleanup function
 */
export const setupNotificationResponseListener = (callback) => {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    console.log('Notification tapped:', response);
    if (callback) {
      callback(response);
    }
  });

  return () => subscription.remove();
};

/**
 * Get notification badge count
 * @returns {Promise<number>} Badge count
 */
export const getBadgeCount = async () => {
  try {
    return await Notifications.getBadgeCountAsync();
  } catch (error) {
    console.error('Error getting badge count:', error);
    return 0;
  }
};

/**
 * Set notification badge count
 * @param {number} count - Badge count
 */
export const setBadgeCount = async (count) => {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Error setting badge count:', error);
  }
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = async () => {
  try {
    await Notifications.dismissAllNotificationsAsync();
    await setBadgeCount(0);
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
};

/**
 * Schedule a local notification (for testing)
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Additional data
 */
export const scheduleLocalNotification = async (title, body, data = {}) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Trigger immediately
    });
  } catch (error) {
    console.error('Error scheduling local notification:', error);
  }
};
