import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ReportCard from '../components/ReportCard';
import Card from '../components/Card';
import { COLORS, REPORT_STATUS } from '../utils/constants';
import { GRADIENTS, RADIUS, SPACING, SHADOWS } from '../utils/gradients';
import { getReports } from '../services/apiService';
import { useFocusEffect } from '@react-navigation/native';

const AllReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useFocusEffect(
    React.useCallback(() => {
      loadReports();
    }, [])
  );

  const loadReports = async () => {
    try {
      const result = await getReports({ limit: 100 }); // Get more reports for community view
      if (result.success) {
        setReports(result.data || []);
      }
    } catch (error) {
      console.error('Load all reports error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReports();
  };

  const getFilteredReports = () => {
    if (filter === 'all') return reports;
    return reports.filter(report => report.status === filter);
  };

  const getStatusCount = (status) => {
    if (status === 'all') return reports.length;
    return reports.filter(r => r.status === status).length;
  };

  const filteredReports = getFilteredReports();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading community reports...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={GRADIENTS.header.colors} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Community Reports</Text>
            <Text style={styles.headerSubtitle}>
              {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.myReportsButton}
            onPress={() => {
              const parent = navigation.getParent();
              if (parent) {
                parent.navigate('MyReportsTab');
              }
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="person" size={20} color={COLORS.white} />
            <Text style={styles.myReportsText}>My Reports</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <LinearGradient colors={GRADIENTS.primary.colors} style={styles.statGradient}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Ionicons name="globe-outline" size={32} color={COLORS.white} />
                <Text style={styles.statNumber}>{reports.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={28} color="rgba(255,255,255,0.9)" />
                <Text style={styles.statNumber}>{getStatusCount('pending')}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="sync-outline" size={28} color="rgba(255,255,255,0.9)" />
                <Text style={styles.statNumber}>{getStatusCount('in-progress')}</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="checkmark-circle-outline" size={28} color="rgba(255,255,255,0.9)" />
                <Text style={styles.statNumber}>{getStatusCount('resolved')}</Text>
                <Text style={styles.statLabel}>Done</Text>
              </View>
            </View>
          </LinearGradient>
        </Card>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterScroll}
        >
          {['all', 'pending', 'in-progress', 'resolved', 'rejected'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.filterChip, filter === status && styles.filterChipActive]}
              onPress={() => setFilter(status)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={filter === status ? GRADIENTS.button.colors : ['#FFFFFF', '#FFFFFF']}
                start={GRADIENTS.button.start}
                end={GRADIENTS.button.end}
                style={styles.filterChipGradient}
              >
                <Text style={[styles.filterText, filter === status && styles.filterTextActive]}>
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')} ({getStatusCount(status)})
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="file-tray-outline" size={80} color={COLORS.gray} />
          <Text style={styles.emptyTitle}>No Reports Yet</Text>
          <Text style={styles.emptyText}>
            {filter === 'all' 
              ? 'No community reports available at this time'
              : `No ${filter} reports at this time`
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredReports}
          renderItem={({ item }) => (
            <ReportCard
              report={item}
              onPress={() => navigation.navigate('ReportDetails', { reportId: item._id })}
            />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        />
      )}
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
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  header: {
    paddingTop: SPACING.xl + 20,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  myReportsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    gap: SPACING.xs,
  },
  myReportsText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    marginTop: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  statCard: {
    overflow: 'hidden',
  },
  statGradient: {
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  filterContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  filterScroll: {
    paddingHorizontal: SPACING.xs,
    gap: SPACING.sm,
  },
  filterChip: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  filterChipGradient: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: SPACING.md,
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

export default AllReportsScreen;
