import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Image,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Wheat, CheckCircle } from 'lucide-react-native';
import PageTransition from '@/components/PageTransition';
import { replaceWithTransition } from '@/src/utils/navigation';

const languages = [
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'en', name: 'English', nativeName: 'English' },
];

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('');
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
      replaceWithTransition('/auth/login');
    }
  }, [transitioning]);

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const handleContinue = async () => {
    if (!selectedLanguage) return;
    
    try {
      await AsyncStorage.setItem('selectedLanguage', selectedLanguage);
      
      // Trigger transition before navigation
      setTransitioning(true);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  return (
    <PageTransition isActive={!transitioning} type="slide">
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#FFFFFF', '#F1F8E9', '#E8F5E8']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.3 }}
        >
          {/* Top Section - Logo */}
          <View style={styles.topSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Image 
                  source={require('./logoai.jpg')} 
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
          
          {/* Heading Section */}
          <View style={styles.headingSection}>
            <Text style={styles.mainHeading}>Choose Your Language</Text>
            <Text style={styles.subHeading}>Select your preferred language to talk with the AI assistant</Text>
          </View>
          
          {/* Language Options Section */}
          <ScrollView style={styles.languageScrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.languagesContainer}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageButton,
                    selectedLanguage === language.code && styles.selectedLanguageButton,
                  ]}
                  onPress={() => handleLanguageSelect(language.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.languageContent}>
                    <View style={styles.languageTextContainer}>
                      <Text style={[
                        styles.languageName,
                        selectedLanguage === language.code && styles.selectedLanguageName,
                      ]}>
                        {language.name}
                      </Text>
                      <Text style={[
                        styles.nativeLanguageName,
                        selectedLanguage === language.code && styles.selectedNativeLanguageName,
                      ]}>
                        {language.nativeName}
                      </Text>
                    </View>
                    
                    {selectedLanguage === language.code && (
                      <View style={styles.checkIconContainer}>
                        <CheckCircle size={24} color="#4CAF50" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          
          {/* Bottom Section - Continue Button */}
          <View style={styles.bottomSection}>
            <TouchableOpacity 
              style={[
                styles.continueButton,
                !selectedLanguage && styles.continueButtonDisabled
              ]}
              onPress={handleContinue}
              disabled={!selectedLanguage}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
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
  
  // Top Section
  topSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 60,
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
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  
  // Heading Section
  headingSection: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 30,
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  subHeading: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  
  // Language Options Section
  languageScrollContainer: {
    flex: 1,
    paddingHorizontal: 32,
  },
  languagesContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  languageButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedLanguageButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  selectedLanguageName: {
    color: '#FFFFFF',
  },
  nativeLanguageName: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  selectedNativeLanguageName: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  checkIconContainer: {
    marginLeft: 16,
  },
  
  // Bottom Section
  bottomSection: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonDisabled: {
    backgroundColor: '#A5D6A7',
    shadowOpacity: 0.1,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});