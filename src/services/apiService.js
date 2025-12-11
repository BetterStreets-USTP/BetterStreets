import axios from 'axios';
import { Platform } from 'react-native';
import { API_CONFIG, STORAGE_KEYS } from '../utils/constants';
import { getData, saveData } from './storageService';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await getData(STORAGE_KEYS.USER_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      await saveData(STORAGE_KEYS.USER_TOKEN, null);
      await saveData(STORAGE_KEYS.USER_DATA, null);
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success && response.data.data) {
      await saveData(STORAGE_KEYS.USER_TOKEN, response.data.data.token);
      await saveData(STORAGE_KEYS.USER_DATA, response.data.data);
      return { success: true, data: response.data.data };
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.log('Login error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed',
      requiresVerification: error.response?.data?.requiresVerification,
      email: error.response?.data?.email,
    };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      // Backend sends requiresVerification flag with data
      return { 
        success: true, 
        data: response.data.data,
        message: response.data.message,
        requiresVerification: response.data.data?.requiresVerification || true
      };
    }
    return { success: false, error: 'Registration failed' };
  } catch (error) {
    console.log('Registration error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Registration failed',
    };
  }
};

export const logout = async () => {
  // For JWT, logout is client-side only - just clear the stored token and user data
  await saveData(STORAGE_KEYS.USER_TOKEN, null);
  await saveData(STORAGE_KEYS.USER_DATA, null);
};

// Report APIs
export const submitReport = async (reportData) => {
  try {
    const formData = new FormData();
    
    // Add title
    if (reportData.title) {
      formData.append('title', reportData.title);
    }
    
    // Add description
    if (reportData.description) {
      formData.append('description', reportData.description);
    }
    
    // Add category
    if (reportData.category) {
      formData.append('category', reportData.category);
    }
    
    // Add location as nested object (backend expects location.latitude and location.longitude)
    if (reportData.latitude && reportData.longitude) {
      formData.append('location[latitude]', reportData.latitude.toString());
      formData.append('location[longitude]', reportData.longitude.toString());
    }
    
    // Add address
    if (reportData.location) {
      formData.append('address', reportData.location);
    }
    
    // Add photos if they exist - React Native FormData format (up to 5)
    if (reportData.images && reportData.images.length > 0) {
      reportData.images.forEach((imageUri, index) => {
        if (!imageUri) return; // Skip null/undefined images
        
        const uriParts = imageUri.split('.');
        const fileType = uriParts[uriParts.length - 1] || 'jpg'; // Default to jpg if no extension
        
        formData.append('photos', {
          uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
          type: `image/${fileType}`,
          name: `report-${Date.now()}-${index}.${fileType}`,
        });
      });
    }

    const response = await api.post('/reports', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data, headers) => {
        // Return FormData as-is for React Native
        return data;
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Submit report error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to submit report',
    };
  }
};

export const getReports = async (filters = {}) => {
  try {
    const response = await api.get('/reports', { params: filters });
    const reports = response.data.success ? response.data.data : (response.data.reports || []);
    // Cache reports for offline access
    await saveData(STORAGE_KEYS.CACHED_REPORTS, reports);
    return { success: true, data: reports };
  } catch (error) {
    // Return cached data if available
    const cached = await getData(STORAGE_KEYS.CACHED_REPORTS);
    if (cached) {
      return { success: true, data: cached, fromCache: true };
    }
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch reports',
    };
  }
};

export const getReportById = async (reportId) => {
  try {
    const response = await api.get(`/reports/${reportId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch report',
    };
  }
};

export const getMyReports = async () => {
  try {
    const response = await api.get('/reports/user/my-reports');
    const reports = response.data.data || response.data.reports || response.data || [];
    return { success: true, data: reports };
  } catch (error) {
    console.error('Get my reports error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch your reports',
    };
  }
};

// Announcements APIs
export const getAnnouncements = async () => {
  try {
    const response = await api.get('/announcements');
    const announcements = response.data.success ? response.data.data : (response.data.announcements || []);
    // Cache announcements for offline access
    await saveData(STORAGE_KEYS.CACHED_ANNOUNCEMENTS, announcements);
    return { success: true, data: announcements };
  } catch (error) {
    // Return cached data if available
    const cached = await getData(STORAGE_KEYS.CACHED_ANNOUNCEMENTS);
    if (cached) {
      return { success: true, data: cached, fromCache: true };
    }
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch announcements',
    };
  }
};

// User Profile APIs
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    await saveData(STORAGE_KEYS.USER_DATA, response.data.user);
    return { success: true, data: response.data.user };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update profile',
    };
  }
};

// Update push token
export const updatePushToken = async (pushToken) => {
  try {
    const response = await api.put('/auth/push-token', { pushToken });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Update push token error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update push token',
    };
  }
};

// Send OTP to email
export const sendOTP = async (email) => {
  try {
    const response = await api.post('/auth/send-otp', { email });
    return {
      success: true,
      message: response.data.message,
      expiresIn: response.data.expiresIn
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to send verification code',
    };
  }
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post('/auth/verify-otp', { email, otp });
    if (response.data.success && response.data.data) {
      // Save token and user data after verification
      await saveData(STORAGE_KEYS.USER_TOKEN, response.data.data.token);
      await saveData(STORAGE_KEYS.USER_DATA, response.data.data);
      return { success: true, data: response.data.data };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Verification failed',
    };
  }
};

// Resend OTP
export const resendOTP = async (email) => {
  try {
    const response = await api.post('/auth/resend-otp', { email });
    return {
      success: true,
      message: response.data.message,
      expiresIn: response.data.expiresIn
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to resend code',
    };
  }
};

// Forgot Password APIs
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return {
      success: true,
      message: response.data.message,
      expiresIn: response.data.expiresIn
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to send reset code',
    };
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', { 
      email, 
      otp, 
      newPassword 
    });
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to reset password',
    };
  }
};

export default {
  login,
  register,
  logout,
  submitReport,
  getReports,
  getReport: getReportById,
  getReportById,
  getMyReports,
  getAnnouncements,
  updateProfile,
  updatePushToken,
  sendOTP,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  api,
};
