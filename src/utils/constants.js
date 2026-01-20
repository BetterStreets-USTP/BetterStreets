// API Configuration
// For Android Emulator: Use 10.0.2.2 to connect to host machine
// For Physical Device: Use your computer's IP (192.168.1.91)
export const API_CONFIG = {
  BASE_URL: 'http://10.0.2.2:3000/api', // Android Emulator uses 10.0.2.2
  TIMEOUT: 10000,
};

// Report Categories - BetterStreets Brand Colors (matching backend enum)
export const CATEGORIES = [
  { id: 'Road Damage', label: 'Road Damage', icon: 'close-circle', color: '#EA80FC' },      // Pastel Purple
  { id: 'Street Lighting', label: 'Street Lighting', icon: 'bulb', color: '#FFFF8D' },     // Pastel Yellow
  { id: 'Garbage/Waste', label: 'Garbage/Waste', icon: 'trash', color: '#FF8A80' },        // Pastel Red
  { id: 'Drainage/Flooding', label: 'Drainage/Flooding', icon: 'water', color: '#80D8FF' }, // Pastel Blue
  { id: 'Illegal Activity', label: 'Illegal Activity', icon: 'warning', color: '#FFD180' }, // Pastel Orange
  { id: 'Public Safety', label: 'Public Safety', icon: 'shield', color: '#FF5252' },        // Red
  { id: 'Infrastructure', label: 'Infrastructure', icon: 'construct', color: '#9FA8DA' },   // Blue
  { id: 'Other', label: 'Other Issues', icon: 'alert-circle', color: '#B0BEC5' },           // Pastel Gray
];

// Report Status - Modern Soft Colors
export const REPORT_STATUS = {
  PENDING: { label: 'Pending', color: '#FFB74D' },       // Soft Orange
  IN_PROGRESS: { label: 'In Progress', color: '#64B5F6' }, // Soft Blue
  RESOLVED: { label: 'Resolved', color: '#81C784' },    // Soft Green
  REJECTED: { label: 'Rejected', color: '#E57373' },    // Soft Red
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: '@betterstreets_token',
  USER_DATA: '@betterstreets_user',
  OFFLINE_REPORTS: '@betterstreets_offline_reports',
  CACHED_REPORTS: '@betterstreets_cached_reports',
  CACHED_ANNOUNCEMENTS: '@betterstreets_cached_announcements',
};

// App Colors - BetterStreets Brand Palette (Matching Logo)
export const COLORS = {
  // Primary gradient colors (from logo)
  primary: '#4CAF7D',          // Medium green from logo
  primaryLight: '#6BC497',     // Light green
  primaryDark: '#2D9666',      // Dark green from logo
  
  // Gradient stops (matching logo gradient)
  gradientStart: '#6BC497',    // Light green top
  gradientMiddle: '#4CAF7D',   // Medium green middle
  gradientEnd: '#2D9666',      // Dark green/teal bottom
  
  // Backgrounds
  background: '#F9FAFB',       // Gray 50 - Clean white-gray
  backgroundSecondary: '#FFFFFF',
  surface: '#FFFFFF',
  
  // Text colors
  text: '#111827',             // Gray 900 - Deep black
  textSecondary: '#6B7280',    // Gray 500
  textLight: '#9CA3AF',        // Gray 400
  
  // Accent & Status
  accent: '#2D9666',           // Dark teal from logo
  success: '#4CAF7D',          // Brand green
  warning: '#F59E0B',          // Amber 500
  error: '#EF4444',            // Red 500
  info: '#3B82F6',             // Blue 500
  
  // UI Elements
  white: '#FFFFFF',
  black: '#000000',
  border: '#E5E7EB',           // Gray 200
  borderLight: '#F3F4F6',      // Gray 100
  disabled: '#D1D5DB',         // Gray 300
  
  // Shadows
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

// Map Configuration
export const MAP_CONFIG = {
  INITIAL_REGION: {
    latitude: 8.4542,
    longitude: 124.6319,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  },
  HEATMAP_RADIUS: 30,
  HEATMAP_OPACITY: 0.6,
};
