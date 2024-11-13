import {GoogleGenerativeAI} from '@google/generative-ai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import {stat} from 'react-native-fs';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {ERROR_MSG} from '~/data/errorCode';
import {getApi} from './axios';

export const AI_MODEL = Config.AI_MODEL;

const keyIdSearchEngine: string = '24ffaab81bfa54cef';
type t_AlertType = 'info' | 'warn' | 'error' | 'success';
export const resolveResponseFromAi = (answer: string) => {
  /**
   * AI answer has form of object with key: result, solution_step
   */
  const appendAnswer = answer + ' ';
  const startIndex = appendAnswer.indexOf('{');
  const endIndex = appendAnswer.lastIndexOf('}') + 1;
  const resolvedData = JSON.parse(answer.slice(startIndex, endIndex));
  return resolvedData;
};

export const getScanImage = async (
  ggSearchId: string,
  searchStr: string,
  type: 'Plant_Image' | 'Disease_in_Plant',
) => {
  searchStr = searchStr.replace(' ', '_') + `_${type}`;
  const requestUrl = `https://www.googleapis.com/customsearch/v1?q=${searchStr}&cx=${keyIdSearchEngine}&key=${ggSearchId}&searchType=image`;
  console.log(requestUrl);
  try {
    const res = await getApi(requestUrl);
    if (res.items && res.items.length > 0) {
      const randIndex = Math.floor(Math.random() * res.items.length);
      return {
        isSuccess: true,
        message: ERROR_MSG.SUCCESS,
        data: res.items[randIndex].link as string,
      };
    }
    return {
      isSuccess: false,
      message: ERROR_MSG.NO_IMAGE_FOUND,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: ERROR_MSG.SOME_THING_WENT_WRONG,
    };
  }
};

export const getIdentifyResultByPromtImage = async (
  aiKey: string,
  prompt: string,
  imgBase64: string,
) => {
  try {
    const genAi = new GoogleGenerativeAI(aiKey);
    const model = genAi.getGenerativeModel({model: AI_MODEL});
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imgBase64,
          mimeType: 'image/jpeg',
        },
      },
    ]);
    const resolvedData = resolveResponseFromAi(result.response.text());
    console.log('Scan result: ' + result.response.text());
    if (resolvedData.name == 'null' || null)
      return {isSuccess: false, message: ERROR_MSG.BAD_IMAGE};
    return {isSuccess: true, message: ERROR_MSG.SUCCESS, data: resolvedData};
  } catch (error) {
    console.log('error in getIdentifyResultByPromtImage: ', error);
    return {
      isSuccess: false,
      message: ERROR_MSG.AI_SERVER_DOWN,
    };
  }
};

export const getDiagnoseResultByImageFile = async (
  aiKey: string,
  prompt: string,
  imgBase64: string,
) => {
  try {
    const genAi = new GoogleGenerativeAI(aiKey);
    const model = genAi.getGenerativeModel({model: AI_MODEL});
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imgBase64,
          mimeType: 'image/jpeg',
        },
      },
    ]);
    const resolvedData = resolveResponseFromAi(result.response.text());
    console.log('Diagnose result: ' + result.response.text());
    if (!resolvedData.isPlantImage)
      return {isSuccess: false, message: ERROR_MSG.BAD_IMAGE};

    if (resolvedData.isPlantImage && resolvedData.isHealthy)
      return {isSuccess: true, message: ERROR_MSG.HEALTHY_PLANT};
    
    if (resolvedData.name == 'null' || null)
      return {isSuccess: false, message: ERROR_MSG.BAD_IMAGE};

    return {isSuccess: true, message: ERROR_MSG.SUCCESS, data: resolvedData};
  } catch (error) {
    console.log('error in getIdentifyResultByPromtImage: ', error);
    return {
      isSuccess: false,
      message: ERROR_MSG.AI_SERVER_DOWN,
    };
  }
};

export const saveDataToStoSuccess = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    // Error saving data
    console.error('Failed to save trial chat time to AsyncStorage', error);
    return false;
  }
};

export const showNotification = (
  title: string,
  content: string,
  type: t_AlertType,
  duration?: 5000,
) => {
  Notifier.showNotification({
    title: title,
    duration: duration,
    description: content,
    Component: NotifierComponents.Alert,
    componentProps: {
      alertType: type,
    },
  });
};
