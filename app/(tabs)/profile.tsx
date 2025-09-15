import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Phone, 
  MapPin, 
  Globe, 
  Bell, 
  LogOut, 
  ChevronRight, 
  Award, 
  BarChart3, 
  Settings, 
  Shield, 
  HelpCircle,
  Edit3,
  Smartphone,
  Mountain,
  Layers
} from 'lucide-react-native';

export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>({
    name: 'Ramesh Patil',
    phoneNumber: '9876543210',
    landSize: '5.2 acres',
    soilType: 'Black Cotton Soil',
    location: 'Pune, Maharashtra'
  });
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      const language = await AsyncStorage.getItem('selectedLanguage');
      if (data) {
        setUserData(JSON.parse(data));
      }
      if (language) {
        const languageNames: Record<string, string> = {
          'hi': 'Hindi',
          'en': 'English',
          'bn': 'Bengali',
          'ta': 'Tamil',
          'te': 'Telugu',
          'ml': 'Malayalam',
          'kn': 'Kannada',
          'gu': 'Gujarati',
          'mr': 'Marathi',
          'pa': 'Punjabi',
        };
        setSelectedLanguage(languageNames[language] || 'Hindi');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              router.replace('/auth/login');
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    setEditData({
      name: userData.name,
      phoneNumber: userData.phoneNumber,
      landSize: userData.landSize,
      soilType: userData.soilType,
      location: userData.location
    });
    setShowEditModal(true);
  };

  const saveProfile = async () => {
    try {
      const updatedData = { ...userData, ...editData };
      setUserData(updatedData);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const menuItems = [
    {
      id: 'language',
      title: 'Language Settings',
      subtitle: selectedLanguage,
      icon: Globe,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      onPress: () => router.push('/language'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage alerts and reminders',
      icon: Bell,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      onPress: () => {},
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Data protection settings',
      icon: Shield,
      color: '#10B981',
      bgColor: '#ECFDF5',
      onPress: () => {},
    },
    {
      id: 'general',
      title: 'General Settings',
      subtitle: 'App preferences',
      icon: Settings,
      color: '#6366F1',
      bgColor: '#EEF2FF',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with gradient background */}
        <LinearGradient
          colors={['#22C55E', '#16A34A', '#15803D']}
          style={styles.header}
        >
          <View style={styles.profileSection}>
            <View style={styles.profilePicture}>
              <LinearGradient
                colors={['#FFFFFF', '#F8FAFC']}
                style={styles.profileGradient}
              >
                <User size={32} color="#22C55E" />
              </LinearGradient>
            </View>
            <Text style={styles.userName}>{userData?.name || 'Farmer'}</Text>
            <View style={styles.userBadge}>
              <Award size={14} color="#FCD34D" />
              <Text style={styles.userBadgeText}>Verified Farmer</Text>
            </View>
            
            {/* Farming Information */}
            <View style={styles.farmingInfo}>
              <View style={styles.farmingInfoRow}>
                <View style={styles.infoItem}>
                  <Smartphone size={14} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>+91 {userData?.phoneNumber || 'N/A'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Mountain size={14} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.infoLabel}>Land Size</Text>
                  <Text style={styles.infoValue}>{userData?.landSize || 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.farmingInfoRow}>
                <View style={styles.infoItem}>
                  <Layers size={14} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.infoLabel}>Soil Type</Text>
                  <Text style={styles.infoValue}>{userData?.soilType || 'N/A'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <MapPin size={14} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{userData?.location || 'N/A'}</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Edit3 size={16} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Enhanced Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.statGradient}
            >
              <BarChart3 size={24} color="#FFFFFF" />
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Activities</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.statGradient}
            >
              <Award size={24} color="#FFFFFF" />
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Schemes</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.statGradient}
            >
              <User size={24} color="#FFFFFF" />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>AI Queries</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Enhanced Menu Section */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuItemIcon, { backgroundColor: item.bgColor }]}>
                    <IconComponent size={20} color={item.color} />
                  </View>
                  <View style={styles.menuItemText}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#D1D5DB" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Enhanced Support Section */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Support & Help</Text>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#FEF2F2' }]}>
                <Phone size={20} color="#EF4444" />
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Kisan Call Center</Text>
                <Text style={styles.menuItemSubtitle}>1800-180-1551 (24/7 Support)</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#D1D5DB" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#EFF6FF' }]}>
                <HelpCircle size={20} color="#3B82F6" />
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Help & FAQ</Text>
                <Text style={styles.menuItemSubtitle}>Get answers to common questions</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        {/* Enhanced Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient
              colors={['#FEE2E2', '#FECACA']}
              style={styles.logoutGradient}
            >
              <LogOut size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Agrimater v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 Smart India Hackathon</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  profileSection: {
    alignItems: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  profileGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    gap: 6,
  },
  userBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FCD34D',
  },
  userDetails: {
    alignItems: 'center',
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  statGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    paddingLeft: 4,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logoutButton: {
    borderRadius: 16,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 4,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  copyrightText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  // Enhanced Farming Info Styles
  farmingInfo: {
    width: '100%',
    marginTop: 16,
    gap: 12,
  },
  farmingInfoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});