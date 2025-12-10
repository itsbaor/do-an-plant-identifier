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
import IconBack from '~/resources/icons/IconBack';
import {t_CareGuideDetail, t_PlantDetail, t_PlantType} from '~/@types/plant';
import {getPromtDetailCareGuide} from '~/resources/prompts';
import {statePremium} from '~/redux/slices/premiumSlice';
import IconFamily from '~/resources/icons/plantDetail/IconFamily';
import IconOrigin from '~/resources/icons/plantDetail/IconOrigin';
import IconType from '~/resources/icons/plantDetail/IconType';
import IconFlower from '~/resources/icons/plantDetail/IconFlower';
import IconBranches from '~/resources/icons/plantDetail/IconBranches';
import IconTwigs from '~/resources/icons/plantDetail/IconTwigs';
import IconLeafs from '~/resources/icons/plantDetail/IconLeafs';
import IconSunlight from '~/resources/icons/plantDetail/IconSunlight';
import IconHeight from '~/resources/icons/plantDetail/IconHeight';
import useInAppReview from '~/hooks/useInAppReview';
import {useModal} from 'react-native-modalfy';
import {AI_MODEL, docGenAi} from './bottom-tabs/home/HomeScreen';
import {resolveResponseFromAi} from '~/utils';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {handleAddPlantToGarden} from './SearchScreen';
import {CYCLE, SUN, WATERING} from '~/@types/category';
import {actionAddPlant} from '~/redux/slices/plantStorageSlice';
import firestore from '@react-native-firebase/firestore';
import {findSmallestKeyValue, incrementMapValue} from './SplashScreen';
import {setStateKeyAi, stateKeyAi} from '~/redux/slices/keyAiSlice';
import {GoogleGenerativeAI} from '@google/generative-ai';
import {stateLang} from '~/redux/slices/langSlices';
import {t_Lang} from '~/@types/language';
import Config from 'react-native-config';

export const getCareGuideDetail = async (
  name: string,
  image: NodeRequire | string,
  genAiKey: string,
  lang: t_Lang,
) => {
  try {
    //Asked AI
    const genAi = new GoogleGenerativeAI(genAiKey);
    const model = genAi.getGenerativeModel({model: AI_MODEL});
    // Firebase tracking removed - using .env key directly
    const result = await model.generateContent([
      getPromtDetailCareGuide(lang),
      name,
    ]);
    const careGuideDataByAi = resolveResponseFromAi(result.response.text());
    const careGuideDetail: t_CareGuideDetail = {
      name: name,
      image: image,
      otherName: careGuideDataByAi.otherName,
      lifeSpan: careGuideDataByAi.lifeSpan,
      watering: careGuideDataByAi.watering,
      sunlight: careGuideDataByAi.sunlight,
      waterDetail: careGuideDataByAi.waterDetail,
      sunlightDetail: careGuideDataByAi.sunlightDetail,
      pruning: careGuideDataByAi.pruning,
    };
    return careGuideDetail;
  } catch (error) {
    console.log('Dev defined error in get care guide detail by AI:----', error);
    return null;
  }
};

const PlantDetailScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {openInAppReview} = useInAppReview();
  const g_lang = useAppSelector(stateLang);
  const isPre = useAppSelector(statePremium);
  const {openModal, closeModals} = useModal();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'PlantDetailScreen'>>();
  const route = useRoute<RouteProp<RootParamList, 'PlantDetailScreen'>>();
  const [isInDb, setIsInDb] = useState<boolean>(false);
  const plantDetail = route.params;
  const theme = useAppTheme();
  const g_aiKey = useAppSelector(stateKeyAi);

  const handleGoToCareGuide = async () => {
    openModal('LoadingModal', {
      message: t('Loading...'),
    });
    const careGuidDetail = await getCareGuideDetail(
      plantDetail.name,
      plantDetail.image,
      Config.API_KEY_GENAI,
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

  const handleAddToDb = () => {
    const plantType: t_PlantType = {
      name: plantDetail.name,
      image: plantDetail.image,
      treeLike: plantDetail.commonName,
      type: plantDetail.type as CYCLE,
      waterlevel: plantDetail.watering[0] as WATERING,
      sunlevel: plantDetail.sunlight[0] as SUN,
    };
    handleAddPlantToGarden(plantType);
    dispatch(actionAddPlant(plantType));
    openInAppReview();
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}>
          <IconBack />
        </TouchableOpacity>
        <Text style={[styles.header, {color: theme.colors.primary_dark}]}>
          {t('Detail Plant')}
        </Text>
        <View style={{width: 32}}></View>
      </View>
      <View style={{flex: 1}}>
        <ScrollView style={{paddingHorizontal: 20}}>
          {/* Name, image and common info */}
          <View style={{flexDirection: 'row', marginTop: 5, gap: 10}}>
            <View
              style={{
                flex: 0.55,
                alignItems: 'flex-start',
                gap: 10,
                marginBottom: 5,
              }}>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: 20,
                  fontWeight: '700',
                  color: '#000000',
                  lineHeight: 23,
                }}>
                {t(plantDetail.name)}
              </Text>
              <Text
                numberOfLines={2}
                style={{
                  color: '#000000',
                  fontSize: 14,
                  lineHeight: 16,
                  fontFamily: 'Inter-Regular',
                }}>
                {t('Also called ') + plantDetail.commonName}
              </Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                <View style={styles.characterContainer}>
                  <View
                    style={[
                      styles.dot,
                      {backgroundColor: theme.colors.primary},
                    ]}></View>
                  <Text numberOfLines={1} style={styles.textCharacter}>
                    {t(plantDetail.lifeSpan)}
                  </Text>
                </View>
                {/* Water */}
                <View style={styles.characterContainer}>
                  <View
                    style={[
                      styles.dot,
                      {backgroundColor: theme.colors.primary},
                    ]}></View>
                  <Text numberOfLines={1} style={styles.textCharacter}>
                    {t(plantDetail.watering[0])}
                  </Text>
                </View>
                {/* Sunlight */}
                <View style={styles.characterContainer}>
                  <View
                    style={[
                      styles.dot,
                      {backgroundColor: theme.colors.primary},
                    ]}></View>
                  <Text numberOfLines={1} style={styles.textCharacter}>
                    {t(plantDetail.sunlight)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{flex: 0.45, aspectRatio: 1}}>
              {plantDetail.image && (
                <Image
                  source={{uri: plantDetail.image} as ImageSourcePropType}
                  style={{width: '100%', height: '100%', borderRadius: 5}}
                />
              )}
            </View>
          </View>
          {/* Button */}
          <View
            style={{
              // paddingHorizontal: 20,
              gap: 10,
              flexDirection: 'row',
              marginVertical: 10,
            }}>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor: theme.colors.bg_white,
                  borderWidth: 1,
                  borderColor: theme.colors.primary_dark,
                },
              ]}
              onPress={handleGoToCareGuide}>
              <Text
                style={[styles.textBtn, {color: theme.colors.primary_dark}]}>
                {t('Care Guide')}
              </Text>
            </TouchableOpacity>
            {!isInDb && (
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                onPress={handleAddToDb}>
                <Text
                  style={[styles.textBtn, {color: theme.colors.text_white}]}>
                  {t('Add to Garden')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/* More info */}
          <View style={{marginBottom: 15}}>
            <Text
              style={{
                fontFamily: 'Inter-Regular',
                fontSize: 20,
                fontWeight: '700',
                color: theme.colors.text_black,
                lineHeight: 30,
              }}>
              {t('About')}
            </Text>
            <Text
              style={{
                fontFamily: 'Inter-Regular',
                fontSize: 15,
                lineHeight: 22,
                color: theme.colors.text_black,
                textAlign: 'left',
              }}>
              {t(plantDetail.description)}
            </Text>
            <View
              style={{
                backgroundColor: theme.colors.bg_white,
                paddingHorizontal: 16,
                paddingTop: 16,
                marginTop: 5,
                gap: 16,
                paddingBottom: 10,
              }}>
              {/* Item */}
              <View style={styles.itemContainer}>
                <View style={[styles.itemRight]}>
                  <IconFamily />
                  <Text style={styles.itemText}>{t('Family')}</Text>
                </View>
                <View
                  style={{
                    flex: 0.6,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}>
                  <Text style={[styles.itemText]} numberOfLines={4}>
                    {t(plantDetail.family)}
                  </Text>
                </View>
              </View>
              <View style={styles.itemContainer}>
                <View style={styles.itemRight}>
                  <IconOrigin />
                  <Text style={styles.itemText}>{t('Origin')}</Text>
                </View>
                <View
                  style={{
                    flex: 0.6,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}>
                  <Text style={styles.itemText} numberOfLines={4}>
                    {t(plantDetail.origin[0])}
                  </Text>
                </View>
              </View>
              <View style={styles.itemContainer}>
                <View style={styles.itemRight}>
                  <IconType />
                  <Text style={styles.itemText}>{t('Type')}</Text>
                </View>
                <View
                  style={{
                    flex: 0.6,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}>
                  <Text style={styles.itemText} numberOfLines={4}>
                    {t(plantDetail.type)}
                  </Text>
                </View>
              </View>
              {plantDetail.flower && (
                <View style={styles.itemContainer}>
                  <View style={styles.itemRight}>
                    <IconFlower />
                    <Text style={styles.itemText}>{t('Flower')}</Text>
                  </View>
                  <View
                    style={{
                      flex: 0.6,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                    }}>
                    <Text style={styles.itemText} numberOfLines={4}>
                      {t(plantDetail.flower[0])}
                    </Text>
                  </View>
                </View>
              )}
              {/* Item */}

              <Text style={styles.titleChar}>{t('Anatomy')}</Text>

              {/* Item */}
              {plantDetail.branches && (
                <View style={styles.itemContainer}>
                  <View style={styles.itemRight}>
                    <IconBranches />
                    <Text style={styles.itemText}>{t('Branches')}</Text>
                  </View>
                  <View
                    style={{
                      flex: 0.6,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                    }}>
                    <Text style={styles.itemText} numberOfLines={4}>
                      {t(plantDetail.branches)}
                    </Text>
                  </View>
                </View>
              )}
              {plantDetail.twigs && (
                <View style={styles.itemContainer}>
                  <View style={styles.itemRight}>
                    <IconTwigs />
                    <Text style={styles.itemText}>{t('Twigs')}</Text>
                  </View>
                  <View
                    style={{
                      flex: 0.6,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                    }}>
                    <Text style={styles.itemText} numberOfLines={4}>
                      {t(plantDetail.twigs)}
                    </Text>
                  </View>
                </View>
              )}
              {plantDetail.leafs && (
                <View style={styles.itemContainer}>
                  <View style={styles.itemRight}>
                    <IconLeafs />
                    <Text style={styles.itemText}>{t('Leafs')}</Text>
                  </View>
                  <View
                    style={{
                      flex: 0.6,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                    }}>
                    <Text style={styles.itemText} numberOfLines={4}>
                      {t(plantDetail.leafs)}
                    </Text>
                  </View>
                </View>
              )}
              {/* Item */}

              <Text style={styles.titleChar}>{t('Propagation')}</Text>
              <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}}>
                {plantDetail.propagation.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      paddingVertical: 4,
                      paddingHorizontal: 8,
                      borderRadius: 24,
                      backgroundColor: 'rgba(158, 240, 240, 1)',
                    }}>
                    <Text
                      style={{
                        fontSize: 10,
                        color: 'rgba(0, 93, 93, 1)',
                      }}>
                      {t(item)}
                    </Text>
                  </View>
                ))}
              </View>

              <Text style={styles.titleChar}>{t('Watering')}</Text>
              <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}}>
                {plantDetail.watering.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      paddingVertical: 4,
                      paddingHorizontal: 8,
                      borderRadius: 24,
                      backgroundColor: 'rgba(208, 226, 255, 1)',
                    }}>
                    <Text
                      style={{
                        fontSize: 10,
                        color: 'rgba(0, 67, 206, 1)',
                      }}>
                      {t(item)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Item */}
              <View style={[styles.itemContainer]}>
                <View style={styles.itemRight}>
                  <IconSunlight />
                  <Text style={styles.itemText}>{t('Sunlight')}</Text>
                </View>
                <View
                  style={{
                    flex: 0.6,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}>
                  <Text style={styles.itemText} numberOfLines={4}>
                    {t(plantDetail.sunlight[0])}
                  </Text>
                </View>
              </View>
              <View style={styles.itemContainer}>
                <View style={styles.itemRight}>
                  <IconHeight />
                  <Text style={styles.itemText}>{t('Height')}</Text>
                </View>
                <View
                  style={{
                    flex: 0.6,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}>
                  <Text style={styles.itemText} numberOfLines={4}>
                    {typeof plantDetail.height == 'string'
                      ? plantDetail.height.indexOf('feet') != -1
                        ? plantDetail.height
                        : plantDetail.height + ' feet'
                      : plantDetail.height + ' feet'}
                  </Text>
                </View>
              </View>
              {/* Item */}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PlantDetailScreen;

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
  dot: {
    height: 8,
    width: 8,
    borderRadius: 1000,
  },
  textCharacter: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000000',
  },
  characterContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    overflow: 'hidden',
  },
  btn: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  textBtn: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemContainer: {flexDirection: 'row'},
  itemRight: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    flex: 0.4,
  },
  itemText: {fontSize: 16, color: '#000000', lineHeight: 20},
  titleChar: {
    fontFamily: 'Inter-Regular',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 28,
    color: '#000000',
  },
});
