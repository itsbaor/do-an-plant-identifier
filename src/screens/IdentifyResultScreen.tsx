import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {useAppTheme} from '~/resources/theme';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import {useModal} from 'react-native-modalfy';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {stateAdsRemote} from '~/redux/slices/adsRemoteSlice';
import {statePremium} from '~/redux/slices/premiumSlice';
import Config from 'react-native-config';
import useInAppReview from '~/hooks/useInAppReview';
import IconClose from '~/resources/icons/IconClose';
import {getDetailPlant} from './bottom-tabs/home/HomeScreen';
import {t_PlantType} from '~/@types/plant';
import {handleAddPlantToGarden} from './SearchScreen';
import {CYCLE, SUN, WATERING} from '~/@types/category';
import {actionAddPlant} from '~/redux/slices/plantStorageSlice';
import firestore from '@react-native-firebase/firestore';
import {findSmallestKeyValue} from './SplashScreen';
import {setStateKeyAi, stateKeyAi} from '~/redux/slices/keyAiSlice';
import {setStateAdsOpen} from '~/redux/slices/adsOpenSlice';
import {stateLang} from '~/redux/slices/langSlices';

export type t_PlantFromScan = {
  image: string | null;
  life_span: string;
  name: string;
  other_name: string;
  sunlight: string;
  watering: string;
};

const ID_ADS = __DEV__
  ? undefined
  : Platform.OS === 'android'
  ? Config.ANDROID_NATIVE_SEARCH
  : Config.IOS_NATIVE_SEARCH;

const IdentifyResultScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'IdentifyResultScreen'>>();
  const route = useRoute<RouteProp<RootParamList, 'IdentifyResultScreen'>>();
  const imageScanned = route.params.scannedImage;
  const dataLists: t_PlantFromScan[] = route.params.resultList;
  const {openModal, closeModals} = useModal();
  const adsRemote = useAppSelector(stateAdsRemote);
  const isPre = useAppSelector(statePremium);
  const theme = useAppTheme();
  const {openInAppReview} = useInAppReview();
  const g_aiKey = useAppSelector(stateKeyAi);
  const g_lang = useAppSelector(stateLang);

  const handleAddToDb = (plant: t_PlantFromScan) => {
    const plantType: t_PlantType = {
      name: plant.name,
      image:
        plant.image ?? require('~/resources/images/home/tropicalPlant.png'),
      treeLike: plant.other_name,
      type: plant.life_span as CYCLE,
      waterlevel: plant.watering as WATERING,
      sunlevel: plant.sunlight as SUN,
    };
    handleAddPlantToGarden(plantType);
    dispatch(actionAddPlant(plantType));
    dispatch(setStateAdsOpen(false));
    openInAppReview();
    dispatch(setStateAdsOpen(true));
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

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      <ImageBackground
        source={{uri: imageScanned}}
        resizeMode="cover"
        style={styles.imageBg}>
        <View style={{alignItems: 'flex-end', paddingHorizontal: 20}}>
          <TouchableOpacity
            style={{borderWidth: 1, borderColor: theme.colors.primary_dark}}
            onPress={() => navigation.goBack()}>
            <IconClose color={theme.colors.bg_white} />
          </TouchableOpacity>
        </View>
        <View style={[styles.resultContainer]}>
          {dataLists.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <View style={{width: '40%', aspectRatio: 1}}>
                <Image
                  source={
                    item.image
                      ? {uri: item.image}
                      : require('~/resources/images/home/tropicalPlant.png')
                  }
                  style={{width: '100%', height: '100%', borderRadius: 5}}
                />
              </View>
              <View style={{justifyContent: 'space-between', flex: 1}}>
                <View>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Inter-Regular',
                      fontSize: 18,
                      fontWeight: '700',
                      color: '#000000',
                      lineHeight: 20,
                    }}>
                    {t(item.name)}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      color: '#000000',
                      fontSize: 12,
                      lineHeight: 14,
                      fontFamily: 'Inter-Regular',
                    }}>
                    {t(`Also called `) + item.other_name}
                  </Text>
                  {/* Character */}
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      marginTop: 5,
                      flexWrap: 'wrap',
                    }}>
                    {/* Life Span */}
                    <View style={styles.characterContainer}>
                      <View style={styles.dot}></View>
                      <Text numberOfLines={1} style={styles.textCharacter}>
                        {t(item.life_span)}
                      </Text>
                    </View>
                    {/* Water */}
                    <View style={styles.characterContainer}>
                      <View style={styles.dot}></View>
                      <Text numberOfLines={1} style={styles.textCharacter}>
                        {t(item.watering)}
                      </Text>
                    </View>
                    {/* Sunlight */}
                    <View style={styles.characterContainer}>
                      <View style={styles.dot}></View>
                      <Text numberOfLines={1} style={styles.textCharacter}>
                        {t(item.sunlight)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Button */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={{
                      flex: 0.7,
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      borderWidth: 1,
                      borderColor: 'rgba(75, 109, 78, 1)',
                      borderRadius: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}
                    onPress={() => {
                      const plantDetail: t_PlantType = {
                        name: item.name,
                        treeLike: item.other_name,
                        image:
                          item.image &&
                          require('~/resources/images/home/tropicalPlant.png'),
                        type: item.life_span as CYCLE,
                        waterlevel: item.watering as WATERING,
                        sunlevel: item.sunlight as SUN,
                      };
                      navigateDetailPlant(plantDetail);
                    }}>
                    <Text
                      style={{
                        color: 'rgba(75, 109, 78, 1)',
                        fontFamily: 'Inter-Regular',
                        fontWeight: '600',
                        fontSize: 10,
                      }}>
                      {t('See Detail')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(50, 160, 95, 1)',
                      borderRadius: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}
                    onPress={() => {
                      handleAddToDb(item);
                    }}>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontFamily: 'Inter-Regular',
                        fontWeight: '600',
                        fontSize: 10,
                      }}>
                      {t('Add To My Garden')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default IdentifyResultScreen;

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
  dot: {
    height: 8,
    width: 8,
    borderRadius: 1000,
    backgroundColor: 'rgba(50, 160, 95, 1)',
  },
  textCharacter: {
    fontFamily: 'Inter-Regular',
    fontSize: 9,
    fontWeight: '400',
    color: '#000000',
  },
  characterContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageBg: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  resultContainer: {
    paddingHorizontal: 15,
    gap: 14,
    paddingBottom: 35,
  },
  itemContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    padding: 13,
    width: '100%',
    minHeight: 100,
    gap: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 5,
  },
});
