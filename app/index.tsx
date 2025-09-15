import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function IndexScreen() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for the navigation system to be ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100); // Small delay to ensure router is mounted

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady) {
      // Navigate to splash screen once ready
      router.replace('/splash');
    }
  }, [isReady, router]);

  // Show loading indicator while waiting
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}