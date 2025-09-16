import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Upload, 
  Camera, 
  Leaf, 
  Eye, 
  Sun, 
  Focus,
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react-native';

interface RecentScan {
  id: string;
  cropName: string;
  result: string;
  status: 'healthy' | 'diseased' | 'warning';
  date: string;
  image: string;
  confidence: number;
}

export default function CropDiseaseDetectionScreen() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.9)).current;
  const buttonPressScale = useRef(new Animated.Value(1)).current;

  // Demo recent scans data
  const [recentScans] = useState<RecentScan[]>([
    {
      id: '1',
      cropName: 'Wheat Leaves',
      result: 'Leaf Rust Detected',
      status: 'diseased',
      date: '2024-01-15',
      image: '🌾',
      confidence: 92
    },
    {
      id: '2',
      cropName: 'Tomato Plant',
      result: 'Healthy',
      status: 'healthy',
      date: '2024-01-14',
      image: '🍅',
      confidence: 98
    },
    {
      id: '3',
      cropName: 'Rice Paddy',
      result: 'Brown Spot - Early Stage',
      status: 'warning',
      date: '2024-01-13',
      image: '🌾',
      confidence: 87
    }
  ]);

  const detectionTips = [
    {
      icon: <Sun size={16} color="#4CAF50" />,
      text: 'Take photos in good natural light'
    },
    {
      icon: <Leaf size={16} color="#4CAF50" />,
      text: 'Focus on affected leaves or parts'
    },
    {
      icon: <Focus size={16} color="#4CAF50" />,
      text: 'Avoid blurry or shaky images'
    },
    {
      icon: <Eye size={16} color="#4CAF50" />,
      text: 'Capture close-up details clearly'
    }
  ];

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
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleButtonPress = (animationValue: Animated.Value, action: () => void) => {
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animationValue, {
        toValue: 1.02,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => action());
  };

  const handleUploadImage = () => {
    handleButtonPress(buttonPressScale, () => {
      setIsScanning(true);
      // Simulate image upload and processing
      setTimeout(() => {
        setIsScanning(false);
        Alert.alert(
          'Analysis Complete',
          'Tomato Leaf - Early Blight detected with 89% confidence. Recommended treatment: Apply copper-based fungicide.',
          [{ text: 'View Details', onPress: () => {} }]
        );
      }, 2500);
    });
  };

  const handleScanWithCamera = () => {
    handleButtonPress(buttonPressScale, () => {
      setIsScanning(true);
      // Simulate camera capture and processing
      setTimeout(() => {
        setIsScanning(false);
        Alert.alert(
          'Analysis Complete',
          'Rice Plant - Bacterial Leaf Blight detected with 94% confidence. Immediate action required.',
          [{ text: 'View Treatment', onPress: () => {} }]
        );
      }, 3000);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return '#4CAF50';
      case 'diseased':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={16} color="#4CAF50" />;
      case 'diseased':
        return <AlertCircle size={16} color="#EF4444" />;
      case 'warning':
        return <AlertCircle size={16} color="#F59E0B" />;
      default:
        return <Clock size={16} color="#6B7280" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F1F8E9', '#E8F5E8']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.3 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#4CAF50" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Crop Disease Detection</Text>
            <Text style={styles.headerSubtitle}>
              Upload or scan a crop image to detect possible diseases instantly
            </Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Detection Card */}
          <Animated.View style={[
            styles.mainCard,
            {
              opacity: fadeAnimation,
              transform: [{ scale: scaleAnimation }],
            }
          ]}>
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFC']}
              style={styles.mainCardGradient}
            >
              {/* Crop Illustration */}
              <View style={styles.illustrationContainer}>
                <View style={styles.cropIconContainer}>
                  <Leaf size={40} color="#4CAF50" />
                </View>
                <Text style={styles.illustrationText}>AI-Powered Analysis</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                <Animated.View style={{ transform: [{ scale: buttonPressScale }] }}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.uploadButton]}
                    onPress={handleUploadImage}
                    disabled={isScanning}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#4CAF50', '#2E7D32']}
                      style={styles.actionButtonGradient}
                    >
                      <Upload size={24} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Upload Image</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{ transform: [{ scale: buttonPressScale }] }}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cameraButton]}
                    onPress={handleScanWithCamera}
                    disabled={isScanning}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#FFFFFF', '#F8FAFC']}
                      style={[styles.actionButtonGradient, styles.cameraButtonGradient]}
                    >
                      <Camera size={24} color="#4CAF50" />
                      <Text style={[styles.actionButtonText, styles.cameraButtonText]}>
                        Scan with Camera
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </View>

              {/* Scanning Animation */}
              {isScanning && (
                <Animated.View style={styles.scanningContainer}>
                  <View style={styles.scanningIndicator}>
                    <Animated.View style={[
                      styles.scanningDot,
                      {
                        opacity: fadeAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.3, 1],
                        }),
                      }
                    ]} />
                  </View>
                  <Text style={styles.scanningText}>Analyzing image...</Text>
                </Animated.View>
              )}
            </LinearGradient>
          </Animated.View>

          {/* Recent Scans Section */}
          <Animated.View style={[
            styles.section,
            {
              opacity: fadeAnimation,
            }
          ]}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <View style={styles.recentScansContainer}>
              {recentScans.map((scan, index) => (
                <Animated.View
                  key={scan.id}
                  style={[
                    styles.scanCard,
                    {
                      opacity: fadeAnimation,
                      transform: [
                        {
                          translateX: fadeAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <View style={styles.scanImageContainer}>
                    <Text style={styles.scanImage}>{scan.image}</Text>
                  </View>
                  
                  <View style={styles.scanInfo}>
                    <View style={styles.scanHeader}>
                      <Text style={styles.scanCropName}>{scan.cropName}</Text>
                      <View style={styles.scanStatus}>
                        {getStatusIcon(scan.status)}
                      </View>
                    </View>
                    
                    <Text style={[
                      styles.scanResult,
                      { color: getStatusColor(scan.status) }
                    ]}>
                      {scan.result}
                    </Text>
                    
                    <View style={styles.scanMetadata}>
                      <View style={styles.metadataItem}>
                        <Calendar size={12} color="#757575" />
                        <Text style={styles.metadataText}>{scan.date}</Text>
                      </View>
                      <Text style={styles.confidenceText}>{scan.confidence}% confidence</Text>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Tips Section */}
          <Animated.View style={[
            styles.section,
            {
              opacity: fadeAnimation,
            }
          ]}>
            <Text style={styles.sectionTitle}>Tips for Better Detection</Text>
            <View style={styles.tipsContainer}>
              {detectionTips.map((tip, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.tipCard,
                    {
                      opacity: fadeAnimation,
                      transform: [
                        {
                          scale: fadeAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.9, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <View style={styles.tipIcon}>
                    {tip.icon}
                  </View>
                  <Text style={styles.tipText}>{tip.text}</Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 16,
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
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  mainCard: {
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  mainCardGradient: {
    padding: 24,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  cropIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F8E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E8F5E8',
  },
  illustrationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  actionButtonsContainer: {
    gap: 16,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  uploadButton: {
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cameraButton: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  cameraButtonGradient: {
    borderWidth: 0,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  cameraButtonText: {
    color: '#4CAF50',
  },
  scanningContainer: {
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  scanningIndicator: {
    marginBottom: 12,
  },
  scanningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  scanningText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  recentScansContainer: {
    gap: 12,
  },
  scanCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  scanImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scanImage: {
    fontSize: 24,
  },
  scanInfo: {
    flex: 1,
  },
  scanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scanCropName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  scanStatus: {
    padding: 2,
  },
  scanResult: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  scanMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metadataText: {
    fontSize: 12,
    color: '#757575',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  confidenceText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  tipsContainer: {
    gap: 12,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F8E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});