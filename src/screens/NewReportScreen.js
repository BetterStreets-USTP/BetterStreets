import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { COLORS, CATEGORIES } from '../utils/constants';
import { GRADIENTS, RADIUS, SPACING, SHADOWS } from '../utils/gradients';
import { getCurrentLocation, getAddressFromCoordinates } from '../utils/locationHelper';
import { submitReport } from '../services/apiService';
import { useOffline } from '../contexts/OfflineContext';
import { generateReportId } from '../utils/helpers';

const NewReportScreen = ({ navigation }) => {
  const { isOnline, addOfflineReport } = useOffline();
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    images: [],
    latitude: null,
    longitude: null,
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isOfflineSubmit, setIsOfflineSubmit] = useState(false);

  // Auto-fetch location on mount
  useEffect(() => {
    handleGetLocation();
  }, []);

  // Reset form when screen comes into focus (when navigating back from other screens)
  useFocusEffect(
    React.useCallback(() => {
      // Only reset form fields, not location
      setFormData(prev => ({
        ...prev,
        category: '',
        description: '',
        images: [],
      }));
      setErrors({});
    }, [])
  );

  const resetForm = () => {
    setFormData({
      category: '',
      description: '',
      images: [],
      latitude: formData.latitude, // Keep location data
      longitude: formData.longitude,
      location: formData.location,
    });
    setErrors({});
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take photos');
        return false;
      }
    }
    return true;
  };

  const handleTakePhoto = async () => {
    if (formData.images.length >= 5) {
      Alert.alert('Limit Reached', 'You can only add up to 5 photos');
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0] && result.assets[0].uri) {
        updateField('images', [...formData.images, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handlePickImage = async () => {
    if (formData.images.length >= 5) {
      Alert.alert('Limit Reached', 'You can only add up to 5 photos');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0] && result.assets[0].uri) {
        updateField('images', [...formData.images, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleGetLocation = async () => {
    setLocationLoading(true);
    try {
      const coords = await getCurrentLocation();
      const address = await getAddressFromCoordinates(coords.latitude, coords.longitude);
      
      updateField('latitude', coords.latitude);
      updateField('longitude', coords.longitude);
      updateField('location', address);
    } catch (error) {
      Alert.alert(
        'Location Required',
        'Please enable location services to report issues at your current location.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => navigation.goBack() },
          { text: 'Retry', onPress: handleGetLocation },
        ]
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.latitude || !formData.longitude) {
      newErrors.location = 'Please capture location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Generate title from category
      const title = `${formData.category} - ${formData.location || 'Community Report'}`;
      
      const reportData = {
        ...formData,
        title,
      };

      if (isOnline) {
        // Submit online
        const result = await submitReport(reportData);
        if (result.success) {
          resetForm();
          setIsOfflineSubmit(false);
          setShowSuccessModal(true);
        } else {
          Alert.alert('Error', result.error || 'Failed to submit report');
        }
      } else {
        // Save offline
        const offlineReport = {
          ...reportData,
          id: generateReportId(),
          status: 'PENDING',
          offline: true,
          createdAt: new Date().toISOString(),
        };
        
        const saved = await addOfflineReport(offlineReport);
        if (saved) {
          resetForm();
          setIsOfflineSubmit(true);
          setShowSuccessModal(true);
        } else {
          Alert.alert('Error', 'Failed to save report offline');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Report an Issue</Text>
          <Text style={styles.headerSubtitle}>Help improve our community</Text>
        </View>

        {/* Category Selection */}
        <Text style={styles.label}>Category *</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((category) => {
            const isActive = formData.category === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCardWrapper}
                onPress={() => updateField('category', category.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isActive ? [category.color, category.color + 'DD'] : ['#FFFFFF', '#FFFFFF']}
                  style={[
                    styles.categoryCard,
                    !isActive && { borderWidth: 2, borderColor: COLORS.border },
                  ]}
                >
                  <View style={[
                    styles.categoryIconContainer,
                    !isActive && { backgroundColor: category.color + '20' }
                  ]}>
                    <Ionicons
                      name={category.icon}
                      size={28}
                      color={isActive ? COLORS.white : category.color}
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryText,
                      isActive && styles.categoryTextActive,
                    ]}
                  >
                    {category.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

        {/* Description */}
        <Input
          label="Description *"
          value={formData.description}
          onChangeText={value => updateField('description', value)}
          placeholder="Describe the issue in detail..."
          multiline
          numberOfLines={5}
          error={errors.description}
          leftIcon={<Ionicons name="document-text" size={20} color={COLORS.textSecondary} />}
        />

        {/* Photos */}
        <Text style={styles.label}>Photos (Up to 5)</Text>
        <Card style={styles.photoContainer}>
          {formData.images.length > 0 && (
            <View style={styles.imagesGrid}>
              {formData.images.map((imageUri, index) => (
                <View key={index} style={styles.imagePreview}>
                  <Image source={{ uri: imageUri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => {
                      const newImages = formData.images.filter((_, i) => i !== index);
                      updateField('images', newImages);
                    }}
                  >
                    <LinearGradient
                      colors={[COLORS.error, '#DC2626']}
                      style={styles.removeImageGradient}
                    >
                      <Ionicons name="close" size={16} color={COLORS.white} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          {formData.images.length < 5 && (
            <View style={styles.photoButtons}>
              <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                <LinearGradient
                  colors={[COLORS.primary + '15', COLORS.primary + '08']}
                  style={styles.photoButtonGradient}
                >
                  <Ionicons name="camera" size={32} color={COLORS.primary} />
                  <Text style={styles.photoButtonText}>Take Photo</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoButton} onPress={handlePickImage}>
                <LinearGradient
                  colors={[COLORS.primary + '15', COLORS.primary + '08']}
                  style={styles.photoButtonGradient}
                >
                  <Ionicons name="image" size={32} color={COLORS.primary} />
                  <Text style={styles.photoButtonText}>Pick Image</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
          
          <Text style={styles.photoCount}>{formData.images.length} / 5 photos</Text>
        </Card>

        {/* Location - Auto-captured */}
        <Text style={styles.label}>Your Current Location *</Text>
        <Card style={styles.locationCard}>
          {locationLoading ? (
            <View style={styles.locationLoadingContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.locationLoadingText}>Getting your location...</Text>
            </View>
          ) : formData.location ? (
            <View style={styles.locationCaptured}>
              <LinearGradient
                colors={[COLORS.success, '#059669']}
                style={styles.locationIcon}
              >
                <Ionicons name="location" size={20} color={COLORS.white} />
              </LinearGradient>
              <View style={styles.locationDetails}>
                <Text style={styles.locationText} numberOfLines={2}>
                  {formData.location}
                </Text>
                <Text style={styles.locationSubtext}>Location auto-captured</Text>
              </View>
              <TouchableOpacity onPress={handleGetLocation} style={styles.refreshButton}>
                <Ionicons name="refresh" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.locationError}>
              <Ionicons name="alert-circle" size={24} color={COLORS.error} />
              <Text style={styles.locationErrorText}>Failed to get location</Text>
              <TouchableOpacity onPress={handleGetLocation}>
                <Text style={styles.retryText}>Tap to retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>
        {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
        <Text style={styles.infoText}>📍 Reports can only be submitted from your current location</Text>

        {/* Submit Button */}
        <Button
          title={isOnline ? 'Submit Report' : 'Save Offline'}
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />

        {!isOnline && (
          <View style={styles.offlineNotice}>
            <Ionicons name="information-circle" size={16} color={COLORS.warning} />
            <Text style={styles.offlineNoticeText}>
              You're offline. Report will be saved and submitted when connection is restored.
            </Text>
          </View>
        )}
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowSuccessModal(false);
          navigation.goBack();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
            </View>
            <Text style={styles.successTitle}>
              {isOfflineSubmit ? 'Report Saved!' : 'Report Submitted!'}
            </Text>
            <Text style={styles.successMessage}>
              {isOfflineSubmit 
                ? 'Your report has been saved offline and will be submitted when you\'re back online.'
                : 'Your issue has been reported successfully. The barangay will review and address it soon.'}
            </Text>
            <Button
              title="Done"
              onPress={() => {
                setShowSuccessModal(false);
                navigation.goBack();
              }}
              style={styles.doneButton}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 120, // Space for floating tab bar
  },
  content: {
    padding: SPACING.lg,
  },
  headerSection: {
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    letterSpacing: 0.3,
  },
  categoriesScroll: {
    marginBottom: SPACING.sm,
  },
  categoriesContent: {
    paddingRight: SPACING.lg,
  },
  categoryCardWrapper: {
    marginRight: SPACING.sm,
  },
  categoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    minWidth: 100,
    ...SHADOWS.small,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
    fontWeight: '600',
  },
  photoContainer: {
    marginBottom: SPACING.lg,
    padding: SPACING.sm,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  photoButton: {
    flex: 1,
  },
  photoButtonGradient: {
    borderWidth: 2,
    borderColor: COLORS.primary + '30',
    borderStyle: 'dashed',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  photoCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  imagePreview: {
    position: 'relative',
    width: '48%',
    aspectRatio: 4 / 3,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.lg,
  },
  removeImageButton: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
  },
  removeImageGradient: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  locationCard: {
    marginBottom: SPACING.sm,
  },
  locationLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
  },
  locationLoadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    fontWeight: '600',
  },
  locationCaptured: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  locationDetails: {
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  refreshButton: {
    padding: SPACING.xs,
  },
  locationError: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  locationErrorText: {
    fontSize: 14,
    color: COLORS.error,
    marginTop: SPACING.xs,
    fontWeight: '600',
  },
  retryText: {
    fontSize: 13,
    color: COLORS.primary,
    marginTop: SPACING.sm,
    fontWeight: '700',
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
    fontStyle: 'italic',
  },
  submitButton: {
    marginTop: SPACING.sm,
  },
  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '20',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.warning + '40',
  },
  offlineNoticeText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.warning,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xxl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    ...SHADOWS.large,
  },
  successIconContainer: {
    marginBottom: SPACING.lg,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  doneButton: {
    width: '100%',
  },
});

export default NewReportScreen;
