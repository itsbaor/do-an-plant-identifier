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
import {Notifier} from 'react-native-notifier';
import {t_CareGuideDetail} from '~/@types/plant';
import Config from 'react-native-config';
import NativeBannerSmall from '~/components/ads/NativeBannerSmall';
import IconBack from '~/resources/icons/IconBack';
import {stateAdsRemote} from '~/redux/slices/adsRemoteSlice';
import {statePremium} from '~/redux/slices/premiumSlice';
import IconWaterDetail from '~/resources/icons/plantDetail/IconWaterDetail';
import IconSunlightDetail from '~/resources/icons/plantDetail/IconSunlightDetail';
import IconPruning from '~/resources/icons/plantDetail/IconPruning';
import {TestIds, useInterstitialAd} from 'react-native-google-mobile-ads';
import {incrementInterCount, stateInterCount} from '~/redux/slices/interCount';
import {setStateAdsOpen} from '~/redux/slices/adsOpenSlice';

const CareGuideDetailScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const adsRemote = useAppSelector(stateAdsRemote);
  const isPre = useAppSelector(statePremium);
  const navigation =
    useNavigation<
      StackNavigationProp<RootParamList, 'CareGuideDetailScreen'>
    >();
  const route = useRoute<RouteProp<RootParamList, 'CareGuideDetailScreen'>>();
  const careGuideDetail = route.params;
  const {openModal, closeModals} = useModal();
  const g_inter = useAppSelector(stateInterCount);
  const theme = useAppTheme();
  const [waitingAds, setWaitingAds] = useState<boolean>(
    adsRemote.NATIVE_SEARCH.isOn,
  );
  const ID_ADS = __DEV__ ? undefined : adsRemote.NATIVE_SEARCH.id;
  const ID_ADS_INTER = __DEV__
    ? TestIds.INTERSTITIAL
    : adsRemote.INTER_PROBLEM.id;
  const interAds = useInterstitialAd(ID_ADS_INTER);

  const handleGoBack = () => {
    navigation.goBack();
    interAds.isLoaded && dispatch(setStateAdsOpen(false)) && interAds.show();
    dispatch(incrementInterCount());
  };

  useEffect(() => {
    adsRemote.INTER_PROBLEM.isOn && (g_inter + 1) % 3 == 0 && interAds.load();
  }, [interAds.load]);

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
          onPress={handleGoBack}
          disabled={waitingAds}
          style={waitingAds && {opacity: 0.5}}>
          <IconBack />
        </TouchableOpacity>
        <Text style={[styles.header, {color: theme.colors.primary_dark}]}>
          {t('Care Guide')}
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
                {t(careGuideDetail.name)}
              </Text>
              <Text
                numberOfLines={2}
                style={{
                  color: '#000000',
                  fontSize: 14,
                  lineHeight: 16,
                  fontFamily: 'Inter-Regular',
                }}>
                {t('Also called ') + careGuideDetail.otherName}
              </Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                <View style={styles.characterContainer}>
                  <View
                    style={[
                      styles.dot,
                      {backgroundColor: theme.colors.primary},
                    ]}></View>
                  <Text numberOfLines={1} style={styles.textCharacter}>
                    {t(careGuideDetail.lifeSpan)}
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
                    {t(careGuideDetail.watering)}
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
                    {t(careGuideDetail.sunlight)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{flex: 0.45, aspectRatio: 1}}>
              {careGuideDetail.image && (
                <Image
                  source={{uri: careGuideDetail.image} as ImageSourcePropType}
                  style={{width: '100%', height: '100%', borderRadius: 5}}
                />
              )}
            </View>
          </View>
          {/* More info */}
          <View style={{gap: 15, marginTop: 23}}>
            <View style={{}}>
              <View style={{flexDirection: 'row', gap: 12}}>
                <IconWaterDetail />
                <Text style={[styles.careGuideTitle]}>{t('Watering')}</Text>
              </View>
              <Text style={[styles.content]}>
                {careGuideDetail.waterDetail}
              </Text>
            </View>
            <View style={{}}>
              <View style={{flexDirection: 'row', gap: 12}}>
                <IconSunlightDetail />
                <Text style={[styles.careGuideTitle]}>{t('Sunlight')}</Text>
              </View>
              <Text style={[styles.content]}>
                {careGuideDetail.sunlightDetail}
              </Text>
            </View>
            <View style={{}}>
              <View style={{flexDirection: 'row', gap: 12}}>
                <IconPruning />
                <Text style={[styles.careGuideTitle]}>{t('Pruning')}</Text>
              </View>
              <Text style={[styles.content]}>{careGuideDetail.pruning}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
      {adsRemote.NATIVE_SEARCH.isOn && (
        <NativeBannerSmall adId={ID_ADS} setWaitAds={setWaitingAds} />
      )}
    </SafeAreaView>
  );
};

export default CareGuideDetailScreen;

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
  careGuideTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 24,
    marginBottom: 5,
  },
  content: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 22,
    textAlign: 'left',
    paddingBottom: 15,
  },
});
