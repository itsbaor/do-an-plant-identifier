import {
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
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import HomeFunctionComponent from '~/components/home/HomeFunctionComponent';
import {plantData} from '~/data/plantData';
import IconRightGreenArrow from '~/resources/icons/IconRightGreenArrow';
import {commonProblemData} from '~/data/commonProblemData';
import HorizontalSliderComponent from '~/components/diagnose/HorizontalSliderComponent';
import DiagnoseFunctionComponent from '~/components/diagnose/DiagnoseFunctionComponent';
import {getCareGuideDetail} from '~/screens/PlantDetailScreen';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {useModal} from 'react-native-modalfy';
import {t_ProblemObject} from '~/@types/common-problem';
import {t_PlantType} from '~/@types/plant';
import {getProblemDetail} from '~/screens/CommonProblemScreen';
import {e_CamFunc} from '../ScanScreen';
import firestore from '@react-native-firebase/firestore';
import {docGenAi} from '../home/HomeScreen';
import {findSmallestKeyValue} from '~/screens/SplashScreen';
import {setStateKeyAi, stateKeyAi} from '~/redux/slices/keyAiSlice';
import {stateLang} from '~/redux/slices/langSlices';

const DiagnoseScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {openModal, closeModals} = useModal();
  const [problemData, setProblemData] = useState<t_ProblemObject[]>([]);
  const [plantCareData, setPlantCareData] = useState<t_PlantType[]>([]);
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'BottomTabNavigation'>>();
  const theme = useAppTheme();
  const g_aiKey = useAppSelector(stateKeyAi);
  const g_lang = useAppSelector(stateLang);

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

  const handleGoToProblem = async (
    name: string,
    image: string | NodeRequire,
    otherName: string,
  ) => {
    openModal('LoadingModal', {
      message: t('Loading...'),
    });
    const problemDetail = await getProblemDetail(
      name,
      image,
      otherName,
      g_aiKey,
      g_lang
    );
    problemDetail
      ? navigation.navigate('CommonProblemDetailScreen', problemDetail)
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
    const startCarePlant = Math.floor(Math.random() * (plantData.length - 5));
    const startCommon = Math.floor(
      Math.random() * (commonProblemData.length - 5),
    );
    setPlantCareData([...plantData.slice(startCarePlant, startCarePlant + 6)]);
    setProblemData([...commonProblemData.slice(startCommon, startCommon + 6)]);
  }, []);

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
      <Text style={[styles.header, {color: theme.colors.primary_dark}]}>
        {t('Diagnose')}
      </Text>
      <ScrollView style={[styles.ph_20, {}]}>
        {/* Diagnose Function */}
        <View style={[styles.diagnoseFunctionContainer, {}]}>
          <DiagnoseFunctionComponent
            title={t('Check Your Plant')}
            onPress={() => {
              navigation.navigate('ScanScreen', {type: e_CamFunc.DIAGNOSE});
            }}
            buttonTitle={t('Start Diagnosing')}
            content={t(
              'Take photos, start diagnose disease & get plant care tips ',
            )}
          />
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

        {/* Common Problem */}
        <View style={[styles.horizontalSliderContainer, {marginBottom: 21}]}>
          <View style={[styles.horizontalSliderTitle]}>
            <Text style={[styles.header, {color: theme.colors.primary_dark}]}>
              {t('Common Problems')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CommonProblemScreen');
              }}>
              <IconRightGreenArrow width={31} height={31} />
            </TouchableOpacity>
          </View>
          <ScrollView style={[]} horizontal={true}>
            {problemData.map((item, index) => {
              return (
                <HorizontalSliderComponent
                  key={index}
                  name={item.name}
                  otherName={item.otherName}
                  image={item.image}
                  onPress={() => {
                    handleGoToProblem(item.name, item.image, item.otherName);
                  }}
                />
              );
            })}
          </ScrollView>
        </View>

        {/* Care Guide */}
        <View style={[styles.horizontalSliderContainer, {paddingBottom: 40}]}>
          <View style={[styles.horizontalSliderTitle]}>
            <Text style={[styles.header, {color: theme.colors.primary_dark}]}>
              {t('Care Guide')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CareGuideScreen');
              }}>
              <IconRightGreenArrow width={31} height={31} />
            </TouchableOpacity>
          </View>
          <ScrollView style={[]} horizontal={true}>
            {plantCareData.map((item, index) => {
              return (
                <HorizontalSliderComponent
                  key={index}
                  name={item.name}
                  otherName={item.treeLike}
                  image={item.image}
                  onPress={() => {
                    handleGoToCareGuide(item.name, item.image);
                  }}
                />
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DiagnoseScreen;

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
    marginBottom: 10,
  },
  ph_20: {
    paddingHorizontal: 20,
  },
  diagnoseFunctionContainer: {
    marginBottom: 21,
  },
  horizontalSliderContainer: {},
  horizontalSliderTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },
});
