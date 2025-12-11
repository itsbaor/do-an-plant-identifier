import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '~/navigations/RootNavigation';
import { fetchUserStats, fetchArticleStats, UserStats, ArticleStats } from '~/services/adminService';
import { clearAuthData, getUserData } from '~/services/authService';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const AdminDashboard = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList, 'AdminDashboard'>>();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [articleStats, setArticleStats] = useState<ArticleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    // Get admin user name
    const userData = await getUserData();
    if (userData) {
      setUserName(userData.name);
    }

    // Fetch statistics
    const [userStatsResult, articleStatsResult] = await Promise.all([
      fetchUserStats(),
      fetchArticleStats(),
    ]);

    if (userStatsResult.success && userStatsResult.data) {
      setUserStats(userStatsResult.data);
    }

    if (articleStatsResult.success && articleStatsResult.data) {
      setArticleStats(articleStatsResult.data);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await clearAuthData();
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.loadingContainer}>
          <LottieView
            source={require('~/resources/animations/circular_loading.json')}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Luxurious Header */}
          <View style={styles.headerContainer}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greetingText}>Welcome Back</Text>
                <Text style={styles.userName}>{userName}</Text>
              </View>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LinearGradient colors={['#ff6b6b', '#ee5a6f']} style={styles.logoutGradient}>
                  <Text style={styles.logoutIcon}>→</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text style={styles.dashboardTitle}>Admin Dashboard</Text>
          </View>

          {/* User Statistics Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>👥</Text>
              <Text style={styles.sectionTitle}>User Analytics</Text>
            </View>
            <View style={styles.cardsRow}>
              <View style={styles.smallCardWrapper}>
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.smallCard}>
                  <Text style={styles.cardIcon}>👤</Text>
                  <Text style={styles.cardValue}>{userStats?.total || 0}</Text>
                  <Text style={styles.cardLabel}>Total Users</Text>
                </LinearGradient>
              </View>
              <View style={styles.smallCardWrapper}>
                <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.smallCard}>
                  <Text style={styles.cardIcon}>✓</Text>
                  <Text style={styles.cardValue}>{userStats?.active || 0}</Text>
                  <Text style={styles.cardLabel}>Active</Text>
                </LinearGradient>
              </View>
            </View>
            <View style={styles.largeCardWrapper}>
              <LinearGradient colors={['#fbc2eb', '#a6c1ee']} style={styles.largeCard}>
                <View style={styles.largeCardContent}>
                  <View style={styles.largeCardLeft}>
                    <Text style={styles.largeCardIcon}>⭐</Text>
                    <View>
                      <Text style={styles.largeCardValue}>{userStats?.admins || 0}</Text>
                      <Text style={styles.largeCardLabel}>Administrators</Text>
                    </View>
                  </View>
                  <View style={styles.largeCardBadge}>
                    <Text style={styles.badgeText}>VIP</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Article Statistics Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📰</Text>
              <Text style={styles.sectionTitle}>Content Analytics</Text>
            </View>
            <View style={styles.cardsRow}>
              <View style={styles.smallCardWrapper}>
                <LinearGradient colors={['#fa709a', '#fee140']} style={styles.smallCard}>
                  <Text style={styles.cardIcon}>📝</Text>
                  <Text style={styles.cardValue}>{articleStats?.total || 0}</Text>
                  <Text style={styles.cardLabel}>Articles</Text>
                </LinearGradient>
              </View>
              <View style={styles.smallCardWrapper}>
                <LinearGradient colors={['#30cfd0', '#330867']} style={styles.smallCard}>
                  <Text style={styles.cardIcon}>✓</Text>
                  <Text style={styles.cardValue}>{articleStats?.published || 0}</Text>
                  <Text style={styles.cardLabel}>Published</Text>
                </LinearGradient>
              </View>
            </View>
            <View style={styles.cardsRow}>
              <View style={styles.smallCardWrapper}>
                <LinearGradient colors={['#a8edea', '#fed6e3']} style={styles.smallCard}>
                  <Text style={styles.cardIcon}>📋</Text>
                  <Text style={styles.cardValue}>{articleStats?.unpublished || 0}</Text>
                  <Text style={styles.cardLabel}>Drafts</Text>
                </LinearGradient>
              </View>
              <View style={styles.smallCardWrapper}>
                <LinearGradient colors={['#ff9a9e', '#fecfef']} style={styles.smallCard}>
                  <Text style={styles.cardIcon}>👁</Text>
                  <Text style={styles.cardValue}>{articleStats?.totalViews || 0}</Text>
                  <Text style={styles.cardLabel}>Views</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Management Actions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>⚙️</Text>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>
            <TouchableOpacity
              style={styles.actionButtonWrapper}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('UserManagement' as any)}>
              <LinearGradient colors={['#667eea', '#764ba2']} style={styles.actionButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <View style={styles.actionButtonContent}>
                  <View style={styles.actionButtonLeft}>
                    <View style={styles.actionIconContainer}>
                      <Text style={styles.actionIcon}>👥</Text>
                    </View>
                    <View>
                      <Text style={styles.actionButtonTitle}>User Management</Text>
                      <Text style={styles.actionButtonSubtitle}>Manage users, roles & permissions</Text>
                    </View>
                  </View>
                  <Text style={styles.actionArrow}>→</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButtonWrapper}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ArticleManagement' as any)}>
              <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.actionButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <View style={styles.actionButtonContent}>
                  <View style={styles.actionButtonLeft}>
                    <View style={styles.actionIconContainer}>
                      <Text style={styles.actionIcon}>📰</Text>
                    </View>
                    <View>
                      <Text style={styles.actionButtonTitle}>Article Management</Text>
                      <Text style={styles.actionButtonSubtitle}>Create & publish content</Text>
                    </View>
                  </View>
                  <Text style={styles.actionArrow}>→</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    opacity: 0.8,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  // Header Styles
  headerContainer: {
    marginBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greetingText: {
    fontSize: 16,
    color: '#a8b2d1',
    fontWeight: '500',
    marginBottom: 4,
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  dashboardTitle: {
    fontSize: 14,
    color: '#8892b0',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  logoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutGradient: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  logoutIcon: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    transform: [{ rotate: '-45deg' }],
  },
  // Section Styles
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  // Card Styles
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  smallCardWrapper: {
    width: (width - 52) / 2,
  },
  smallCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
    opacity: 0.9,
  },
  largeCardWrapper: {
    marginTop: 4,
  },
  largeCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  largeCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  largeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  largeCardIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  largeCardValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  largeCardLabel: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
    opacity: 0.9,
  },
  largeCardBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Action Button Styles
  actionButtonWrapper: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  actionButton: {
    borderRadius: 20,
    padding: 20,
  },
  actionButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  actionButtonSubtitle: {
    fontSize: 13,
    color: '#ffffff',
    opacity: 0.8,
  },
  actionArrow: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default AdminDashboard;
