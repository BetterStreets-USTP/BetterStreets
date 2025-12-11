import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { GRADIENTS, RADIUS, SPACING, SHADOWS } from '../utils/gradients';
import Button from '../components/Button';
import apiService from '../services/apiService';

const VerifyOTPScreen = ({ route, navigation }) => {
  console.log('VerifyOTPScreen params:', route.params);
  const { email, name } = route.params || {};
  console.log('Email:', email, 'Name:', name);
  
  // Redirect back if no email provided
  useEffect(() => {
    if (!email) {
      console.error('No email provided to VerifyOTPScreen');
      Alert.alert('Error', 'Email address is required', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  }, [email, navigation]);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  console.log('OTP state:', otp);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verified, setVerified] = useState(false);
  
  const inputRefs = useRef([]);

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (text, index) => {
    // Only allow numbers
    if (text && !/^\d+$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (index === 5 && text && newOtp.every(digit => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode = null) => {
    const otpString = otpCode || otp.join('');
    
    if (otpString.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.verifyOTP(email, otpString);
      
      if (response.success) {
        setVerified(true);
      } else {
        Alert.alert('Verification Failed', response.message || 'Invalid or expired code');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || resending) return;

    setResending(true);
    try {
      const response = await apiService.resendOTP(email);
      
      if (response.success) {
        Alert.alert('Code Sent', 'A new verification code has been sent to your email');
        setCountdown(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        Alert.alert('Failed', response.message || 'Failed to resend code');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handlePaste = (text) => {
    // Handle pasting 6-digit code
    const digits = text.replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length === 6) {
      setOtp(digits);
      inputRefs.current[5]?.blur();
      handleVerify(digits.join(''));
    }
  };

  // Don't render if no email
  if (!email) {
    return null;
  }

  // Show success screen
  if (verified) {
    return (
      <LinearGradient
        colors={GRADIENTS.primary.colors}
        style={styles.container}
      >
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Ionicons name="document-text" size={80} color={COLORS.white} />
          </View>
          <Text style={styles.successTitle}>Registration Successful</Text>
          <Text style={styles.successSubtitle}>
            Your email has been verified.{'\n'}You can now login to your account.
          </Text>
          <Button
            title="Continue"
            onPress={() => navigation.replace('Login')}
            style={styles.continueButton}
          />
        </View>
      </LinearGradient>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={GRADIENTS.primary.colors}
          style={styles.container}
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
          <Ionicons name="mail-open" size={64} color={COLORS.white} />
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {otp && otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => inputRefs.current[index] = ref}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
                loading && styles.otpInputDisabled
              ]}
              value={digit}
              onChangeText={text => handleOtpChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              onPaste={index === 0 ? e => handlePaste(e.nativeEvent.text) : null}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!loading}
              autoFocus={index === 0}
            />
          ))}
        </View>

        <Button
          title={loading ? 'Verifying...' : 'Verify Email'}
          onPress={() => handleVerify()}
          disabled={loading || otp.some(digit => digit === '')}
          loading={loading}
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          {canResend ? (
            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={resending}
              style={styles.resendButton}
            >
              {resending ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.resendButtonText}>Resend Code</Text>
              )}
            </TouchableOpacity>
          ) : (
            <Text style={styles.countdownText}>
              Resend in {countdown}s
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.changeEmailButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="pencil" size={16} color={COLORS.white} />
          <Text style={styles.changeEmailText}>Change Email Address</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
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
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: SPACING.xxl,
    textAlign: 'center',
    lineHeight: 24,
  },
  email: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
    width: '100%',
  },
  otpInput: {
    width: 50,
    height: 60,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  otpInputFilled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: COLORS.white,
  },
  otpInputDisabled: {
    opacity: 0.5,
  },
  resendContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: SPACING.sm,
  },
  resendButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    textDecorationLine: 'underline',
  },
  countdownText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  changeEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xxl,
    paddingVertical: SPACING.md,
  },
  changeEmailText: {
    fontSize: 14,
    color: COLORS.white,
    marginLeft: SPACING.xs,
    textDecorationLine: 'underline',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  successIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  successSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xxl,
    opacity: 0.9,
  },
  continueButton: {
    width: '100%',
  },
});

export default VerifyOTPScreen;
