import { Platform } from 'react-native';
import { getAuthToken } from './authService';
import { Article } from './articleService';

const API_BASE = (process.env.EXPO_PUBLIC_API_BASE_URL as string)
  || (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000');

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface UserStats {
  total: number;
  active: number;
  admins: number;
}

export interface ArticleStats {
  total: number;
  published: number;
  unpublished: number;
  totalViews: number;
  byCategory: Array<{ category: string; count: number }>;
}

// User Management APIs

export const fetchAllUsers = async (): Promise<{ success: boolean; data?: User[]; error?: string }> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch users');
    }

    const { users } = await response.json();
    return { success: true, data: users };
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return { success: false, error: error?.message || 'Cannot connect to server' };
  }
};

export const updateUser = async (
  userId: number,
  updates: { name?: string; email?: string; role?: string; is_active?: boolean }
): Promise<{ success: boolean; data?: User; error?: string }> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update user');
    }

    const { user } = await response.json();
    return { success: true, data: user };
  } catch (error: any) {
    console.error('Error updating user:', error);
    return { success: false, error: error?.message || 'Cannot connect to server' };
  }
};

export const deleteUser = async (userId: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE}/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to delete user');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return { success: false, error: error?.message || 'Cannot connect to server' };
  }
};

export const fetchUserStats = async (): Promise<{ success: boolean; data?: UserStats; error?: string }> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE}/api/users/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch user stats');
    }

    const stats = await response.json();
    return { success: true, data: stats };
  } catch (error: any) {
    console.error('Error fetching user stats:', error);
    return { success: false, error: error?.message || 'Cannot connect to server' };
  }
};

// Article Management APIs

export const fetchAllArticles = async (
  published?: boolean
): Promise<{ success: boolean; data?: Article[]; error?: string }> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    let url = `${API_BASE}/api/articles/admin/all`;
    if (published !== undefined) {
      url += `?published=${published}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch articles');
    }

    const { articles } = await response.json();
    return { success: true, data: articles };
  } catch (error: any) {
    console.error('Error fetching all articles:', error);
    return { success: false, error: error?.message || 'Cannot connect to server' };
  }
};

export const createArticle = async (article: {
  title: string;
  description?: string;
  content: string;
  image_url?: string;
  category?: string;
  is_published?: boolean;
}): Promise<{ success: boolean; articleId?: number; error?: string }> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE}/api/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(article),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create article');
    }

    const { articleId } = await response.json();
    return { success: true, articleId };
  } catch (error: any) {
    console.error('Error creating article:', error);
    return { success: false, error: error?.message || 'Cannot connect to server' };
  }
};

export const updateArticle = async (
  articleId: number,
  updates: {
    title?: string;
    description?: string;
    content?: string;
    image_url?: string;
    category?: string;
    is_published?: boolean;
  }
): Promise<{ success: boolean; data?: Article; error?: string }> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE}/api/articles/${articleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update article');
    }

    const { article } = await response.json();
    return { success: true, data: article };
  } catch (error: any) {
    console.error('Error updating article:', error);
    return { success: false, error: error?.message || 'Cannot connect to server' };
  }
};

export const deleteArticle = async (articleId: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE}/api/articles/${articleId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to delete article');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting article:', error);
    return { success: false, error: error?.message || 'Cannot connect to server' };
  }
};

export const togglePublishArticle = async (
  articleId: number,
  is_published: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE}/api/articles/${articleId}/publish`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ is_published }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to toggle publish status');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error toggling publish status:', error);
    return { success: false, error: error?.message || 'Cannot connect to server' };
  }
};

export const fetchArticleStats = async (): Promise<{ success: boolean; data?: ArticleStats; error?: string }> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE}/api/articles/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch article stats');
    }

    const stats = await response.json();
    return { success: true, data: stats };
  } catch (error: any) {
    console.error('Error fetching article stats:', error);
    return { success: false, error: error?.message || 'Cannot connect to server' };
  }
};
