import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Send, Bot, User, Sparkles, Wheat, Mic, Image, Plus, Clock, Star, TrendingUp } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'quick_action';
  category?: string;
}

interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  action: string;
}

interface ChatStats {
  totalQuestions: number;
  helpfulAnswers: number;
  avgResponseTime: string;
}

const demoResponses: Record<string, string> = {
  'what should i do today': '🌧️ Rain expected tomorrow, avoid spraying pesticides. Today is good for checking irrigation systems and preparing for the rain.',
  'weather': '🌤️ Today: Partly cloudy, 28°C. Tomorrow: Rain expected with 15mm precipitation. Wind speed: 12 km/h from southwest.',
  'pest control': '🐛 For effective pest control: 1) Inspect crops early morning, 2) Use neem oil spray for organic treatment, 3) Avoid chemical spraying before rain.',
  'fertilizer': '🌱 For current season: Apply NPK 19:19:19 @ 200kg/ha. Add organic compost for better soil health. Best time: Early morning or evening.',
  'crop disease': '🔍 Upload an image of affected plant for accurate diagnosis. Common signs: yellowing leaves, spots, wilting. Early detection is key for treatment.',
  'irrigation': '💧 Check soil moisture at 6-inch depth. Water deeply but less frequently. Drip irrigation saves 30-50% water compared to flood irrigation.',
};

