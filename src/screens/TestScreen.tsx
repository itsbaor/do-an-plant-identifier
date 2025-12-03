import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppSelector, useAppDispatch} from '~/hooks/useReduxStore';
import {stateCount, setStateCount} from '~/redux/slices/counterSlice';
import Config from 'react-native-config';
import {ScrollView} from 'react-native-gesture-handler';
import {BallIndicator} from 'react-native-indicators';
import i18n from '~/i18n';
import { useTranslation } from 'react-i18next';
import { t_Lang } from '~/@types/language';
import { useAppTheme } from '~/resources/theme';

const TestScreen = () => {
  const {t} = useTranslation();
  const count = useAppSelector(stateCount);
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const [curLang, setCurLang] = useState<t_Lang>('en');

  const getRandomeNumber = () => {
    return Math.floor(Math.random() * 101);
  };

  const handleChangeLanguage = (lng:t_Lang) => {
    i18n.changeLanguage(lng);
    setCurLang(lng);
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={[{flex: 1, paddingHorizontal: 15, paddingTop: 15}]}>
        <ScrollView style={[{}]}>
          {/* ENV Var */}
          <Text
            style={{
              color: '#ffffff',
              textAlign: 'center',
              fontSize: 20,
              fontWeight: '700',
            }}>
            {t('ENV target')}: {Config.ENVIRONMENT}
          </Text>

          {/* State Redux store */}
          <View style={[styles.eleSpace, {}]}>
            <Text style={{color: theme.colors.primary}}>{t('ReduxStore State')}: {count}</Text>
            <Button
              title={t("Click to change random number")}
              onPress={() => {
                dispatch(setStateCount(getRandomeNumber()));
              }}
            />
          </View>

          {/**Language */}
          <View style={[styles.eleSpace, {}]}>
            <Text
              style={{
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
              }}>
              {t('Click to change language')}
            </Text>
            <Button
              title={t("English")}
              disabled={curLang === 'en'}
              onPress={() => {handleChangeLanguage('en');}}
            />
            <Button
              title={t("Japanese")}
              disabled={curLang === 'ja'}
              onPress={() => {handleChangeLanguage('ja');}}
            />
            <Button
              title={t("Hindi")}
              disabled={curLang === 'hi'}
              onPress={() => {handleChangeLanguage('hi');}}
            />
            <Button
              title={t("Germany")}
              disabled={curLang === 'de'}
              onPress={() => {handleChangeLanguage('de');}}
            />
            <Button
              title={t("Portuguese")}
              disabled={curLang === 'pt'}
              onPress={() => {handleChangeLanguage('pt');}}
            />
            <Button
              title={t("Korean")}
              disabled={curLang === 'ko'}
              onPress={() => {handleChangeLanguage('ko');}}
            />
            <Button
              title={t("Indonesian")}
              disabled={curLang === 'id'}
              onPress={() => {handleChangeLanguage('id');}}
            />
            <Button
              title={t("Spanish")}
              disabled={curLang === 'es'}
              onPress={() => {handleChangeLanguage('es');}}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  eleSpace: {
    gap: 10,
    // marginTop: 20,
    marginBottom: 20,
  },
  primeBtn: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5,
    gap: 8,
  },
  primeBtnText: {
    color: '#000000',
    fontSize: 16,
  },
});
