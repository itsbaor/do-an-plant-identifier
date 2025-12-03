import {Image, Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import {useAppTheme} from '~/resources/theme';
import Config from 'react-native-config';
import * as Progress from 'react-native-progress';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import {KEY_LANG} from './LanguageScreen';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {setStateLang} from '~/redux/slices/langSlices';
import i18n from '~/i18n';
import remoteConfig from '@react-native-firebase/remote-config';
import Lottie from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {t_Lang} from '~/@types/language';
import {itemIdAndroid} from './premium/PremiumScreen';
import {getAvailablePurchases, initConnection} from 'react-native-iap';
import {setStatePremium} from '~/redux/slices/premiumSlice';
import {statePremium} from '~/redux/slices/premiumSlice';
import {CHAT, t_Chat} from '~/@types/chat';
import {CHAT_KEY, setStateChat} from '~/redux/slices/chatDataSlice';

const ONE_WEEK_DURATION = 7 * 24 * 60 * 60 * 1000;
const ONE_YEAR_DURATION = 365 * 24 * 60 * 60 * 1000;

export const findGreatestKeyValue = (obj: any) => {
  let maxKey = Config.API_KEY_PLANTID;
  let maxValue = 0;

  for (const key in obj) {
    if (obj[key] > maxValue) {
      maxValue = obj[key];
      maxKey = key;
    }
  }

  return maxKey;
};

export const findSmallestKeyValue = (obj: any) => {
  let minKey = Config.API_KEY_GENAI;
  let minValue = 10e9;

  for (const key in obj) {
    if (obj[key] < minValue) {
      minValue = obj[key];
      minKey = key;
    }
  }
  return minKey;
};

export const incrementMapValue = async (docId: string, mapKey: string) => {
  try {
    // Reference to the document
    const docRef = firestore().collection('PlantIdent').doc(docId);
    // Fetch the document to get the current value
    const documentSnapshot = await docRef.get();
    if (documentSnapshot.exists) {
      const currentData = documentSnapshot.data();
      // Get the current map value using the mapKey
      const currentValue = currentData?.[mapKey];
      if (typeof currentValue === 'number') {
        // Subtract 1 from the current value
        const updatedValue = currentValue + 1;
        // Update the specific key in the Map using dot notation
        await docRef.update({
          [`${mapKey}`]: updatedValue,
        });
      }
    } else {
      console.log('Document does not exist');
    }
  } catch (error) {
    console.error('Error updating map value:', error);
  }
};

const SplashScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const isPre = useAppSelector(statePremium);
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);
  const theme = useAppTheme();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'SplashScreen'>>();
  const timeLoadingSplash = setTimeout(() => {
    setIsTimeOut(true);
  }, 8000);

  const trans = [
    t('Success'),
    t('No internet connection. Please check your connection and try again.'),
    t(
      'Camera permission denied. Please go to settings and enable camera permission.',
    ),
    t(
      'Gallery permission denied. Please go to settings and enable gallery permission.',
    ),
    t('No camera device found. Please check your camera and try again.'),
    t('Something went wrong. Please try again later!'),
    t('AI server is down. Please try again later!'),
    t('Image cannot be translated. Please try another image!'),
    t('Image convert failed. Please try again later!'),
    t('This plant already exists in garden.'),
    t('Bad image. Please try another image.'),
    t('Your Plant is Healthy and Disease-Free!'),
    t('No image found'),
  ];

  const loadScreen = async (isSub = false) => {
    try {
      navigation.navigate('Login');
    } catch (error) {
      console.error('Dev defined error: ', error);
    }
  };

  const hasPremiumSub = async (): Promise<boolean> => {
    try {
      let isPremium = false;
      Platform.OS === 'android' &&
        (await initConnection().then(async () => {
          const purchases = await getAvailablePurchases();
          for (const purchase of purchases) {
            const currentTime = new Date().getTime();
            const subscriptionTime = purchase.transactionDate;
            if (
              purchase.productId === itemIdAndroid.YEARLY &&
              currentTime - subscriptionTime < ONE_WEEK_DURATION
            ) {
              //Check date for year
              isPremium = true;
              break;
            }
            if (
              purchase.productId === itemIdAndroid.WEEKLY &&
              currentTime - subscriptionTime < ONE_YEAR_DURATION
            ) {
              //Check date for week
              isPremium = true;
              break;
            }
          }
          dispatch(setStatePremium(isPremium));
        }));
      return isPremium;
    } catch (error) {
      console.error('Get current purchase Error', error);
      return false;
    }
  };

  useEffect(() => {
    clearTimeout(timeLoadingSplash);
    loadScreen();
  }, []);

  useEffect(() => {
    //Get chat data with keey CHAT_KEY in AsyncStorage
    const initialStateWithSavedChat = async () => {
      const value = await AsyncStorage.getItem(CHAT_KEY);
      if (value) {
        const chats = JSON.parse(value);
        dispatch(setStateChat(chats));
      }
    };
    initialStateWithSavedChat();
  }, []);

  

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_white}]}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingBottom: 30,
        }}>
        <View
          style={[styles.itemContainer, {flex: 1, justifyContent: 'center'}]}>
          <Lottie
            style={{width: '70%', height: '50%'}}
            source={require('~/resources/animations/leaf_scan.json')}
            autoPlay
            loop
          />
          <Text style={[styles.text, {color: theme.colors.primary}]}>
            {t('Leaf Scan Pro')}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {width: '100%', alignItems: 'center'},
  text: {
    fontSize: 35,
    lineHeight: 40,
    fontWeight: '700',
    marginBottom: 6,
  },
});
