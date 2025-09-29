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
  Easing,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Phone, Shield, Sparkles, User, Mic, MicOff } from 'lucide-react-native';
import PageTransition from '@/components/PageTransition';
import { replaceWithTransition } from '@/src/utils/navigation';
// Import speech recognition for voice input
import Voice from '@react-native-voice/voice';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const floatAnimation = useRef(new Animated.Value(0)).current;
  const particlesAnimation = useRef(new Animated.Value(0)).current;
  const [transitioning, setTransitioning] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Cross-platform error handling function
  const showError = (msg: string) => {
    if (Platform.OS === 'web') {
      console.error(msg);
    } else {
      Alert.alert(t('error'), msg);
    }
  };

  // Particle positions for background effect
  const particlePositions = useRef([
    new Animated.ValueXY({ x: -20, y: -20 }),
    new Animated.ValueXY({ x: 100, y: 50 }),
    new Animated.ValueXY({ x: 300, y: -20 }),
    new Animated.ValueXY({ x: -20, y: 200 }),
    new Animated.ValueXY({ x: 350, y: 300 }),
  ]).current;

  // Initialize animations
  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
    ]).start();

    // Gentle pulse effect for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation for particles
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnimation, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnimation, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Particle animations
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(particlePositions[0], {
            toValue: { x: 50, y: 30 },
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particlePositions[0], {
            toValue: { x: -20, y: -20 },
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(particlePositions[1], {
            toValue: { x: 150, y: 100 },
            duration: 5000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particlePositions[1], {
            toValue: { x: 100, y: 50 },
            duration: 5000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(particlePositions[2], {
            toValue: { x: 350, y: 30 },
            duration: 4500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particlePositions[2], {
            toValue: { x: 300, y: -20 },
            duration: 4500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(particlePositions[3], {
            toValue: { x: 30, y: 250 },
            duration: 5500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particlePositions[3], {
            toValue: { x: -20, y: 200 },
            duration: 5500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(particlePositions[4], {
            toValue: { x: 400, y: 350 },
            duration: 6000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particlePositions[4], {
            toValue: { x: 350, y: 300 },
            duration: 6000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // Initialize speech recognition
    initializeSpeechRecognition();

    // Cleanup function
    return () => {
      if (Platform.OS !== 'web') {
        Voice.destroy().then(Voice.removeAllListeners);
      }
    };
  }, []);

  // Handle navigation after transition
  useEffect(() => {
    if (transitioning) {
      replaceWithTransition('/(tabs)');
    }
  }, [transitioning]);

  // Speech Recognition Functions
  const initializeSpeechRecognition = () => {
    console.log('Initializing speech recognition for platform:', Platform.OS);
    
    if (Platform.OS === 'web') {
      // Web implementation
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase().trim();
          console.log('Speech recognition result:', transcript);
          setIsListening(false);
          handleVoiceInput(transcript);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          showError(t('somethingWentWrong'));
        };
        
        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          setIsListening(false);
        };
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    } else {
      // Mobile implementation using react-native-voice
      console.log('Setting up react-native-voice listeners');
      
      Voice.onSpeechStart = () => {
        console.log('Speech started');
        setIsListening(true);
      };
      
      Voice.onSpeechEnd = () => {
        console.log('Speech ended');
        setIsListening(false);
      };
      
      Voice.onSpeechResults = (event: any) => {
        console.log('Speech results:', event.value);
        if (event.value && event.value.length > 0) {
          const transcript = event.value[0].toLowerCase().trim();
          console.log('Processing speech transcript:', transcript);
          setIsListening(false);
          handleVoiceInput(transcript);
        }
      };
      
      Voice.onSpeechError = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        showError(t('somethingWentWrong'));
      };
    }
  };

  const speakPrompt = () => {
    console.log('Login prompt - using ONLY Niraj Hindi voice from 11labs');
    // ONLY use 11labs Niraj Hindi voice - NO device TTS fallbacks
    // User explicitly requested ONLY Niraj Hindi voice
    
    // Start listening directly without device TTS
    setTimeout(() => {
      startListening();
    }, 500);
  };

  const startListening = () => {
    console.log('Starting speech recognition');
    
    if (Platform.OS === 'web') {
      // Web implementation
      if (recognitionRef.current) {
        try {
          console.log('Starting web speech recognition');
          recognitionRef.current.start();
          setIsListening(true);
        } catch (error) {
          console.error('Error starting speech recognition:', error);
        showError(t('somethingWentWrong'));
        }
      } else {
        showError(t('somethingWentWrong'));
      }
    } else {
      // Mobile implementation using react-native-voice
      console.log('Starting voice recognition on mobile');
      try {
        Voice.start('en-US');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        showError(t('somethingWentWrong'));
      }
    }
  };

  const stopListening = () => {
    if (Platform.OS === 'web') {
      // Web implementation
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    } else {
      // Mobile implementation using react-native-voice
      Voice.stop();
      setIsListening(false);
    }
  };

  const handleVoiceInput = (text: string) => {
    console.log('Voice input received:', text);
    
    // Extract phone number from voice input
    const phoneNumberMatch = text.match(/\d{10}/);
    if (phoneNumberMatch) {
      const extractedNumber = phoneNumberMatch[0];
      console.log('Extracted phone number:', extractedNumber);
      setPhoneNumber(extractedNumber);
      
      // Automatically send OTP after a short delay
      setTimeout(() => {
        handleSendOtpWithNumber(extractedNumber);
      }, 1000);
    } else {
      // Try to extract any sequence of digits
      const digitsOnly = text.replace(/\D/g, '');
      console.log('Digits only:', digitsOnly);
      if (digitsOnly.length >= 10) {
        const extractedNumber = digitsOnly.substring(0, 10);
        console.log('Extracted phone number from digits:', extractedNumber);
        setPhoneNumber(extractedNumber);
        
        // Automatically send OTP after a short delay
        setTimeout(() => {
          handleSendOtpWithNumber(extractedNumber);
        }, 1000);
      } else {
        console.log('Could not extract a valid phone number from voice input');
        Alert.alert(t('error'), t('invalidPhoneNumber'));
      }
    }
  };

  // OTP and Login Functions
  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      Alert.alert(t('error'), t('invalidPhoneNumber'));
      return;
    }

    setOtpLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setShowOtpField(true);
      setOtpLoading(false);
      
      // Generate a random 6-digit OTP
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtp(randomOtp);
      console.log('Generated OTP:', randomOtp);
      
      // Automatically continue after 2 seconds
      setTimeout(() => {
        console.log('Auto-submitting with OTP:', randomOtp);
        handleAutoLogin();
      }, 2000);
    }, 3000);
  };

  const handleSendOtpWithNumber = async (number: string) => {
    console.log('Sending OTP for number:', number);
    
    if (!number || number.length !== 10) {
      Alert.alert(t('error'), t('invalidPhoneNumber'));
      return;
    }

    setOtpLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setShowOtpField(true);
      setOtpLoading(false);
      
      // Generate a random 6-digit OTP
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtp(randomOtp);
      console.log('Generated OTP for voice input:', randomOtp);
      
      // Automatically continue after 2 seconds
      setTimeout(() => {
        console.log('Auto-submitting with OTP from voice input:', randomOtp);
        handleAutoLogin();
      }, 2000);
    }, 1500);
  };

  const handleLogin = async () => {
    console.log('Attempting login with:', { phoneNumber, otp, showOtpField });
    
    if (!phoneNumber || !otp) {
      console.log('Login validation failed - missing data');
      Alert.alert(t('error'), t('enterOTP'));
      return;
    }

    setLoading(true);
    console.log('Starting login process');
    
    // Simulate login process
    setTimeout(() => {
      console.log('Login process completed');
      setLoading(false);
      
      // Trigger transition before navigation
      setTransitioning(true);
    }, 1500);
  };

  const handleAutoLogin = async () => {
    console.log('Attempting auto login with:', { phoneNumber, otp, showOtpField });
    // For auto login, we bypass some validation
    
    if (!phoneNumber) {
      console.log('Auto login validation failed - missing phone number');
      return;
    }

    // Ensure OTP field is visible
    if (!showOtpField) {
      setShowOtpField(true);
    }

    setLoading(true);
    console.log('Starting auto login process');
    
    // Simulate login process
    setTimeout(() => {
      console.log('Auto login process completed');
      setLoading(false);
      
      // Trigger transition before navigation
      setTransitioning(true);
    }, 1500);
  };

  const handleSignUp = () => {
    // For sign up, we can use the utility function as well
    replaceWithTransition('/auth/signup');
  };

  const handleBack = () => {
    // Handle back navigation
    console.log('Back button pressed');
    replaceWithTransition('/language');
  };

  return (
    <PageTransition isActive={!transitioning} type="slideFromRight">
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Animated Background Particles */}
          {particlePositions.map((position, index) => (
            <Animated.View
              key={index}
              style={[
                styles.particle,
                {
                  transform: position.getTranslateTransform(),
                  opacity: fadeAnimation,
                  backgroundColor: index % 2 === 0 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(46, 125, 50, 0.15)',
                  width: 12 + index * 2,
                  height: 12 + index * 2,
                  borderRadius: 6 + index,
                }
              ]}
            />
          ))}

          <LinearGradient
            colors={['#FFFFFF', '#F1F8E9', '#E8F5E8']}
            style={styles.backgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.3 }}
          >
            {/* Top Navigation */}
            <View style={styles.topNavigation}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <ArrowLeft size={24} color="#4CAF50" />
              </TouchableOpacity>
              
              <View style={styles.topCenter}>
                <Text style={styles.topTitle}>{t('login')}</Text>
              </View>
              
              {/* Microphone Button */}
              <TouchableOpacity 
                style={styles.micButton}
                onPress={isListening ? stopListening : speakPrompt}
              >
                {isListening ? (
                  <MicOff size={24} color="#FFFFFF" />
                ) : (
                  <Mic size={24} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.content}>
              {/* Top Section - Logo with Enhanced Animation */}
              <Animated.View style={[
                styles.topSection,
                {
                  opacity: fadeAnimation,
                  transform: [{ scale: scaleAnimation }],
                }
              ]}>
                <Animated.View style={[
                  styles.logoContainer,
                  {
                    transform: [{ scale: pulseAnimation }],
                  }
                ]}>
                  <LinearGradient
                    colors={['#4CAF50', '#2E7D32', '#4CAF50']}
                    style={styles.logoGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.logoWrapper}>
                      <Image 
                        source={require('../logoai.jpg')} 
                        style={styles.logoImage}
                        resizeMode="contain"
                      />
                    </View>
                  </LinearGradient>
                  
                  {/* Glow Effect */}
                  <Animated.View style={[
                    styles.glowEffect,
                    {
                      transform: [{ scale: pulseAnimation }],
                      opacity: pulseAnimation.interpolate({
                        inputRange: [1, 1.05],
                        outputRange: [0.3, 0.6]
                      })
                    }
                  ]} />
                </Animated.View>
                
                {/* AI Badge */}
                <View style={styles.aiBadge}>
                  <Sparkles size={16} color="#FFFFFF" />
                  <Text style={styles.aiBadgeText}>{t('aiPowered')}</Text>
                </View>
              </Animated.View>
              
              {/* Welcome Section */}
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>{t('welcomeBack')}</Text>
                <Text style={styles.welcomeSubtitle}>{t('loginSubtitle')}</Text>
              </View>
              
              {/* Middle Section - Form */}
              <View style={styles.formSection}>
                {/* Phone Number Input with Send OTP Button */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('phoneNumber')}</Text>
                  <View style={styles.phoneInputRow}>
                    <View style={styles.phoneInputContainer}>
                      <View style={styles.inputIconContainer}>
                        <Phone size={20} color="#4CAF50" />
                      </View>
                      <TextInput
                        style={styles.input}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder={t('enterPhoneNumber')}
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
                        {otpLoading ? t('loading') : t('getOTP')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* OTP Input */}
                {showOtpField && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('enterOTP')}</Text>
                    <View style={styles.inputContainer}>
                      <View style={styles.inputIconContainer}>
                        <Shield size={20} color="#4CAF50" />
                      </View>
                      <TextInput
                        style={styles.input}
                        value={otp}
                        onChangeText={setOtp}
                        placeholder={t('enterOTP')}
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
                    {loading ? t('loading') : t('login')}
                  </Text>
                </TouchableOpacity>
                
                {/* Sign Up Link */}
                <TouchableOpacity onPress={handleSignUp} style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>
                    {t('dontHaveAccount')} <Text style={styles.signUpLink}>{t('signup')}</Text>
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
  particle: {
    position: 'absolute',
    zIndex: 0,
  },
  backgroundGradient: {
    flex: 1,
  },
  
  // Top Navigation
  topNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  topCenter: {
    flex: 1,
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  
  // Top Section
  topSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  glowEffect: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 90,
    backgroundColor: '#4CAF50',
    opacity: 0.4,
    zIndex: -1,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
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
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2E7D32',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    textShadowColor: 'rgba(46, 125, 50, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIconContainer: {
    marginRight: 12,
    paddingVertical: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333333',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  otpButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    shadowColor: '#2E7D32',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  otpButtonDisabled: {
    backgroundColor: '#A5D6A7',
    shadowOpacity: 0.1,
  },
  otpButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  
  // Bottom Section
  bottomSection: {
    alignItems: 'center',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#2E7D32',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#2E7D32',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#A5D6A7',
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
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
    fontWeight: '700',
  },
});