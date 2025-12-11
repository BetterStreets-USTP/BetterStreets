import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { REPORT_STATUS, CATEGORIES, COLORS } from '../utils/constants';
import { RADIUS, SPACING, SHADOWS } from '../utils/gradients';
import { formatDate } from '../utils/helpers';
import Card from './Card';

const ReportCard = ({ report, onPress }) => {
  // Map backend status to frontend
  const statusMap = {
    'pending': 'PENDING',
    'in-progress': 'IN_PROGRESS',
    'resolved': 'RESOLVED',
    'rejected': 'REJECTED',
  };
  
  const statusKey = statusMap[report.status] || 'PENDING';
  const status = REPORT_STATUS[statusKey] || REPORT_STATUS.PENDING;
  const category = CATEGORIES.find(cat => cat.id === report.category) || CATEGORIES[CATEGORIES.length - 1];

  // Get photo URL - handle both backend format (photos array) and frontend format (image)
  const photoUrl = report.photos?.[0]?.path 
    ? `http://192.168.1.91:3000${report.photos[0].path}` 
    : report.image;

  // Get location address - handle both backend format and frontend format
  const locationText = report.location?.address || report.location || 'Location not specified';

  return (
    <Card onPress={() => onPress(report)} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <LinearGradient
            colors={[category.color, category.color + 'CC']}
            style={styles.categoryBadge}
          >
            <Ionicons name={category.icon} size={20} color={COLORS.white} />
          </LinearGradient>
          <View style={styles.headerText}>
            <Text style={styles.category}>{category.label}</Text>
            <Text style={styles.date}>{formatDate(report.createdAt)}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      {photoUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: photoUrl }} style={styles.image} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.imageOverlay}
          />
        </View>
      )}

      <View style={styles.cardBody}>
        <Text style={styles.description} numberOfLines={3}>
          {report.description}
        </Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color={COLORS.primary} />
          <Text style={styles.location} numberOfLines={1}>
            {locationText}
          </Text>
        </View>
        
        {report.upvotes?.length > 0 && (
          <View style={styles.upvotesContainer}>
            <Ionicons name="arrow-up-circle" size={16} color={COLORS.success} />
            <Text style={styles.upvotesText}>
              {Array.isArray(report.upvotes) ? report.upvotes.length : report.upvotes} upvotes
            </Text>
          </View>
        )}
      </View>

      {report.offline && (
        <View style={styles.offlineBadge}>
          <Ionicons name="cloud-offline" size={14} color={COLORS.white} />
          <Text style={styles.offlineText}>Pending Sync</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryBadge: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  headerText: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  category: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  imageContainer: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginVertical: SPACING.sm,
  },
  image: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  cardBody: {
    marginTop: SPACING.xs,
  },
  description: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 21,
    marginBottom: SPACING.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xs,
  },
  location: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 6,
    flex: 1,
    fontWeight: '500',
  },
  upvotesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upvotesText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 6,
    fontWeight: '600',
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.sm,
    ...SHADOWS.small,
  },
  offlineText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 6,
  },
});

export default ReportCard;
