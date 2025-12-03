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
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import firestore from '@react-native-firebase/firestore';
import {useModal} from 'react-native-modalfy';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {commonProblemData} from '~/data/commonProblemData';
import IconBack from '~/resources/icons/IconBack';
import {statePremium} from '~/redux/slices/premiumSlice';
import {t_ProblemObject} from '~/@types/common-problem';
import NoDataFoundComponent from '~/components/NoDataFoundComponent';
import SearchBar from '~/components/SearchBar';
import {AI_MODEL, docGenAi} from './bottom-tabs/home/HomeScreen';
import {getPromtDetailProblem} from '~/resources/prompts';
import {t_ProblemDetail} from '~/@types/plant';
import {resolveResponseFromAi} from '~/utils';
import {GoogleGenerativeAI} from '@google/generative-ai';
import {findSmallestKeyValue, incrementMapValue} from './SplashScreen';
import {setStateKeyAi, stateKeyAi} from '~/redux/slices/keyAiSlice';
import {t_Lang} from '~/@types/language';
import {stateLang} from '~/redux/slices/langSlices';

export const getProblemDetail = async (
  name: string,
  image: NodeRequire | string,
  otherName: string,
  genAiKey: string,
  lang: t_Lang,
) => {
  try {
    //Asked AI
    const genAi = new GoogleGenerativeAI(genAiKey);
    const model = genAi.getGenerativeModel({model: AI_MODEL});
    incrementMapValue(docGenAi, genAiKey);
    const result = await model.generateContent([
      getPromtDetailProblem(lang),
      name,
    ]);
    const problemDataByAi = resolveResponseFromAi(result.response.text());
    const problemDetail: t_ProblemDetail = {
      name: name,
      image: image,
      otherName: otherName,
      definition: problemDataByAi.definition,
      reason: problemDataByAi.reason,
      symptoms: problemDataByAi.symptoms,
      solution: problemDataByAi.solution,
    };
    return problemDetail;
  } catch (error) {
    console.log('Dev defined error in get detail by AI:----', error);
    return null;
  }
};

const CommonProblemScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'CommonProblemScreen'>>();
  const {openModal, closeModals} = useModal();
  const g_aiKey = useAppSelector(stateKeyAi);
  const g_lang = useAppSelector(stateLang);
  const isPre = useAppSelector(statePremium);
  const theme = useAppTheme();
  const [searchText, setSearchText] = useState<string>();
  const [problemData, setProblemData] = useState<t_ProblemObject[]>([]);

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
      g_lang,
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
    const startIndex = Math.floor(
      Math.random() * (commonProblemData.length - 11),
    );
    setProblemData([...commonProblemData.slice(startIndex, startIndex + 12)]);
  }, []);

  useEffect(() => {
    const seachTrim = searchText?.trim();
    if (seachTrim) {
      const filtered = commonProblemData.filter(item =>
        item.name.toLowerCase().includes(seachTrim.toLowerCase()),
      );
      setProblemData([...filtered.slice(0, 12)]);
    } else {
      const startIndex = Math.floor(
        Math.random() * (commonProblemData.length - 11),
      );
      setProblemData([...commonProblemData.slice(startIndex, startIndex + 12)]);
    }
  }, [searchText]);

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
          {t('Common Problems')}
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
        {problemData.length === 0 ? (
          <NoDataFoundComponent />
        ) : (
          <ScrollView style={{paddingHorizontal: 20}}>
            <View style={styles.categoryListContainer}>
              {problemData.map((item, index) => (
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
                        handleGoToProblem(
                          item.name,
                          item.image,
                          item.otherName,
                        );
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
                          source={
                            item.image as unknown as
                              | ImageSourcePropType
                              | undefined
                          }
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
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CommonProblemScreen;

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
