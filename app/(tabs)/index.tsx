import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Modal, Animated, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Bot, 
  Activity, 
  Calendar, 
  Bell, 
  Camera, 
  Cloud, 
  Sparkles, 
  MessageCircle, 
  X,
  Menu,
  TrendingUp,
  Newspaper,
  Phone,
  IndianRupee,
  Users,
  MapPin,
  Thermometer,
  Mic,
  MicOff
} from 'lucide-react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { saveAIInteraction } from '@/src/utils/api'; // Correct import path



export default function HomeScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [weather, setWeather] = useState('🌤️ Partly cloudy, 28°C');
  const [reminder, setReminder] = useState('🌧️ Rain expected tomorrow, avoid spraying pesticides');
  const [showAIModal, setShowAIModal] = useState(false);
  const [glowAnimation] = useState(new Animated.Value(0));
  const [rotateAnimation] = useState(new Animated.Value(0));
  const [scaleAnimation] = useState(new Animated.Value(1));
  const [orbitalAnimation] = useState(new Animated.Value(0));
  const [weatherAnimation] = useState(new Animated.Value(0));
  const [pulseAnimation] = useState(new Animated.Value(1));
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{role: string, parts: string}[]>([]);
  const [audioLevel] = useState(new Animated.Value(1)); // For audio visualization
  
  const router = useRouter();
  const recognitionRef = useRef<any>(null);
  const genAIRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize Gemini AI
  useEffect(() => {
    try {
      // Get API key from environment variable (in a real app, this should come from a secure backend service)
      const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "AIzaSyB9D42GOeezcrEPQLMUvF4MmM3O6sJfmuw"; // Fallback for demo
      genAIRef.current = new GoogleGenerativeAI(API_KEY);
      modelRef.current = genAIRef.current.getGenerativeModel({ model: "gemini-2.5-flash" });
    } catch (error) {
      console.error("Error initializing Gemini AI:", error);
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    // Check if platform supports speech recognition (Web Speech API)
    const isWeb = Platform.OS === 'web';
    
    if (isWeb) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-IN-NeerjaNeural';
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          handleVoiceInput(transcript);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          Alert.alert('Speech Recognition Error', 'There was an error with speech recognition. Please try again.');
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    } else {
      console.warn('Speech recognition only available on web platform');
    }
    
    // Load user data and weather
    loadUserData();
    loadWeather();
    
    // Enhanced futuristic animations
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    );
    
    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );
    
    const orbitalLoop = Animated.loop(
      Animated.timing(orbitalAnimation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );
    
    const scaleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    
    // Weather card animation
    const weatherLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(weatherAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(weatherAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    
    // Pulse animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    
    glowLoop.start();
    rotateLoop.start();
    orbitalLoop.start();
    scaleLoop.start();
    weatherLoop.start();
    pulseLoop.start();
    
    // Start listening when component mounts
    // Auto-start voice assistant when home page opens
    setTimeout(() => {
      if (Platform.OS === 'web') {
        startListening();
      }
    }, 3000);
    
    return () => {
      glowLoop.stop();
      rotateLoop.stop();
      orbitalLoop.stop();
      scaleLoop.stop();
      weatherLoop.stop();
      pulseLoop.stop();
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      // Clean up speaking animation
      stopSpeakingAnimation();
      
      // Clean up speaking animation resources
      if ((audioLevel as any)._speakingAnimation) {
        (audioLevel as any)._speakingAnimation.stop();
      }
    };
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadWeather = async () => {
    try {
      const locationData = await AsyncStorage.getItem('userLocation');
      if (locationData) {
        // In real app, make API call to OpenWeather
        // For demo, showing static data
        const weatherData = [
          '☀️ Sunny, 32°C - Perfect for field work',
          '🌧️ Rain expected, 24°C - Good for irrigation',
          '⛅ Cloudy, 28°C - Ideal for spraying',
          '🌪️ Windy, 26°C - Avoid pesticide application'
        ];
        const randomWeather = weatherData[Math.floor(Math.random() * weatherData.length)];
        setWeather(randomWeather);
      }
    } catch (error) {
      console.error('Error loading weather:', error);
    }
  };

  const navigateToAIChat = () => {
    setShowAIModal(true);
  };

  const startAIConversation = () => {
    setShowAIModal(false);
    router.push('/ai-chat');
  };

  const navigateToActivityTracking = () => {
    router.push('/activity-tracking');
  };

  const navigateToSchemes = () => {
    console.log('Navigate to Government Schemes');
  };

  const navigateToCropDisease = () => {
    router.push('/crop-disease');
  };

  const navigateToMandiPrices = () => {
    // Navigate to mandi prices screen
    console.log('Navigate to Mandi Prices');
  };

  const navigateToNews = () => {
    // Navigate to farming news screen
    console.log('Navigate to Farming News');
  };

  const callAI = () => {
    // Trigger phone-like AI interaction
    console.log('Call AI Assistant');
  };

  const openDrawerMenu = () => {
    // Open drawer menu
    console.log('Open Drawer Menu');
  };

  const openNotifications = () => {
    // Open notifications
    console.log('Open Notifications');
  };

  const startListening = () => {
    if (Platform.OS === 'web' && recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        Alert.alert('Error', 'Could not start voice recognition. Please ensure your browser supports it and you have given microphone permissions.');
      }
    } else {
      Alert.alert('Platform Not Supported', 'Voice recognition is only available on web platform.');
    }
  };

  const stopListening = () => {
    if (Platform.OS === 'web' && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleVoiceInput = async (text: string) => {
    if (!text.trim()) return;
    
    try {
      // Add user message to conversation history
      const updatedHistory = [...conversationHistory, { role: "user", parts: text }];
      setConversationHistory(updatedHistory);
      
      // Check for navigation commands first
      const lowerText = text.toLowerCase();
      
      // Navigation commands
      if (lowerText.includes('open crop') || lowerText.includes('crop disease') || lowerText.includes('crop page')) {
        navigateToCropDisease();
        speakResponse("Opening crop disease detection page");
        return;
      }
      
      if (lowerText.includes('open events') || lowerText.includes('events page')) {
        router.push('/events');
        speakResponse("Opening events page");
        return;
      }
      
      if (lowerText.includes('open profile') || lowerText.includes('profile page')) {
        router.push('/profile');
        speakResponse("Opening profile page");
        return;
      }
      
      if (lowerText.includes('open community') || lowerText.includes('community page')) {
        router.push('/community');
        speakResponse("Opening community page");
        return;
      }
      
      if (lowerText.includes('open activity') || lowerText.includes('activity tracking')) {
        navigateToActivityTracking();
        speakResponse("Opening activity tracking page");
        return;
      }
      
      if (lowerText.includes('open chat') || lowerText.includes('ai chat')) {
        router.push('/ai-chat');
        speakResponse("Opening AI chat");
        return;
      }
      
      // Show that we're processing for general queries
      setIsSpeaking(true);
      
      // Generate response using Gemini for general queries
      if (modelRef.current) {
        const prompt = `You are KrushiAI, an intelligent farming assistant. Provide helpful, concise responses to farming questions. 
        User query: ${text}
        
        Respond in a friendly, helpful manner with farming-specific advice.`;
        
        const result = await modelRef.current.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
        
        // Add AI response to conversation history
        setConversationHistory([...updatedHistory, { role: "model", parts: responseText }]);
        
        // Save interaction to MongoDB
        try {
          const interactionSaved = await saveAIInteraction({
            farmerId: userData?.id || userData?.phone || 'anonymous',
            query: text,
            response: responseText,
            context: {}
          });
          
          if (interactionSaved) {
            console.log('AI interaction saved successfully to MongoDB');
          } else {
            console.warn('Failed to save AI interaction to MongoDB');
          }
        } catch (error) {
          console.error('Error saving interaction to MongoDB:', error);
        }
        
        // Speak the response
        speakResponse(responseText);
      } else {
        const fallbackResponse = "I'm your KrushiAI farming assistant. I can help with crop care, weather updates, pest control, and farming advice. What would you like to know?";
        
        // Save fallback response to MongoDB
        try {
          const interactionSaved = await saveAIInteraction({
            farmerId: userData?.id || userData?.phone || 'anonymous',
            query: text,
            response: fallbackResponse,
            context: {}
          });
          
          if (interactionSaved) {
            console.log('AI interaction saved successfully to MongoDB');
          } else {
            console.warn('Failed to save AI interaction to MongoDB');
          }
        } catch (error) {
          console.error('Error saving interaction to MongoDB:', error);
        }
        
        speakResponse(fallbackResponse);
        setConversationHistory([...updatedHistory, { role: "model", parts: fallbackResponse }]);
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      const errorMessage = "Sorry, I encountered an error processing your request. Please try again.";
      speakResponse(errorMessage);
    }
  };

  const speakResponse = (text: string) => {
    if (Platform.OS === 'web' && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = window.speechSynthesis.getVoices().find(voice => voice.lang.includes('en')) || null;
      utterance.rate = 1.5; // Increased from 1.0 to 1.5 for faster speech
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Simulate audio waveform based on speech synthesis events
      utterance.onstart = () => {
        setIsSpeaking(true);
        // Start a more dynamic animation when speaking begins
        startSpeakingAnimation();
      };
      
      utterance.onend = () => {
        stopSpeakingAnimation();
        setIsSpeaking(false);
        // Auto-start listening again after speaking
        setTimeout(() => {
          startListening();
        }, 1000);
      };
      
      utterance.onerror = (event) => {
        stopSpeakingAnimation();
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };
      
      // Add boundary events for more granular control
      utterance.onboundary = (event) => {
        // Adjust animation based on speech boundaries
        if (event.name === 'word') {
          // Create a small pulse for each word
          Animated.sequence([
            Animated.timing(audioLevel, {
              toValue: 1.1 + Math.random() * 0.2, // Random value between 1.1 and 1.3
              duration: 80,
              useNativeDriver: true,
            }),
            Animated.timing(audioLevel, {
              toValue: 1.0 + Math.random() * 0.1, // Random value between 1.0 and 1.1
              duration: 100,
              useNativeDriver: true,
            })
          ]).start();
        } else if (event.name === 'sentence') {
          // Create a more pronounced pulse for each sentence
          Animated.sequence([
            Animated.timing(audioLevel, {
              toValue: 1.2 + Math.random() * 0.3, // Random value between 1.2 and 1.5
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(audioLevel, {
              toValue: 1.0,
              duration: 200,
              useNativeDriver: true,
            })
          ]).start();
        }
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported or not on web platform');
      setIsSpeaking(false);
      // Auto-start listening again after speaking
      setTimeout(() => {
        if (Platform.OS === 'web') {
          startListening();
        }
      }, 1000);
    }
  };

  const startSpeakingAnimation = () => {
    // Create a more dynamic speaking animation
    const speakingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(audioLevel, {
          toValue: 1.15,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(audioLevel, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(audioLevel, {
          toValue: 1.2,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(audioLevel, {
          toValue: 1.0,
          duration: 150,
          useNativeDriver: true,
        }),
      ])
    );
    
    speakingAnimation.start();
    
    // Store reference to stop later
    (audioLevel as any)._speakingAnimation = speakingAnimation;
  };

  const stopSpeakingAnimation = () => {
    // Stop the speaking animation
    if ((audioLevel as any)._speakingAnimation) {
      (audioLevel as any)._speakingAnimation.stop();
    }
    
    // Reset to normal scale with a smooth transition
    Animated.timing(audioLevel, {
      toValue: 1,
      duration: 500, // Slower reset for smoother transition
      useNativeDriver: true,
    }).start();
  };

  const startAudioVisualization = () => {
    if (!audioContextRef.current || !analyserRef.current) return;
    
    const updateAudioLevel = () => {
      if (!analyserRef.current) return;
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      
      // Normalize to 0-1 range (0-255 is the Uint8Array range)
      const normalizedLevel = 1 + (average / 255) * 0.5; // Scale to 1.0 - 1.5 range
      
      // Update the animated value
      Animated.timing(audioLevel, {
        toValue: normalizedLevel,
        duration: 50, // Smooth transitions
        useNativeDriver: true,
      }).start();
      
      // Continue the loop
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };
    
    updateAudioLevel();
  };

  const stopAudioVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Reset to normal scale
    Animated.timing(audioLevel, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const toggleVoiceAssistant = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Top Navigation Header */}
        <View style={styles.topNavigation}>
          <TouchableOpacity style={styles.navButton} onPress={openDrawerMenu}>
            <Menu size={24} color="#1F2937" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.appTitle}>KrushiAI</Text>
            <View style={styles.locationRow}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.locationText}>Pune, Maharashtra</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.navButton} onPress={openNotifications}>
            <View style={styles.notificationContainer}>
              <Bell size={24} color="#1F2937" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}
          </Text>
          <Text style={styles.userName}>{userData?.name || 'Farmer'} </Text>
        </View>

        {/* AI Assistant - Futuristic Centered Circle */}
        <View style={styles.centeredCircleContainer}>
          {/* Outer Orbital Ring */}
          <Animated.View style={[
            styles.outerOrbitalRing,
            {
              transform: [{
                rotate: orbitalAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                })
              }]
            }
          ]}>
            <View style={styles.orbitalDot1} />
            <View style={styles.orbitalDot2} />
            <View style={styles.orbitalDot3} />
          </Animated.View>
          
          {/* Main Circle with Enhanced Effects */}
          <TouchableOpacity 
            onPress={toggleVoiceAssistant}
            activeOpacity={0.7}
            style={styles.circleTouchContainer}
          >
            <Animated.View style={[
              styles.perfectMainCircle,
              {
                shadowOpacity: glowAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.8],
                }),
                shadowRadius: glowAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 40],
                }),
                transform: [
                  {
                    scale: audioLevel
                  },
                  {
                    rotate: rotateAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    })
                  }
                ]
              }
            ]}>
              {/* Holographic Gradient */}
              <LinearGradient
                colors={[
                  'rgba(59, 130, 246, 0.9)',
                  'rgba(139, 92, 246, 0.8)', 
                  'rgba(16, 185, 129, 0.7)',
                  'rgba(236, 72, 153, 0.6)',
                  'rgba(59, 130, 246, 0.9)'
                ]}
                style={styles.holographicLayer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Inner Glass Effect */}
                <LinearGradient
                  colors={[
                    'rgba(255, 255, 255, 0.2)',
                    'rgba(255, 255, 255, 0.05)',
                    'rgba(255, 255, 255, 0.1)'
                  ]}
                  style={styles.glassLayer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.circleContentMain}>
                    {/* AI Bot with Glow */}
                    <Animated.View style={[
                      styles.botContainer,
                      {
                        opacity: glowAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        })
                      }
                    ]}>
                      <Bot size={90} color="#FFFFFF" />
                    </Animated.View>
                    
                    {/* Futuristic Text */}
                    <Animated.Text style={[
                      styles.futuristicTitle,
                      {
                        opacity: glowAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.9, 1],
                        })
                      }
                    ]}>KrushiAi</Animated.Text>
                    
                    <Animated.Text style={[
                      styles.futuristicSubtitle,
                      {
                        opacity: glowAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.7, 1],
                        })
                      }
                    ]}>
                      {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Neural Interface Active"}
                    </Animated.Text>
                    
                    {/* Mic Icon for Voice Control */}
                    <View style={styles.micIconContainer}>
                      {isListening ? (
                        <MicOff size={24} color="#FFFFFF" />
                      ) : (
                        <Mic size={24} color="#FFFFFF" />
                      )}
                    </View>
                    
                    {/* Data Streams */}
                    <View style={styles.dataStreams}>
                      <Animated.View style={[
                        styles.dataLine,
                        {
                          opacity: glowAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.3, 0.8],
                          })
                        }
                      ]} />
                      <Animated.View style={[
                        styles.dataLine,
                        styles.dataLine2,
                        {
                          opacity: glowAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.2, 0.6],
                          })
                        }
                      ]} />
                    </View>
                  </View>
                </LinearGradient>
              </LinearGradient>
              
              {/* Multiple Pulse Rings */}
              <Animated.View style={[
                styles.pulseRingMain,
                {
                  opacity: glowAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.4, 0.8],
                  }),
                  transform: [{
                    scale: glowAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.15],
                    })
                  }]
                }
              ]} />
              
              <Animated.View style={[
                styles.pulseRingSecondary,
                {
                  opacity: glowAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 0.5],
                  }),
                  transform: [{
                    scale: glowAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1.1, 1.3],
                    })
                  }]
                }
              ]} />
            </Animated.View>
          </TouchableOpacity>
          
          {/* Energy Particles */}
          <Animated.View style={[
            styles.energyParticle1,
            {
              opacity: glowAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
              transform: [{
                rotate: orbitalAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-360deg'],
                })
              }]
            }
          ]} />
          
          <Animated.View style={[
            styles.energyParticle2,
            {
              opacity: glowAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.8],
              }),
              transform: [{
                rotate: orbitalAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['180deg', '540deg'],
                })
              }]
            }
          ]} />
        </View>

        {/* Professional Light-Themed Weather Forecast */}
        <View style={styles.weatherForecastContainer}>
          {/* Current Weather Card */}
          <Animated.View
            style={[
              styles.currentWeatherCard,
              {
                transform: [{
                  scale: weatherAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.008]
                  })
                }]
              }
            ]}
          >
            <LinearGradient
              colors={['#FFFFFF', '#FDFDFD', '#FAFAFA']}
              style={styles.weatherCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.currentWeatherHeader}>
                <View style={styles.locationContainer}>
                  <View style={styles.locationIconWrapper}>
                    <MapPin size={16} color="#FFB200" />
                  </View>
                  <Text style={styles.locationText}>Hinjawadi, Pune</Text>
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.updateTime}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <View style={styles.liveIndicatorWeather}>
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.currentWeatherMain}>
                <View style={styles.tempSection}>
                  <Animated.Text 
                    style={[
                      styles.currentTemp,
                      {
                        transform: [{
                          scale: pulseAnimation.interpolate({
                            inputRange: [1, 1.1],
                            outputRange: [1, 1.03]
                          })
                        }]
                      }
                    ]}
                  >
                    26°C
                  </Animated.Text>
                  <View style={styles.weatherIconWrapper}>
                    <Animated.View
                      style={[{
                        transform: [{
                          translateY: weatherAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -4]
                          })
                        }]
                      }]}
                    >
                      <View style={styles.iconBackground}>
                        <Cloud size={52} color="#FFB200" />
                      </View>
                    </Animated.View>
                    <Text style={styles.weatherCondition}>Light Rain</Text>
                    <Text style={styles.feelsLike}>Feels like 29°C</Text>
                  </View>
                </View>
                
                <View style={styles.miniStatsContainer}>
                  <View style={styles.miniStatsGrid}>
                    <View style={styles.miniStat}>
                      <View style={styles.statIconWrapper}>
                        <Cloud size={16} color="#FFB200" />
                      </View>
                      <Text style={styles.miniStatValue}>65%</Text>
                      <Text style={styles.miniStatLabel}>Precipitation</Text>
                    </View>
                    <View style={styles.miniStat}>
                      <View style={styles.statIconWrapper}>
                        <Thermometer size={16} color="#FFB200" />
                      </View>
                      <Text style={styles.miniStatValue}>82%</Text>
                      <Text style={styles.miniStatLabel}>Humidity</Text>
                    </View>
                    <View style={styles.miniStat}>
                      <View style={styles.statIconWrapper}>
                        <Activity size={16} color="#FFB200" />
                      </View>
                      <Text style={styles.miniStatValue}>12 km/h</Text>
                      <Text style={styles.miniStatLabel}>Wind</Text>
                    </View>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
          
          {/* Hourly Temperature Chart */}
          <Animated.View 
            style={[
              styles.hourlyChartCard,
              {
                opacity: weatherAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })
              }
            ]}
          >
            <LinearGradient
              colors={['#FFFFFF', '#FDFDFD']}
              style={styles.chartCardGradient}
            >
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Today's Temperature</Text>
                <View style={styles.chartBadge}>
                  <Text style={styles.chartBadgeText}>24H</Text>
                </View>
              </View>
              <View style={styles.chartContainer}>
                {/* Enhanced Chart Line */}
                <View style={styles.chartGrid}>
                  <Animated.View 
                    style={[
                      styles.temperatureLine,
                      {
                        opacity: weatherAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.7, 1]
                        })
                      }
                    ]}
                  />
                  <Animated.View 
                    style={[
                      styles.temperatureFill,
                      {
                        opacity: weatherAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.3, 0.6]
                        })
                      }
                    ]}
                  />
                  {/* Chart dots */}
                  {[20, 35, 50, 65, 80, 95].map((position, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.chartDot,
                        {
                          left: `${position}%`,
                          opacity: weatherAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.5, 1]
                          })
                        }
                      ]}
                    />
                  ))}
                </View>
                <View style={styles.chartLabels}>
                  {['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'].map((time, index) => (
                    <View key={index} style={styles.timeLabel}>
                      <Text style={styles.tempLabelText}>{[22, 24, 26, 28, 25, 23][index]}°</Text>
                      <Text style={styles.timeLabelText}>{time}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
          
          {/* 7-Day Forecast */}
          <Animated.View 
            style={[
              styles.weeklyForecastCard,
              {
                opacity: weatherAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })
              }
            ]}
          >
            <LinearGradient
              colors={['#FFFFFF', '#FDFDFD']}
              style={styles.forecastCardGradient}
            >
              <View style={styles.forecastHeader}>
                <Text style={styles.forecastTitle}>7-Day Forecast</Text>
                <View style={styles.forecastBadge}>
                  <Text style={styles.forecastBadgeText}>WEEK</Text>
                </View>
              </View>
              <View style={styles.forecastGrid}>
                {[
                  { day: 'Today', icon: Cloud, high: 28, low: 22, isToday: true },
                  { day: 'Tue', icon: Cloud, high: 30, low: 24, isToday: false },
                  { day: 'Wed', icon: Cloud, high: 32, low: 26, isToday: false },
                  { day: 'Thu', icon: Cloud, high: 29, low: 23, isToday: false },
                  { day: 'Fri', icon: Cloud, high: 27, low: 21, isToday: false },
                  { day: 'Sat', icon: Cloud, high: 31, low: 25, isToday: false },
                  { day: 'Sun', icon: Cloud, high: 33, low: 27, isToday: false }
                ].map((forecast, index) => (
                  <Animated.View 
                    key={index} 
                    style={[
                      styles.dailyForecastCard,
                      forecast.isToday && styles.todayCard,
                      {
                        opacity: weatherAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1]
                        }),
                        transform: [{
                          translateY: weatherAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [5, 0]
                          })
                        }]
                      }
                    ]}
                  >
                    <Text style={[
                      styles.dayName,
                      forecast.isToday && styles.todayText
                    ]}>{forecast.day}</Text>
                    <View style={styles.dayIconContainer}>
                      <View style={[
                        styles.dayIconWrapper,
                        forecast.isToday && styles.todayIconWrapper
                      ]}>
                        <forecast.icon size={24} color={forecast.isToday ? '#FFB200' : '#777'} />
                      </View>
                    </View>
                    <View style={styles.dayTemps}>
                      <Text style={[
                        styles.highTemp,
                        forecast.isToday && styles.todayTemp
                      ]}>{forecast.high}°</Text>
                      <Text style={styles.lowTemp}>{forecast.low}°</Text>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* AI Modal Popup */}
        <Modal
          visible={showAIModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAIModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowAIModal(false)}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
              
              <LinearGradient
                colors={['#22C55E', '#16A34A', '#15803D']}
                style={styles.modalContent}
              >
                <View style={styles.modalSparkleContainer}>
                  <Sparkles size={16} color="rgba(255, 255, 255, 0.6)" style={styles.modalSparkle1} />
                  <Sparkles size={12} color="rgba(255, 255, 255, 0.4)" style={styles.modalSparkle2} />
                  <Sparkles size={14} color="rgba(255, 255, 255, 0.5)" style={styles.modalSparkle3} />
                </View>
                
                <Animated.View style={[
                  styles.glowingAIContainer,
                  {
                    shadowOpacity: glowAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 0.8],
                    }),
                    shadowRadius: glowAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 25],
                    }),
                  }
                ]}>
                  <View style={styles.perfectCircle}>
                    <LinearGradient
                      colors={['#E0F2FE', '#BAE6FD', '#7DD3FC', '#38BDF8']}
                      style={styles.circleGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.circleContent}>
                        <Bot size={60} color="#0369A1" />
                        <Animated.View style={[
                          styles.pulseRing,
                          {
                            opacity: glowAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.3, 0.8],
                            }),
                            transform: [{
                              scale: glowAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.1],
                              })
                            }]
                          }
                        ]} />
                      </View>
                    </LinearGradient>
                  </View>
                </Animated.View>
                
                <Text style={styles.modalTitle}>AI Assistant Ready</Text>
                <Text style={styles.modalSubtitle}>
                  Your intelligent farming companion is now activated! 
                  Ask me about weather, crops, pests, and get instant help.
                </Text>
                
                <View style={styles.modalFeatures}>
                  <View style={styles.featureItem}>
                    <Cloud size={16} color="rgba(255, 255, 255, 0.8)" />
                    <Text style={styles.featureText}>Weather Updates</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Activity size={16} color="rgba(255, 255, 255, 0.8)" />
                    <Text style={styles.featureText}>Crop Monitoring</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Bell size={16} color="rgba(255, 255, 255, 0.8)" />
                    <Text style={styles.featureText}>Smart Alerts</Text>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.startChatButton} onPress={startAIConversation}>
                  <LinearGradient
                    colors={['#FFFFFF', '#F8FAFC']}
                    style={styles.startChatGradient}
                  >
                    <MessageCircle size={20} color="#22C55E" />
                    <Text style={styles.startChatText}>Start Chatting</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </Modal>

        {/* Service Sections - Rectangular Cards */}
        <View style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>Agricultural Services</Text>
          
          {/* Row 1: Crop Disease Detection & Farmer Activity */}
          <View style={styles.serviceRow}>
            <TouchableOpacity style={[styles.serviceCard, styles.serviceCardLarge]} onPress={navigateToCropDisease}>
              <LinearGradient
                colors={['#FEF2F2', '#FEE2E2', '#FECACA']}
                style={styles.serviceGradient}
              >
                <View style={styles.serviceHeader}>
                  <View style={styles.serviceIconContainer}>
                    <Camera size={24} color="#EF4444" />
                  </View>
                  <Animated.View style={[{ transform: [{ scale: pulseAnimation }] }]}>
                    <View style={styles.activeIndicator} />
                  </Animated.View>
                </View>
                <Text style={styles.serviceTitle}>Crop Disease Detection</Text>
                <Text style={styles.serviceDescription}>Upload crop images for instant AI diagnosis</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.serviceCard, styles.serviceCardLarge]} onPress={navigateToActivityTracking}>
              <LinearGradient
                colors={['#F0FDF4', '#DCFCE7', '#BBF7D0']}
                style={styles.serviceGradient}
              >
                <View style={styles.serviceHeader}>
                  <View style={styles.serviceIconContainer}>
                    <Activity size={24} color="#22C55E" />
                  </View>
                </View>
                <Text style={styles.serviceTitle}>Activity Tracking</Text>
                <Text style={styles.serviceDescription}>Log and monitor farming activities</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {/* Row 2: Government Schemes & Mandi Prices */}
          <View style={styles.serviceRow}>
            <TouchableOpacity style={[styles.serviceCard, styles.serviceCardLarge]} onPress={navigateToSchemes}>
              <LinearGradient
                colors={['#EFF6FF', '#DBEAFE', '#BFDBFE']}
                style={styles.serviceGradient}
              >
                <View style={styles.serviceHeader}>
                  <View style={styles.serviceIconContainer}>
                    <Calendar size={24} color="#3B82F6" />
                  </View>
                </View>
                <Text style={styles.serviceTitle}>Government Schemes</Text>
                <Text style={styles.serviceDescription}>Explore subsidies and benefits</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.serviceCard, styles.serviceCardLarge]} onPress={navigateToMandiPrices}>
              <LinearGradient
                colors={['#FFFBEB', '#FEF3C7', '#FDE68A']}
                style={styles.serviceGradient}
              >
                <View style={styles.serviceHeader}>
                  <View style={styles.serviceIconContainer}>
                    <IndianRupee size={24} color="#F59E0B" />
                  </View>
                  <View style={styles.liveIndicator}>
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                </View>
                <Text style={styles.serviceTitle}>Mandi Prices</Text>
                <Text style={styles.serviceDescription}>Real-time crop market prices</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {/* Row 3: News & Call AI */}
          <View style={styles.serviceRow}>
            <TouchableOpacity style={[styles.serviceCard, styles.serviceCardLarge]} onPress={navigateToNews}>
              <LinearGradient
                colors={['#F3E8FF', '#E9D5FF', '#DDD6FE']}
                style={styles.serviceGradient}
              >
                <View style={styles.serviceHeader}>
                  <View style={styles.serviceIconContainer}>
                    <Newspaper size={24} color="#8B5CF6" />
                  </View>
                  <View style={styles.newsIndicator}>
                    <Text style={styles.newsText}>TODAY</Text>
                  </View>
                </View>
                <Text style={styles.serviceTitle}>Farming News</Text>
                <Text style={styles.serviceDescription}>Latest agricultural updates</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.serviceCard, styles.serviceCardLarge]} onPress={callAI}>
              <LinearGradient
                colors={['#ECFDF5', '#D1FAE5', '#A7F3D0']}
                style={styles.serviceGradient}
              >
                <View style={styles.serviceHeader}>
                  <View style={styles.serviceIconContainer}>
                    <Phone size={24} color="#10B981" />
                  </View>
                  <Animated.View style={[{ transform: [{ scale: pulseAnimation }] }]}>
                    <View style={styles.callIndicator} />
                  </Animated.View>
                </View>
                <Text style={styles.serviceTitle}>Call AI Assistant</Text>
                <Text style={styles.serviceDescription}>Voice interaction with AI</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  // Top Navigation Styles
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // Greeting Section
  greetingSection: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  header: {
    paddingVertical: 20,
    paddingBottom: 10,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  weatherCard: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 0,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  // Enhanced Weather Card Styles
  weatherCardContainer: {
    marginBottom: 20,
  },
  weatherGlassOverlay: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 4,
    backdropFilter: 'blur(10px)',
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  weatherLocation: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  weatherTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  weatherMainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  weatherIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    overflow: 'hidden',
  },
  weatherIconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  weatherMainTemp: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  weatherFeelsLike: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  weatherDetailsGrid: {
    gap: 8,
  },
  weatherDetailCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    minWidth: 60,
    backdropFilter: 'blur(5px)',
  },
  weatherDetailIcon: {
    marginBottom: 4,
  },
  weatherDetailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  weatherDetailLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  weatherAdviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 4,
  },
  weatherAdviceIcon: {
    marginRight: 8,
  },
  weatherAdviceText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
  },
  weatherFloatingParticle1: {
    position: 'absolute',
    top: 15,
    right: 25,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  weatherFloatingParticle2: {
    position: 'absolute',
    top: 35,
    right: 45,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.8)',
    shadowColor: '#FFD700',
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  weatherFloatingParticle3: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(135, 206, 235, 0.9)',
    shadowColor: '#87CEEB',
    shadowOpacity: 0.7,
    shadowRadius: 3,
  },
  weatherFloatingParticle4: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  weatherWave1: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  weatherWave2: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  weatherInfo: {
    marginLeft: 15,
  },
  weatherMain: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  weatherDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  weatherRight: {
    alignItems: 'flex-end',
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  weatherDetailText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  weatherAdvice: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  weatherParticle1: {
    position: 'absolute',
    top: 10,
    right: 20,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  weatherParticle2: {
    position: 'absolute',
    bottom: 15,
    right: 40,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  weatherText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
  },
  aiSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  aiBackground: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  aiGradientBackground: {
    padding: 32,
    alignItems: 'center',
    position: 'relative',
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sparkle1: {
    position: 'absolute',
    top: 20,
    right: 30,
  },
  sparkle2: {
    position: 'absolute',
    top: 40,
    left: 40,
  },
  sparkle3: {
    position: 'absolute',
    bottom: 30,
    right: 50,
  },
  aiButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  aiButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  aiSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    textAlign: 'center',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22C55E',
  },
  reminderCard: {
    backgroundColor: '#FEF3C7',
    padding: 18,
    borderRadius: 18,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  reminderText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  quickActionsContainer: {
    marginBottom: 20,
  },
  // Service Sections Styles
  servicesContainer: {
    marginBottom: 30,
  },
  serviceRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  serviceCard: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceCardLarge: {
    minHeight: 120,
  },
  serviceGradient: {
    padding: 16,
    borderRadius: 16,
    height: '100%',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  liveIndicator: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newsIndicator: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newsText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  callIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    paddingLeft: 4,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    width: '31%',
    alignItems: 'center',
    minHeight: 140,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 380,
    minHeight: 450,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 20,
    // Perfect centering
    alignSelf: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 30,
    alignItems: 'center',
    position: 'relative',
  },
  modalSparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalSparkle1: {
    position: 'absolute',
    top: 25,
    right: 35,
  },
  modalSparkle2: {
    position: 'absolute',
    top: 50,
    left: 45,
  },
  modalSparkle3: {
    position: 'absolute',
    bottom: 40,
    right: 55,
  },
  glowingAIContainer: {
    marginBottom: 25,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    elevation: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfectCircle: {
    width: 150,
    height: 150,
    borderRadius: 75, // Perfect circle: 50% of width/height
    overflow: 'hidden',
    shadowColor: '#0369A1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    // Floating effect
    transform: [{ translateY: -2 }],
  },
  circleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circleContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(3, 105, 161, 0.3)',
    backgroundColor: 'transparent',
  },
  glowingAI: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modalSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  modalFeatures: {
    width: '100%',
    marginBottom: 25,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  startChatButton: {
    width: '100%',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  startChatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 20,
    gap: 10,
  },
  startChatText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22C55E',
  },
  // Centered Circle Styles
  centeredCircleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  perfectMainCircle: {
    width: 150,
    height: 150,
    borderRadius: 75, // Perfect circle: 50% of width/height
    overflow: 'hidden',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    // Floating effect
    transform: [{ translateY: -4 }],
  },
  circleGradientMain: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circleContentMain: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  circleTouchContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginTop: 8,
    textAlign: 'center',
  },
  circleSubtitle: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 2,
    textAlign: 'center',
  },
  pulseRingMain: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: 'rgba(30, 64, 175, 0.3)',
    backgroundColor: 'transparent',
  },
  // Futuristic Enhancement Styles
  outerOrbitalRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbitalDot1: {
    position: 'absolute',
    top: -4,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#60A5FA',
    shadowColor: '#60A5FA',
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  orbitalDot2: {
    position: 'absolute',
    bottom: -4,
    right: '50%',
    marginRight: -4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A78BFA',
    shadowColor: '#A78BFA',
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  orbitalDot3: {
    position: 'absolute',
    right: -4,
    top: '50%',
    marginTop: -4,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#34D399',
    shadowColor: '#34D399',
    shadowOpacity: 0.7,
    shadowRadius: 3,
  },
  holographicLayer: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glassLayer: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  botContainer: {
    marginBottom: 8,
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  futuristicTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(59, 130, 246, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  futuristicSubtitle: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dataStreams: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataLine: {
    position: 'absolute',
    width: 80,
    height: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.6)',
    shadowColor: '#3B82F6',
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  dataLine2: {
    marginTop: 4,
    width: 60,
    backgroundColor: 'rgba(139, 92, 246, 0.6)',
    shadowColor: '#8B5CF6',
  },
  pulseRingSecondary: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    backgroundColor: 'transparent',
  },
  energyParticle1: {
    position: 'absolute',
    top: 20,
    right: 30,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#60A5FA',
    shadowColor: '#60A5FA',
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  energyParticle2: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#EC4899',
    shadowColor: '#EC4899',
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  // Professional Light Weather Forecast Styles
  weatherForecastContainer: {
    marginBottom: 24,
    gap: 20,
  },
  currentWeatherCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  weatherCardGradient: {
    padding: 24,
    borderRadius: 20,
  },
  currentWeatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 178, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  updateTime: {
    fontSize: 12,
    color: '#777',
    fontWeight: '500',
  },
  liveIndicatorWeather: {
    backgroundColor: '#FFB200',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  currentWeatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tempSection: {
    flex: 1,
  },
  currentTemp: {
    fontSize: 56,
    fontWeight: '800',
    color: '#333',
    marginBottom: 12,
    letterSpacing: -2,
  },
  weatherIconWrapper: {
    alignItems: 'flex-start',
    gap: 8,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 178, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherCondition: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  feelsLike: {
    fontSize: 14,
    color: '#777',
    fontWeight: '500',
  },
  miniStatsContainer: {
    flex: 1,
    paddingLeft: 20,
  },
  miniStatsGrid: {
    gap: 16,
  },
  miniStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 178, 0, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  statIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 178, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniStatValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '700',
    flex: 1,
  },
  miniStatLabel: {
    fontSize: 12,
    color: '#777',
    fontWeight: '500',
  },
  hourlyChartCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  chartCardGradient: {
    padding: 24,
    borderRadius: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  chartBadge: {
    backgroundColor: 'rgba(255, 178, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  chartBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFB200',
  },
  chartContainer: {
    height: 140,
    position: 'relative',
  },
  chartGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  temperatureLine: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#FFB200',
    borderRadius: 2,
    shadowColor: '#FFB200',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  temperatureFill: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: 'rgba(255, 178, 0, 0.15)',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  chartDot: {
    position: 'absolute',
    top: 38,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFB200',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#FFB200',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  chartLabels: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  timeLabel: {
    alignItems: 'center',
    gap: 6,
  },
  tempLabelText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '700',
  },
  timeLabelText: {
    fontSize: 11,
    color: '#777',
    fontWeight: '500',
  },
  weeklyForecastCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  forecastCardGradient: {
    padding: 24,
    borderRadius: 20,
  },
  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  forecastBadge: {
    backgroundColor: 'rgba(255, 178, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  forecastBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFB200',
  },
  forecastGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dailyForecastCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 178, 0, 0.1)',
  },
  todayCard: {
    backgroundColor: 'rgba(255, 178, 0, 0.1)',
    borderColor: '#FFB200',
    borderWidth: 1.5,
  },
  dayName: {
    fontSize: 13,
    color: '#777',
    fontWeight: '600',
    marginBottom: 10,
  },
  todayText: {
    color: '#FFB200',
    fontWeight: '700',
  },
  dayIconContainer: {
    marginBottom: 10,
  },
  dayIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(119, 119, 119, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayIconWrapper: {
    backgroundColor: 'rgba(255, 178, 0, 0.2)',
  },
  dayTemps: {
    alignItems: 'center',
    gap: 4,
  },
  highTemp: {
    fontSize: 16,
    color: '#333',
    fontWeight: '700',
  },
  todayTemp: {
    color: '#FFB200',
  },
  lowTemp: {
    fontSize: 13,
    color: '#777',
    fontWeight: '500',
  },
  // Voice Assistant Styles
  micIconContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});