export default function AIChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI farming assistant. I can help you with crop care, weather updates, pest control, and farming advice. What would you like to know?',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [glowAnimation] = useState(new Animated.Value(0));
  const [fadeAnimation] = useState(new Animated.Value(0));
  const [slideAnimation] = useState(new Animated.Value(30));
  const [pulseAnimation] = useState(new Animated.Value(1));
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  // Enhanced chat statistics
  const [chatStats] = useState<ChatStats>({
    totalQuestions: 47,
    helpfulAnswers: 43,
    avgResponseTime: '2.3s'
  });

  // Quick action suggestions
  const [quickActions] = useState<QuickAction[]>([
    {
      id: '1',
      title: 'Weather Forecast',
      icon: <TrendingUp size={20} color="#4CAF50" />,
      description: 'Get today\'s weather and 7-day forecast',
      action: 'weather forecast for today'
    },
    {
      id: '2',
      title: 'Crop Health Check',
      icon: <Star size={20} color="#4CAF50" />,
      description: 'Analyze crop condition and get advice',
      action: 'crop health analysis'
    },
    {
      id: '3',
      title: 'Pest Control',
      icon: <Plus size={20} color="#4CAF50" />,
      description: 'Get pest identification and treatment tips',
      action: 'pest control advice'
    },
    {
      id: '4',
      title: 'Daily Tasks',
      icon: <Clock size={20} color="#4CAF50" />,
      description: 'Check today\'s recommended farming activities',
      action: 'what should I do today'
    }
  ]);

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
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

    // Start glow animation for AI indicator
    const glowLoop = Animated.loop(
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
    );
    glowLoop.start();

    // Pulse animation for recording
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    
    if (isRecording) {
      pulseLoop.start();
    } else {
      pulseLoop.stop();
    }

    return () => {
      glowLoop.stop();
      pulseLoop.stop();
    };
  }, [isRecording]);

  const sendMessage = (messageText?: string) => {
    const textToSend = messageText || inputText;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setShowQuickActions(false);

    // Scroll to bottom when new message is added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Find appropriate response
    const query = textToSend.toLowerCase();
    let response = 'I understand your question about farming. While I\'m in demo mode, I can help with weather updates, crop care, pest control, fertilizer advice, and irrigation tips. Please ask about specific farming topics!';
    let category = 'general';

    for (const [key, value] of Object.entries(demoResponses)) {
      if (query.includes(key)) {
        response = value;
        category = key;
        break;
      }
    }

    // Enhanced responses based on category
    if (query.includes('crop health') || query.includes('analysis')) {
      response = '🌱 For comprehensive crop health analysis: 1) Check leaf color and texture, 2) Monitor growth patterns, 3) Inspect for pest damage, 4) Test soil moisture levels. Would you like me to guide you through a specific crop assessment?';
      category = 'crop_health';
    }

    // Simulate AI response delay with realistic timing
    const responseDelay = Math.random() * 1000 + 1500; // 1.5-2.5 seconds
    setTimeout(() => {
      setIsTyping(false);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        type: 'text',
        category
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Scroll to bottom after AI response
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, responseDelay);

    setInputText('');
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording simulation
      setTimeout(() => {
        setIsRecording(false);
        setInputText('What should I do about yellow leaves on my tomato plants?');
      }, 3000);
    }
  };

  const handleImageUpload = () => {
    // Simulate image upload for crop analysis
    const imageAnalysisMessage: Message = {
      id: Date.now().toString(),
      text: '📸 Image uploaded successfully! Analyzing crop condition...',
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, imageAnalysisMessage]);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const analysisResult: Message = {
        id: (Date.now() + 1).toString(),
        text: '🔍 Analysis Complete: I can see healthy green leaves with good moisture levels. No signs of disease detected. Your crop looks healthy! Continue current care routine and monitor for any changes.',
        isUser: false,
        timestamp: new Date(),
        type: 'text',
        category: 'image_analysis'
      };
      setMessages(prev => [...prev, analysisResult]);
    }, 3000);
  };

  const handleQuickAction = (action: QuickAction) => {
    sendMessage(action.action);
  };

  const renderMessage = (message: Message) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      <View style={styles.messageHeader}>
        <View style={[
          styles.messageIcon,
          message.isUser ? styles.userMessageIcon : styles.aiMessageIcon
        ]}>
          {message.isUser ? (
            <User size={16} color={message.isUser ? '#FFFFFF' : '#4CAF50'} />
          ) : (
            <Bot size={16} color="#4CAF50" />
          )}
        </View>
        <Text style={styles.messageTime}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <View style={[
        styles.messageText,
        message.isUser ? styles.userMessageText : styles.aiMessageText
      ]}>
        <Text style={[
          styles.messageTextContent,
          message.isUser ? styles.userMessageTextContent : styles.aiMessageTextContent
        ]}>
          {message.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F1F8E9', '#E8F5E8']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.3 }}
      >
        {/* Enhanced Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#4CAF50" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Wheat size={20} color="#4CAF50" />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>AI Farming Assistant</Text>
                <Text style={styles.headerSubtitle}>Smart Agriculture Support</Text>
              </View>
            </View>
            
            <Animated.View style={[
              styles.aiIndicator,
              {
                shadowOpacity: glowAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.8],
                }),
                shadowRadius: glowAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [4, 12],
                }),
              }
            ]}>
              <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                style={styles.aiIndicatorGradient}
              >
                <Animated.View style={[
                  styles.aiDot,
                  {
                    opacity: glowAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  }
                ]} />
                <Text style={styles.aiStatus}>Online</Text>
                <Sparkles size={12} color="#FFFFFF" style={styles.sparkleIcon} />
              </LinearGradient>
            </Animated.View>
          </View>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessage)}
          {isTyping && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={styles.messageHeader}>
                <LinearGradient
                  colors={['#4CAF50', '#2E7D32']}
                  style={styles.typingIcon}
                >
                  <Bot size={16} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.messageTime}>typing...</Text>
              </View>
              <View style={styles.typingIndicator}>
                <Animated.View style={[styles.typingDot, styles.dot1]} />
                <Animated.View style={[styles.typingDot, styles.dot2]} />
                <Animated.View style={[styles.typingDot, styles.dot3]} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Enhanced Input Container */}
        <View style={styles.inputContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.inputContainerGradient}
          >
            {/* Recording Indicator */}
            {isRecording && (
              <Animated.View style={[
                styles.recordingIndicator,
                {
                  transform: [{ scale: pulseAnimation }],
                }
              ]}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>Recording...</Text>
              </Animated.View>
            )}
            
            <View style={styles.inputRow}>
              {/* Voice Input Button */}
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  isRecording && styles.recordingButton
                ]}
                onPress={handleVoiceRecording}
                activeOpacity={0.8}
              >
                <Animated.View style={[
                  { transform: [{ scale: isRecording ? pulseAnimation : new Animated.Value(1) }] }
                ]}>
                  <Mic size={20} color={isRecording ? '#FFFFFF' : '#4CAF50'} />
                </Animated.View>
              </TouchableOpacity>
              
              {/* Text Input */}
              <TextInput
                style={styles.textInput}
                placeholder="Ask about weather, crops, pests..."
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={200}
                placeholderTextColor="#9CA3AF"
                editable={!isRecording}
              />
              
              {/* Image Upload Button */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleImageUpload}
                activeOpacity={0.8}
              >
                <Image size={20} color="#4CAF50" />
              </TouchableOpacity>
              
              {/* Send Button */}
              <TouchableOpacity
                style={[
                  styles.sendButton, 
                  (!inputText.trim() && !isRecording) && styles.disabledSendButton
                ]}
                onPress={() => sendMessage()}
                disabled={!inputText.trim() && !isRecording}
                activeOpacity={0.8}
              >
                <Send size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Enhanced Suggestions */}
        <View style={styles.suggestionsContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.suggestionsGradient}
          >
            <Text style={styles.suggestionsTitle}>Quick Questions:</Text>
            <View style={styles.suggestionsRow}>
              <TouchableOpacity
                style={styles.suggestionChip}
                onPress={() => sendMessage('What should I do today?')}
                activeOpacity={0.8}
              >
                <Text style={styles.suggestionText}>Today's Tasks</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.suggestionChip}
                onPress={() => sendMessage('Weather forecast')}
                activeOpacity={0.8}
              >
                <Text style={styles.suggestionText}>Weather</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.suggestionChip}
                onPress={() => sendMessage('Pest control tips')}
                activeOpacity={0.8}
              >
                <Text style={styles.suggestionText}>Pest Control</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  titleContainer: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  aiIndicatorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  aiStatus: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  sparkleIcon: {
    marginLeft: 2,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statsGradient: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
  },
  quickActionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionGradient: {
    padding: 16,
    minHeight: 100,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F8E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userMessageIcon: {
    backgroundColor: '#4CAF50',
  },
  aiMessageIcon: {
    backgroundColor: '#F1F8E9',
  },
  messageTime: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  messageText: {
    maxWidth: '80%',
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  userMessageText: {
    backgroundColor: '#4CAF50',
  },
  aiMessageText: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageTextContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    lineHeight: 20,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  userMessageTextContent: {
    color: '#FFFFFF',
  },
  aiMessageTextContent: {
    color: '#1F2937',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputContainerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F8E9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  recordingButton: {
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  sendButton: {
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
    elevation: 4,
  },
  disabledSendButton: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0.1,
  },
  suggestionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  suggestionsGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  suggestionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#F1F8E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  suggestionText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  // Typing indicator styles
  typingIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    maxWidth: '80%',
    gap: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
});