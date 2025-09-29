import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, Animated } from 'react-native';
import PageTransition from '@/components/PageTransition';
import { replaceWithTransition } from '@/src/utils/navigation';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

// API base URL - should match the one used in ai-chat.tsx
// API Configuration - LAN IP for mobile device connectivity
// For mobile devices, use your computer's LAN IP instead of localhost
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.60.149.114:3000';
console.log('Index API_BASE_URL configured as:', API_BASE_URL);

export default function IndexScreen() {
  const [isReady, setIsReady] = useState(false);
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [transitioning, setTransitioning] = useState(false);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    // Fade in animation for loading indicator
    Animated.timing(fadeAnimation, {
      toValue: 1,
      
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Wait for the navigation system to be ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100); // Small delay to ensure router is mounted

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // On first mount, try to fetch and play Hindi TTS once
    const playWelcome = async () => {
      if (hasPlayedRef.current) return;
      try {
        hasPlayedRef.current = true;
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false });
        // Use 11labs TTS from backend (only Niraj Hindi voice)
        const ttsUrl = `${API_BASE_URL}/tts?lang=hi&text=${encodeURIComponent('नमस्ते किसान भाई! कल बारिश होगी, छिड़काव से बचें।')}`;
        const { sound } = await Audio.Sound.createAsync({ uri: ttsUrl }, { shouldPlay: true });
		// Optionally unload after playback finishes
		sound.setOnPlaybackStatusUpdate((status) => {
			if ('didJustFinish' in status && status.didJustFinish) {
				sound.unloadAsync();
			}
		});
      } catch (e) {
        // Ignore failures to avoid blocking navigation
      }
    };
    playWelcome();
  }, []);

  useEffect(() => {
    if (isReady) {
      // Trigger transition before navigation
      setTransitioning(true);
    }
  }, [isReady]);

  useEffect(() => {
    if (transitioning) {
      replaceWithTransition('/splash');
    }
  }, [transitioning]);

  // Show loading indicator while waiting
  return (
    <PageTransition isActive={!transitioning} type="fade">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View style={{ opacity: fadeAnimation }}>
          <ActivityIndicator size="large" />
        </Animated.View>
      </View>
    </PageTransition>
  );
}