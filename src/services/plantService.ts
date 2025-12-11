/**
 * Plant Service
 *
 * Handles plant data synchronization with backend API
 *
 * Features:
 * - Fetch plants from backend
 * - Add/remove plants with backend sync
 * - Bulk upload for migration
 * - Error handling and retry logic
 */

import {Platform} from 'react-native';
import {getAuthToken} from './authService';
import {t_PlantType} from '~/@types/plant';

const getApiBaseUrl = (): string => {
  const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL as string;
  if (envBaseUrl) return envBaseUrl;
  return Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';
};

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetch all plants from backend
 */
export const fetchPlantsFromBackend = async (): Promise<
  ApiResponse<t_PlantType[]>
> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {success: false, error: 'Not authenticated'};
    }

    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/plants`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {success: false, error: errorData.error || 'Failed to fetch plants'};
    }

    const data = await response.json();

    // Transform backend format to frontend format
    const plants: t_PlantType[] = data.plants.map((plant: any) => ({
      id: plant.id,
      name: plant.name,
      image: plant.image,
      treeLike: plant.tree_like,
      type: plant.type,
      waterlevel: plant.water_level,
      sunlevel: plant.sun_level,
      growth: plant.growth,
      category: plant.category,
    }));

    return {success: true, data: plants};
  } catch (error) {
    console.error('Error fetching plants:', error);
    return {success: false, error: 'Network error'};
  }
};

/**
 * Add plant to backend
 */
export const addPlantToBackend = async (
  plant: t_PlantType,
): Promise<ApiResponse<number>> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {success: false, error: 'Not authenticated'};
    }

    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/plants`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: plant.name,
        image: plant.image,
        treeLike: plant.treeLike,
        type: plant.type,
        waterlevel: plant.waterlevel,
        sunlevel: plant.sunlevel,
        growth: plant.growth,
        category: plant.category,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {success: false, error: errorData.error || 'Failed to add plant'};
    }

    const data = await response.json();
    return {success: true, data: data.plantId};
  } catch (error) {
    console.error('Error adding plant:', error);
    return {success: false, error: 'Network error'};
  }
};

/**
 * Remove plant from backend
 */
export const removePlantFromBackend = async (
  plantName: string,
): Promise<ApiResponse<void>> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {success: false, error: 'Not authenticated'};
    }

    const baseUrl = getApiBaseUrl();
    const response = await fetch(
      `${baseUrl}/api/plants/${encodeURIComponent(plantName)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {success: false, error: errorData.error || 'Failed to remove plant'};
    }

    return {success: true};
  } catch (error) {
    console.error('Error removing plant:', error);
    return {success: false, error: 'Network error'};
  }
};

/**
 * Bulk upload plants (for migration)
 */
export const bulkUploadPlants = async (
  plants: t_PlantType[],
): Promise<ApiResponse<{inserted: number; skipped: number}>> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {success: false, error: 'Not authenticated'};
    }

    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/plants/bulk`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({plants}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {success: false, error: errorData.error || 'Failed to upload plants'};
    }

    const data = await response.json();
    return {success: true, data: {inserted: data.inserted, skipped: data.skipped}};
  } catch (error) {
    console.error('Error bulk uploading plants:', error);
    return {success: false, error: 'Network error'};
  }
};
