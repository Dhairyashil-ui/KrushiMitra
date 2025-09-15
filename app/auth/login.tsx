import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Pressable,
  KeyboardTypeOptions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Phone, Lock, User } from 'lucide-react-native';

interface CustomInputProps {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  error?: string;
}

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
}

// Professional Input Component
const CustomInput: React.FC<CustomInputProps> = ({ 
  icon, 
  placeholder, 
  value, 
  onChangeText, 
  keyboardType = 'default', 
  maxLength, 
  error 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusedAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focusedAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const borderColor = focusedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E0E0E0', '#2E7D32'],
  });

  const shadowOpacity = focusedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.3],
  });

  return (
    <View style={styles.inputWrapper}>
      <Animated.View 
        style={[
          styles.inputContainer, 
          { 
            borderColor,
            shadowOpacity,
          }
        ]}
      >
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Professional Button Component
const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, disabled, style, textStyle }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View 
        style={[
          styles.button, 
          style,
          disabled && styles.buttonDisabled,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [errors, setErrors] = useState<{phone?: string; otp?: string}>({});
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Fade in animation on component mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validatePhoneNumber = (phone: string) => {
    if (!phone) return 'Phone number is required';
    if (!/^\d{10}$/.test(phone)) return 'Please enter a valid 10-digit phone number';
    return null;
  };

  const validateOtp = (otpValue: string) => {
    if (!otpValue) return 'OTP is required';
    if (!/^\d{6}$/.test(otpValue)) return 'Please enter a valid 6-digit OTP';
    return null;
  };

  const handleSendOtp = async () => {
    const phoneError = validatePhoneNumber(phoneNumber);
    if (phoneError) {
      setErrors({ phone: phoneError });
      return;
    }

    setErrors({});
    setOtpLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setShowOtp(true);
      setOtpLoading(false);
      Alert.alert('Success', 'OTP sent successfully to your phone number');
    }, 1500);
  };

  const handleLogin = async () => {
    const phoneError = validatePhoneNumber(phoneNumber);
    const otpError = validateOtp(otp);
    
    if (phoneError || otpError) {
      setErrors({
        phone: phoneError,
        otp: otpError,
      });
      return;
    }

    setErrors({});
    setLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 2000);
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <LinearGradient
          colors={['#E8F5E8', '#F1F8E9', '#FFFFFF']}
          style={styles.gradient}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <User size={48} color="#2E7D32" />
              </View>
              <Text style={styles.welcomeTitle}>Welcome Back</Text>
              <Text style={styles.subtitle}>Login to continue your KrushiMitra journey</Text>
            </View>
            
            {/* Login Form Card */}
            <View style={styles.formCard}>
              <View style={styles.formContent}>
                {/* Phone Number Input */}
                <View style={styles.phoneRow}>
                  <View style={styles.phoneInputContainer}>
                    <CustomInput
                      icon={<Phone size={20} color="#666" />}
                      placeholder="Enter Mobile Number"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      maxLength={10}
                      error={errors.phone}
                    />
                  </View>
                  <CustomButton
                    title={otpLoading ? 'Sending...' : 'Send OTP'}
                    onPress={handleSendOtp}
                    disabled={otpLoading || !phoneNumber}
                    style={styles.otpButton}
                    textStyle={styles.otpButtonText}
                  />
                </View>
                
                {/* OTP Input */}
                {showOtp && (
                  <Animated.View
                    style={{
                      opacity: fadeAnim,
                      transform: [{ translateY: slideAnim }],
                    }}
                  >
                    <CustomInput
                      icon={<Lock size={20} color="#666" />}
                      placeholder="Enter OTP"
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="numeric"
                      maxLength={6}
                      error={errors.otp}
                    />
                  </Animated.View>
                )}
                
                {/* Login Button */}
                <CustomButton
                  title={loading ? 'Logging in...' : 'Login'}
                  onPress={handleLogin}
                  disabled={loading || !phoneNumber || !showOtp || !otp}
                  style={styles.loginButton}
                  textStyle={styles.loginButtonText}
                />
              </View>
            </View>
            
            {/* Sign Up Link */}
            <TouchableOpacity onPress={handleSignUp} style={styles.signUpContainer}>
              <Text style={styles.signUpText}>
                Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  formContent: {
    gap: 20,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  phoneInputContainer: {
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  otpButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 100,
  },
  otpButtonText: {
    fontSize: 14,
  },
  loginButton: {
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 18,
  },
  signUpContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  signUpText: {
    fontSize: 16,
    color: '#666',
  },
  signUpLink: {
    color: '#2E7D32',
    fontWeight: '600',
  },
});