import {Platform, StyleSheet, Text, View} from 'react-native';
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

const ID_ADS = __DEV__
  ? undefined
  : Platform.OS === 'android'
  ? Config.ANDROID_NATIVE_SEARCH
  : Config.IOS_NATIVE_SEARCH;

const TemplateScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const route = useRoute<RouteProp<RootParamList>>();
  const {openModal, closeModals} = useModal();
  const adsRemote = useAppSelector(stateAdsRemote);
  const isPre = useAppSelector(statePremium);
  const [waitingAds, setWaitingAds] = useState<boolean>(
    adsRemote.NATIVE_SEARCH.isOn,
  );
  const theme = useAppTheme();
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      <HeaderWithBack
        handleGoBack={() => navigation.goBack()}
        title={t('Title')}
        waitingAds={waitingAds}
      />
      <View style={{flex: 1, backgroundColor: 'red'}}></View>
      {adsRemote.NATIVE_SEARCH.isOn && (
        <NativeBannerSmall adId={ID_ADS} setWaitAds={setWaitingAds} />
      )}
    </SafeAreaView>
  );
};

export default TemplateScreen;

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
});
