import AsyncStorage from '@react-native-async-storage/async-storage';
import {t_PlantType} from '~/@types/plant';
import {ERROR_MSG} from '~/data/errorCode';
import {KEY_PLANT_LIST} from '~/screens/bottom-tabs/garden/top-tabs/MyGarden';

export const addPlantToStorage = async (plant: t_PlantType) => {
  const plantData = await AsyncStorage.getItem(KEY_PLANT_LIST);
  let currentPlantList: t_PlantType[] = [];
  if (plantData) {
    currentPlantList = JSON.parse(plantData);
    //Check if the plant exists in currentPlantList
    if (currentPlantList.find(item => item.name === plant.name)) {
      return {success: false};
    }
  }
  await AsyncStorage.setItem(
    KEY_PLANT_LIST,
    JSON.stringify([plant, ...currentPlantList]),
  );
  return {success: true, updateList: [plant, ...currentPlantList]};
};

export const removePlantFromStorage = async (plantName: string) => {
  const plantData = await AsyncStorage.getItem(KEY_PLANT_LIST);
  let currentPlantList: t_PlantType[] = [];
  if (plantData) {
    currentPlantList = JSON.parse(plantData);
    currentPlantList = currentPlantList.filter(item => item.name !== plantName);
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
};

export const removeAllPlantsFromStorage = async () => {
  AsyncStorage.removeItem(KEY_PLANT_LIST);
};
