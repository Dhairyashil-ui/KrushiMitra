import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  TextInput,
  Platform,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  Plus, 
  Camera, 
  Send,
  TrendingUp,
  Users,
  BookOpen,
  Wheat
} from 'lucide-react-native';

export default function CommunityScreen() {
  const [newPost, setNewPost] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const communityPosts = [
    {
      id: 1,
      author: 'Ramesh Patil',
      location: 'Pune, Maharashtra',
      time: '2 hours ago',
      content: 'Great harvest this season! My tomato yield increased by 40% using the new fertilizer technique shared in this community. Thanks everyone! 🍅',
      likes: 24,
      comments: 8,
      shares: 3,
      image: null,
      category: 'Success Story'
    },
    {
      id: 2,
      author: 'Priya Sharma',
      location: 'Nashik, Maharashtra',
      time: '5 hours ago',
      content: 'Has anyone tried drip irrigation for cotton crops? Looking for practical advice and cost analysis. Please share your experiences.',
      likes: 12,
      comments: 15,
      shares: 2,
      image: null,
      category: 'Question'
    },
    {
      id: 3,
      author: 'Suresh Kumar',
      location: 'Solapur, Maharashtra',
      time: '1 day ago',
      content: 'Weather alert: Heavy rains expected in our region. Please cover your crops and check drainage systems. Stay safe everyone! 🌧️',
      likes: 45,
      comments: 12,
      shares: 18,
      image: null,
      category: 'Weather Alert'
    }
  ];

  const renderPost = (post: any) => (
    <View key={post.id} style={styles.postCard}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC']}
        style={styles.postCardGradient}
      >
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{post.author.charAt(0)}</Text>
            </View>
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>{post.author}</Text>
              <Text style={styles.postLocation}>{post.location} • {post.time}</Text>
            </View>
          </View>
          <View style={[
            styles.categoryTag, 
            post.category === 'Success Story' && styles.successTag,
            post.category === 'Question' && styles.questionTag,
            post.category === 'Weather Alert' && styles.alertTag
          ]}>
            <Text style={[styles.categoryText, 
              post.category === 'Success Story' && styles.successText,
              post.category === 'Question' && styles.questionText,
              post.category === 'Weather Alert' && styles.alertText
            ]}>{post.category}</Text>
          </View>
        </View>

        {/* Post Content */}
        <Text style={styles.postContent}>{post.content}</Text>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Heart size={20} color="#4CAF50" />
            <Text style={styles.actionText}>{post.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={20} color="#4CAF50" />
            <Text style={styles.actionText}>{post.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={20} color="#4CAF50" />
            <Text style={styles.actionText}>{post.shares}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

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
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Wheat size={24} color="#4CAF50" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Community</Text>
                <Text style={styles.headerSubtitle}>Share thoughts, learn together</Text>
              </View>
            </View>
            <View style={styles.headerStats}>
              <View style={styles.statItem}>
                <Users size={16} color="#4CAF50" />
                <Text style={styles.statText}>2.4k farmers</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <TrendingUp size={18} color="#4CAF50" />
            </View>
            <Text style={styles.statTitle}>45</Text>
            <Text style={styles.statLabel}>Active Today</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <BookOpen size={18} color="#4CAF50" />
            </View>
            <Text style={styles.statTitle}>128</Text>
            <Text style={styles.statLabel}>New Posts</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <MessageCircle size={18} color="#4CAF50" />
            </View>
            <Text style={styles.statTitle}>89</Text>
            <Text style={styles.statLabel}>Discussions</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Create Post Section */}
          <TouchableOpacity 
            style={styles.createPostCard}
            onPress={() => setShowCreatePost(!showCreatePost)}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFC']}
              style={styles.createPostGradient}
            >
              <View style={styles.createPostHeader}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>F</Text>
                </View>
                <Text style={styles.createPostText}>Share your farming experience...</Text>
              </View>
              <View style={styles.createPostActions}>
                <TouchableOpacity style={styles.createAction}>
                  <Camera size={20} color="#4CAF50" />
                  <Text style={styles.createActionText}>Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createAction}>
                  <Plus size={20} color="#4CAF50" />
                  <Text style={styles.createActionText}>Post</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Expandable Create Post Form */}
          {showCreatePost && (
            <View style={styles.createPostForm}>
              <LinearGradient
                colors={['#FFFFFF', '#F8FAFC']}
                style={styles.createPostFormGradient}
              >
                <TextInput
                  style={styles.postInput}
                  placeholder="What's happening in your farm today?"
                  value={newPost}
                  onChangeText={setNewPost}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#9CA3AF"
                />
                <View style={styles.postFormActions}>
                  <TouchableOpacity style={styles.attachButton}>
                    <Camera size={20} color="#4CAF50" />
                    <Text style={styles.attachText}>Add Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.postButton, newPost.length > 0 && styles.postButtonActive]}
                    disabled={newPost.length === 0}
                  >
                    <Send size={16} color={newPost.length > 0 ? "#FFFFFF" : "#9CA3AF"} />
                    <Text style={[styles.postButtonText, newPost.length > 0 && styles.postButtonTextActive]}>
                      Post
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Community Posts */}
          <View style={styles.postsContainer}>
            <Text style={styles.postsTitle}>Recent Posts</Text>
            {communityPosts.map(renderPost)}
          </View>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  headerStats: {
    alignItems: 'flex-end',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F8E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  createPostCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  createPostGradient: {
    padding: 16,
  },
  createPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  createPostText: {
    flex: 1,
    fontSize: 16,
    color: '#9CA3AF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  createPostActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  createAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  createActionText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  createPostForm: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  createPostFormGradient: {
    padding: 16,
  },
  postInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 12,
    minHeight: 80,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  postFormActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  attachText: {
    fontSize: 14,
    color: '#4CAF50',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  postButtonActive: {
    backgroundColor: '#4CAF50',
  },
  postButtonText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  postButtonTextActive: {
    color: '#FFFFFF',
  },
  postsContainer: {
    marginBottom: 20,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  postCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  postCardGradient: {
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F8E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  postLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  successTag: {
    backgroundColor: '#DCFCE7',
  },
  questionTag: {
    backgroundColor: '#DBEAFE',
  },
  alertTag: {
    backgroundColor: '#FEF3C7',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  successText: {
    color: '#4CAF50',
  },
  questionText: {
    color: '#3B82F6',
  },
  alertText: {
    color: '#F59E0B',
  },
  postContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});