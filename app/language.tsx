import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Globe,
  Zap,
  Activity,
  Cpu,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const languages = [
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر' },
  { code: 'gom', name: 'Konkani', nativeName: 'कोंकणी' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'mni', name: 'Manipuri', nativeName: 'ꯃꯤꯇꯩ ꯂꯣꯟ' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'or', name: 'Oriya', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'brx', name: 'Bodo', nativeName: 'बर्' },
  { code: 'sat', name: 'Santhali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी' },
];

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const router = useRouter();
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const particleAnimation = useRef(new Animated.Value(0)).current;
  const staggerAnimation = useRef(languages.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Header entrance animation
    Animated.sequence([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered language items animation
    const staggerAnimations = staggerAnimation.map((anim, index) => 
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 50,
        useNativeDriver: true,
      })
    );
    
    Animated.stagger(50, staggerAnimations).start();

    // Continuous glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();

    // Particle animation
    Animated.loop(
      Animated.timing(particleAnimation, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      })
    ).start();
  };

  const handleLanguageSelect = async (languageCode: string) => {
    setSelectedLanguage(languageCode);
    
    // Selection animation
    Animated.sequence([
      Animated.timing(fadeAnimation, {
        toValue: 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    await AsyncStorage.setItem('selectedLanguage', languageCode);
    
    // Navigate with delay for animation
    setTimeout(() => {
      router.replace('/auth/login');
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e', '#0f3460']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        {/* Animated Background Particles */}
        <Animated.View style={[
          styles.particle1,
          {
            opacity: particleAnimation.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.3, 1, 0.3],
            }),
            transform: [{
              translateX: particleAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, width + 50],
              })
            }]
          }
        ]} />
        
        <Animated.View style={[
          styles.particle2,
          {
            opacity: particleAnimation.interpolate({
              inputRange: [0, 0.3, 0.7, 1],
              outputRange: [0.2, 0.8, 0.8, 0.2],
            }),
            transform: [{
              translateY: particleAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [height, -100],
              })
            }]
          }
        ]} />

        {/* Header Section */}
        <Animated.View style={[
          styles.header,
          {
            opacity: fadeAnimation,
            transform: [{ translateY: slideAnimation }],
          }
        ]}>
          <LinearGradient
            colors={['rgba(0, 212, 255, 0.2)', 'rgba(0, 102, 255, 0.1)', 'transparent']}
            style={styles.headerGradient}
          >
            <View style={styles.titleContainer}>
              <Animated.View style={[
                styles.iconContainer,
                {
                  transform: [{
                    rotate: rotateAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    })
                  }]
                }
              ]}>
                <LinearGradient
                  colors={['#00d4ff', '#0099cc', '#0066ff']}
                  style={styles.iconGradient}
                >
                  <Globe size={32} color="#fff" />
                </LinearGradient>
              </Animated.View>
              
              <Text style={styles.title}>⚡ NEURAL LANGUAGE MATRIX</Text>
              <Text style={styles.subtitle}>Configure your preferred linguistic interface protocol</Text>
              
              <Animated.View style={[
                styles.energyBar,
                {
                  width: glowAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [width * 0.3, width * 0.8],
                  }),
                }
              ]} />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Language Selection List */}
        <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
          {languages.map((language, index) => (
            <Animated.View
              key={language.code}
              style={{
                opacity: staggerAnimation[index],
                transform: [{
                  translateX: staggerAnimation[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  })
                }]
              }}
            >
              <TouchableOpacity
                style={[
                  styles.languageItem,
                  selectedLanguage === language.code && styles.selectedLanguageItem,
                ]}
                onPress={() => handleLanguageSelect(language.code)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={selectedLanguage === language.code 
                    ? ['rgba(0, 212, 255, 0.3)', 'rgba(0, 102, 255, 0.2)', 'rgba(26, 26, 46, 0.9)']
                    : ['rgba(26, 26, 46, 0.6)', 'rgba(22, 33, 62, 0.7)', 'rgba(15, 52, 96, 0.5)']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.languageGradient}
                >
                  <View style={styles.languageContent}>
                    <View style={styles.languageInfo}>
                      <View style={styles.nameContainer}>
                        <Activity 
                          size={16} 
                          color={selectedLanguage === language.code ? '#00d4ff' : '#00ff88'} 
                        />
                        <Text style={[
                          styles.languageName,
                          selectedLanguage === language.code && styles.selectedLanguageName,
                        ]}>
                          {language.name}
                        </Text>
                      </View>
                      <Text style={[
                        styles.nativeLanguageName,
                        selectedLanguage === language.code && styles.selectedNativeLanguageName,
                      ]}>
                        {language.nativeName}
                      </Text>
                    </View>
                    
                    {selectedLanguage === language.code && (
                      <Animated.View style={[
                        styles.selectedIndicator,
                        {
                          opacity: glowAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1],
                          }),
                          transform: [{
                            scale: glowAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 1.1],
                            })
                          }]
                        }
                      ]}>
                        <LinearGradient
                          colors={['#00d4ff', '#0099cc', '#0066ff']}
                          style={styles.indicatorGradient}
                        >
                          <CheckCircle size={20} color="#fff" />
                        </LinearGradient>
                      </Animated.View>
                    )}
                    
                    <ArrowRight 
                      size={20} 
                      color={selectedLanguage === language.code ? '#00d4ff' : '#666'} 
                      style={styles.arrowIcon}
                    />
                  </View>
                  
                  {selectedLanguage === language.code && (
                    <View style={styles.selectedBorder}>
                      <Animated.View style={[
                        styles.pulseRing,
                        {
                          opacity: glowAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.3, 0.7],
                          }),
                          transform: [{
                            scale: glowAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 1.05],
                            })
                          }]
                        }
                      ]} />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
          
          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  gradientContainer: {
    flex: 1,
  },
  particle1: {
    position: 'absolute',
    top: height * 0.2,
    width: 3,
    height: 3,
    backgroundColor: '#00d4ff',
    borderRadius: 1.5,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  particle2: {
    position: 'absolute',
    right: width * 0.1,
    width: 2,
    height: 2,
    backgroundColor: '#00ff88',
    borderRadius: 1,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0, 212, 255, 0.3)',
  },
  headerGradient: {
    borderRadius: 20,
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 212, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#00d4ff',
    textAlign: 'center',
    letterSpacing: 0.5,
    opacity: 0.8,
    marginBottom: 16,
  },
  energyBar: {
    height: 3,
    backgroundColor: '#00d4ff',
    borderRadius: 2,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  languageList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  languageItem: {
    marginVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  selectedLanguageItem: {
    elevation: 12,
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  languageGradient: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    position: 'relative',
  },
  languageInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  selectedLanguageName: {
    color: '#ffffff',
    textShadowColor: 'rgba(0, 212, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  nativeLanguageName: {
    fontSize: 14,
    color: '#b0c4de',
    marginLeft: 24,
    letterSpacing: 0.3,
  },
  selectedNativeLanguageName: {
    color: '#e0e6ed',
  },
  selectedIndicator: {
    marginRight: 12,
  },
  indicatorGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  selectedBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  pulseRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#00d4ff',
  },
  bottomSpacer: {
    height: 40,
  },
});