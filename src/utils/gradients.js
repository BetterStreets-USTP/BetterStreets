import { COLORS } from './constants';

/**
 * Modern gradient utilities for 2025-2026 design
 */

// Linear gradient configurations for React Native
export const GRADIENTS = {
  // Primary green gradient
  primary: {
    colors: [COLORS.gradientStart, COLORS.gradientMiddle, COLORS.gradientEnd],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    locations: [0, 0.5, 1],
  },
  
  // Header gradient
  header: {
    colors: [COLORS.primary, COLORS.primaryDark],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  
  // Button gradient
  button: {
    colors: [COLORS.primary, COLORS.primaryDark],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  
  // Card gradient (subtle)
  card: {
    colors: [COLORS.white, COLORS.background],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  
  // Success gradient
  success: {
    colors: [COLORS.success, COLORS.primaryDark],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  
  // Overlay gradient
  overlay: {
    colors: ['transparent', COLORS.overlayLight],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
};

// Shadow presets for modern depth
export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  large: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  
  floating: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
};

// Border radius presets
export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Spacing scale
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
