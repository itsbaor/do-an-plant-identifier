import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '~/navigations/RootNavigation';
import {
  fetchAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  togglePublishArticle,
} from '~/services/adminService';
import { Article } from '~/services/articleService';
import LottieView from 'lottie-react-native';

const ArticleManagement = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    const result = await fetchAllArticles();
    if (result.success && result.data) {
      setArticles(result.data);
    } else {
      Alert.alert('Error', result.error || 'Failed to load articles');
    }
    setLoading(false);
  };

  const openCreateModal = () => {
    setEditingArticle(null);
    setTitle('');
    setDescription('');
    setContent('');
    setImageUrl('');
    setCategory('');
    setModalVisible(true);
  };

  const openEditModal = (article: Article) => {
    setEditingArticle(article);
    setTitle(article.title);
    setDescription(article.description || '');
    setContent(article.content);
    setImageUrl(article.image_url || '');
    setCategory(article.category || '');
    setModalVisible(true);
  };

  const handleSaveArticle = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Title and content are required');
      return;
    }

    if (editingArticle) {
      // Update existing article
      const result = await updateArticle(editingArticle.id, {
        title,
        description: description || undefined,
        content,
        image_url: imageUrl || undefined,
        category: category || undefined,
      });

      if (result.success) {
        Alert.alert('Success', 'Article updated successfully');
        setModalVisible(false);
        loadArticles();
      } else {
        Alert.alert('Error', result.error || 'Failed to update article');
      }
    } else {
      // Create new article
      const result = await createArticle({
        title,
        description: description || undefined,
        content,
        image_url: imageUrl || undefined,
        category: category || undefined,
        is_published: false,
      });

      if (result.success) {
        Alert.alert('Success', 'Article created successfully');
        setModalVisible(false);
        loadArticles();
      } else {
        Alert.alert('Error', result.error || 'Failed to create article');
      }
    }
  };

  const handleTogglePublish = async (article: Article) => {
    const newStatus = !article.is_published;
    Alert.alert(
      newStatus ? 'Publish Article' : 'Unpublish Article',
      `Are you sure you want to ${newStatus ? 'publish' : 'unpublish'} "${article.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            const result = await togglePublishArticle(article.id, newStatus);
            if (result.success) {
              Alert.alert('Success', `Article ${newStatus ? 'published' : 'unpublished'} successfully`);
              loadArticles();
            } else {
              Alert.alert('Error', result.error || 'Failed to update article');
            }
          },
        },
      ]
    );
  };

  const handleDeleteArticle = async (article: Article) => {
    Alert.alert(
      'Delete Article',
      `Are you sure you want to delete "${article.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteArticle(article.id);
            if (result.success) {
              Alert.alert('Success', 'Article deleted successfully');
              loadArticles();
            } else {
              Alert.alert('Error', result.error || 'Failed to delete article');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LottieView
            source={require('~/resources/animations/circular_loading.json')}
            autoPlay
            loop
            style={{ width: '100%', height: '25%' }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Article Management</Text>
      </View>

      <TouchableOpacity style={styles.createButton} onPress={openCreateModal}>
        <Text style={styles.createButtonText}>+ Create New Article</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {articles.map((article) => (
          <View key={article.id} style={styles.articleCard}>
            <View style={styles.articleInfo}>
              <Text style={styles.articleTitle}>{article.title}</Text>
              {article.description && (
                <Text style={styles.articleDescription} numberOfLines={2}>
                  {article.description}
                </Text>
              )}
              <View style={styles.badges}>
                {article.category && (
                  <View style={[styles.badge, styles.categoryBadge]}>
                    <Text style={styles.badgeText}>{article.category}</Text>
                  </View>
                )}
                <View
                  style={[styles.badge, article.is_published ? styles.publishedBadge : styles.draftBadge]}>
                  <Text style={styles.badgeText}>{article.is_published ? 'Published' : 'Draft'}</Text>
                </View>
              </View>
              <Text style={styles.articleStats}>
                Views: {article.views} | Created: {new Date(article.created_at).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} onPress={() => openEditModal(article)}>
                <Text style={styles.actionBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.publishBtn]}
                onPress={() => handleTogglePublish(article)}>
                <Text style={styles.actionBtnText}>{article.is_published ? 'Unpublish' : 'Publish'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => handleDeleteArticle(article)}>
                <Text style={styles.actionBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editingArticle ? 'Edit Article' : 'Create Article'}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter article title"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter short description"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text style={styles.label}>Content *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter article content"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={10}
            />

            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter image URL"
              value={imageUrl}
              onChangeText={setImageUrl}
            />

            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter category"
              value={category}
              onChangeText={setCategory}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveArticle}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginBottom: 8,
  },
  backText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  createButton: {
    backgroundColor: '#10b981',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  articleInfo: {
    marginBottom: 12,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  articleDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadge: {
    backgroundColor: '#dbeafe',
  },
  publishedBadge: {
    backgroundColor: '#d1fae5',
  },
  draftBadge: {
    backgroundColor: '#fee2e2',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  articleStats: {
    fontSize: 12,
    color: '#94a3b8',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#3b82f6',
  },
  publishBtn: {
    backgroundColor: '#10b981',
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  closeButton: {
    fontSize: 24,
    color: '#64748b',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
  },
  textArea: {
    height: 200,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ArticleManagement;
