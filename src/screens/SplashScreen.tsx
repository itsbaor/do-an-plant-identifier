import {Image, Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import {useAppTheme} from '~/resources/theme';
import {
  TestIds,
  useInterstitialAd,
  BannerAd,
  BannerAdSize,
  AdsConsentDebugGeography,
} from 'react-native-google-mobile-ads';
import Config from 'react-native-config';
import * as Progress from 'react-native-progress';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import {KEY_LANG} from './LanguageScreen';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {setStateLang} from '~/redux/slices/langSlices';
import {
  setStateAdsRemote,
  stateAdsRemote,
  t_AdsRemote,
  t_AdsRemoteState,
} from '~/redux/slices/adsRemoteSlice';
import {setStateAdsOpen, stateAdsOpen} from '~/redux/slices/adsOpenSlice';
import i18n from '~/i18n';
import remoteConfig from '@react-native-firebase/remote-config';
import {AdsConsent, AdsConsentStatus} from 'react-native-google-mobile-ads';
import Lottie from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {t_Lang} from '~/@types/language';
import {itemIdAndroid} from './premium/PremiumScreen';
import {getAvailablePurchases, initConnection} from 'react-native-iap';
import {setStatePremium} from '~/redux/slices/premiumSlice';
import {statePremium} from '~/redux/slices/premiumSlice';
import {DEFAULT_ADS_STATE} from '~/data/dataAdsDefault';
import {CHAT, t_Chat} from '~/@types/chat';
import {CHAT_KEY, setStateChat} from '~/redux/slices/chatDataSlice';

const REMOTE_PREFIX_ADS = 'ads';

const SEPERATOR = '_';

const A_PLATFORM = 'a';
const I_PLATFORM = 'i';

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

const ID_INTER_SPLASH = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === 'android'
  ? Config.ANDROID_INTER_SPLASH
  : Config.IOS_INTER_ADD_PLANT;

const ID_BANNER_SPLASH = __DEV__
  ? TestIds.BANNER
  : Platform.OS === 'android'
  ? Config.ANDROID_BANNER_SPLASH
  : Config.IOS_BANNER_SPLASH;

const SplashScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const isPre = useAppSelector(statePremium);
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);
  const theme = useAppTheme();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'SplashScreen'>>();
  const adsRemote = useAppSelector(stateAdsRemote);
  const timeLoadingSplash = setTimeout(() => {
    setIsTimeOut(true);
  }, 8000);

  const interSplash = useInterstitialAd(ID_INTER_SPLASH);
  const [waitingAds, setWaitingAds] = useState<boolean>(true);
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

  const checkConsent = async (): Promise<boolean> => {
    const consentInfo = await AdsConsent.requestInfoUpdate();
    //Return true if non EU registration
    if (!consentInfo.isConsentFormAvailable) return true;

    // Check if user requires consent
    if (consentInfo.status === AdsConsentStatus.OBTAINED) return true;
    if (
      consentInfo.status === AdsConsentStatus.UNKNOWN ||
      consentInfo.status === AdsConsentStatus.REQUIRED
    ) {
      // Show a Google-rendered form
      const formResult = await AdsConsent.showForm();
      if (formResult.status === AdsConsentStatus.OBTAINED) return true;
    }
    return false;
  };

  const loadScreen = async (isSub = false) => {
    try {
      const lng = await AsyncStorage.getItem(KEY_LANG);
      if (lng) {
        //Da chay tren 1 lan
        i18n.changeLanguage(lng);
        dispatch(setStateLang(lng as t_Lang));
        isSub &&
          navigation.navigate('BottomTabNavigation', {screen: 'HomeScreen'});
        !isSub && navigation.navigate('PremiumScreen', {appStart: true});
      } else {
        //Chay lan dau
        navigation.navigate('LanguageScreen');
      }
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
    if (!waitingAds) {
      adsRemote.INTER_SPLASH?.isOn && interSplash.load();
      if (!adsRemote.INTER_SPLASH?.isOn) {
        clearTimeout(timeLoadingSplash);
        loadScreen();
      }
    }
  }, [waitingAds, interSplash.load]);

  useEffect(() => {
    if (interSplash.isLoaded) {
      clearTimeout(timeLoadingSplash);
      dispatch(setStateAdsOpen(false));
      interSplash.show();
      loadScreen();
    }
  }, [interSplash.isLoaded]);

  useEffect(() => {
    isTimeOut && loadScreen();
  }, [isTimeOut]);

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

  /** Fetch data from firebase Store */
  useEffect(() => {
    const loadApp = async () => {
      console.log('Loading app...');
      try {
        const hasPreSub = await hasPremiumSub();
        const isConsent = await checkConsent();
        console.log('Premium account: ' + hasPreSub);
        hasPreSub && dispatch(setStatePremium(true));
        remoteConfig()
          .setDefaults(DEFAULT_ADS_STATE)
          .then(() => {
            console.log('Default values set.');
          })
          .then(() => remoteConfig().fetchAndActivate())
          .then(() => {
            const values = remoteConfig().getAll();
            const tmpRemote: t_AdsRemoteState = {
              BANNER_HOME: {isOn: false, id: ''},
              BANNER_SPLASH: {isOn: false, id: ''},
              INTER_ADD_PLANT: {isOn: false, id: ''},
              INTER_DIAGNOSE: {isOn: false, id: ''},
              INTER_IDENTIFY: {isOn: false, id: ''},
              INTER_LIGHT_METER: {isOn: false, id: ''},
              INTER_SCAN: {isOn: false, id: ''},
              INTER_SPLASH: {isOn: false, id: ''},
              INTER_WATER_CACULATOR: {isOn: false, id: ''},
              NATIVE_AI_PLANT_EXPERT: {isOn: false, id: ''},
              NATIVE_CACULATOR: {isOn: false, id: ''},
              NATIVE_COMMON_PROBLEMS: {isOn: false, id: ''},
              NATIVE_LANGUAGE: {isOn: false, id: ''},
              ONBOARDING_FULL: {isOn: false, id: ''},
              NATIVE_ONBOARDING: {isOn: false, id: ''},
              NATIVE_ONBOARDING_2: {isOn: false, id: ''},
              NATIVE_ONBOARDING_3: {isOn: false, id: ''},
              NATIVE_REMINDER: {isOn: false, id: ''},
              NATIVE_SEARCH: {isOn: false, id: ''},
              REWARD_AI_PLANT_EXPERT: {isOn: false, id: ''},
              APP_OPEN: {isOn: false, id: ''},
              //Ads more
              INTER_PROBLEM: {isOn: false, id: ''},
              REWARD_CACULATOR: {isOn: false, id: ''},
              REWARD_REMINDER: {isOn: false, id: ''},
              REWARD_AI_BACK: {isOn: false, id: ''},
              NATIVE_ITEM_HOME: {isOn: false, id: ''},
              NATIVE_ITEM_CACULATOR: {isOn: false, id: ''},
              NATIVE_ITEM_MY_GARDEN: {isOn: false, id: ''},
              NATIVE_ITEM_REMINDER: {isOn: false, id: ''},
              NATIVE_ITEM_PROBLEM: {isOn: false, id: ''},
              NATIVE_ITEM_EXPLORE: {isOn: false, id: ''},
            };
            Object.entries(values).forEach($ => {
              const [key, entry] = $;
              const keySepList = key.split(SEPERATOR);
              const [type, platform] = [keySepList[0], keySepList[1]];
              if (type === REMOTE_PREFIX_ADS) {
                if (Platform.OS === 'android' && platform === A_PLATFORM) {
                  const adsRemote: t_AdsRemote = JSON.parse(entry.asString());
                  //remove the first six characters of key
                  const exactKey = key.slice(6);
                  isConsent && !hasPreSub
                    ? (tmpRemote[exactKey as keyof t_AdsRemoteState] =
                        adsRemote)
                    : (tmpRemote[exactKey as keyof t_AdsRemoteState] = {
                        ...adsRemote,
                        isOn: false,
                      });
                }
                if (Platform.OS === 'ios' && platform === I_PLATFORM) {
                  const adsRemote: t_AdsRemote = JSON.parse(entry.asString());
                  //remove the first six characters of key
                  const exactKey = key.slice(6);
                  hasPreSub && dispatch(setStatePremium(true));
                  isConsent && !hasPreSub
                    ? (tmpRemote[exactKey as keyof t_AdsRemoteState] =
                        adsRemote)
                    : (tmpRemote[exactKey as keyof t_AdsRemoteState] = {
                        ...adsRemote,
                        isOn: false,
                      });
                }
                dispatch(setStateAdsRemote(tmpRemote));
              }
            });
            console.log('tmpRemote.APPOpen?.isOn:', tmpRemote.APP_OPEN?.isOn);
            !tmpRemote.BANNER_SPLASH?.isOn &&
              !tmpRemote.INTER_SPLASH?.isOn &&
              clearTimeout(timeLoadingSplash) &&
              loadScreen(hasPreSub);
            !tmpRemote.BANNER_SPLASH?.isOn &&
              tmpRemote.INTER_SPLASH?.isOn &&
              interSplash.load();
          })
          .catch(() => {
            console.error('Something went wrongs when fetch remote config!');
            clearTimeout(timeLoadingSplash);
            loadScreen();
          });
      } catch (error) {
        console.log('Error:', error);
      }
    };
    loadApp();
  }, [interSplash.load]);

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
        <View style={[styles.itemContainer]}>
          <Progress.Bar
            progress={0.5}
            width={200}
            height={10}
            indeterminate={true}
            color={theme.colors.primary}
            borderRadius={10}
          />
        </View>
        <View style={[styles.itemContainer]}>
          <Text style={{color: theme.colors.primary}}>
            {t('This action may contain ads')}
          </Text>
        </View>
      </View>
      {/** Loading ads */}
      {adsRemote.BANNER_SPLASH?.isOn && (
        <BannerAd
          unitId={ID_BANNER_SPLASH}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          onAdFailedToLoad={() => setWaitingAds(false)}
          onAdLoaded={() => setWaitingAds(false)}
        />
      )}
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
