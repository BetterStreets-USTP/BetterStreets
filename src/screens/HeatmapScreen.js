import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, CATEGORIES } from '../utils/constants';
import { GRADIENTS, RADIUS, SPACING, SHADOWS } from '../utils/gradients';
import { getReports } from '../services/apiService';

const HeatmapScreen = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 8.4542,
    longitude: 124.6319,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const result = await getReports();
      if (result.success) {
        const reportsWithLocation = result.data.filter(
          report => report.location?.coordinates?.length === 2
        );
        setReports(reportsWithLocation);
      }
    } catch (error) {
      console.error('Load reports error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerColor = (category) => {
    const cat = CATEGORIES.find(c => c.id === category);
    return cat ? cat.color : COLORS.primary;
  };

  const getCategoryIcon = (category) => {
    const cat = CATEGORIES.find(c => c.id === category);
    return cat ? cat.icon : 'alert-circle';
  };

  const filteredReports = selectedCategory
    ? reports.filter(r => r.category === selectedCategory)
    : reports;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={mapRegion}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
      >
        {filteredReports.map((report) => {
          const [longitude, latitude] = report.location.coordinates;
          return (
            <Marker
              key={report._id?.toString() || report.id}
              coordinate={{ latitude, longitude }}
              title={report.category}
              description={report.description}
            >
              <View style={[styles.customMarker, { backgroundColor: getMarkerColor(report.category) }]}>
                <Ionicons
                  name={getCategoryIcon(report.category)}
                  size={20}
                  color={COLORS.white}
                />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity
            style={[styles.filterChip, !selectedCategory && styles.filterChipActive]}
            onPress={() => setSelectedCategory(null)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={!selectedCategory ? GRADIENTS.button.colors : ['#FFFFFF', '#FFFFFF']}
              start={GRADIENTS.button.start}
              end={GRADIENTS.button.end}
              style={styles.filterChipGradient}
            >
              <Text style={[styles.filterText, !selectedCategory && styles.filterTextActive]}>
                All ({reports.length})
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          {CATEGORIES.map((category) => {
            const count = reports.filter(r => r.category === category.id).length;
            const isActive = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setSelectedCategory(isActive ? null : category.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isActive ? [category.color, category.color + 'DD'] : ['#FFFFFF', '#FFFFFF']}
                  style={styles.filterChipGradient}
                >
                  <Ionicons 
                    name={category.icon} 
                    size={16} 
                    color={isActive ? COLORS.white : category.color} 
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                    {category.label.split('/')[0]} ({count})
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <LinearGradient
          colors={[COLORS.white, COLORS.background]}
          style={styles.statsGradient}
        >
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{filteredReports.length}</Text>
              <Text style={styles.statLabel}>Reports</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {filteredReports.filter(r => r.status === 'resolved').length}
              </Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {filteredReports.filter(r => r.status === 'pending').length}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
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
    marginTop: SPACING.sm,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  customMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    ...SHADOWS.medium,
  },
  filterContainer: {
    position: 'absolute',
    top: SPACING.md,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  filterScroll: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  filterChip: {
    marginRight: SPACING.xs,
  },
  filterChipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  filterChipActive: {
    borderColor: 'transparent',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  statsCard: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.md,
    right: SPACING.md,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  statsGradient: {
    padding: SPACING.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
});

export default HeatmapScreen;
