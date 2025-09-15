import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Send, Bot, User, Sparkles } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
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
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [glowAnimation] = useState(new Animated.Value(0));
  const router = useRouter();

  useEffect(() => {
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
    return () => glowLoop.stop();
  }, []);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Find appropriate response
    const query = inputText.toLowerCase();
    let response = 'I understand your question about farming. While I\'m in demo mode, I can help with weather updates, crop care, pest control, fertilizer advice, and irrigation tips. Please ask about specific farming topics!';

    for (const [key, value] of Object.entries(demoResponses)) {
      if (query.includes(key)) {
        response = value;
        break;
      }
    }

    // Simulate AI response delay
    setTimeout(() => {
      setIsTyping(false);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 2000);

    setInputText('');
  };

  const renderMessage = (message: Message) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      <View style={styles.messageHeader}>
        <View style={styles.messageIcon}>
          {message.isUser ? (
            <User size={16} color={message.isUser ? '#FFFFFF' : '#22C55E'} />
          ) : (
            <Bot size={16} color="#22C55E" />
          )}
        </View>
        <Text style={styles.messageTime}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <Text style={[
        styles.messageText,
        message.isUser ? styles.userMessageText : styles.aiMessageText
      ]}>
        {message.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Farming Assistant</Text>
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
            colors={['#22C55E', '#16A34A']}
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

      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.map(renderMessage)}
        {isTyping && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <View style={styles.messageHeader}>
              <LinearGradient
                colors={['#22C55E', '#16A34A']}
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask about weather, crops, pests..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={200}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.disabledSendButton]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Quick Questions:</Text>
        <View style={styles.suggestionsRow}>
          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => setInputText('What should I do today?')}
          >
            <Text style={styles.suggestionText}>Today's Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => setInputText('Weather forecast')}
          >
            <Text style={styles.suggestionText}>Weather</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => setInputText('Pest control tips')}
          >
            <Text style={styles.suggestionText}>Pest Control</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginLeft: 16,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  aiIndicatorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
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
  },
  sparkleIcon: {
    marginLeft: 2,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    marginBottom: 4,
  },
  messageIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  messageText: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    lineHeight: 20,
  },
  userMessageText: {
    backgroundColor: '#22C55E',
    color: '#FFFFFF',
  },
  aiMessageText: {
    backgroundColor: '#F3F4F6',
    color: '#1F2937',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    backgroundColor: '#D1D5DB',
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  suggestionsTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  suggestionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  suggestionText: {
    fontSize: 12,
    color: '#6B7280',
  },
  // Typing indicator styles
  typingIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    maxWidth: '80%',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
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