import {
  BackHandler,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {useAppTheme} from '~/resources/theme';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stateLang} from '~/redux/slices/langSlices';
import {setStateLang} from '~/redux/slices/langSlices';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import {t_Lang, t_LangObject} from '~/@types/language';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {langList} from '~/data/languageData';
import LanguageSelectComponent from '~/components/languages/LanguageSelectComponent';
import IconBack from '~/resources/icons/IconBack';
import IconCheck from '~/resources/icons/IconCheck';
import i18n from '~/i18n';
import {TIME_DELAY} from '~/App';
import {DotIndicator} from 'react-native-indicators';

export const KEY_LANG = '@key_lang';

export const LANG_MAP_VALUE = {
  de: 'Germany',
  en: 'English',
  es: 'Spanish',
  hi: 'Hindi',
  id: 'Indonesian',
  ja: 'Japanese',
  ko: 'Korean',
  pt: 'Portuguese',
};

const LanguageScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'LanguageScreen'>>();
  const [langSelected, setLangSelected] = useState<t_Lang>('');
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const theme = useAppTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const langTrans = [
    t('English'),
    t('Hindi'),
    t('Portuguese'),
    t('Spanish'),
    t('Indonesian'),
    t('Japanese'),
    t('Germany'),
  ];

  const handleSelectLanguage = (lng: t_Lang) => {
    setLangSelected(lng);
  };

  const handleConfirmLanguage = async () => {
    await AsyncStorage.setItem(KEY_LANG, langSelected);
    dispatch(setStateLang(langSelected));
    isFirstTime ? navigation.navigate('OnBoardingScreen') : navigation.goBack();
    i18n.changeLanguage(langSelected);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const checkFirstTime = async () => {
    try {
      const lang = await AsyncStorage.getItem(KEY_LANG);
      setIsFirstTime(lang ? false : true);
      lang && setLangSelected(lang as t_Lang);
    } catch (error) {
      console.warn('Dev defined error: ', error);
    }
  };

  useEffect(() => {
    checkFirstTime();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      scrollViewRef.current?.scrollToEnd();
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      {/* Header */}
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        {!isFirstTime && (
          <TouchableOpacity
            onPress={handleGoBack}>
            <IconBack />
          </TouchableOpacity>
        )}
        <View>
          <Text
            style={{
              color: theme.colors.text_black,
              fontSize: 20,
              fontWeight: '600',
            }}>
            {t('Language')}
          </Text>
        </View>
        <View style={{width: 40, aspectRatio: 1, justifyContent: 'center'}}>
          {langSelected && (
            <TouchableOpacity style={{}} onPress={handleConfirmLanguage}>
              <IconCheck />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Scroll */}
      <View style={{flex: 1}}>
        <ScrollView ref={scrollViewRef} style={{paddingHorizontal: 35}}>
          <View style={{paddingTop: 25}}>
            {langList.map((item: t_LangObject, index: number) => (
              <LanguageSelectComponent
                languageObject={item}
                languageSelected={langSelected}
                onSelectLanguage={handleSelectLanguage}
                key={index}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
