/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {AxiosInstance, AxiosResponse} from 'axios';
import Config from 'react-native-config';
import {ERROR_MSG} from '~/data/errorCode';

// API Configuration
const PLANT_ID_BASE_URL = 'https://plant.id/api/v3';
const API_TIMEOUT = 30000; // 30 seconds for better reliability
const MAX_RETRY_ATTEMPTS = 2;
const RETRY_DELAY = 1000; // 1 second

// Create axios instance for Plant.id API
const plantIdAxios: AxiosInstance = axios.create({
  baseURL: PLANT_ID_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
plantIdAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  error => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      if (status === 401) {
        console.error('Plant.id API: Invalid API key');
      } else if (status === 429) {
        console.error('Plant.id API: Rate limit exceeded');
      } else if (status >= 500) {
        console.error('Plant.id API: Server error');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Plant.id API: Request timeout');
    }
    return Promise.reject(error);
  },
);

// Types
export type PlantIdentifyResult = {
  name: string;
  probability: number;
  image: string;
  scientific_name?: string;
  common_names?: string[];
  similar_images?: Array<{url: string; similarity: number}>;
};

export type PlantDiagnoseResult = {
  name: string;
  probability: number;
  similar_images: Array<{url: string; similarity: number}>;
  description?: string;
  treatment?: {
    chemical?: string[];
    biological?: string[];
    prevention?: string[];
  };
};

export type ApiResponse<T> = {
  isSuccess: boolean;
  message: string;
  data?: T;
};

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Note: Image optimization is now handled by imageOptimizer service
// This function is kept for backward compatibility
export const optimizeBase64Image = (base64: string, quality: number = 0.8): string => {
  return base64;
};

// Retry wrapper for API calls
async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  retries: number = MAX_RETRY_ATTEMPTS,
): Promise<T> {
  try {
    return await apiCall();
  } catch (error: any) {
    if (retries > 0 && shouldRetry(error)) {
      console.log(`Retrying API call. Attempts remaining: ${retries}`);
      await delay(RETRY_DELAY);
      return retryApiCall(apiCall, retries - 1);
    }
    throw error;
  }
}

// Check if error is retryable
function shouldRetry(error: any): boolean {
  // Retry on network errors, timeouts, and 5xx errors
  if (!error.response) return true; // Network error
  if (error.code === 'ECONNABORTED') return true; // Timeout
  const status = error.response?.status;
  return status >= 500 && status < 600; // Server errors
}

/**
 * Identify plant using Plant.id API
 * @param base64Image - Base64 encoded image
 * @param apiKey - Plant.id API key
 * @returns Promise with identification results
 */
export const identifyPlant = async (
  base64Image: string,
  apiKey: string,
): Promise<ApiResponse<PlantIdentifyResult[]>> => {
  try {
    // Optimize image for faster upload
    const optimizedImage = optimizeBase64Image(base64Image);

    // Plant.id API expects base64 with data URI prefix
    const base64WithPrefix = optimizedImage.startsWith('data:')
      ? optimizedImage
      : `data:image/jpeg;base64,${optimizedImage}`;

    const response = await retryApiCall(async () => {
      return await plantIdAxios.post(
        '/identification',
        {
          images: [base64WithPrefix],
          similar_images: true,
        },
        {
          headers: {
            'Api-Key': apiKey,
            'Content-Type': 'application/json',
          },
        },
      );
    });

    // Process response
    const suggestions = response.data?.result?.classification?.suggestions || [];

    if (suggestions.length === 0) {
      return {
        isSuccess: false,
        message: ERROR_MSG.BAD_IMAGE,
      };
    }

    // Take top 3 results
    const topResults = suggestions.slice(0, 3);

    const processedResults: PlantIdentifyResult[] = topResults.map((item: any) => ({
      name: item.name || 'Unknown',
      probability: item.probability || 0,
      image: item.similar_images?.[0]?.url || '',
      scientific_name: item.details?.scientific_name,
      common_names: item.details?.common_names,
      similar_images: item.similar_images || [],
    }));

    return {
      isSuccess: true,
      message: ERROR_MSG.SUCCESS,
      data: processedResults,
    };
  } catch (error: any) {
    console.error('Error in identifyPlant:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);

    if (error.response?.status === 400) {
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Invalid request. Please check image format.',
      };
    }

    if (error.response?.status === 401) {
      return {
        isSuccess: false,
        message: 'Invalid API key',
      };
    }

    if (error.code === 'ECONNABORTED') {
      return {
        isSuccess: false,
        message: 'Request timeout. Please try again.',
      };
    }

    return {
      isSuccess: false,
      message: ERROR_MSG.SOME_THING_WENT_WRONG,
    };
  }
};

