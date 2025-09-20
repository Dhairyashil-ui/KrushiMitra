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
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Clock, 
  Footprints, 
  Droplets, 
  CheckCircle2,
  Target,
  TrendingUp,
  Calendar,
  Sun,
  Zap,
  Star,
  AlertCircle,
  BarChart3,
  Activity
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface DailyActivity {
  day: string;
  hours: number;
  steps: number;
  tasks: number;
}

interface Task {
  id: string;
  title: string;
  status: 'completed' | 'pending' | 'overdue';
  time: string;
  category: string;
}

interface Insight {
  id: string;
  type: 'success' | 'warning' | 'info';
  icon: React.ReactNode;
  title: string;
  message: string;
}

export default function ActivityTrackingScreen() {
  const router = useRouter();
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(30)).current;
  const chartAnimation = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;

  // Today's activity data
  const [todayStats] = useState({
    hoursInField: 6.5,
    stepsWalked: 8420,
    waterIntake: 2.8,
    tasksCompleted: 8,
    totalTasks: 12
  });

  // Weekly activity data for chart
  const [weeklyData] = useState<DailyActivity[]>([
    { day: 'Mon', hours: 5.5, steps: 7200, tasks: 6 },
    { day: 'Tue', hours: 7.0, steps: 9100, tasks: 9 },
    { day: 'Wed', hours: 6.2, steps: 8300, tasks: 7 },
    { day: 'Thu', hours: 8.1, steps: 10500, tasks: 11 },
    { day: 'Fri', hours: 6.8, steps: 8900, tasks: 8 },
    { day: 'Sat', hours: 4.5, steps: 6200, tasks: 5 },
    { day: 'Sun', hours: 6.5, steps: 8420, tasks: 8 }
  ]);

  // Tasks data
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Water the tomato fields',
      status: 'completed',
      time: '06:00 AM',
      category: 'Irrigation'
    },
    {
      id: '2',
      title: 'Check pest traps in wheat field',
      status: 'completed',
      time: '08:30 AM',
      category: 'Pest Control'
    },
    {
      id: '3',
      title: 'Apply fertilizer to corn crops',
      status: 'pending',
      time: '02:00 PM',
      category: 'Fertilization'
    },
    {
      id: '4',
      title: 'Harvest mature vegetables',
      status: 'pending',
      time: '04:00 PM',
      category: 'Harvesting'
    },
    {
      id: '5',
      title: 'Equipment maintenance check',
      status: 'overdue',
      time: 'Yesterday',
      category: 'Maintenance'
    }
  ]);

  // Insights and motivation
  const [insights] = useState<Insight[]>([
    {
      id: '1',
      type: 'success',
      icon: <Star size={18} color="#4CAF50" />,
      title: 'Great Progress!',
      message: 'You worked 6.5 hrs today 🌱'
    },
    {
      id: '2',
      type: 'warning',
      icon: <Sun size={18} color="#F59E0B" />,
      title: 'Stay Hydrated',
      message: 'Remember to take breaks in the heat ☀️'
    },
    {
      id: '3',
      type: 'info',
      icon: <Target size={18} color="#3B82F6" />,
      title: 'Weekly Goal',
      message: 'You\'re 78% towards your 50-hour goal'
    }
  ]);

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate charts after a delay
    setTimeout(() => {
      Animated.timing(chartAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, 400);

    // Animate progress bars
    setTimeout(() => {
      Animated.timing(progressAnimation, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: false,
      }).start();
    }, 600);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#F59E0B';
      case 'overdue':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={20} color="#4CAF50" />;
      case 'pending':
        return <Clock size={20} color="#F59E0B" />;
      case 'overdue':
        return <AlertCircle size={20} color="#EF4444" />;
      default:
        return <Clock size={20} color="#6B7280" />;
    }
  };

  const getInsightCardColors = (type: string) => {
    switch (type) {
      case 'success':
        return ['#F0FDF4', '#DCFCE7'] as const;
      case 'warning':
        return ['#FFFBEB', '#FEF3C7'] as const;
      case 'info':
        return ['#EFF6FF', '#DBEAFE'] as const;
      default:
        return ['#F9FAFB', '#F3F4F6'] as const;
    }
  };

  const maxHours = Math.max(...weeklyData.map(d => d.hours));

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
            <Text style={styles.headerTitle}>Activity Tracking</Text>
            <Text style={styles.headerSubtitle}>
              Monitor your farming progress and productivity
            </Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Today's Summary Card */}
          <Animated.View style={[
            styles.summaryCard,
            {
              opacity: fadeAnimation,
              transform: [{ translateY: slideAnimation }],
            }
          ]}>
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFC']}
              style={styles.summaryCardGradient}
            >
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>Today's Activity</Text>
                <View style={styles.dateContainer}>
                  <Calendar size={16} color="#4CAF50" />
                  <Text style={styles.dateText}>
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Text>
                </View>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Clock size={24} color="#4CAF50" />
                  </View>
                  <Text style={styles.statNumber}>{todayStats.hoursInField}</Text>
                  <Text style={styles.statLabel}>Hours in Field</Text>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Footprints size={24} color="#8B4513" />
                  </View>
                  <Text style={styles.statNumber}>{todayStats.stepsWalked.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>Steps Walked</Text>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Droplets size={24} color="#3B82F6" />
                  </View>
                  <Text style={styles.statNumber}>{todayStats.waterIntake}L</Text>
                  <Text style={styles.statLabel}>Water Intake</Text>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <CheckCircle2 size={24} color="#F59E0B" />
                  </View>
                  <Text style={styles.statNumber}>
                    {todayStats.tasksCompleted}/{todayStats.totalTasks}
                  </Text>
                  <Text style={styles.statLabel}>Tasks Done</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Daily Goal Progress</Text>
                  <Text style={styles.progressPercentage}>
                    {Math.round((todayStats.tasksCompleted / todayStats.totalTasks) * 100)}%
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <Animated.View style={[
                    styles.progressBar,
                    {
                      width: progressAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', `${(todayStats.tasksCompleted / todayStats.totalTasks) * 100}%`],
                      }),
                    }
                  ]} />
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Weekly Chart */}
          <Animated.View style={[
            styles.chartCard,
            {
              opacity: fadeAnimation,
            }
          ]}>
            <LinearGradient
              colors={['#FFFFFF', '#FDFDFD']}
              style={styles.chartCardGradient}
            >
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Weekly Activity Trend</Text>
                <View style={styles.chartToggle}>
                  <TouchableOpacity style={[styles.toggleButton, styles.activeToggle]}>
                    <Text style={[styles.toggleText, styles.activeToggleText]}>Hours</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.toggleButton}>
                    <Text style={styles.toggleText}>Steps</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.chartContainer}>
                {weeklyData.map((day, index) => (
                  <View key={day.day} style={styles.chartBarContainer}>
                    <View style={styles.chartBarWrapper}>
                      <Animated.View style={[
                        styles.chartBar,
                        {
                          height: chartAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, (day.hours / maxHours) * 120],
                          }),
                        }
                      ]}>
                        <LinearGradient
                          colors={['#4CAF50', '#2E7D32']}
                          style={styles.chartBarGradient}
                        />
                      </Animated.View>
                    </View>
                    <Text style={styles.chartBarValue}>{day.hours}h</Text>
                    <Text style={styles.chartBarLabel}>{day.day}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Tasks Section */}
          <Animated.View style={[
            styles.section,
            {
              opacity: fadeAnimation,
            }
          ]}>
            <Text style={styles.sectionTitle}>Tasks & Milestones</Text>
            <View style={styles.tasksContainer}>
              {tasks.slice(0, 4).map((task, index) => (
                <Animated.View
                  key={task.id}
                  style={[
                    styles.taskCard,
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
                  <View style={styles.taskIconContainer}>
                    {getTaskStatusIcon(task.status)}
                  </View>
                  
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <View style={styles.taskMetadata}>
                      <Text style={styles.taskCategory}>{task.category}</Text>
                      <Text style={styles.taskDivider}>•</Text>
                      <Text style={styles.taskTime}>{task.time}</Text>
                    </View>
                  </View>

                  <View style={[
                    styles.taskStatusIndicator,
                    { backgroundColor: getTaskStatusColor(task.status) }
                  ]} />
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Insights Section */}
          <Animated.View style={[
            styles.section,
            {
              opacity: fadeAnimation,
            }
          ]}>
            <Text style={styles.sectionTitle}>Motivation & Insights</Text>
            <View style={styles.insightsContainer}>
              {insights.map((insight, index) => (
                <Animated.View
                  key={insight.id}
                  style={[
                    styles.insightCard,
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
                  <LinearGradient
                    colors={getInsightCardColors(insight.type)}
                    style={styles.insightCardGradient}
                  >
                    <View style={styles.insightIcon}>
                      {insight.icon}
                    </View>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightTitle}>{insight.title}</Text>
                      <Text style={styles.insightMessage}>{insight.message}</Text>
                    </View>
                  </LinearGradient>
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
  summaryCard: {
    marginBottom: 24,
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
  summaryCardGradient: {
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  progressContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  progressPercentage: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  chartCard: {
    marginBottom: 24,
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
  chartCardGradient: {
    padding: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  chartToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: '#4CAF50',
  },
  toggleText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  activeToggleText: {
    color: '#FFFFFF',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    paddingTop: 20,
  },
  chartBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBar: {
    width: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  chartBarGradient: {
    flex: 1,
    borderRadius: 12,
  },
  chartBarValue: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  chartBarLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  tasksContainer: {
    gap: 12,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  taskIconContainer: {
    marginRight: 16,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  taskMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCategory: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  taskDivider: {
    fontSize: 12,
    color: '#D1D5DB',
    marginHorizontal: 8,
  },
  taskTime: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  taskStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 12,
  },
  insightsContainer: {
    gap: 12,
  },
  insightCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  insightMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});