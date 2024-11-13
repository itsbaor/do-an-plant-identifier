import {
  ImageBackground,
  ImageSourcePropType,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {useAppTheme} from '~/resources/theme';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import Config from 'react-native-config';
import {stateAdsRemote} from '~/redux/slices/adsRemoteSlice';
import IconBack from '~/resources/icons/IconBack';
import HeaderWithBack from '~/components/HeaderWithBack';
import NativeBannerSmall from '~/components/ads/NativeBannerSmall';
import SearchBar from '~/components/SearchBar';
import {categoryData, e_CategoryLabel} from '~/data/categoryData';
import {plantData} from '~/data/plantData';
import {t_PlantType} from '~/@types/plant';
import {useModal} from 'react-native-modalfy';
import FilterTag from '~/components/search/FilterTag';
import NoDataFoundComponent from '~/components/NoDataFoundComponent';
import {
  stateCategory,
  setStateCategoryChecklist,
  setUpdateCategoryChecklist,
  setStateCategorySun,
  setStateCategoryCycle,
  setStateCategoryGrowth,
  setStateCategoryWatering,
  setResetStateCategory,
} from '~/redux/slices/categorySlice';
import {CATEGORY, CYCLE, GROWTH, SUN, WATERING} from '~/@types/category';
import PlantItem from '~/components/search/PlantItem';
import {getDetailPlant} from './bottom-tabs/home/HomeScreen';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import IconFilter from '~/resources/icons/IconFilter';
import {addPlantToStorage} from '~/utils/plantStorage';
import i18n from '~/i18n';
import {actionAddPlant} from '~/redux/slices/plantStorageSlice';
import firestore from '@react-native-firebase/firestore';
import {findSmallestKeyValue} from './SplashScreen';
import {setStateKeyAi, stateKeyAi} from '~/redux/slices/keyAiSlice';
import NativeItemSearch from '~/components/ads/NativeItemSearch';
import {stateLang} from '~/redux/slices/langSlices';

export const handleAddPlantToGarden = async (plant: t_PlantType) => {
  const res = await addPlantToStorage(plant);
  if (res.success) {
    Notifier.showNotification({
      title: i18n.t('Success'),
      description: i18n.t('Add Plant to garden successfully.'),
      Component: NotifierComponents.Alert,
      componentProps: {
        alertType: 'success',
      },
    });
  } else {
    Notifier.showNotification({
      title: i18n.t('Duplicate'),
      description: i18n.t('Plant already exists in your garden!'),
      Component: NotifierComponents.Alert,
      componentProps: {
        alertType: 'error',
      },
    });
  }
};

const SearchScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const adsRemote = useAppSelector(stateAdsRemote);
  const g_Category = useAppSelector(stateCategory);
  const g_aiKey = useAppSelector(stateKeyAi);
  const g_lang = useAppSelector(stateLang);
  const {openModal, closeModals} = useModal();
  const [searchPlantList, setSearchPlantList] = useState<t_PlantType[]>([]);
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'SearchScreen'>>();
  const route = useRoute<RouteProp<RootParamList, 'SearchScreen'>>();
  const [searchText, setSearchText] = useState<string | undefined>(
    route.params.searchValue,
  );
  const [waitingAds, setWaitingAds] = useState<boolean>(
    adsRemote.NATIVE_SEARCH.isOn,
  );
  const theme = useAppTheme();
  const ID_ADS = __DEV__ ? undefined : adsRemote.NATIVE_SEARCH.id;

  const handleGoToDetail = async (plant: t_PlantType) => {
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
          description: t(
            'Something went wrong when get detail! Please try again later.',
          ),
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: 'error',
          },
        });
    closeModals('LoadingModal');
  };

  const handleRemoveSun = () => {
    dispatch(setStateCategorySun(SUN.NONE));
  };

  const handleRemoveCycle = () => {
    dispatch(setStateCategoryCycle(CYCLE.NONE));
  };

  const handleRemoveGrowth = () => {
    dispatch(setStateCategoryGrowth(GROWTH.NONE));
  };

  const handleRemoveWatering = () => {
    dispatch(setStateCategoryWatering(WATERING.NONE));
  };

  const handleUpdateCategory = (field: e_CategoryLabel, value: boolean) => {
    dispatch(setUpdateCategoryChecklist({field, value}));
  };

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
    return () => {
      dispatch(setResetStateCategory());
    };
  }, []);

  useEffect(() => {
    waitingAds &&
      openModal('LoadingModal', {
        message: t('Loading data...'),
      });
    !waitingAds && closeModals('LoadingModal');
  }, [waitingAds]);

  useEffect(() => {
    let searchPlantTmp = plantData;
    if (searchText?.trim()) {
      searchPlantTmp = plantData.filter(plant =>
        plant.name.toLowerCase().includes(searchText.trim().toLowerCase()),
      );
    }
    //Search by category
    if (g_Category.categoryChecklist.some(ele => ele.isChecked)) {
      const filterCategory: string[] = g_Category.categoryChecklist
        .filter(item => item.isChecked)
        .map(item => item.category);
      searchPlantTmp = searchPlantTmp.filter(plant =>
        plant.category?.some(item => filterCategory.includes(item)),
      );
    }
    //Sun
    if (g_Category.sun != SUN.NONE) {
      searchPlantTmp = searchPlantTmp.filter(
        plant => plant.sunlevel == g_Category.sun,
      );
    }
    //Watering
    if (g_Category.watering != WATERING.NONE) {
      searchPlantTmp = searchPlantTmp.filter(
        plant => plant.waterlevel == g_Category.watering,
      );
    }
    //Growth
    if (g_Category.growth != GROWTH.NONE) {
      searchPlantTmp = searchPlantTmp.filter(
        plant => plant.growth == g_Category.growth,
      );
    }
    //Cycle
    if (g_Category.cycle != CYCLE.NONE) {
      searchPlantTmp = searchPlantTmp.filter(
        plant => plant.type == g_Category.cycle,
      );
    }
    setSearchPlantList(
      searchPlantTmp.length <= 12
        ? [...searchPlantTmp]
        : [...searchPlantTmp.slice(0, 12)],
    );
  }, [g_Category, searchText]);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      <HeaderWithBack
        title={t('Search')}
        waitingAds={waitingAds}
        handleGoBack={() => navigation.goBack()}
      />
      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
        }}>
        <View style={{flex: 1}}>
          <SearchBar
            stateText={searchText}
            setStateText={setSearchText}
            placeholder={t('Search plants')}
            handleSearch={() => {}}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('FilterScreen')}>
          <IconFilter />
        </TouchableOpacity>
      </View>
      <View
        style={{flex: 1, marginVertical: 15, gap: 10, paddingHorizontal: 20}}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: theme.colors.primary_dark,
          }}>
          {t('Plant Category')}
        </Text>
        {/* Filter Tag area */}
        {(g_Category.categoryChecklist.some(ele => ele.isChecked) ||
          g_Category.cycle != CYCLE.NONE ||
          g_Category.watering != WATERING.NONE ||
          g_Category.growth != GROWTH.NONE ||
          g_Category.sun != SUN.NONE) && (
          <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 5}}>
            {g_Category.categoryChecklist.map(
              (item, index) =>
                item.isChecked && (
                  <FilterTag
                    key={index}
                    label={item.category}
                    onRemove={() => {
                      handleUpdateCategory(item.category, false);
                    }}
                  />
                ),
            )}
            {g_Category.sun !== SUN.NONE && (
              <FilterTag label={g_Category.sun} onRemove={handleRemoveSun} />
            )}
            {g_Category.cycle !== CYCLE.NONE && (
              <FilterTag
                label={g_Category.cycle}
                onRemove={handleRemoveCycle}
              />
            )}
            {g_Category.growth !== GROWTH.NONE && (
              <FilterTag
                label={g_Category.growth}
                onRemove={handleRemoveGrowth}
              />
            )}
            {g_Category.watering !== WATERING.NONE && (
              <FilterTag
                label={g_Category.watering}
                onRemove={handleRemoveWatering}
              />
            )}
          </View>
        )}
        <View style={{flex: 1}}>
          {searchText?.trim() ||
          g_Category.categoryChecklist.some(ele => ele.isChecked) ||
          g_Category.cycle != CYCLE.NONE ||
          g_Category.watering != WATERING.NONE ||
          g_Category.growth != GROWTH.NONE ||
          g_Category.sun != SUN.NONE ? (
            // View if searchText is not empty
            searchPlantList.length ? (
              <ScrollView style={{}}>
                <View style={styles.plantListContainer}>
                  {searchPlantList.slice(0, 12).map((plant, index) => (
                    <PlantItem
                      key={index}
                      plant={plant}
                      handleOpenDetails={() => handleGoToDetail(plant)}
                      handleAddPlantToGarden={() => {
                        handleAddPlantToGarden(plant);
                        dispatch(actionAddPlant(plant));
                      }}></PlantItem>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <NoDataFoundComponent />
            )
          ) : (
            // View if searchText = ''
            <ScrollView>
              <View style={[styles.categoryListContainer]}>
                {categoryData
                  .slice(1, categoryData.length - 1)
                  .map((item, index) => (
                    <View
                      key={index}
                      style={[
                        styles.categoryItemContainer,
                        index % 2 == 0
                          ? styles.categoryItemContainerLeft
                          : styles.categoryItemContainerRight,
                      ]}>
                      <TouchableOpacity
                        style={[styles.categoryItem, {}]}
                        onPress={() => handleUpdateCategory(item.label, true)}>
                        <ImageBackground
                          style={{height: '100%'}}
                          source={item.image as unknown as ImageSourcePropType}
                          resizeMode="cover">
                          <Text
                            style={[
                              {
                                fontSize: 18,
                                lineHeight: 22,
                                color: 'rgba(0, 0, 0, 0.55)',
                                marginLeft: '7%',
                                marginTop: '65%',
                              },
                            ]}>
                            {t(item.label)}
                          </Text>
                        </ImageBackground>
                      </TouchableOpacity>
                    </View>
                  ))}
                {adsRemote.NATIVE_SEARCH.isOn && (
                  <View
                    style={[
                      styles.categoryItemContainer,
                      styles.categoryItemContainerRight,
                    ]}>
                    <NativeItemSearch adId={ID_ADS} />
                  </View>
                )}
                <View
                  style={[
                    styles.categoryItemContainer,
                    adsRemote.NATIVE_SEARCH.isOn
                      ? styles.categoryItemContainerLeft
                      : styles.categoryItemContainerRight,
                  ]}>
                  <TouchableOpacity
                    style={[styles.categoryItem, {}]}
                    onPress={() =>
                      handleUpdateCategory(
                        categoryData[categoryData.length - 1].label,
                        true,
                      )
                    }>
                    <ImageBackground
                      style={{height: '100%'}}
                      source={
                        categoryData[categoryData.length - 1]
                          .image as unknown as ImageSourcePropType
                      }
                      resizeMode="cover">
                      <Text
                        style={[
                          {
                            fontSize: 18,
                            lineHeight: 22,
                            color: 'rgba(0, 0, 0, 0.55)',
                            marginLeft: '7%',
                            marginTop: '65%',
                          },
                        ]}>
                        {t(categoryData[categoryData.length - 1].label)}
                      </Text>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
      {adsRemote.NATIVE_SEARCH.isOn && (
        <NativeBannerSmall adId={ID_ADS} setWaitAds={setWaitingAds} />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '700',
    alignSelf: 'center',
  },
  ph_20: {
    paddingHorizontal: 20,
  },
  categoryListContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryItemContainer: {
    width: '50%',
    aspectRatio: 188 / 160,
    marginBottom: 12,
  },
  categoryItemContainerLeft: {
    paddingRight: 8,
  },
  categoryItemContainerRight: {
    paddingLeft: 8,
  },
  categoryItem: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(75, 109, 78, 0.3)',
  },
  plantListContainer: {
    marginVertical: 10,
    alignItems: 'center',
    gap: 12,
  },
});