/**
 * Diagnose plant health using Plant.id API
 * @param base64Image - Base64 encoded image
 * @param apiKey - Plant.id API key
 * @returns Promise with diagnosis results
 */
export const diagnosePlant = async (
  base64Image: string,
  apiKey: string,
): Promise<ApiResponse<PlantDiagnoseResult[]>> => {
  try {
    // Optimize image for faster upload
    const optimizedImage = optimizeBase64Image(base64Image);

    // Plant.id API expects base64 with data URI prefix
    const base64WithPrefix = optimizedImage.startsWith('data:')
      ? optimizedImage
      : `data:image/jpeg;base64,${optimizedImage}`;

    const response = await retryApiCall(async () => {
      return await plantIdAxios.post(
        '/health_assessment',
        {
          images: [base64WithPrefix],
          similar_images: true,
          disease_details: [
            'local_name',
            'description',
            'url',
            'treatment',
            'classification',
            'common_names',
            'cause',
          ],
        },
        {
          headers: {
            'Api-Key': apiKey,
            'Content-Type': 'application/json',
          },
        },
      );
    });

    // Process response
    const suggestions = response.data?.result?.disease?.suggestions || [];
    const isHealthy = response.data?.result?.is_healthy?.binary;

    if (isHealthy) {
      return {
        isSuccess: true,
        message: ERROR_MSG.HEALTHY_PLANT,
      };
    }

    if (suggestions.length === 0) {
      return {
        isSuccess: false,
        message: ERROR_MSG.BAD_IMAGE,
      };
    }

    // Take top 3 results
    const topResults = suggestions.slice(0, 3);

    const processedResults: PlantDiagnoseResult[] = topResults.map((item: any) => ({
      name: item.name || 'Unknown',
      probability: item.probability || 0,
      similar_images: item.similar_images || [],
      description: item.details?.description,
      treatment: item.details?.treatment,
    }));

    return {
      isSuccess: true,
      message: ERROR_MSG.SUCCESS,
      data: processedResults,
    };
  } catch (error: any) {
    console.error('Error in diagnosePlant:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);

    if (error.response?.status === 400) {
      return {
        isSuccess: false,
        message: error.response?.data?.message || 'Invalid request. Please check image format.',
      };
    }

    if (error.response?.status === 401) {
      return {
        isSuccess: false,
        message: 'Invalid API key',
      };
    }

    if (error.code === 'ECONNABORTED') {
      return {
        isSuccess: false,
        message: 'Request timeout. Please try again.',
      };
    }

    return {
      isSuccess: false,
      message: ERROR_MSG.SOME_THING_WENT_WRONG,
    };
  }
};

/**
 * Get identification status by access token
 * Useful for async operations or checking results later
 * @param accessToken - Access token from initial request
 * @param apiKey - Plant.id API key
 */
export const getIdentificationStatus = async (
  accessToken: string,
  apiKey: string,
): Promise<any> => {
  try {
    const response = await plantIdAxios.get(`/identification/${accessToken}`, {
      headers: {
        'Api-Key': apiKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting identification status:', error);
    throw error;
  }
};

export default {
  identifyPlant,
  diagnosePlant,
  getIdentificationStatus,
};
