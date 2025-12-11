const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
const expo = new Expo();

/**
 * Send push notification to a single device
 * @param {string} pushToken - Expo push token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Additional data payload
 * @returns {Promise<void>}
 */
exports.sendPushNotification = async (pushToken, title, body, data = {}) => {
  try {
    // Check if the push token is valid
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      return;
    }

    // Construct the message
    const message = {
      to: pushToken,
      sound: 'default',
      title: title,
      body: body,
      data: data,
      priority: 'high',
      channelId: 'default',
    };

    // Send the notification
    const chunks = expo.chunkPushNotifications([message]);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending push notification chunk:', error);
      }
    }

    console.log('Push notification sent successfully:', { title, body });
    return tickets;
  } catch (error) {
    console.error('Error in sendPushNotification:', error);
    throw error;
  }
};

/**
 * Send push notifications to multiple devices
 * @param {Array} recipients - Array of {pushToken, title, body, data}
 * @returns {Promise<void>}
 */
exports.sendBulkPushNotifications = async (recipients) => {
  try {
    const messages = [];

    for (const recipient of recipients) {
      if (!Expo.isExpoPushToken(recipient.pushToken)) {
        console.error(`Invalid push token: ${recipient.pushToken}`);
        continue;
      }

      messages.push({
        to: recipient.pushToken,
        sound: 'default',
        title: recipient.title,
        body: recipient.body,
        data: recipient.data || {},
        priority: 'high',
        channelId: 'default',
      });
    }

    if (messages.length === 0) {
      console.log('No valid push tokens found');
      return;
    }

    // Chunk messages for optimal delivery
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending bulk push notification chunk:', error);
      }
    }

    console.log(`Bulk push notifications sent to ${messages.length} devices`);
    return tickets;
  } catch (error) {
    console.error('Error in sendBulkPushNotifications:', error);
    throw error;
  }
};

/**
 * Get notification title and body based on report status
 * @param {string} status - Report status
 * @param {string} reportTitle - Report title
 * @param {string} remarks - Admin remarks
 * @param {string} assignedAgency - Assigned agency name
 * @returns {object} - {title, body}
 */
exports.getNotificationContent = (status, reportTitle, remarks = '', assignedAgency = null) => {
  const statusConfig = {
    'pending': {
      title: 'Report Submitted ✅',
      body: `Your report "${reportTitle}" has been submitted and is pending review`,
    },
    'in-progress': {
      title: 'Report In Progress 🔄',
      body: assignedAgency 
        ? `Your report "${reportTitle}" is being handled by ${assignedAgency}`
        : `Your report "${reportTitle}" is now being addressed`,
    },
    'resolved': {
      title: 'Report Resolved ✅',
      body: `Your report "${reportTitle}" has been resolved`,
    },
    'rejected': {
      title: 'Report Update ❌',
      body: `Your report "${reportTitle}" status: Rejected`,
    },
  };

  const config = statusConfig[status] || statusConfig['pending'];
  
  // Append remarks if provided
  if (remarks && remarks.trim()) {
    config.body += `\n\n📝 Update: ${remarks}`;
  }

  // Add agency info if provided and not already in body
  if (assignedAgency && !config.body.includes(assignedAgency)) {
    config.body += `\n\n👥 Handled by: ${assignedAgency}`;
  }

  return config;
};

/**
 * Validate push token
 * @param {string} pushToken - Expo push token
 * @returns {boolean}
 */
exports.isValidPushToken = (pushToken) => {
  return Expo.isExpoPushToken(pushToken);
};
