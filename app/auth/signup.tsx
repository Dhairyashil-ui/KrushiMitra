import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Wheat, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    farmerName: '',
    phoneNumber: '',
    landSize: '',
    soilType: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSendOTP = async () => {
    if (!formData.phoneNumber.trim() || formData.phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setOtpLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true);
      setOtpLoading(false);
      Alert.alert('Success', 'OTP sent successfully to your mobile number');
    }, 1500);
  };

  const handleSubmit = async () => {
    // Validate all required fields
    if (!formData.farmerName.trim()) {
      Alert.alert('Error', 'Please enter farmer name');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter mobile number');
      return;
    }
    if (!formData.landSize.trim()) {
      Alert.alert('Error', 'Please enter land size');
      return;
    }
    if (!formData.soilType.trim()) {
      Alert.alert('Error', 'Please enter soil type');
      return;
    }
    if (!otpSent) {
      Alert.alert('Error', 'Please send OTP first');
      return;
    }
    if (!formData.otp.trim()) {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }

    setLoading(true);
    
    // Simulate successful registration
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'Registration completed successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    }, 1500);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F1F8E9', '#E8F5E8']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.3 }}
        >
          {/* Top Section - Logo and App Name */}
          <View style={styles.topSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={24} color="#4CAF50" />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Wheat size={40} color="#4CAF50" />
              </View>
              <Text style={styles.appName}>KrushiAI</Text>
            </View>
            
            <View style={styles.placeholder} />
          </View>
          
          {/* Heading Section */}
          <View style={styles.headingSection}>
            <Text style={styles.mainHeading}>Create Account</Text>
            <Text style={styles.subHeading}>Fill in your details to get started</Text>
          </View>

          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Form Fields */}
            <View style={styles.formContainer}>
              
              {/* Farmer Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>FARMER NAME *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Farmer Name"
                    placeholderTextColor="#999"
                    value={formData.farmerName}
                    onChangeText={(value) => handleInputChange('farmerName', value)}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Phone Number with Send OTP */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PHONE NUMBER *</Text>
                <View style={styles.phoneInputRow}>
                  <View style={styles.phoneInputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Mobile Number"
                      placeholderTextColor="#999"
                      value={formData.phoneNumber}
                      onChangeText={(value) => handleInputChange('phoneNumber', value)}
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.otpButton,
                      (!formData.phoneNumber || formData.phoneNumber.length !== 10 || otpLoading) && styles.otpButtonDisabled
                    ]}
                    onPress={handleSendOTP}
                    disabled={!formData.phoneNumber || formData.phoneNumber.length !== 10 || otpLoading}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.otpButtonText}>
                      {otpLoading ? 'Sending...' : 'Send OTP'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Land Size */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>LAND SIZE *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Land Size (in acres/hectares)"
                    placeholderTextColor="#999"
                    value={formData.landSize}
                    onChangeText={(value) => handleInputChange('landSize', value)}
                  />
                </View>
              </View>

              {/* Soil Type */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>SOIL TYPE *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Soil Type"
                    placeholderTextColor="#999"
                    value={formData.soilType}
                    onChangeText={(value) => handleInputChange('soilType', value)}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* OTP Field */}
              {otpSent && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>OTP *</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter OTP"
                      placeholderTextColor="#999"
                      value={formData.otp}
                      onChangeText={(value) => handleInputChange('otp', value)}
                      keyboardType="numeric"
                      maxLength={6}
                      autoComplete="sms-otp"
                      textContentType="oneTimeCode"
                    />
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Bottom Section - Submit Button */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (loading || !formData.farmerName || !formData.phoneNumber || !formData.landSize || 
                 !formData.soilType || !otpSent || !formData.otp) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={
                loading || !formData.farmerName || !formData.phoneNumber || !formData.landSize || 
                !formData.soilType || !otpSent || !formData.otp
              }
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
              </Text>
            </TouchableOpacity>
            
            {/* Login Link */}
            <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  
  // Top Section
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  placeholder: {
    width: 44,
  },
  
  // Heading Section
  headingSection: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 20,
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  subHeading: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  
  // Form Section
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  formContainer: {
    paddingHorizontal: 32,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 24,
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
  phoneInputRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  phoneInputContainer: {
    flex: 1,
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
    paddingHorizontal: 32,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#2E7D32',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#2E7D32',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#A5D6A7',
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  loginContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loginText: {
    fontSize: 16,
    color: '#757575',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  loginLink: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});