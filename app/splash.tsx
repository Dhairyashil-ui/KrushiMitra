import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Cpu, Zap, Activity, Shield, Wifi } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.3)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const orbitalAnimation = useRef(new Animated.Value(0)).current;
  const textSlideAnimation = useRef(new Animated.Value(50)).current;
  const particleAnimation = useRef(new Animated.Value(0)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // StatusBar configuration
    StatusBar.setHidden(true);

    // Start all animations
    startAnimations();

    const checkFlow = async () => {
      try {
        // Extended time for better splash experience
        setTimeout(() => {
          StatusBar.setHidden(false);
          router.replace('/language');
        }, 4000);
      } catch (error) {
        console.error('Error during splash navigation:', error);
        setTimeout(() => {
          StatusBar.setHidden(false);
          router.replace('/language');
        }, 8000);
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
        duration: 800,
        useNativeDriver: true,
      }),
      // Scale up logo
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Text slide in
    Animated.timing(textSlideAnimation, {
      toValue: 0,
      duration: 1200,
      delay: 800,
      useNativeDriver: true,
    }).start();

    // Continuous rotation
    Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse effect
    Animated.loop(
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
    ).start();

    // Orbital animation
    Animated.loop(
      Animated.timing(orbitalAnimation, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      })
    ).start();

    // Particle animation
    Animated.loop(
      Animated.timing(particleAnimation, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();

    // Glow animation
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
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e', '#0f3460', '#1a1a2e', '#0a0a0a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
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
              translateY: particleAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [height, -100],
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
              translateX: particleAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, width + 50],
              })
            }]
          }
        ]} />

        <Animated.View style={[
          styles.particle3,
          {
            opacity: particleAnimation.interpolate({
              inputRange: [0, 0.4, 0.8, 1],
              outputRange: [0.4, 1, 0.6, 0.4],
            }),
            transform: [{
              translateY: particleAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [height + 50, -100],
              })
            }]
          }
        ]} />

        {/* Main Content */}
        <Animated.View style={[
          styles.logoContainer,
          {
            opacity: fadeAnimation,
            transform: [{ scale: scaleAnimation }],
          }
        ]}>
          {/* Orbital Rings */}
          <Animated.View style={[
            styles.outerRing,
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
          </Animated.View>

          <Animated.View style={[
            styles.middleRing,
            {
              transform: [{
                rotate: orbitalAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['360deg', '0deg'],
                })
              }]
            }
          ]}>
            <View style={styles.orbitalDot3} />
            <View style={styles.orbitalDot4} />
          </Animated.View>

          {/* Main Logo Circle */}
          <Animated.View style={[
            styles.logoCircle,
            {
              transform: [
                { scale: pulseAnimation },
                {
                  rotate: rotateAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  })
                }
              ],
              shadowOpacity: glowAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.8],
              }),
              shadowRadius: glowAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 40],
              }),
            }
          ]}>
            <LinearGradient
              colors={[
                'rgba(0, 212, 255, 0.9)',
                'rgba(0, 153, 204, 0.8)',
                'rgba(0, 102, 255, 0.7)',
                'rgba(139, 92, 246, 0.6)',
                'rgba(0, 212, 255, 0.9)'
              ]}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.logoContent}>
                <Cpu size={80} color="#ffffff" />
                
                {/* Tech Icons around the CPU */}
                <Animated.View style={[
                  styles.techIcon1,
                  {
                    transform: [{
                      rotate: rotateAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '-360deg'],
                      })
                    }]
                  }
                ]}>
                  <Zap size={16} color="#00ff88" />
                </Animated.View>
                
                <Animated.View style={[
                  styles.techIcon2,
                  {
                    transform: [{
                      rotate: rotateAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '-360deg'],
                      })
                    }]
                  }
                ]}>
                  <Activity size={16} color="#ff6b6b" />
                </Animated.View>
                
                <Animated.View style={[
                  styles.techIcon3,
                  {
                    transform: [{
                      rotate: rotateAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '-360deg'],
                      })
                    }]
                  }
                ]}>
                  <Shield size={16} color="#ffa726" />
                </Animated.View>
                
                <Animated.View style={[
                  styles.techIcon4,
                  {
                    transform: [{
                      rotate: rotateAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '-360deg'],
                      })
                    }]
                  }
                ]}>
                  <Wifi size={16} color="#00d4ff" />
                </Animated.View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* App Title */}
          <Animated.View style={[
            styles.titleContainer,
            {
              transform: [{ translateY: textSlideAnimation }],
              opacity: fadeAnimation,
            }
          ]}>
            <LinearGradient
              colors={['#00d4ff', '#0099cc', '#0066ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.titleGradient}
            >
              <Text style={styles.appName}>KrushiAI</Text>
            </LinearGradient>
            
            <Animated.Text style={[
              styles.tagline,
              {
                opacity: glowAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1],
                }),
              }
            ]}>
              ⚡ Neural Agricultural Intelligence System
            </Animated.Text>
            
            <Animated.Text style={[
              styles.subtitle,
              {
                opacity: fadeAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.8],
                }),
              }
            ]}>
              Powered by AI NEXUS • Quantum Farming Solutions
            </Animated.Text>
          </Animated.View>

          {/* Loading Indicator */}
          <Animated.View style={[
            styles.loadingContainer,
            {
              opacity: fadeAnimation,
            }
          ]}>
            <Animated.View style={[
              styles.loadingBar,
              {
                width: glowAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width * 0.1, width * 0.7],
                }),
              }
            ]} />
            <Text style={styles.loadingText}>Initializing Neural Networks...</Text>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle1: {
    position: 'absolute',
    left: width * 0.1,
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
    top: height * 0.3,
    width: 2,
    height: 2,
    backgroundColor: '#00ff88',
    borderRadius: 1,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  particle3: {
    position: 'absolute',
    right: width * 0.2,
    width: 4,
    height: 4,
    backgroundColor: '#ff6b6b',
    borderRadius: 2,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  logoContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
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
    backgroundColor: '#00d4ff',
    borderRadius: 4,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  orbitalDot2: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    backgroundColor: '#00ff88',
    borderRadius: 4,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  orbitalDot3: {
    position: 'absolute',
    left: -4,
    top: '50%',
    marginTop: -4,
    width: 8,
    height: 8,
    backgroundColor: '#ff6b6b',
    borderRadius: 4,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  orbitalDot4: {
    position: 'absolute',
    right: -4,
    top: '50%',
    marginTop: -4,
    width: 8,
    height: 8,
    backgroundColor: '#ffa726',
    borderRadius: 4,
    shadowColor: '#ffa726',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoContent: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  techIcon1: {
    position: 'absolute',
    top: -30,
    right: -10,
  },
  techIcon2: {
    position: 'absolute',
    bottom: -30,
    left: -10,
  },
  techIcon3: {
    position: 'absolute',
    top: -10,
    left: -30,
  },
  techIcon4: {
    position: 'absolute',
    bottom: -10,
    right: -30,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  titleGradient: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: 16,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 212, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  tagline: {
    fontSize: 16,
    color: '#00d4ff',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 212, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  loadingContainer: {
    alignItems: 'center',
    width: width * 0.8,
  },
  loadingBar: {
    height: 3,
    backgroundColor: '#00d4ff',
    borderRadius: 2,
    marginBottom: 12,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  loadingText: {
    fontSize: 14,
    color: '#00d4ff',
    letterSpacing: 0.5,
    opacity: 0.8,
  },
});