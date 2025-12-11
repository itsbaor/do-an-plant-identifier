import { Platform } from 'react-native';

export interface Article {
  id: number;
  title: string;
  description: string | null;
  content: string;
  image_url: string | null;
  category: string | null;
  views: number;
  created_at: string;
  updated_at: string;
  author_name?: string;
}

const API_BASE = (process.env.EXPO_PUBLIC_API_BASE_URL as string)
  || (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000');

/**
 * Fetch published articles from backend
 * @param category - Optional category filter
 * @param limit - Number of articles to fetch (default: 20)
 * @param offset - Offset for pagination (default: 0)
 * @returns Array of published articles
 */
export const fetchArticlesFromBackend = async (
  category?: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ success: boolean; data?: Article[]; error?: string }> => {
  try {
    let url = `${API_BASE}/api/articles?limit=${limit}&offset=${offset}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch articles');
    }

    const { articles } = await response.json();
    return { success: true, data: articles };
  } catch (error: any) {
    console.error('Error fetching articles from backend:', error);
    return {
      success: false,
      error: error?.message || 'Cannot connect to server',
    };
  }
};

/**
 * Fetch single article by ID
 * @param articleId - Article ID
 * @returns Single article with incremented view count
 */
export const fetchArticleById = async (
  articleId: number
): Promise<{ success: boolean; data?: Article; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/api/articles/${articleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Article not found');
    }

    const { article } = await response.json();
    return { success: true, data: article };
  } catch (error: any) {
    console.error('Error fetching article by ID:', error);
    return {
      success: false,
      error: error?.message || 'Cannot connect to server',
    };
  }
};
