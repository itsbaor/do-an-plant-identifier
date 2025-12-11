import AsyncStorage from '@react-native-async-storage/async-storage';
import {t_PlantType} from '~/@types/plant';
import {ERROR_MSG} from '~/data/errorCode';
import {KEY_PLANT_LIST} from '~/screens/bottom-tabs/garden/top-tabs/MyGarden';
import {
  addPlantToBackend,
  removePlantFromBackend,
  fetchPlantsFromBackend,
} from '~/services/plantService';
import {getAuthToken} from '~/services/authService';

/**
 * Add plant - syncs to backend if user is authenticated
 */
export const addPlantToStorage = async (plant: t_PlantType) => {
  try {
    const token = await getAuthToken();

    if (token) {
      // User is authenticated - use backend
      const result = await addPlantToBackend(plant);

      if (!result.success) {
        return {success: false, error: result.error};
      }

      // Fetch updated list from backend
      const plantsResult = await fetchPlantsFromBackend();
      if (plantsResult.success && plantsResult.data) {
        return {success: true, updateList: plantsResult.data};
      }

      return {success: true};
    } else {
      // User not authenticated - fallback to AsyncStorage (legacy)
      const plantData = await AsyncStorage.getItem(KEY_PLANT_LIST);
      let currentPlantList: t_PlantType[] = [];
      if (plantData) {
        currentPlantList = JSON.parse(plantData);
        if (currentPlantList.find(item => item.name === plant.name)) {
          return {success: false};
        }
      }
      await AsyncStorage.setItem(
        KEY_PLANT_LIST,
        JSON.stringify([plant, ...currentPlantList]),
      );
      return {success: true, updateList: [plant, ...currentPlantList]};
    }
  } catch (error) {
    console.error('Error adding plant:', error);
    return {success: false, error: 'Failed to add plant'};
  }
};

/**
 * Remove plant - syncs to backend if user is authenticated
 */
export const removePlantFromStorage = async (plantName: string) => {
  try {
    const token = await getAuthToken();

    if (token) {
      // User is authenticated - use backend
      const result = await removePlantFromBackend(plantName);

      if (!result.success) {
        console.error('Failed to remove from backend:', result.error);
      }

      // Fetch updated list from backend
      const plantsResult = await fetchPlantsFromBackend();
      if (plantsResult.success && plantsResult.data) {
        return plantsResult.data;
      }

      return [];
    } else {
      // User not authenticated - fallback to AsyncStorage (legacy)
      const plantData = await AsyncStorage.getItem(KEY_PLANT_LIST);
      let currentPlantList: t_PlantType[] = [];
      if (plantData) {
        currentPlantList = JSON.parse(plantData);
        currentPlantList = currentPlantList.filter(
          item => item.name !== plantName,
        );
        if (currentPlantList.length === 0) {
          await AsyncStorage.removeItem(KEY_PLANT_LIST);
        } else {
          await AsyncStorage.setItem(
            KEY_PLANT_LIST,
            JSON.stringify(currentPlantList),
          );
        }
      }
      return currentPlantList;
    }
  } catch (error) {
    console.error('Error removing plant:', error);
    return [];
  }
};

/**
 * Fetch plants - checks backend first if authenticated
 */
export const fetchPlants = async (): Promise<t_PlantType[]> => {
  try {
    const token = await getAuthToken();

    if (token) {
      // User is authenticated - fetch from backend
      const result = await fetchPlantsFromBackend();

      if (result.success && result.data) {
        return result.data;
      }

      console.error('Failed to fetch from backend:', result.error);
      return [];
    } else {
      // User not authenticated - fallback to AsyncStorage (legacy)
      const plantData = await AsyncStorage.getItem(KEY_PLANT_LIST);
      return plantData ? JSON.parse(plantData) : [];
    }
  } catch (error) {
    console.error('Error fetching plants:', error);
    return [];
  }
};

/**
 * Remove all plants from AsyncStorage (legacy function)
 */
export const removeAllPlantsFromStorage = async () => {
  AsyncStorage.removeItem(KEY_PLANT_LIST);
};
