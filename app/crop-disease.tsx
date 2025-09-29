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
  Dimensions,
  Easing,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
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
  Calendar,
  Zap,
  Shield,
  Activity,
  Sparkles,
  Save,
  Share2
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface RecentScan {
  id: string;
  cropName: string;
  result: string;
  status: 'healthy' | 'diseased' | 'warning';
  date: string;
  image: string;
  confidence: number;
}

interface AIDiagnosis {
  disease: string;
  confidence: number;
  treatment: string;
  prevention: string[];
  tips: string[];
}

export default function CropDiseaseDetectionScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [aiDiagnosis, setAiDiagnosis] = useState<AIDiagnosis | null>(null);
  
  // Animation refs
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.9)).current;
  const buttonPressScale = useRef(new Animated.Value(1)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const floatAnimation = useRef(new Animated.Value(0)).current;
  const particlesAnimation = useRef(new Animated.Value(0)).current;
  const diagnosisRevealAnimation = useRef(new Animated.Value(0)).current;
  const headerScaleAnimation = useRef(new Animated.Value(0.8)).current;

  // Particle positions for background effect
  const particlePositions = useRef([
    new Animated.ValueXY({ x: -20, y: -20 }),
    new Animated.ValueXY({ x: 100, y: 50 }),
    new Animated.ValueXY({ x: 300, y: -20 }),
    new Animated.ValueXY({ x: -20, y: 200 }),
    new Animated.ValueXY({ x: 350, y: 300 }),
    new Animated.ValueXY({ x: width * 0.7, y: height * 0.3 }),
    new Animated.ValueXY({ x: width * 0.2, y: height * 0.6 }),
  ]).current;

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
      Animated.timing(headerScaleAnimation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
    ]).start();

    // Gentle pulse effect for logo
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

    // Floating animation for particles
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnimation, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnimation, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Particle animations
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(particlePositions[0], {
            toValue: { x: 50, y: 30 },
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particlePositions[0], {
            toValue: { x: -20, y: -20 },
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(particlePositions[1], {
            toValue: { x: 150, y: 100 },
            duration: 5000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particlePositions[1], {
            toValue: { x: 100, y: 50 },
            duration: 5000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(particlePositions[2], {
            toValue: { x: 350, y: 30 },
            duration: 4500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particlePositions[2], {
            toValue: { x: 300, y: -20 },
            duration: 4500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(particlePositions[3], {
            toValue: { x: 30, y: 250 },
            duration: 5500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particlePositions[3], {
            toValue: { x: -20, y: 200 },
            duration: 5500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(particlePositions[4], {
            toValue: { x: 400, y: 350 },
            duration: 6000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particlePositions[4], {
            toValue: { x: 350, y: 300 },
            duration: 6000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(particlePositions[5], {
            toValue: { x: width * 0.8, y: height * 0.4 },
            duration: 7000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particlePositions[5], {
            toValue: { x: width * 0.7, y: height * 0.3 },
            duration: 7000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(particlePositions[6], {
            toValue: { x: width * 0.3, y: height * 0.7 },
            duration: 6500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particlePositions[6], {
            toValue: { x: width * 0.2, y: height * 0.6 },
            duration: 6500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
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

  const handleUploadImage = async () => {
    // Request permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera roll is required to upload images.');
      return;
    }
    
    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setSelectedImage(selectedImageUri);
      
      // Show scanning animation and simulate AI analysis
      setIsScanning(true);
      
      // Simulate AI analysis process
      setTimeout(() => {
        setIsScanning(false);
        
        // Mock AI diagnosis result
        const mockDiagnosis: AIDiagnosis = {
          disease: "Tomato Early Blight",
          confidence: 89,
          treatment: "Apply copper-based fungicide and remove affected leaves immediately. Ensure proper spacing between plants for better air circulation.",
          prevention: [
            "Water at the base of plants, not on leaves",
            "Rotate crops annually",
            "Apply mulch to prevent soil-borne diseases",
            "Prune lower branches to improve airflow"
          ],
          tips: [
            "Check plants regularly for yellowing leaves with dark spots",
            "Harvest tomatoes early if disease is severe",
            "Disinfect gardening tools after use"
          ]
        };
        
        setAiDiagnosis(mockDiagnosis);
        
        // Animate diagnosis reveal
        Animated.timing(diagnosisRevealAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 3000);
    }
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

  // Add interactive button component for better UX
  const InteractiveButton = ({ onPress, children, style, disabled = false }: any) => {
    const buttonScale = useRef(new Animated.Value(1)).current;
    
    const handlePressIn = () => {
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
        friction: 5,
      }).start();
    };
    
    const handlePressOut = () => {
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }).start();
    };
    
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={disabled}
      >
        <Animated.View style={[style, { transform: [{ scale: buttonScale }] }]}>
          {children}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Background Particles */}
      {particlePositions.map((position, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              transform: position.getTranslateTransform(),
              opacity: fadeAnimation,
              backgroundColor: index % 2 === 0 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(46, 125, 50, 0.15)',
              width: 12 + index * 2,
              height: 12 + index * 2,
              borderRadius: 6 + index,
            }
          ]}
        />
      ))}

      <LinearGradient
        colors={['#FFFFFF', '#F1F8E9', '#E8F5E8']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.3 }}
      >
        {/* Header with enhanced animation */}
        <Animated.View style={[
          styles.header,
          {
            transform: [{ scale: headerScaleAnimation }],
          }
        ]}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#4CAF50" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{t('cropDisease.title')}</Text>
            <Text style={styles.headerSubtitle}>
              {t('cropDisease.scanCrop')}
            </Text>
          </View>
          
          {/* Enhanced AI Badge */}
          <View style={styles.aiBadge}>
            <Sparkles size={16} color="#FFD700" />
            <Text style={styles.aiBadgeText}>AI Powered</Text>
          </View>
        </Animated.View>

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
              {/* Crop Illustration or Selected Image Preview */}
              <View style={styles.illustrationContainer}>
                {selectedImage ? (
                  // Display selected image
                  <View style={styles.imagePreviewContainer}>
                    <Image 
                      source={{ uri: selectedImage }} 
                      style={styles.selectedImagePreview} 
                    />
                    <View style={styles.imageOverlay}>
                      <Zap size={20} color="#FFFFFF" />
                      <Text style={styles.imageOverlayText}>Ready for AI Analysis</Text>
                    </View>
                  </View>
                ) : (
                  // Display default illustration with enhanced animation
                  <Animated.View style={[
                    styles.cropIconContainer,
                    {
                      transform: [{ scale: pulseAnimation }],
                    }
                  ]}>
                    <Leaf size={40} color="#4CAF50" />
                  </Animated.View>
                )}
                <Text style={styles.illustrationText}>
                  {selectedImage ? 'Ready for Analysis' : 'AI-Powered Analysis'}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                <InteractiveButton
                  onPress={handleUploadImage}
                  disabled={isScanning}
                  style={[styles.actionButton, styles.uploadButton]}
                >
                  <LinearGradient
                    colors={['#4CAF50', '#2E7D32']}
                    style={styles.actionButtonGradient}
                  >
                    <Upload size={24} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>
                      {selectedImage ? 'Re-upload Image' : 'Upload Image'}
                    </Text>
                  </LinearGradient>
                </InteractiveButton>

                <InteractiveButton
                  onPress={handleScanWithCamera}
                  disabled={isScanning}
                  style={[styles.actionButton, styles.cameraButton]}
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
                </InteractiveButton>
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
                  <Text style={styles.scanningText}>{t('cropDisease.analyzing')}</Text>
                  <Text style={styles.scanningSubtext}>Detecting diseases and providing solutions</Text>
                  
                  {/* Enhanced scanning visualization */}
                  <View style={styles.scanningVisualization}>
                    <Animated.View style={[
                      styles.scanningBar,
                      {
                        transform: [{
                          translateX: fadeAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-100, width * 0.8],
                          })
                        }]
                      }
                    ]} />
                  </View>
                  
                  {/* AI Processing Status */}
                  <View style={styles.processingStatus}>
                    <View style={styles.statusItem}>
                      <Activity size={16} color="#4CAF50" />
                      <Text style={styles.statusText}>Image Processing</Text>
                    </View>
                    <View style={styles.statusItem}>
                      <Leaf size={16} color="#4CAF50" />
                      <Text style={styles.statusText}>Disease Detection</Text>
                    </View>
                    <View style={styles.statusItem}>
                      <Shield size={16} color="#4CAF50" />
                      <Text style={styles.statusText}>Solution Generation</Text>
                    </View>
                  </View>
                </Animated.View>
              )}
              
              {/* AI Diagnosis Results */}
              {aiDiagnosis && !isScanning && (
                <Animated.View style={[
                  styles.diagnosisContainer, 
                  { 
                    opacity: diagnosisRevealAnimation,
                    transform: [{
                      translateY: diagnosisRevealAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      })
                    }]
                  }
                ]}>
                  <View style={styles.diagnosisHeader}>
                    <Zap size={24} color="#4CAF50" />
                    <Text style={styles.diagnosisTitle}>AI Analysis Complete</Text>
                    <View style={styles.confidenceBadge}>
                      <Text style={styles.confidenceBadgeText}>{aiDiagnosis.confidence}%</Text>
                    </View>
                  </View>
                  
                  <View style={styles.diseaseInfo}>
                    <Text style={styles.diseaseName}>{aiDiagnosis.disease}</Text>
                    <View style={styles.confidenceContainer}>
                      <Activity size={16} color="#4CAF50" />
                      <Text style={styles.diagnosisConfidenceText}>{aiDiagnosis.confidence}% Confidence</Text>
                    </View>
                  </View>
                  
                  <View style={styles.treatmentSection}>
                    <View style={styles.sectionHeader}>
                      <Shield size={20} color="#4CAF50" />
                      <Text style={styles.sectionLabel}>Recommended Treatment</Text>
                    </View>
                    <Text style={styles.treatmentText}>{aiDiagnosis.treatment}</Text>
                  </View>
                  
                  <View style={styles.preventionSection}>
                    <View style={styles.sectionHeader}>
                      <Shield size={20} color="#4CAF50" />
                      <Text style={styles.sectionLabel}>Prevention Tips</Text>
                    </View>
                    {aiDiagnosis.prevention.map((tip, index) => (
                      <View key={index} style={styles.tipItem}>
                        <View style={styles.bulletPoint} />
                        <Text style={styles.diagnosisTipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <View style={styles.tipsSection}>
                    <View style={styles.sectionHeader}>
                      <Leaf size={20} color="#4CAF50" />
                      <Text style={styles.sectionLabel}>Additional Tips</Text>
                    </View>
                    {aiDiagnosis.tips.map((tip, index) => (
                      <View key={index} style={styles.tipItem}>
                        <View style={styles.bulletPoint} />
                        <Text style={styles.diagnosisTipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                  
                  {/* Action Buttons for Results */}
                  <View style={styles.resultActions}>
                    <InteractiveButton
                      onPress={() => console.log('Save report')}
                      style={styles.saveButton}
                    >
                      <LinearGradient
                        colors={['#2E7D32', '#4CAF50']}
                        style={styles.resultActionButton}
                      >
                        <Save size={20} color="#FFFFFF" />
                        <Text style={styles.saveButtonText}>Save Report</Text>
                      </LinearGradient>
                    </InteractiveButton>
                    
                    <InteractiveButton
                      onPress={() => console.log('Share results')}
                      style={styles.shareButton}
                    >
                      <LinearGradient
                        colors={['#FFFFFF', '#F8FAFC']}
                        style={styles.resultActionButton}
                      >
                        <Share2 size={20} color="#4CAF50" />
                        <Text style={styles.shareButtonText}>Share</Text>
                      </LinearGradient>
                    </InteractiveButton>
                  </View>

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
            <View style={styles.sectionHeaderWithIcon}>
              <Activity size={20} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Recent Scans</Text>
            </View>
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
                            outputRange: [index % 2 === 0 ? -20 : 20, 0],
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
                      <View style={[styles.scanStatus, { backgroundColor: getStatusColor(scan.status) + '20' }]}>
                        {getStatusIcon(scan.status)}
                      </View>
                    </View>
                    <Text style={styles.scanResult}>{scan.result}</Text>
                    <View style={styles.scanMetadata}>
                      <View style={styles.metadataItem}>
                        <Calendar size={12} color="#757575" />
                        <Text style={styles.metadataText}>{scan.date}</Text>
                      </View>
                      <Text style={styles.confidenceText}>{scan.confidence}%</Text>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Tips Section - Keeping this section as it provides value to users */}
          <Animated.View style={[
            styles.section,
            {
              opacity: fadeAnimation,
            }
          ]}>
            <View style={styles.sectionHeaderWithIcon}>
              <Sun size={20} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Tips for Better Detection</Text>
            </View>
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
  particle: {
    position: 'absolute',
    zIndex: 0,
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
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
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
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  mainCardGradient: {
    padding: 24,
    borderRadius: 20,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imagePreviewContainer: {
    width: 200,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E8F5E8',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  selectedImagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(46, 125, 50, 0.8)',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imageOverlayText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
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
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
    borderRadius: 16,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    marginBottom: 4,
  },
  scanningSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  scanningVisualization: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginVertical: 16,
    overflow: 'hidden',
  },
  scanningBar: {
    width: 40,
    height: 6,
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  processingStatus: {
    width: '100%',
    marginTop: 20,
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F8E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  diagnosisContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  diagnosisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  diagnosisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  confidenceBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  diseaseInfo: {
    marginBottom: 20,
  },
  diseaseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  confidenceContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F8E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  diagnosisConfidenceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  treatmentSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  treatmentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  preventionSection: {
    marginBottom: 20,
  },
  tipsSection: {
    marginBottom: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginTop: 8,
  },
  diagnosisTipText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  resultActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
  },
  resultActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 10,
  },
  saveButton: {
    shadowColor: '#2E7D32',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  shareButton: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  shareButtonText: {
    color: '#4CAF50',
    fontWeight: '700',
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
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
    borderRadius: 16,
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