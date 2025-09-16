import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Wheat } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.3)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const textSlideAnimation = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Start animations
    startAnimations();

    const checkFlow = async () => {
      try {
        // Clean splash experience
        setTimeout(() => {
          router.replace('/language');
        }, 3000);
      } catch (error) {
        console.error('Error during splash navigation:', error);
        setTimeout(() => {
          router.replace('/language');
        }, 4000);
      }
    };

    checkFlow();
  }, []);

  const startAnimations = () => {
    // Main entrance animation sequence
    Animated.sequence([
      // Fade in
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Scale up logo
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Text slide in
    Animated.timing(textSlideAnimation, {
      toValue: 0,
      duration: 800,
      delay: 400,
      useNativeDriver: true,
    }).start();

    // Gentle pulse effect
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
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F1F8E9', '#E8F5E8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >

        {/* Main Content */}
        <Animated.View style={[
          styles.logoContainer,
          {
            opacity: fadeAnimation,
            transform: [{ scale: scaleAnimation }],
          }
        ]}>
          {/* Main Logo Circle */}
          <Animated.View style={[
            styles.logoCircle,
            {
              transform: [{ scale: pulseAnimation }],
            }
          ]}>
            <View style={styles.logoWrapper}>
              <Wheat size={60} color="#4CAF50" />
            </View>
          </Animated.View>

          {/* App Title */}
          <Animated.View style={[
            styles.titleContainer,
            {
              transform: [{ translateY: textSlideAnimation }],
              opacity: fadeAnimation,
            }
          ]}>
            <Text style={styles.appName}>KrushiAI</Text>
            <Text style={styles.tagline}>Smart Farming Solutions</Text>
            <Text style={styles.subtitle}>Empowering Farmers with AI Technology</Text>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  logoWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  titleContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    letterSpacing: 2,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    textShadowColor: 'rgba(76, 175, 80, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: '#2E7D32',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 8,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});