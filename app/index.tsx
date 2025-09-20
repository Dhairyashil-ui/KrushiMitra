import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, Animated } from 'react-native';
import PageTransition from '@/components/PageTransition';
import { replaceWithTransition } from '@/src/utils/navigation';

export default function IndexScreen() {
  const [isReady, setIsReady] = useState(false);
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [transitioning, setTransitioning] = useState(false);

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