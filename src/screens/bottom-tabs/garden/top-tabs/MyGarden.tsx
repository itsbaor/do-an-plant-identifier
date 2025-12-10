import {
  Image,
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
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useModal} from 'react-native-modalfy';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import {e_CamFunc} from '../../ScanScreen';
import {t_PlantType} from '~/@types/plant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import PlantItem from '~/components/search/PlantItem';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {getDetailPlant} from '../../home/HomeScreen';
import {removePlantFromStorage} from '~/utils/plantStorage';
import IconRemove from '~/resources/icons/garden/IconRemove';
import {
  setStatePlantStorage,
  statePlantStorage,
} from '~/redux/slices/plantStorageSlice';
import firestore from '@react-native-firebase/firestore';
import {findSmallestKeyValue} from '~/screens/SplashScreen';
import {setStateKeyAi, stateKeyAi} from '~/redux/slices/keyAiSlice';
import {stateLang} from '~/redux/slices/langSlices';
import Config from 'react-native-config';

export const KEY_PLANT_LIST = '@plant_list';

const MyGarden = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const g_plantStorage = useAppSelector(statePlantStorage);
  const g_aiKey = useAppSelector(stateKeyAi);
  const g_lang = useAppSelector(stateLang);
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const theme = useAppTheme();
  const {openModal, closeModals} = useModal();
  const [loading, setLoading] = useState(true);

  const handleOpenAddPlantModal = () => {
    openModal('AddPlantModal', {
      openIdentCam: handleOpenIdentCam,
      openSearch: handleOpenSearch,
    });
  };

  const openConfirmModal = (plantName: string) => {
    openModal('RemoveSinglePlantModal', {
      plantName: plantName,
      actionDelete: () => handleRemovePlantFromGarden(plantName),
    });
  };

  const handleRemovePlantFromGarden = async (plantName: string) => {
    closeModals('RemoveSinglePlantModal');
    const removedPlantList = await removePlantFromStorage(plantName);
    dispatch(setStatePlantStorage(removedPlantList));
    Notifier.showNotification({
      title: t('Success'),
      description: t('Remove plant successfully.'),
      Component: NotifierComponents.Alert,
      componentProps: {
        alertType: 'success',
      },
    });
  };

  const handleOpenIdentCam = () => {
    navigation.navigate('ScanScreen', {type: e_CamFunc.IDENTIFY});
    closeModals('AddPlantModal');
  };
  const handleOpenSearch = () => {
    navigation.navigate('SearchScreen', {searchValue: undefined});
    closeModals('AddPlantModal');
  };

  const getPlantInStorage = async () => {
    setLoading(true);
    const plantData = await AsyncStorage.getItem(KEY_PLANT_LIST);
    if (plantData) {
      dispatch(setStatePlantStorage(JSON.parse(plantData)));
    } else {
      dispatch(setStatePlantStorage([]));
    }
    setLoading(false);
  };

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
      Config.API_KEY_GENAI,
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

  useFocusEffect(
    React.useCallback(() => {
      getPlantInStorage();
      return () => {};
    }, []),
  );

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme.colors.bg_main, position: 'relative'},
      ]}>
      {loading ? (
        <View style={{flex: 1, width: SCREEN_WIDTH, justifyContent: 'center'}}>
          <LottieView
            source={require('~/resources/animations/circular_loading.json')}
            autoPlay
            loop
            style={{width: '100%', height: '25%'}}
          />
        </View>
      ) : g_plantStorage.length ? (
        <View style={{flex: 1, width: '100%'}}>
          <TouchableOpacity
            style={{
              width: '100%',
              paddingVertical: 8,
              borderRadius: 5,
              backgroundColor: theme.colors.primary,
              marginBottom: 10,
            }}
            onPress={handleOpenAddPlantModal}>
            <Text
              style={{
                color: theme.colors.text_white,
                fontWeight: '600',
                fontSize: 18,
                textAlign: 'center',
              }}>
              {t('+ Add Plant')}
            </Text>
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <ScrollView style={{}}>
              {g_plantStorage.map((plant, index) => (
                <PlantItem
                  key={index}
                  plant={plant}
                  handleOpenDetails={() => handleGoToDetail(plant)}
                  handleRemovePlantFromGarden={() =>
                    openConfirmModal(plant.name)
                  }
                />
              ))}
              <View style={{height: 30}}></View>
            </ScrollView>
          </View>
        </View>
      ) : (
        <>
          <Image
            style={[{height: 227, aspectRatio: 330 / 227, marginTop: 50}]}
            resizeMode="contain"
            source={require('~/resources/images/garden/backgroudgarden.png')}></Image>
          <Text style={[styles.title, {color: theme.colors.primary_dark}]}>
            {t("You don't have any plants")}
          </Text>
          <Text style={[styles.title2, {color: theme.colors.text_black}]}>
            {t('Add your first plants and start caring for it')}
          </Text>
          <TouchableOpacity
            style={[
              {
                borderRadius: 5,
                backgroundColor: theme.colors.primary,
                paddingVertical: 12,
                paddingHorizontal: 50,
              },
            ]}
            onPress={handleOpenAddPlantModal}>
            <Text style={[styles.btnText, {color: theme.colors.text_white}]}>
              {t('Add Plant')}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default MyGarden;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 15,
  },
  title: {
    marginBottom: 5,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  title2: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
