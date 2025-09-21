import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Image,
  Modal,
  Animated,
  Platform,
  Alert,
  Dimensions
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Star,
  Package,
  Calendar,
  BarChart3,
  Navigation,
  Eye,
  MessageCircle,
  Share,
  Bookmark,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react-native';

interface MandiLocation {
  id: string;
  name: string;
  location: string;
  district: string;
  currentPrice: number;
  lastWeekAverage: number;
  priceChange: number;
  priceChangePercent: number;
  distance: number; // in km
  contactNumber: string;
  workingHours: string;
  storageAvailable: number; // in quintals
  quality: 'Premium' | 'Good' | 'Average' | 'Fair';
  rating: number;
  reviews: number;
  notes: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface CommodityDetails {
  id: string;
  name: string;
  category: string;
  type: string;
  season: string;
  quality: string;
  images: string[];
  packaging: {
    standard: string;
    bulk: string;
    premium: string;
  };
  description: string;
  nutritionalInfo: string;
  storageRequirements: string;
  pricePrediction: {
    nextWeek: number;
    nextMonth: number;
    trend: 'rising' | 'falling' | 'stable';
    confidence: number;
  };
  mandiLocations: MandiLocation[];
}

// Mock data for Kerala mandi locations
const MOCK_MANDI_LOCATIONS: MandiLocation[] = [
  {
    id: '1',
    name: 'Kochi Agricultural Market',
    location: 'Kochi',
    district: 'Ernakulam',
    currentPrice: 45,
    lastWeekAverage: 42,
    priceChange: 3,
    priceChangePercent: 7.1,
    distance: 15.2,
    contactNumber: '+91 484 1234567',
    workingHours: '6:00 AM - 8:00 PM',
    storageAvailable: 250,
    quality: 'Premium',
    rating: 4.5,
    reviews: 128,
    notes: 'Best quality tomatoes with excellent packaging. Farmers highly recommend.',
    coordinates: { latitude: 9.9312, longitude: 76.2673 }
  },
  {
    id: '2',
    name: 'Thiruvananthapuram Central Market',
    location: 'Thiruvananthapuram',
    district: 'Thiruvananthapuram',
    currentPrice: 42,
    lastWeekAverage: 40,
    priceChange: 2,
    priceChangePercent: 5.0,
    distance: 8.5,
    contactNumber: '+91 471 2345678',
    workingHours: '5:30 AM - 9:00 PM',
    storageAvailable: 180,
    quality: 'Good',
    rating: 4.2,
    reviews: 95,
    notes: 'Consistent quality with good storage facilities.',
    coordinates: { latitude: 8.5241, longitude: 76.9366 }
  },
  {
    id: '3',
    name: 'Kozhikode Wholesale Market',
    location: 'Kozhikode',
    district: 'Kozhikode',
    currentPrice: 48,
    lastWeekAverage: 45,
    priceChange: 3,
    priceChangePercent: 6.7,
    distance: 25.8,
    contactNumber: '+91 495 3456789',
    workingHours: '6:00 AM - 7:30 PM',
    storageAvailable: 320,
    quality: 'Premium',
    rating: 4.7,
    reviews: 156,
    notes: 'Highest quality produce with premium packaging options.',
    coordinates: { latitude: 11.2588, longitude: 75.7804 }
  },
  {
    id: '4',
    name: 'Thrissur Agricultural Market',
    location: 'Thrissur',
    district: 'Thrissur',
    currentPrice: 38,
    lastWeekAverage: 41,
    priceChange: -3,
    priceChangePercent: -7.3,
    distance: 12.3,
    contactNumber: '+91 487 4567890',
    workingHours: '5:00 AM - 8:30 PM',
    storageAvailable: 200,
    quality: 'Average',
    rating: 3.8,
    reviews: 67,
    notes: 'Good value for money, suitable for bulk purchases.',
    coordinates: { latitude: 10.5276, longitude: 76.2144 }
  },
  {
    id: '5',
    name: 'Kannur District Market',
    location: 'Kannur',
    district: 'Kannur',
    currentPrice: 44,
    lastWeekAverage: 43,
    priceChange: 1,
    priceChangePercent: 2.3,
    distance: 18.7,
    contactNumber: '+91 497 5678901',
    workingHours: '6:30 AM - 8:00 PM',
    storageAvailable: 150,
    quality: 'Good',
    rating: 4.1,
    reviews: 89,
    notes: 'Reliable market with consistent supply throughout the year.',
    coordinates: { latitude: 11.8745, longitude: 75.3704 }
  },
  {
    id: '6',
    name: 'Kollam Agricultural Market',
    location: 'Kollam',
    district: 'Kollam',
    currentPrice: 41,
    lastWeekAverage: 39,
    priceChange: 2,
    priceChangePercent: 5.1,
    distance: 22.1,
    contactNumber: '+91 474 6789012',
    workingHours: '5:30 AM - 9:00 PM',
    storageAvailable: 190,
    quality: 'Good',
    rating: 4.3,
    reviews: 112,
    notes: 'Well-organized market with good transportation facilities.',
    coordinates: { latitude: 8.8932, longitude: 76.6141 }
  }
];

const MOCK_COMMODITY_DETAILS: CommodityDetails = {
  id: 'tomato',
  name: 'Tomato',
  category: 'Vegetables',
  type: 'Hybrid',
  season: 'Year Round',
  quality: 'Premium Grade A',
  images: [
    'https://images.unsplash.com/photo-1592924357228-91b4e4a8b5c1?w=400',
    'https://images.unsplash.com/photo-1546470427-5a4a0d2b5b4a?w=400',
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'
  ],
  packaging: {
    standard: '25kg crates',
    bulk: '50kg bags',
    premium: '10kg boxes'
  },
  description: 'Fresh, ripe tomatoes perfect for cooking and processing. Grown using organic methods with no harmful pesticides.',
  nutritionalInfo: 'Rich in Vitamin C, Lycopene, and antioxidants. Low in calories and high in fiber.',
  storageRequirements: 'Store in cool, dry place. Avoid direct sunlight. Best consumed within 7-10 days.',
  pricePrediction: {
    nextWeek: 46,
    nextMonth: 52,
    trend: 'rising',
    confidence: 85
  },
  mandiLocations: MOCK_MANDI_LOCATIONS
};

export default function CommodityDetailsScreen() {
  const [commodityDetails, setCommodityDetails] = useState<CommodityDetails>(MOCK_COMMODITY_DETAILS);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating'>('distance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const router = useRouter();
  const params = useLocalSearchParams();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animation on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Sort mandi locations based on selected criteria
  const sortedMandiLocations = [...commodityDetails.mandiLocations].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'distance':
        comparison = a.distance - b.distance;
        break;
      case 'price':
        comparison = a.currentPrice - b.currentPrice;
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const highestPrice = Math.max(...commodityDetails.mandiLocations.map(m => m.currentPrice));
  const lowestPrice = Math.min(...commodityDetails.mandiLocations.map(m => m.currentPrice));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return '#22C55E';
    if (change < 0) return '#EF4444';
    return '#6B7280';
  };

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={16} color="#22C55E" />;
    if (change < 0) return <TrendingDown size={16} color="#EF4444" />;
    return null;
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Premium': return '#22C55E';
      case 'Good': return '#3B82F6';
      case 'Average': return '#F59E0B';
      case 'Fair': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'Premium': return <CheckCircle size={16} color="#22C55E" />;
      case 'Good': return <CheckCircle size={16} color="#3B82F6" />;
      case 'Average': return <AlertCircle size={16} color="#F59E0B" />;
      case 'Fair': return <XCircle size={16} color="#EF4444" />;
      default: return <AlertCircle size={16} color="#6B7280" />;
    }
  };

  const renderMandiCard = (mandi: MandiLocation, index: number) => {
    const isHighestPrice = mandi.currentPrice === highestPrice;
    const isLowestPrice = mandi.currentPrice === lowestPrice;
    
    return (
      <Animated.View
        key={mandi.id}
        style={[
          styles.mandiCard,
          isHighestPrice && styles.highestPriceCard,
          isLowestPrice && styles.lowestPriceCard,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <LinearGradient
          colors={isHighestPrice ? ['#F0FDF4', '#DCFCE7'] : isLowestPrice ? ['#FEF2F2', '#FEE2E2'] : ['#FFFFFF', '#F8FAFC']}
          style={styles.mandiCardGradient}
        >
          {/* Header */}
          <View style={styles.mandiHeader}>
            <View style={styles.mandiInfo}>
              <Text style={styles.mandiName}>{mandi.name}</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.mandiLocation}>{mandi.location}, {mandi.district}</Text>
              </View>
              <View style={styles.distanceRow}>
                <Navigation size={14} color="#3B82F6" />
                <Text style={styles.distanceText}>{mandi.distance} km away</Text>
              </View>
            </View>
            
            <View style={styles.mandiBadges}>
              {isHighestPrice && (
                <View style={styles.highestPriceBadge}>
                  <Text style={styles.badgeText}>HIGHEST</Text>
                </View>
              )}
              {isLowestPrice && (
                <View style={styles.lowestPriceBadge}>
                  <Text style={styles.badgeText}>LOWEST</Text>
                </View>
              )}
              <View style={styles.qualityBadge}>
                {getQualityIcon(mandi.quality)}
                <Text style={[styles.qualityText, { color: getQualityColor(mandi.quality) }]}>
                  {mandi.quality}
                </Text>
              </View>
            </View>
          </View>

          {/* Price Information */}
          <View style={styles.priceSection}>
            <View style={styles.currentPriceSection}>
              <Text style={styles.priceLabel}>Current Price</Text>
              <Text style={[
                styles.currentPrice,
                isHighestPrice && styles.highestPriceText,
                isLowestPrice && styles.lowestPriceText
              ]}>
                {formatPrice(mandi.currentPrice)}/kg
              </Text>
              <View style={styles.priceChangeRow}>
                {getPriceChangeIcon(mandi.priceChange)}
                <Text style={[
                  styles.priceChange,
                  { color: getPriceChangeColor(mandi.priceChange) }
                ]}>
                  {mandi.priceChange > 0 ? '+' : ''}{formatPrice(Math.abs(mandi.priceChange))} ({mandi.priceChangePercent > 0 ? '+' : ''}{mandi.priceChangePercent.toFixed(1)}%)
                </Text>
              </View>
            </View>

            <View style={styles.weeklyAverageSection}>
              <Text style={styles.weeklyLabel}>Last Week Avg</Text>
              <Text style={styles.weeklyPrice}>{formatPrice(mandi.lastWeekAverage)}/kg</Text>
            </View>
          </View>

          {/* Storage and Rating */}
          <View style={styles.storageRatingSection}>
            <View style={styles.storageInfo}>
              <Package size={16} color="#6B7280" />
              <Text style={styles.storageText}>{mandi.storageAvailable} quintals available</Text>
            </View>
            <View style={styles.ratingInfo}>
              <Star size={16} color="#F59E0B" />
              <Text style={styles.ratingText}>{mandi.rating} ({mandi.reviews} reviews)</Text>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.contactSection}>
            <TouchableOpacity style={styles.contactButton}>
              <Phone size={16} color="#3B82F6" />
              <Text style={styles.contactText}>{mandi.contactNumber}</Text>
            </TouchableOpacity>
            <View style={styles.hoursInfo}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.hoursText}>{mandi.workingHours}</Text>
            </View>
          </View>

          {/* Notes */}
          {mandi.notes && (
            <View style={styles.notesSection}>
              <MessageCircle size={14} color="#6B7280" />
              <Text style={styles.notesText}>{mandi.notes}</Text>
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderImageModal = () => (
    <Modal
      visible={showImageModal}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setShowImageModal(false)}
    >
      <View style={styles.imageModalOverlay}>
        <TouchableOpacity 
          style={styles.imageModalClose}
          onPress={() => setShowImageModal(false)}
        >
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Image
          source={{ uri: commodityDetails.images[selectedImage] }}
          style={styles.modalImage}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{commodityDetails.name} Details</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Share size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Bookmark size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Commodity Images */}
          <View style={styles.imageSection}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imageScroll}
            >
              {commodityDetails.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.imageContainer,
                    selectedImage === index && styles.selectedImageContainer
                  ]}
                  onPress={() => {
                    setSelectedImage(index);
                    setShowImageModal(true);
                  }}
                >
                  <Image source={{ uri: image }} style={styles.commodityImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Basic Information */}
          <View style={styles.infoSection}>
            <Text style={styles.commodityName}>{commodityDetails.name}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category:</Text>
              <Text style={styles.infoValue}>{commodityDetails.category}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type:</Text>
              <Text style={styles.infoValue}>{commodityDetails.type}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Season:</Text>
              <Text style={styles.infoValue}>{commodityDetails.season}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Quality:</Text>
              <Text style={styles.infoValue}>{commodityDetails.quality}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{commodityDetails.description}</Text>
          </View>

          {/* Nutritional Info */}
          <View style={styles.nutritionSection}>
            <Text style={styles.sectionTitle}>Nutritional Information</Text>
            <Text style={styles.nutritionText}>{commodityDetails.nutritionalInfo}</Text>
          </View>

          {/* Storage Requirements */}
          <View style={styles.storageSection}>
            <Text style={styles.sectionTitle}>Storage Requirements</Text>
            <Text style={styles.storageText}>{commodityDetails.storageRequirements}</Text>
          </View>

          {/* Packaging Options */}
          <View style={styles.packagingSection}>
            <Text style={styles.sectionTitle}>Packaging Options</Text>
            <View style={styles.packagingOptions}>
              <View style={styles.packagingOption}>
                <Text style={styles.packagingLabel}>Standard</Text>
                <Text style={styles.packagingValue}>{commodityDetails.packaging.standard}</Text>
              </View>
              <View style={styles.packagingOption}>
                <Text style={styles.packagingLabel}>Bulk</Text>
                <Text style={styles.packagingValue}>{commodityDetails.packaging.bulk}</Text>
              </View>
              <View style={styles.packagingOption}>
                <Text style={styles.packagingLabel}>Premium</Text>
                <Text style={styles.packagingValue}>{commodityDetails.packaging.premium}</Text>
              </View>
            </View>
          </View>

          {/* Price Prediction */}
          <View style={styles.predictionSection}>
            <Text style={styles.sectionTitle}>Price Prediction</Text>
            <View style={styles.predictionCard}>
              <View style={styles.predictionRow}>
                <Text style={styles.predictionLabel}>Next Week:</Text>
                <Text style={styles.predictionValue}>{formatPrice(commodityDetails.pricePrediction.nextWeek)}/kg</Text>
              </View>
              <View style={styles.predictionRow}>
                <Text style={styles.predictionLabel}>Next Month:</Text>
                <Text style={styles.predictionValue}>{formatPrice(commodityDetails.pricePrediction.nextMonth)}/kg</Text>
              </View>
              <View style={styles.predictionRow}>
                <Text style={styles.predictionLabel}>Trend:</Text>
                <View style={styles.trendContainer}>
                  <Text style={[
                    styles.trendText,
                    { color: commodityDetails.pricePrediction.trend === 'rising' ? '#22C55E' : 
                             commodityDetails.pricePrediction.trend === 'falling' ? '#EF4444' : '#6B7280' }
                  ]}>
                    {commodityDetails.pricePrediction.trend.toUpperCase()}
                  </Text>
                  <Text style={styles.confidenceText}>
                    ({commodityDetails.pricePrediction.confidence}% confidence)
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Mandi Locations Header */}
          <View style={styles.mandiHeaderSection}>
            <Text style={styles.sectionTitle}>Mandi Locations in Kerala</Text>
            <View style={styles.sortControls}>
              <TouchableOpacity 
                style={styles.sortButton}
                onPress={() => {
                  const options = ['distance', 'price', 'rating'];
                  const currentIndex = options.indexOf(sortBy);
                  const nextIndex = (currentIndex + 1) % options.length;
                  setSortBy(options[nextIndex] as 'distance' | 'price' | 'rating');
                }}
              >
                <Text style={styles.sortButtonText}>
                  Sort: {sortBy === 'distance' ? 'Distance' : sortBy === 'price' ? 'Price' : 'Rating'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.sortOrderButton}
                onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <Text style={styles.sortOrderText}>{sortOrder === 'asc' ? '↑' : '↓'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mandi Locations List */}
          <View style={styles.mandiList}>
            {sortedMandiLocations.map((mandi, index) => renderMandiCard(mandi, index))}
          </View>
        </ScrollView>
      </Animated.View>

      {renderImageModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
  },
  imageScroll: {
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedImageContainer: {
    borderColor: '#3B82F6',
  },
  commodityImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 1,
  },
  commodityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  descriptionSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  nutritionSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 1,
  },
  nutritionText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  storageSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 1,
  },
  storageText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  packagingSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 1,
  },
  packagingOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  packagingOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  packagingLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  packagingValue: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
    textAlign: 'center',
  },
  predictionSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 1,
  },
  predictionCard: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  predictionLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  predictionValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  confidenceText: {
    fontSize: 12,
    color: '#6B7280',
  },
  mandiHeaderSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  sortButtonText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  sortOrderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortOrderText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  mandiList: {
    padding: 20,
  },
  mandiCard: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  highestPriceCard: {
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  lowestPriceCard: {
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  mandiCardGradient: {
    padding: 20,
    borderRadius: 16,
  },
  mandiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  mandiInfo: {
    flex: 1,
  },
  mandiName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  mandiLocation: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  mandiBadges: {
    alignItems: 'flex-end',
  },
  highestPriceBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  lowestPriceBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  qualityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  qualityText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentPriceSection: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  highestPriceText: {
    color: '#22C55E',
  },
  lowestPriceText: {
    color: '#EF4444',
  },
  priceChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceChange: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  weeklyAverageSection: {
    alignItems: 'flex-end',
  },
  weeklyLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  weeklyPrice: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  storageRatingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  storageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storageText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  contactSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contactText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  hoursInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  notesSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  notesText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.7,
    borderRadius: 12,
  },
});
