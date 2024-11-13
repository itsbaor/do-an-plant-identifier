import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {useAppTheme} from '~/resources/theme';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import {useModal} from 'react-native-modalfy';
import {Notifier} from 'react-native-notifier';
import {stateAdsRemote} from '~/redux/slices/adsRemoteSlice';
import {statePremium} from '~/redux/slices/premiumSlice';
import Config from 'react-native-config';
import HeaderWithBack from '~/components/HeaderWithBack';
import NativeBannerSmall from '~/components/ads/NativeBannerSmall';
import {
  e_Repeat,
  setStateReminder,
  stateReminder,
} from '~/redux/slices/reminderSlice';

const SelectScheduleScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const route = useRoute<RouteProp<RootParamList>>();
  const {openModal, closeModals} = useModal();
  const adsRemote = useAppSelector(stateAdsRemote);
  const g_reminder = useAppSelector(stateReminder);
  const isPre = useAppSelector(statePremium);
  const [waitingAds, setWaitingAds] = useState<boolean>(
    adsRemote.NATIVE_REMINDER.isOn,
  );
  const ID_ADS = __DEV__ ? undefined : adsRemote.NATIVE_REMINDER.id;

  const theme = useAppTheme();

  const handleChooseRepeater = (repeat: e_Repeat) => {
    dispatch(setStateReminder({...g_reminder, repeat}));
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      <HeaderWithBack
        handleGoBack={() => navigation.goBack()}
        title={t('Select a repeater')}
        waitingAds={waitingAds}
      />
      <View style={{flex: 1, paddingHorizontal: 20, gap: 15}}>
        <Text style={{fontSize: 18, color: theme.colors.text_black}}>
          {t('Select the type of repeat you want to create')}
        </Text>
        <View style={{flex: 1, gap: 10}}>
          <TouchableOpacity
            onPress={() => {
              handleChooseRepeater(e_Repeat.DAILY);
            }}
            disabled={waitingAds}
            style={{
              width: '100%',
              borderRadius: 5,
              borderWidth: 1,
              backgroundColor:
                g_reminder.repeat == e_Repeat.DAILY
                  ? theme.colors.primary
                  : theme.colors.bg_white,
              borderColor:
                g_reminder.repeat == e_Repeat.DAILY
                  ? theme.colors.primary
                  : theme.colors.primary_dark,
              alignItems: 'center',
              paddingVertical: 15,
              position: 'relative',
              opacity: waitingAds ? 0.5 : 1,
            }}>
            <Text
              style={{
                color:
                  g_reminder.repeat == e_Repeat.DAILY
                    ? theme.colors.text_white
                    : theme.colors.text_black,
                fontSize: 16,
                fontWeight: '700',
              }}>
              {t('Daily')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleChooseRepeater(e_Repeat.WEEKLY);
            }}
            disabled={waitingAds}
            style={{
              width: '100%',
              borderRadius: 5,
              borderWidth: 1,
              backgroundColor:
                g_reminder.repeat == e_Repeat.WEEKLY
                  ? theme.colors.primary
                  : theme.colors.bg_white,
              borderColor:
                g_reminder.repeat == e_Repeat.WEEKLY
                  ? theme.colors.primary
                  : theme.colors.primary_dark,
              alignItems: 'center',
              paddingVertical: 15,
              position: 'relative',
              opacity: waitingAds ? 0.5 : 1,
            }}>
            <Text
              style={{
                color:
                  g_reminder.repeat == e_Repeat.WEEKLY
                    ? theme.colors.text_white
                    : theme.colors.text_black,
                fontSize: 16,
                fontWeight: '700',
              }}>
              {t('Weekly')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleChooseRepeater(e_Repeat.MONTHLY);
            }}
            disabled={waitingAds}
            style={{
              width: '100%',
              borderRadius: 5,
              borderWidth: 1,
              backgroundColor:
                g_reminder.repeat == e_Repeat.MONTHLY
                  ? theme.colors.primary
                  : theme.colors.bg_white,
              borderColor:
                g_reminder.repeat == e_Repeat.MONTHLY
                  ? theme.colors.primary
                  : theme.colors.primary_dark,
              alignItems: 'center',
              paddingVertical: 15,
              position: 'relative',
              opacity: waitingAds ? 0.5 : 1,
            }}>
            <Text
              style={{
                color:
                  g_reminder.repeat == e_Repeat.MONTHLY
                    ? theme.colors.text_white
                    : theme.colors.text_black,
                fontSize: 16,
                fontWeight: '700',
              }}>
              {t('Monthly')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {adsRemote.NATIVE_REMINDER.isOn && (
        <NativeBannerSmall adId={ID_ADS} setWaitAds={setWaitingAds} />
      )}
    </SafeAreaView>
  );
};

export default SelectScheduleScreen;

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
});
