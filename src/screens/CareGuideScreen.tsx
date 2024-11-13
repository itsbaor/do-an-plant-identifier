import {
  Image,
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
import {useModal} from 'react-native-modalfy';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {getCareGuideDetail} from './PlantDetailScreen';
import {plantData} from '~/data/plantData';
import IconBack from '~/resources/icons/IconBack';
import {stateAdsRemote} from '~/redux/slices/adsRemoteSlice';
import {statePremium} from '~/redux/slices/premiumSlice';
import NativeBannerSmall from '~/components/ads/NativeBannerSmall';
import Config from 'react-native-config';
import {t_PlantType} from '~/@types/plant';
import SearchBar from '~/components/SearchBar';
import NoDataFoundComponent from '~/components/NoDataFoundComponent';
import firestore from '@react-native-firebase/firestore';
import {docGenAi} from './bottom-tabs/home/HomeScreen';
import {findSmallestKeyValue} from './SplashScreen';
import {setStateKeyAi, stateKeyAi} from '~/redux/slices/keyAiSlice';
import NativeItemProblemCare from '~/components/ads/NativeItemProblemCare';
import {stateLang} from '~/redux/slices/langSlices';

const CareGuideScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const route = useRoute<RouteProp<RootParamList>>();
  const {openModal, closeModals} = useModal();
  const [searchText, setSearchText] = useState<string>();
  const [plantCareData, setPlantCareData] = useState<t_PlantType[]>([]);
  const adsRemote = useAppSelector(stateAdsRemote);
  const isPre = useAppSelector(statePremium);
  const theme = useAppTheme();
  const g_aiKey = useAppSelector(stateKeyAi);
  const g_lang = useAppSelector(stateLang);
  const [waitingAds, setWaitingAds] = useState<boolean>(
    adsRemote.NATIVE_SEARCH.isOn,
  );
  const ID_ADS = __DEV__ ? undefined : adsRemote.NATIVE_SEARCH.id;
  const ID_ADS_ITEM = __DEV__ ? undefined : adsRemote.NATIVE_ITEM_PROBLEM.id;

  useEffect(() => {
    const startIndex = Math.floor(Math.random() * (plantData.length - 15));
    setPlantCareData([...plantData.slice(startIndex, startIndex + 16)]);
  }, []);

  useEffect(() => {
    const seachTrim = searchText?.trim();
    if (seachTrim) {
      const filtered = plantData.filter(item =>
        item.name.toLowerCase().includes(seachTrim.toLowerCase()),
      );
      setPlantCareData([...filtered.slice(0, 16)]);
    } else {
      const startIndex = Math.floor(Math.random() * (plantData.length - 15));
      setPlantCareData([...plantData.slice(startIndex, startIndex + 16)]);
    }
  }, [searchText]);

  const handleGoToCareGuide = async (
    name: string,
    image: string | NodeRequire,
  ) => {
    openModal('LoadingModal', {
      message: t('Loading...'),
    });
    const careGuidDetail = await getCareGuideDetail(
      name,
      image,
      g_aiKey,
      g_lang,
    );
    careGuidDetail
      ? navigation.navigate('CareGuideDetailScreen', careGuidDetail)
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
      .doc(docGenAi) // Replace with your document ID
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
    waitingAds &&
      openModal('LoadingModal', {
        message: t('Loading data...'),
      });
    !waitingAds && closeModals('LoadingModal');
  }, [waitingAds]);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      <View
        style={[
          styles.ph_20,
          {
            marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconBack />
        </TouchableOpacity>
        <Text style={[styles.header, {color: theme.colors.primary_dark}]}>
          {t('Care Guide')}
        </Text>
        <View style={{width: 32}}></View>
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
          placeholder={t('Search')}
          handleSearch={() => {}}
        />
      </View>
      <View style={{flex: 1}}>
        {plantCareData.length === 0 ? (
          <NoDataFoundComponent />
        ) : (
          <ScrollView style={{paddingHorizontal: 20}}>
            <View style={styles.categoryListContainer}>
              {plantCareData.map((item, index) =>
                (index + 1) % 8 == 0 && adsRemote.NATIVE_ITEM_PROBLEM.isOn ? (
                  <View
                    key={index}
                    style={{
                      width: '50%',
                      aspectRatio: 180 / 210,
                      marginBottom: 15,
                      paddingHorizontal: 4,
                    }}>
                    <NativeItemProblemCare adId={ID_ADS_ITEM} />
                  </View>
                ) : (
                  <View
                    key={index}
                    style={{
                      width: '50%',
                      aspectRatio: 180 / 210,
                      marginBottom: 15,
                      paddingHorizontal: 4,
                    }}>
                    <View key={index} style={[styles.categoryItemContainer]}>
                      <TouchableOpacity
                        style={[styles.categoryItem]}
                        onPress={() => {
                          handleGoToCareGuide(item.name, item.image);
                        }}>
                        <View style={{flex: 1}}>
                          <Image
                            style={{
                              height: '100%',
                              width: '100%',
                              borderTopLeftRadius: 5,
                              borderTopRightRadius: 5,
                            }}
                            resizeMode="cover"
                            source={{uri: item.image} as ImageSourcePropType}
                          />
                        </View>
                        <View style={{paddingVertical: 8, paddingLeft: 10}}>
                          <Text style={[styles.textName]} numberOfLines={1}>
                            {t(item.name)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ),
              )}
            </View>
          </ScrollView>
        )}
      </View>
      {adsRemote.NATIVE_SEARCH.isOn && (
        <NativeBannerSmall adId={ID_ADS} setWaitAds={setWaitingAds} />
      )}
    </SafeAreaView>
  );
};

export default CareGuideScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
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
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryItemContainer: {
    flex: 1,
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
  textName: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 24,
    color: '#000000',
  },
  textOtherName: {
    fontSize: 9,
    fontWeight: '400',
    lineHeight: 15,
    color: '#000000',
  },
});
