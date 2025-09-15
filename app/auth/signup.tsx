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
import { ArrowLeft } from 'lucide-react-native';
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

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSendOTP = async () => {
    if (!formData.phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }

    if (formData.phoneNumber.length < 10) {
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

  const handleSubmit = () => {
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

    // Simulate successful registration
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Sign Up</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Form Fields */}
          <View style={styles.formContainer}>
            
            {/* Farmer Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Farmer Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Farmer Name"
                placeholderTextColor="#999"
                value={formData.farmerName}
                onChangeText={(value) => handleInputChange('farmerName', value)}
                autoCapitalize="words"
              />
            </View>

            {/* Phone Number with Send OTP */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Phone Number <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.phoneContainer}>
                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  placeholder="Enter Mobile Number"
                  placeholderTextColor="#999"
                  value={formData.phoneNumber}
                  onChangeText={(value) => handleInputChange('phoneNumber', value)}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                <TouchableOpacity
                  style={[
                    styles.otpButton,
                    (!formData.phoneNumber || otpLoading) && styles.otpButtonDisabled
                  ]}
                  onPress={handleSendOTP}
                  disabled={!formData.phoneNumber || otpLoading}
                >
                  <Text style={styles.otpButtonText}>
                    {otpLoading ? 'Sending...' : 'Send OTP'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Land Size */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Land Size <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Land Size (in acres/hectares)"
                placeholderTextColor="#999"
                value={formData.landSize}
                onChangeText={(value) => handleInputChange('landSize', value)}
              />
            </View>

            {/* Soil Type */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Soil Type <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Soil Type"
                placeholderTextColor="#999"
                value={formData.soilType}
                onChangeText={(value) => handleInputChange('soilType', value)}
                autoCapitalize="words"
              />
            </View>

            {/* OTP Field */}
            {otpSent && (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  OTP <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP"
                  placeholderTextColor="#999"
                  value={formData.otp}
                  onChangeText={(value) => handleInputChange('otp', value)}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>
            )}
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!formData.farmerName || !formData.phoneNumber || !formData.landSize || 
               !formData.soilType || !otpSent || !formData.otp) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={
              !formData.farmerName || !formData.phoneNumber || !formData.landSize || 
              !formData.soilType || !otpSent || !formData.otp
            }
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  placeholder: {
    width: 34, // Same width as back button for center alignment
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  formContainer: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#e53e3e',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  phoneInput: {
    flex: 1,
  },
  otpButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  otpButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  otpButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});