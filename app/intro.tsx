import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PagerView from 'react-native-pager-view';

const { width } = Dimensions.get('window');

const introSlides = [
  {
    id: 1,
    icon: '🤖',
    title: 'AI Assistant',
    description: 'Get smart farming advice powered by artificial intelligence',
  },
  {
    id: 2,
    icon: '🔍',
    title: 'Crop Disease Detection',
    description: 'Identify diseases and pests early with image recognition',
  },
  {
    id: 3,
    icon: '🌤️',
    title: 'Weather Alerts',
    description: 'Stay informed with real-time weather updates and forecasts',
  },
  {
    id: 4,
    icon: '📋',
    title: 'Government Schemes',
    description: 'Access information about farming subsidies and schemes',
  },
  {
    id: 5,
    icon: '📊',
    title: 'Activity Tracker',
    description: 'Track your farming activities and maintain records',
  },
];

export default function IntroScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasSeenIntro', 'true');
    router.replace('/language');
  };

  const handleNext = async () => {
    if (currentPage < introSlides.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      await AsyncStorage.setItem('hasSeenIntro', 'true');
      router.replace('/language');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <PagerView
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {introSlides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <Text style={styles.icon}>{slide.icon}</Text>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </PagerView>

      <View style={styles.bottomContainer}>
        <View style={styles.pagination}>
          {introSlides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentPage && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentPage === introSlides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: '#6B7280',
    fontSize: 16,
  },
  pager: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#22C55E',
    width: 24,
  },
  nextButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});