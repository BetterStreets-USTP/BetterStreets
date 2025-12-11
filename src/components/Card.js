import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/constants';
import { RADIUS, SPACING, SHADOWS } from '../utils/gradients';

const Card = ({ 
  children, 
  style, 
  onPress, 
  gradient = false,
  elevated = true,
  variant = 'default' 
}) => {
  const cardStyles = [
    styles.card,
    elevated && styles.elevated,
    variant === 'outlined' && styles.outlined,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity 
        style={cardStyles} 
        onPress={onPress}
        activeOpacity={0.9}
      >
        {gradient ? (
          <LinearGradient
            colors={[COLORS.white, COLORS.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientContent}
          >
            {children}
          </LinearGradient>
        ) : (
          children
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles}>
      {gradient ? (
        <LinearGradient
          colors={[COLORS.white, COLORS.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientContent}
        >
          {children}
        </LinearGradient>
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    overflow: 'hidden',
  },
  elevated: {
    ...SHADOWS.medium,
  },
  outlined: {
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  gradientContent: {
    borderRadius: RADIUS.lg,
  },
});

export default Card;
