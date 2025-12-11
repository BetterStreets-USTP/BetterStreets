import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';
import ReportCard from '../components/ReportCard';
import Card from '../components/Card';
import { COLORS } from '../utils/constants';
import { GRADIENTS, RADIUS, SPACING, SHADOWS } from '../utils/gradients';
import { getReports, getAnnouncements } from '../services/apiService';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { isOnline, offlineReports, syncing, syncOfflineReports } = useOffline();
  const [reports, setReports] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reportsResult, announcementsResult] = await Promise.all([
        getReports({ limit: 5 }),
        getAnnouncements(),
      ]);

      if (reportsResult.success) {
        setReports(Array.isArray(reportsResult.data) ? reportsResult.data : []);
      }

      if (announcementsResult.success) {
        const announcementsData = Array.isArray(announcementsResult.data) ? announcementsResult.data : [];
        console.log('Announcements data:', announcementsData);
        setAnnouncements(announcementsData.slice(0, 3));
      }
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSync = async () => {
    if (offlineReports.length === 0) {
      Alert.alert('No Reports', 'No offline reports to sync');
      return;
    }

    const result = await syncOfflineReports();
    if (result.success) {
      Alert.alert(
        'Sync Complete',
        `Successfully synced ${result.synced} of ${result.total} reports`
      );
      loadData();
    } else {
      Alert.alert('Sync Failed', result.error || 'Unable to sync reports');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
          colors={[COLORS.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={GRADIENTS.primary.colors}
        start={GRADIENTS.primary.start}
        end={GRADIENTS.primary.end}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'}! 👋</Text>
            <Text style={styles.subGreeting}>Let's make our community better</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: isOnline ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)' }]}>
            <Ionicons name={isOnline ? 'wifi' : 'wifi-outline'} size={16} color={COLORS.white} />
            <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Offline Reports Banner */}
      {offlineReports.length > 0 && (
        <TouchableOpacity 
          style={styles.offlineBannerContainer}
          onPress={handleSync} 
          disabled={syncing}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.warning, '#F97316']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.offlineBanner}
          >
            <Ionicons name="cloud-upload" size={24} color={COLORS.white} />
            <View style={styles.offlineBannerText}>
              <Text style={styles.offlineBannerTitle}>
                {offlineReports.length} Report{offlineReports.length > 1 ? 's' : ''} Pending Sync
              </Text>
            <Text style={styles.offlineBannerSubtitle}>
              {syncing ? 'Syncing...' : 'Tap to sync now'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: 0 }]}>Quick Actions</Text>
        </View>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCardWrapper}
            onPress={() => navigation.navigate('ReportTab', { screen: 'NewReport' })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={GRADIENTS.button.colors}
              start={GRADIENTS.button.start}
              end={GRADIENTS.button.end}
              style={styles.actionCard}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="add-circle" size={36} color={COLORS.white} />
              </View>
              <Text style={styles.actionText}>New Report</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCardWrapper}
            onPress={() => navigation.navigate('MyReportsTab')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#06B6D4', '#0891B2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionCard}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="document-text" size={36} color={COLORS.white} />
              </View>
              <Text style={styles.actionText}>My Reports</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCardWrapper}
            onPress={() => navigation.navigate('HeatmapTab')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionCard}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="map" size={36} color={COLORS.white} />
              </View>
              <Text style={styles.actionText}>Heatmap</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Announcements */}
      {announcements.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Updates</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AnnouncementsTab')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          {announcements.map((announcement, index) => (
            <TouchableOpacity
              key={announcement._id?.toString() || announcement.id || index}
              onPress={() => navigation.navigate('AnnouncementsTab')}
              activeOpacity={0.7}
            >
              <Card style={styles.announcementCard}>
                <View style={styles.announcementContent}>
                  <View style={styles.announcementIcon}>
                    <LinearGradient
                      colors={[COLORS.primary, COLORS.primaryDark]}
                      style={styles.announcementIconGradient}
                    >
                      <Ionicons name="megaphone" size={20} color={COLORS.white} />
                    </LinearGradient>
                  </View>
                  <View style={styles.announcementText}>
                    <Text style={styles.announcementTitle} numberOfLines={2}>
                      {announcement.title || 'No title'}
                    </Text>
                    <Text style={styles.announcementDate}>
                      {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'Recent'}
                    </Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Recent Reports */}
      <View style={[styles.section, styles.lastSection]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ReportsTab')}>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>
        {reports.length > 0 ? (
          reports.map((report, index) => (
            <ReportCard
              key={report._id?.toString() || report.id || index}
              report={report}
              onPress={() => navigation.navigate('ReportDetails', { reportId: report._id || report.id })}
            />
          ))
        ) : (
          <Card style={styles.emptyState}>
            <LinearGradient
              colors={[COLORS.primary + '20', COLORS.primary + '10']}
              style={styles.emptyStateGradient}
            >
              <Ionicons name="document-outline" size={56} color={COLORS.primary} />
              <Text style={styles.emptyText}>No reports yet</Text>
              <Text style={styles.emptySubtext}>Be the first to report an issue</Text>
            </LinearGradient>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 100, // Space for floating tab bar
  },
  header: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  subGreeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 4,
  },
  offlineBannerContainer: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  offlineBannerText: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  offlineBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  offlineBannerSubtitle: {
    fontSize: 13,
    color: COLORS.white,
    marginTop: 2,
    opacity: 0.9,
  },
  section: {
    marginTop: SPACING.lg,
  },
  lastSection: {
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.3,
    paddingHorizontal: SPACING.lg,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.xs,
  },
  actionCardWrapper: {
    flex: 1,
  },
  actionCard: {
    aspectRatio: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  actionIconContainer: {
    marginBottom: SPACING.xs,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  announcementCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  announcementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  announcementIcon: {
    marginRight: SPACING.sm,
  },
  announcementIconGradient: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  announcementText: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  announcementDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  emptyState: {
    marginHorizontal: SPACING.md,
    overflow: 'hidden',
  },
  emptyStateGradient: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: SPACING.md,
    fontWeight: '700',
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});

export default HomeScreen;
