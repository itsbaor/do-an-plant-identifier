import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {useAppTheme} from '~/resources/theme';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import IconBlink from '~/resources/icons/bottom-tabs/home/IconBlink';
import SearchBar from '~/components/SearchBar';
import {ScrollView} from 'react-native-gesture-handler';
import IconIdentify from '~/resources/icons/bottom-tabs/home/IconIdentify';
import IconDiagnose from '~/resources/icons/bottom-tabs/IconDiagnose';
import HomeFunctionComponent from '~/components/home/HomeFunctionComponent';
import CareToolComponent from '~/components/home/CareToolComponent';
import {categoryData, e_CategoryLabel} from '~/data/categoryData';
import firestore from '@react-native-firebase/firestore';
import {plantData} from '~/data/plantData';
import {
  t_PlantDetail,
  t_PlantDetailBaseInfo,
  t_PlantType,
} from '~/@types/plant';
import CategoryResultComponent from '~/components/home/CategoryResultComponent';
import {getPromtDetailPlant} from '~/resources/prompts';
import {GoogleGenerativeAI} from '@google/generative-ai';
import Config from 'react-native-config';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {useModal} from 'react-native-modalfy';
import {resolveResponseFromAi} from '~/utils';
import {e_CamFunc} from '../ScanScreen';
import {useInterstitialAd, TestIds} from 'react-native-google-mobile-ads';
import {stateAdsRemote} from '~/redux/slices/adsRemoteSlice';
import {setStateAdsOpen} from '~/redux/slices/adsOpenSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KEY_PLANT_LIST} from '../garden/top-tabs/MyGarden';
import {
  setStatePlantStorage,
  statePlantStorage,
} from '~/redux/slices/plantStorageSlice';
import {KEY_REMINDER_LIST} from '../garden/top-tabs/Reminder';
import {setStateReminderStorage} from '~/redux/slices/reminderStorageSlice';
import {findSmallestKeyValue, incrementMapValue} from '~/screens/SplashScreen';
import {setStateKeyAi, stateKeyAi} from '~/redux/slices/keyAiSlice';
import NativeItemHome from '~/components/ads/NativeItemHome';
import {t_Lang} from '~/@types/language';
import {stateLang} from '~/redux/slices/langSlices';

export const GENAI = new GoogleGenerativeAI(Config.API_KEY_GENAI);
export const AI_MODEL = Config.AI_MODEL;
export const docGenAi = 'keyGenAi';
export const docGenImage = 'keySearchImage';

export const getDetailPlant = async (
  plant: t_PlantDetailBaseInfo,
  genAiKey: string,
  lang: t_Lang,
) => {
  try {
    const genAi = new GoogleGenerativeAI(genAiKey);
    const model = genAi.getGenerativeModel({model: AI_MODEL});
    incrementMapValue(docGenAi, genAiKey);
    const result = await model.generateContent([
      getPromtDetailPlant(lang),
      plant.name,
    ]);
    // Modified result from AI
    const plantDetailByAi = resolveResponseFromAi(result.response.text());
    const detailResult: t_PlantDetail = {
      name: plant.name || 'None',
      image: plant.image,
      lifeSpan: plant.lifeSpan || 'None',
      family: plantDetailByAi.family || 'None',
      origin: plantDetailByAi.origin || ['None'],
      description: plantDetailByAi.description || 'None',
      commonName: plant.commonName || 'None',
      type: plantDetailByAi.type || 'None',
      flower: plantDetailByAi.flower,
      branches: plantDetailByAi.branches,
      twigs: plantDetailByAi.twigs,
      leafs: plantDetailByAi.leafs,
      propagation: plantDetailByAi.propagation || ['None'],
      watering: plantDetailByAi.watering || ['None'],
      sunlight: plantDetailByAi.sunlight || ['None'],
      height: plantDetailByAi.height || 'None',
    };
    return detailResult;
  } catch (error) {
    console.error('Dev defined error get plant detail: ', error);
    return null;
  }
};

const HomeScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'BottomTabNavigation'>>();
  const g_plantStorage = useAppSelector(statePlantStorage);
  const g_aiKey = useAppSelector(stateKeyAi);
  const g_lang = useAppSelector(stateLang);
  const adsRemote = useAppSelector(stateAdsRemote);
  const theme = useAppTheme();
  const [searchText, setSearchText] = useState<string>();
  const [selectedPlantCal, setSelectedPlantCal] = useState<string>('');
  const [waitNativeAds, setWaitNativeAds] = useState<boolean>(
    adsRemote.NATIVE_ITEM_HOME.isOn,
  );
  const {openModal, closeModals} = useModal();
  const [homePlantList, setHomePlantList] = useState<t_PlantType[]>(
    plantData.slice(0, 9),
  );
  const [categorySelectedLabel, setCategorySelectedLabel] =
    useState<e_CategoryLabel>(e_CategoryLabel.ALL);
  const ID_ADS_LIGHT_METER = __DEV__
    ? TestIds.INTERSTITIAL
    : adsRemote.INTER_LIGHT_METER.id;

  const ID_ADS_CACULATOR = __DEV__
    ? TestIds.INTERSTITIAL
    : adsRemote.INTER_WATER_CACULATOR.id;
  const ID_ADS_ITEM = __DEV__ ? undefined : adsRemote.NATIVE_ITEM_HOME.id;
  const adsLightMeter = useInterstitialAd(ID_ADS_LIGHT_METER);
  const adsCaculator = useInterstitialAd(ID_ADS_CACULATOR);
  const homeTrans = [
    t('All'),
    t('Outdoor'),
    t('Indoor'),
    t('Medicinal'),
    t('Rare'),
    t('Fruits'),
    t('Flowers'),
    t('Poisonous'),
    t('Edible'),
    t('Good Morning'),
    t('Good Afternoon'),
    t('Good Evening'),
  ];

  const timeOfDay = useCallback(() => {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 5 && hours < 12) return 'Morning';
    if (hours >= 12 && hours < 17) return 'Afternoon';
    return 'Evening';
  }, []);

  const handleOpenIdentCam = () => {
    navigation.navigate('ScanScreen', {type: e_CamFunc.IDENTIFY});
    closeModals('AddPlantModal');
  };
  const handleOpenSearch = () => {
    navigation.navigate('SearchScreen', {searchValue: undefined});
    closeModals('AddPlantModal');
  };

  const handleOpenAddPlantModal = () => {
    closeModals('ChoosePlantModal', () =>
      openModal('AddPlantModal', {
        openIdentCam: handleOpenIdentCam,
        openSearch: handleOpenSearch,
      }),
    );
  };

  const openChoosePlantModal = async () => {
    const plantList = await getPlantInStorage();
    openModal('ChoosePlantModal', {
      openModalAddPlant: handleOpenAddPlantModal,
      plantList: plantList,
      navigateCaculator: handleNavigateCaculationScreen,
    });
  };

  const navigateToLightMeterScreen = () => {
    if (adsRemote.INTER_LIGHT_METER.isOn) {
      openModal('LoadingModal', {
        message: t('Loading ads...'),
      });
      adsLightMeter.load();
    } else {
      navigation.navigate('LightMeterScreen');
    }
  };

  const navigateToReminderScreen = () => {
    navigation.navigate('BottomTabNavigation', {
      screen: 'GardenScreen',
      params: {screen: 'Reminder'},
    });
  };

  const navigateDetailPlant = async (plant: t_PlantType) => {
    openModal('LoadingModal', {
      message: t('Loading...'),
    });
    const plantDetail = await getDetailPlant(
      {
        name: plant.name,
        commonName: plant.treeLike,
        image: plant.image,
        lifeSpan: plant.type,
        watering: plant.waterlevel,
        sunlight: plant.sunlevel,
      },
      g_aiKey,
      g_lang,
    );
    plantDetail
      ? navigation.navigate('PlantDetailScreen', plantDetail)
      : Notifier.showNotification({
          title: 'Oopss!',
          description: t('Something went wrong! Please try again later.'),
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: 'error',
          },
        });
    closeModals('LoadingModal');
  };

  const getPlantInStorage = async () => {
    const plantData = await AsyncStorage.getItem(KEY_PLANT_LIST);
    if (plantData) {
      dispatch(setStatePlantStorage(JSON.parse(plantData)));
      return JSON.parse(plantData);
    } else {
      dispatch(setStatePlantStorage([]));
      return [];
    }
  };

  const getReminderInStorage = async () => {
    const reminderData = await AsyncStorage.getItem(KEY_REMINDER_LIST);
    if (reminderData) {
      dispatch(setStateReminderStorage(JSON.parse(reminderData)));
    } else {
      dispatch(setStatePlantStorage([]));
    }
  };

  const handleSearch = () => {
    searchText?.trim() &&
      navigation.navigate('SearchScreen', {
        searchValue: searchText,
      });
    setSearchText('');
  };

  const handleNavigateCaculationScreen = (plantName: string) => {
    setSelectedPlantCal(plantName);
    closeModals('ChoosePlantModal', () => {
      if (adsRemote.INTER_WATER_CACULATOR.isOn) {
        openModal('LoadingModal', {
          message: t('Loading ads...'),
        });
        adsCaculator.load();
      } else {
        navigation.navigate('WaterCaculatorScreen', {plantName});
      }
    });
  };

  useEffect(() => {
    if (adsRemote.INTER_LIGHT_METER.isOn && adsLightMeter.isLoaded) {
      dispatch(setStateAdsOpen(false));
      closeModals('LoadingModal');
      adsLightMeter.show();
      navigation.navigate('LightMeterScreen');
    }
  }, [adsLightMeter.isLoaded]);

  useEffect(() => {
    if (adsRemote.INTER_LIGHT_METER.isOn && adsLightMeter.error) {
      closeModals('LoadingModal');
      navigation.navigate('LightMeterScreen');
    }
  }, [adsLightMeter.error]);

  //Load inter water caculator ads
  useEffect(() => {
    if (adsRemote.INTER_WATER_CACULATOR.isOn && adsCaculator.isLoaded) {
      dispatch(setStateAdsOpen(false));
      closeModals('LoadingModal');
      adsCaculator.show();
      navigation.navigate('WaterCaculatorScreen', {
        plantName: selectedPlantCal,
      });
    }
  }, [adsCaculator.isLoaded]);

  useEffect(() => {
    if (adsRemote.INTER_WATER_CACULATOR.isOn && adsCaculator.error) {
      closeModals('LoadingModal');
      navigation.navigate('WaterCaculatorScreen', {
        plantName: selectedPlantCal,
      });
    }
  }, [adsCaculator.error]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('PlantIdent')
      .doc('keyGenAi') // Replace with your document ID
      .onSnapshot(
        documentSnapshot => {
          if (documentSnapshot.exists) {
            const key = findSmallestKeyValue(documentSnapshot.data());
            dispatch(setStateKeyAi(key));
          }
        },
        error => {
          console.error('Error fetching real-time updates:', error);
        },
      );

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (categorySelectedLabel === 'All') {
      const startIndex = Math.floor(Math.random() * (plantData.length - 8));
      setHomePlantList([...plantData.slice(startIndex, startIndex + 9)]);
    } else {
      const filteredPlants = plantData.filter(item =>
        item.category?.includes(categorySelectedLabel),
      );
      const startIndex = Math.floor(
        Math.random() * (filteredPlants.length - 8),
      );
      setHomePlantList([...filteredPlants.slice(startIndex, startIndex + 9)]);
    }
  }, [categorySelectedLabel]);

  useFocusEffect(
    React.useCallback(() => {
      getPlantInStorage();
      getReminderInStorage();
      return () => {};
    }, []),
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      {/* Header */}
      <View style={[styles.headerContainer]}>
        <Text
          style={[
            styles.headerGreetingText,
            {color: theme.colors.primary_dark},
          ]}>
          {t(`Good ${timeOfDay()}`)}!
        </Text>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: theme.colors.primary}]}
          onPress={() => {
            navigation.push('PremiumScreen', {appStart: false});
          }}>
          <IconBlink />
          <Text
            style={[styles.buttonText, {color: theme.colors.text_white}]}
            numberOfLines={1}>
            {t('Premium')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.ph_20,
          {height: 45, marginVertical: 15, marginBottom: 10},
        ]}>
        <SearchBar
          stateText={searchText}
          setStateText={setSearchText}
          placeholder={t('Search plants')}
          handleSearch={handleSearch}
        />
      </View>

      {/* Content */}
      <ScrollView style={[styles.ph_20, {}]}>
        {/* Check your plant title */}
        <View style={[{marginBottom: 10}]}>
          <Text
            style={[
              styles.headerGreetingText,
              {color: theme.colors.primary_dark},
            ]}>
            {t('Check your plant')}
          </Text>
        </View>
        {/* Plant Scan functions */}
        <View style={[{flexDirection: 'row', gap: 15}]}>
          {/* Identify */}
          <View
            style={[
              styles.scanContainer,
              {
                borderColor: theme.colors.border_green_opacity,
              },
            ]}>
            <ImageBackground
              source={require('~/resources/images/home/treeIdentify.png')}
              resizeMode="cover"
              style={{width: '100%', height: '100%'}}>
              <View style={[styles.imageBgContainer]}>
                <TouchableOpacity
                  style={[
                    styles.scanBtn,
                    {
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  onPress={() => {
                    navigation.navigate('ScanScreen', {
                      type: e_CamFunc.IDENTIFY,
                    });
                  }}>
                  <IconIdentify />
                  <Text style={{color: theme.colors.text_white, fontSize: 15}}>
                    {t('Identify')}
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
          {/* Diagnose */}
          <View
            style={[
              styles.scanContainer,
              {
                borderColor: theme.colors.border_green_opacity,
              },
            ]}>
            <ImageBackground
              source={require('~/resources/images/home/treeDiagnose.png')}
              resizeMode="cover"
              style={{width: '100%', height: '100%'}}>
              <View style={[styles.imageBgContainer]}>
                <TouchableOpacity
                  style={[
                    styles.scanBtn,
                    {
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  onPress={() => {
                    navigation.navigate('ScanScreen', {
                      type: e_CamFunc.DIAGNOSE,
                    });
                  }}>
                  <IconDiagnose colors={theme.colors.bg_white} />
                  <Text style={{color: theme.colors.text_white, fontSize: 15}}>
                    {t('Diagnose')}
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </View>
        {/* AI banner */}
        <View>
          <HomeFunctionComponent
            title={t('Ask AI Plant Expert')}
            onPress={() => {
              navigation.navigate('AiChatScreen');
            }}
            content={
              t(
                'Our AI Plant Expert are ready to help with your problems',
              ) as string
            }
            buttonTitle={t('Start Chat')}
            image={require('~/resources/images/home/aiDoctor.png')}
            bgImage={require('~/resources/images/home/homeAiBg.png')}
          />
        </View>
        {/* Care Tools */}
        <View>
          <Text
            style={[
              styles.headerGreetingText,
              {marginVertical: 15, color: theme.colors.primary_dark},
            ]}>
            {t('Care Tools')}
          </Text>
        </View>
        <View style={[styles.toolContainer, {}]}>
          <CareToolComponent
            title={t('Water Caculator')}
            image={require('~/resources/animations/icon_calculator.json')}
            onPress={openChoosePlantModal}
          />
          {Platform.OS === 'android' && (
            <CareToolComponent
              title={t('Light Meter')}
              image={require('~/resources/animations/icon_sun.json')}
              onPress={navigateToLightMeterScreen}
            />
          )}

          <CareToolComponent
            title={t('Reminder')}
            image={require('~/resources/animations/icon_reminder.json')}
            onPress={navigateToReminderScreen}
          />
        </View>
        {/* Plant Category */}
        <View>
          <Text
            style={[
              styles.headerGreetingText,
              {marginVertical: 15, color: theme.colors.primary_dark},
            ]}>
            {t('Plant Category')}
          </Text>
        </View>
        <View style={[{flexDirection: 'row', flexWrap: 'wrap', gap: 8}]}>
          {categoryData.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryTitleButton,
                {borderColor: theme.colors.primary},
                categorySelectedLabel == category.label && {
                  backgroundColor: theme.colors.primary,
                },
              ]}
              onPress={() => {
                setCategorySelectedLabel(category.label);
              }}>
              <Text
                style={[
                  styles.categoryTitleText,
                  categorySelectedLabel == category.label && {
                    color: '#FFFFFF',
                  },
                ]}>
                {t(category.label)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView style={[{marginTop: 24}]} horizontal={true}>
          {homePlantList.map((plant, index) =>
            (index + 1) % 4 == 0 ? (
              adsRemote.NATIVE_ITEM_HOME.isOn && (
                <NativeItemHome
                  key={index}
                  adId={ID_ADS_ITEM}
                  setWaitAds={setWaitNativeAds}
                />
              )
            ) : (
              <CategoryResultComponent
                key={index}
                label={plant.category}
                name={t(plant.name)}
                image={plant.image}
                onPress={() => navigateDetailPlant(plant)}
              />
            ),
          )}
        </ScrollView>
        {/* Last block */}
        <View style={{height: 40}}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerGreetingText: {
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '700',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    width: 105,
    borderRadius: 5,
    gap: 5,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    width: '50%',
  },
  ph_20: {
    paddingHorizontal: 20,
  },
  scanContainer: {
    aspectRatio: 1,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
  },
  imageBgContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  scanBtn: {
    width: '100%',
    height: '22%',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  toolContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  categoryTitleButton: {
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 12,
    // marginRight: 6,
  },
  categoryTitleText: {
    fontSize: 15,
    lineHeight: 25,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.45)',
  },
});
