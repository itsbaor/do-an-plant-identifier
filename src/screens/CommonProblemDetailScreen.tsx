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
import IconBack from '~/resources/icons/IconBack';
import {stateAdsRemote} from '~/redux/slices/adsRemoteSlice';
import NativeBannerSmall from '~/components/ads/NativeBannerSmall';
import Config from 'react-native-config';
import {incrementInterCount, stateInterCount} from '~/redux/slices/interCount';
import {useInterstitialAd, TestIds} from 'react-native-google-mobile-ads';
import {setStateAdsOpen} from '~/redux/slices/adsOpenSlice';

const CommonProblemDetailScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<
      StackNavigationProp<RootParamList, 'CommonProblemDetailScreen'>
    >();
  const route =
    useRoute<RouteProp<RootParamList, 'CommonProblemDetailScreen'>>();
  const problemDetail = route.params;
  const {openModal, closeModals} = useModal();
  const adsRemote = useAppSelector(stateAdsRemote);
  const g_inter = useAppSelector(stateInterCount);
  const theme = useAppTheme();
  const [waitingAds, setWaitingAds] = useState<boolean>(
    adsRemote.NATIVE_COMMON_PROBLEMS.isOn,
  );
  const ID_ADS = __DEV__ ? undefined : adsRemote.NATIVE_COMMON_PROBLEMS.id;
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
          {t('Common Problems')}
        </Text>
        <View style={{width: 32}}></View>
      </View>
      <View style={{flex: 1}}>
        <ScrollView style={{paddingHorizontal: 20}}>
          {/* Name, image and common info */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              gap: 10,
              marginBottom: 10,
            }}>
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
                {t(problemDetail.name)}
              </Text>
              <Text
                numberOfLines={2}
                style={{
                  color: '#000000',
                  fontSize: 14,
                  lineHeight: 16,
                  fontFamily: 'Inter-Regular',
                }}>
                {t('Also called ') + problemDetail.otherName}
              </Text>
            </View>
            <View style={{flex: 0.45, aspectRatio: 1}}>
              {problemDetail.image && (
                <Image
                  source={problemDetail.image as unknown as ImageSourcePropType}
                  style={{width: '100%', height: '100%', borderRadius: 5}}
                />
              )}
            </View>
          </View>
          {/* Definition */}
          <View style={{}}>
            <Text style={[styles.problemTitle]}>
              {t('What is ') + problemDetail.name + '?'}
            </Text>
            <View style={{}}>
              <Text style={[styles.content]}>{problemDetail.definition}</Text>
            </View>
          </View>

          {/* Why happened */}
          <View>
            <Text style={[styles.problemTitle]}>
              {t('How does ') + problemDetail.name + t(' occur?')}
            </Text>
            <View style={{}}>
              <Text style={[styles.content]}>{problemDetail.reason}</Text>
            </View>
          </View>

          {/* Symptoms */}
          <View>
            <Text style={[styles.problemTitle]}>{t(`Symptoms`)}</Text>
            <View style={{}}>
              {problemDetail.symptoms.map((item, index) => (
                <View key={index}>
                  <Text style={[styles.problemSubTitle]}>
                    {t(`${index + 1} - ${item.symptom_name}`)}
                  </Text>
                  <Text style={[styles.content]}>{item.detail}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Solution */}
          <View>
            <Text style={[styles.problemTitle]}>{t(`Solutions`)}</Text>
            <View style={{}}>
              <Text style={[styles.content]}>{problemDetail.solution}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
      {adsRemote.NATIVE_COMMON_PROBLEMS.isOn && (
        <NativeBannerSmall adId={ID_ADS} setWaitAds={setWaitingAds} />
      )}
    </SafeAreaView>
  );
};

export default CommonProblemDetailScreen;

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
  problemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 24,
    marginBottom: 5,
  },
  problemSubTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 22,
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
