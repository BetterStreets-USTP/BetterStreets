import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, API_CONFIG, STORAGE_KEYS } from '../utils/constants';
import { GRADIENTS, RADIUS, SPACING, SHADOWS } from '../utils/gradients';
import { getData } from '../services/storageService';

const { width } = Dimensions.get('window');

const ReportDetailsScreen = ({ route, navigation }) => {
  const { reportId } = route.params;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchReportDetails();
  }, [reportId]);

  const fetchReportDetails = async () => {
    try {
      const token = await getData(STORAGE_KEYS.USER_TOKEN);
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/reports/${reportId}`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      const data = await response.json();
      const reportData = data.data || data.report || data;
      setReport(reportData);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return ['#FFB74D', '#FF9800'];
      case 'in-progress': return ['#64B5F6', '#2196F3'];
      case 'resolved': return ['#81C784', '#4CAF50'];
      case 'rejected': return ['#E57373', '#F44336'];
      default: return [COLORS.gray, COLORS.darkGray];
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'time-outline';
      case 'in-progress': return 'sync-outline';
      case 'resolved': return 'checkmark-circle-outline';
      case 'rejected': return 'close-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading report details...</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.gray} />
        <Text style={styles.emptyText}>Report not found</Text>
      </View>
    );
  }

  return (
    <>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Status Banner */}
      <LinearGradient
        colors={getStatusColor(report.status)}
        style={styles.statusBanner}
      >
        <Ionicons name={getStatusIcon(report.status)} size={32} color={COLORS.white} />
        <Text style={styles.statusText}>{report.status.toUpperCase().replace('-', ' ')}</Text>
      </LinearGradient>

      {/* Report Info */}
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>{report.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={16} color={COLORS.gray} />
              <Text style={styles.metaText}>{report.reporter?.name || 'Anonymous'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.gray} />
              <Text style={styles.metaText}>
                {new Date(report.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryBadge}>
            <LinearGradient
              colors={GRADIENTS.button.colors}
              start={GRADIENTS.button.start}
              end={GRADIENTS.button.end}
              style={styles.categoryGradient}
            >
              <Ionicons name="pricetag" size={16} color={COLORS.white} />
              <Text style={styles.categoryText}>{report.category}</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Assigned Agency */}
        {report.assignedAgency && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assigned Agency</Text>
            <View style={styles.agencyCard}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.agencyGradient}
              >
                <Ionicons name="briefcase" size={20} color={COLORS.white} />
                <Text style={styles.agencyText}>{report.assignedAgency}</Text>
              </LinearGradient>
            </View>
          </View>
        )}

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{report.description}</Text>
        </View>

        {/* Admin Remarks/Updates */}
        {report.adminNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="information-circle" size={18} color={COLORS.primary} /> Barangay Updates
            </Text>
            <View style={styles.remarksCard}>
              <View style={styles.remarksHeader}>
                <Ionicons name="megaphone" size={20} color={COLORS.primary} />
                <Text style={styles.remarksHeaderText}>Official Remarks</Text>
              </View>
              <Text style={styles.remarksText}>{report.adminNotes}</Text>
            </View>
          </View>
        )}

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationCard}>
            <Ionicons name="location" size={24} color={COLORS.primary} />
            <Text style={styles.locationText}>{report.location?.address || 'No address'}</Text>
          </View>
        </View>

        {/* Photos */}
        {report.photos && report.photos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos ({report.photos.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {report.photos.map((photo, index) => {
                // Handle both object {path: '/uploads/...'} and string '/uploads/...' formats
                const photoPath = typeof photo === 'object' ? photo.path : photo;
                
                // Remove /api from BASE_URL for photos since they're served from /uploads/, not /api/uploads/
                const baseUrl = API_CONFIG.BASE_URL.replace('/api', '');
                const photoUrl = photoPath.startsWith('http') 
                  ? photoPath 
                  : `${baseUrl}${photoPath.startsWith('/') ? photoPath : '/' + photoPath}`;
                
                console.log('Photo URL generated:', photoUrl);
                
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedImage(photoUrl);
                      setModalVisible(true);
                    }}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: photoUrl }}
                      style={styles.photo}
                      resizeMode="cover"
                      onError={(e) => {
                        console.error('Image failed to load:', photoUrl);
                        console.error('Error:', e.nativeEvent.error);
                      }}
                      onLoad={() => console.log('Image loaded successfully:', photoUrl)}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Status Timeline */}
        {report.statusHistory && report.statusHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="git-commit" size={18} color={COLORS.primary} /> Report Timeline
            </Text>
            <View style={styles.timelineContainer}>
              {report.statusHistory.slice().reverse().map((history, index) => {
                const isLast = index === report.statusHistory.length - 1;
                const statusColors = {
                  pending: '#FFB74D',
                  'in-progress': '#64B5F6',
                  resolved: '#81C784',
                  rejected: '#E57373'
                };
                const statusIcons = {
                  pending: 'time',
                  'in-progress': 'sync',
                  resolved: 'checkmark-circle',
                  rejected: 'close-circle'
                };
                return (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={[styles.timelineDot, { backgroundColor: statusColors[history.status] }]}>
                        <Ionicons name={statusIcons[history.status]} size={16} color={COLORS.white} />
                      </View>
                      {!isLast && <View style={styles.timelineLine} />}
                    </View>
                    <View style={styles.timelineContent}>
                      <View style={styles.timelineHeader}>
                        <Text style={[styles.timelineStatus, { color: statusColors[history.status] }]}>
                          {history.status.toUpperCase().replace('-', ' ')}
                        </Text>
                        <Text style={styles.timelineDate}>
                          {new Date(history.timestamp).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                      </View>
                      {history.remarks && (
                        <Text style={styles.timelineRemarks}>{history.remarks}</Text>
                      )}
                      {history.assignedAgency && (
                        <View style={styles.timelineAgency}>
                          <Ionicons name="briefcase-outline" size={14} color={COLORS.gray} />
                          <Text style={styles.timelineAgencyText}>{history.assignedAgency}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </ScrollView>

    {/* Full-Screen Image Modal */}
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity 
          style={styles.modalCloseButton}
          onPress={() => setModalVisible(false)}
        >
          <Ionicons name="close-circle" size={40} color={COLORS.white} />
        </TouchableOpacity>
        
        <Image
          source={{ uri: selectedImage }}
          style={styles.modalImage}
          resizeMode="contain"
        />
        
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        />
      </View>
    </Modal>
    </>
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
    fontWeight: '600',
    color: COLORS.gray,
  },
  emptyText: {
    marginTop: SPACING.md,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 1,
  },
  content: {
    padding: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.gray,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  agencyCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  agencyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  agencyText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
    flex: 1,
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.darkGray,
    lineHeight: 22,
  },
  remarksCard: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  remarksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  remarksHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  remarksText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    lineHeight: 22,
  },
  timelineContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingBottom: SPACING.lg,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.border,
    marginTop: SPACING.xs,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  timelineStatus: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timelineDate: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray,
  },
  timelineRemarks: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.darkGray,
    lineHeight: 20,
    marginBottom: SPACING.xs,
  },
  timelineAgency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SPACING.xs,
  },
  timelineAgencyText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  photo: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: RADIUS.md,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.lightGray,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  modalImage: {
    width: width,
    height: '100%',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
});

export default ReportDetailsScreen;
