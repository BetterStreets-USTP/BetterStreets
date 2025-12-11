import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { GRADIENTS, RADIUS, SPACING, SHADOWS } from '../utils/gradients';
import Input from '../components/Input';
import Button from '../components/Button';
import apiService from '../services/apiService';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const inputRefs = useRef([]);

  const handleOtpChange = (text, index) => {
    if (text && !/^\d+$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    setErrors({ ...errors, otp: '' });

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResetPassword = async () => {
    const newErrors = {};

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      newErrors.otp = 'Please enter the 6-digit code';
    }

    if (!newPassword) {
      newErrors.password = 'Password is required';
    } else if (newPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.resetPassword(email, otpString, newPassword);

      if (result.success) {
        Alert.alert(
          'Success! 🎉',
          'Your password has been reset successfully. You can now login with your new password.',
          [
            {
              text: 'Go to Login',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } else {
        setErrors({ otp: result.error || 'Failed to reset password' });
      }
    } catch (err) {
      setErrors({ otp: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const result = await apiService.forgotPassword(email);
      if (result.success) {
        Alert.alert('Success', 'A new reset code has been sent to your email');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    }
  };

  return (
    <LinearGradient
      colors={GRADIENTS.primary.colors}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed" size={64} color={COLORS.white} />
            </View>

            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to{'\n'}
              <Text style={styles.email}>{email}</Text>
            </Text>

            <View style={styles.formContainer}>
              <Text style={styles.label}>Verification Code</Text>
              <View style={styles.otpContainer}>
                {otp && otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => inputRefs.current[index] = ref}
                    style={[
                      styles.otpInput,
                      digit && styles.otpInputFilled,
                      errors.otp && styles.otpInputError
                    ]}
                    value={digit}
                    onChangeText={text => handleOtpChange(text, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    autoFocus={index === 0}
                  />
                ))}
              </View>
              {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}

              <TouchableOpacity onPress={handleResendCode} style={styles.resendButton}>
                <Text style={styles.resendText}>Resend Code</Text>
              </TouchableOpacity>

              <Input
                label="New Password"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setErrors({ ...errors, password: '' });
                }}
                placeholder="Enter new password"
                secureTextEntry={!showPassword}
                error={errors.password}
                leftIcon="lock-closed"
                rightIcon={showPassword ? 'eye-off' : 'eye'}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors({ ...errors, confirmPassword: '' });
                }}
                placeholder="Confirm new password"
                secureTextEntry={!showConfirmPassword}
                error={errors.confirmPassword}
                leftIcon="lock-closed"
                rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
                onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              <Button
                title={loading ? 'Resetting...' : 'Reset Password'}
                onPress={handleResetPassword}
                disabled={loading}
                loading={loading}
                style={styles.resetButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xxl,
    opacity: 0.9,
  },
  email: {
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  otpInput: {
    width: 50,
    height: 56,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: RADIUS.md,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  otpInputFilled: {
    borderColor: COLORS.white,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  otpInputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 12,
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  resendButton: {
    alignSelf: 'center',
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  resendText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  resetButton: {
    marginTop: SPACING.lg,
  },
});

export default ResetPasswordScreen;
