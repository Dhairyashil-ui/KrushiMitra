import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PageTransition from '@/components/PageTransition';
import { replaceWithTransition } from '@/src/utils/navigation';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    // Fade in animation when screen loads
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (transitioning) {
      replaceWithTransition('/(tabs)');
    }
  }, [transitioning]);

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      return;
    }

    setOtpLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setShowOtpField(true);
      setOtpLoading(false);
    }, 1500);
  };

  const handleLogin = async () => {
    if (!phoneNumber || !otp) {
      return;
    }

    setLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      
      // Trigger transition before navigation
      setTransitioning(true);
    }, 1500);
  };

  const handleSignUp = () => {
    // For sign up, we can use the utility function as well
    replaceWithTransition('/auth/signup');
  };

  return (
    <PageTransition isActive={!transitioning} type="slideFromRight">
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F1F8E9', '#E8F5E8']}
            style={styles.backgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.3 }}
          >
            <View style={styles.content}>
              {/* Top Section - Logo */}
              <View style={styles.topSection}>
                <View style={styles.logoContainer}>
                  <View style={styles.logoWrapper}>
                    <Image 
                      source={require('../logoai.jpg')} 
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                  </View>
                </View>
                
                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                  <Text style={styles.welcomeTitle}>Welcome</Text>
                  <Text style={styles.welcomeSubtitle}>Log into your account</Text>
                </View>
              </View>
              
              {/* Middle Section - Form */}
              <View style={styles.formSection}>
                {/* Phone Number Input with Send OTP Button */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                  <View style={styles.phoneInputRow}>
                    <View style={styles.phoneInputContainer}>
                      <TextInput
                        style={styles.input}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="Enter Mobile Number"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                        maxLength={10}
                      />
                    </View>
                    <TouchableOpacity 
                      style={[
                        styles.otpButton,
                        (otpLoading || !phoneNumber || phoneNumber.length !== 10) && styles.otpButtonDisabled
                      ]}
                      onPress={handleSendOtp}
                      disabled={otpLoading || !phoneNumber || phoneNumber.length !== 10}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.otpButtonText}>
                        {otpLoading ? 'Sending...' : 'Send OTP'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* OTP Input */}
                {showOtpField && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>OTP</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={otp}
                        onChangeText={setOtp}
                        placeholder="Enter OTP"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        maxLength={6}
                        autoComplete="sms-otp"
                        textContentType="oneTimeCode"
                      />
                    </View>
                  </View>
                )}
              </View>
              
              {/* Bottom Section - Login Button */}
              <View style={styles.bottomSection}>
                <TouchableOpacity 
                  style={[
                    styles.loginButton,
                    (loading || !phoneNumber || !showOtpField || !otp) && styles.loginButtonDisabled
                  ]}
                  onPress={handleLogin}
                  disabled={loading || !phoneNumber || !showOtpField || !otp}
                  activeOpacity={0.8}
                >
                  <Text style={styles.loginButtonText}>
                    {loading ? 'LOGGING IN...' : 'LOG IN'}
                  </Text>
                </TouchableOpacity>
                
                {/* Sign Up Link */}
                <TouchableOpacity onPress={handleSignUp} style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>
                    Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PageTransition>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundGradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  
  // Top Section
  topSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoWrapper: {
    width: 180, // Increased size
    height: 180, // Increased size
    borderRadius: 60, // Adjusted for new size
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
  },
  logoImage: {
    width: 140, // Increased size
    height: 140, // Increased size
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    marginTop: 10,
  },
  welcomeSection: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#757575',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  
  // Middle Section - Form
  formSection: {
    marginBottom: 40,
    gap: 24,
  },
  inputGroup: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  phoneInputContainer: {
    flex: 1,
  },
  inputContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333333',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  otpButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    shadowColor: '#2E7D32',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  otpButtonDisabled: {
    backgroundColor: '#A5D6A7',
    shadowOpacity: 0.1,
  },
  otpButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  
  // Bottom Section
  bottomSection: {
    alignItems: 'center',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    backgroundColor: '#A5D6A7',
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  signUpContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  signUpText: {
    fontSize: 16,
    color: '#757575',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  signUpLink: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});