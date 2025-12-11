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
  watering?: {
    max?: number;
    min?: number;
  };
  propagation_methods?: string[];
  taxonomy?: {
    class?: string;
    family?: string;
    genus?: string;
    kingdom?: string;
    order?: string;
    phylum?: string;
  };
  edible_parts?: string[];
  description?: {
    value?: string;
  };
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
    console.log('Starting Plant.id identification...');
    console.log('API Key (first 10 chars):', apiKey?.substring(0, 10) + '...');

    // Optimize image for faster upload
    const optimizedImage = optimizeBase64Image(base64Image);

    // Plant.id API expects base64 with data URI prefix
    const base64WithPrefix = optimizedImage.startsWith('data:')
      ? optimizedImage
      : `data:image/jpeg;base64,${optimizedImage}`;

    console.log('Base64 image prepared, length:', base64WithPrefix.length);

    const response = await retryApiCall(async () => {
      console.log('Making API request to Plant.id...');
      return await plantIdAxios.post(
        '/identification',
        {
          images: [base64WithPrefix],
          similar_images: true,
          classification_level: 'all',
          classification_raw: true,
        },
        {
          headers: {
            'Api-Key': apiKey,
            'Content-Type': 'application/json',
          },
        },
      );
    });

    console.log('API response status:', response.status);
    console.log('API response has data:', !!response.data);

    // Process response - handle different Plant.id API versions
    if (!response.data) {
      console.error('No response data from Plant.id API');
      return {
        isSuccess: false,
        message: 'Invalid API response',
      };
    }

    console.log('Plant.id API response keys:', Object.keys(response.data));

    // Check status
    const status = response.data.status;
    console.log('API response status:', status);

    // Try different possible response paths for Plant.id API v2/v3
    let suggestions: any[] = [];

    // V3 API with async response (201 status)
    if (response.data.access_token && response.data.result) {
      console.log('Got V3 async response with result included');
      console.log('Result keys:', Object.keys(response.data.result));
      console.log('Status field:', response.data.status);

      // Check if classification exists
      if (response.data.result.classification) {
        const classification = response.data.result.classification;

        // Handle Plant.id v3 API structure where suggestions is an object with genus/species arrays
        if (classification.suggestions) {
          const suggestionsObj = classification.suggestions;

          // Check if suggestions is an array (v2 format)
          if (Array.isArray(suggestionsObj)) {
            suggestions = suggestionsObj;
            console.log('Found', suggestions.length, 'suggestions (array format)');
          }
          // Check if suggestions is an object with genus/species (v3 format)
          else if (typeof suggestionsObj === 'object') {
            // Prioritize species over genus for more specific identification
            if (suggestionsObj.species && Array.isArray(suggestionsObj.species)) {
              suggestions = suggestionsObj.species;
              console.log('Found', suggestions.length, 'species suggestions');
            } else if (suggestionsObj.genus && Array.isArray(suggestionsObj.genus)) {
              suggestions = suggestionsObj.genus;
              console.log('Found', suggestions.length, 'genus suggestions');
            } else {
              console.log('Suggestions object keys:', Object.keys(suggestionsObj));
            }
          }
        } else if (classification.predictions && Array.isArray(classification.predictions)) {
          suggestions = classification.predictions;
          console.log('Found', suggestions.length, 'predictions');
        } else {
          console.log('Classification keys:', Object.keys(classification));
          console.log('No suggestions found in classification');
        }
      } else {
        console.log('No classification in result');
      }

      // Only check is_plant if we don't have suggestions
      if ((!suggestions || suggestions.length === 0) && response.data.result.is_plant !== undefined) {
        const isPlant = response.data.result.is_plant?.binary || response.data.result.is_plant?.probability > 0.5;
        console.log('No suggestions found, checking is_plant:', isPlant);
        if (!isPlant) {
          console.log('No plant detected in image');
          return {
            isSuccess: false,
            message: 'No plant detected in the image. Please try a clearer photo.',
          };
        }
      }
    }
    // V2 or synchronous V3
    else if (response.data.suggestions) {
      // Direct suggestions array (v2)
      suggestions = response.data.suggestions;
      console.log('Found suggestions at root level (v2 format)');
    } else if (response.data.result?.classification?.suggestions) {
      // Nested in classification (v3)
      suggestions = response.data.result.classification.suggestions;
      console.log('Found suggestions in classification (v3 format)');
    } else if (response.data.result?.is_plant?.binary !== undefined) {
      // Plant check result
      console.log('Got plant check result, not identification');
      return {
        isSuccess: false,
        message: response.data.result.is_plant.binary
          ? 'Plant detected but no identification available'
          : 'No plant detected in image',
      };
    }

    console.log('Suggestions found:', suggestions.length);
    if (suggestions.length > 0) {
      console.log('First suggestion sample:', JSON.stringify(suggestions[0], null, 2));
    }

    if (!suggestions || suggestions.length === 0) {
      console.error('No plant suggestions in response');
      return {
        isSuccess: false,
        message: ERROR_MSG.BAD_IMAGE,
      };
    }

    // Take top 3 results
    const topResults = Array.isArray(suggestions) ? suggestions.slice(0, 3) : [];

    if (topResults.length === 0) {
      console.error('No results after filtering');
      return {
        isSuccess: false,
        message: ERROR_MSG.BAD_IMAGE,
      };
    }

    console.log('Processing', topResults.length, 'results');

    const processedResults: PlantIdentifyResult[] = topResults.map((item: any, index: number) => {
      // Extract details from the classification response
      const details = item.details || {};
      const similarImages = item.similar_images || [];

      // Get the best image from similar_images
      const bestImage = similarImages.length > 0 ? similarImages[0].url : '';

      console.log(`Result ${index + 1}:`, {
        name: item.name,
        probability: item.probability,
        hasImage: !!bestImage,
        similarImagesCount: similarImages.length,
      });

      return {
        name: item.name || 'Unknown',
        probability: item.probability || 0,
        image: bestImage,
        scientific_name: item.name, // In v3, name is already the scientific name
        common_names: details.common_names || [],
        similar_images: similarImages,
        watering: details.watering,
        propagation_methods: details.propagation_methods,
        taxonomy: details.taxonomy,
        edible_parts: details.edible_parts,
        description: details.description,
      };
    });

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
          disease_model: 'full',
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
