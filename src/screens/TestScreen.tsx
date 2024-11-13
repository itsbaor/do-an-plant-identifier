import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppSelector, useAppDispatch} from '~/hooks/useReduxStore';
import {stateCount, setStateCount} from '~/redux/slices/counterSlice';
import Config from 'react-native-config';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useInterstitialAd,
  useRewardedAd,
} from 'react-native-google-mobile-ads';
import NativeImage from '~/components/ads/NativeImage';
import {ScrollView} from 'react-native-gesture-handler';
import {BallIndicator} from 'react-native-indicators';
import i18n from '~/i18n';
import { useTranslation } from 'react-i18next';
import { t_Lang } from '~/@types/language';
import NativeBanner from '~/components/ads/NativeBanner';
import NativeVideo from '~/components/ads/NativeVideo';
import { useAppTheme } from '~/resources/theme';

enum e_AdsFullScreenType {
  NONE,
  INTER,
  REWARD,
  APP_OPEN,
}

enum e_AdsComponentType {
  BANNER,
  NATIVE_BANNER,
  NATIVE_IMAGE,
  NATIVE_VIDEO,
}

const TestScreen = () => {
  const {t} = useTranslation();
  const count = useAppSelector(stateCount);
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const interAds = useInterstitialAd(TestIds.INTERSTITIAL);
  const rewardAds = useRewardedAd(TestIds.REWARDED);
  const [loading, setLoading] = useState<boolean>(false);
  const [adsFullScreenType, setAdsFullScreenType] =
    useState<e_AdsFullScreenType>(e_AdsFullScreenType.NONE);
  const [curLang, setCurLang] = useState<t_Lang>('en');
  const [adsComponentType, setAdsComponentType] = useState<e_AdsComponentType>(
    e_AdsComponentType.BANNER,
  );

  const getRandomeNumber = () => {
    return Math.floor(Math.random() * 101);
  };

  const handleShowInterAds = () => {
    setLoading(true);
    setAdsFullScreenType(e_AdsFullScreenType.INTER);
    interAds.load();
  };

  const handleShowRewardAds = () => {
    setLoading(true);
    setAdsFullScreenType(e_AdsFullScreenType.REWARD);
    rewardAds.load();
  };

  const handleChangeLanguage = (lng:t_Lang) => {
    i18n.changeLanguage(lng);
    setCurLang(lng);
  }

  useEffect(() => {
    //Done ads loading
    if (interAds.isLoaded) {
      interAds.show();
    }
    if (rewardAds.isLoaded) {
      rewardAds.show();
    }
    setLoading(false);
    setAdsFullScreenType(e_AdsFullScreenType.NONE);
  }, [interAds.isLoaded, rewardAds.isLoaded]);

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
              disabled={loading}
            />
          </View>

          {/* Ads full screen test */}
          <View style={[styles.eleSpace, {}]}>
            <Text
              style={{
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
              }}>
                {t('Click to show ads full screen')}
            </Text>
            <Text
              style={{
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 10,
              }}>
              ({t('App Open Ads show when user open app from foreground')})
            </Text>
            <TouchableOpacity
              style={[{}, styles.primeBtn]}
              disabled={loading}
              onPress={handleShowInterAds}>
              <Text style={[{}, styles.primeBtnText]}>{t('Show Inter Ads')}</Text>
              {loading && adsFullScreenType === e_AdsFullScreenType.INTER && (
                <View>
                  <BallIndicator color="#000000" size={16} />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[{}, styles.primeBtn]}
              disabled={loading}
              onPress={handleShowRewardAds}>
              <Text style={[{}, styles.primeBtnText]}>{t('Show Reward Ads')}</Text>
              {loading && adsFullScreenType === e_AdsFullScreenType.REWARD && (
                <View>
                  <BallIndicator color="#000000" size={16} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/** Ads component test button */}
          <View style={[styles.eleSpace, {}]}>
            <Text
              style={{
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
              }}>
              {t('Click to change ads in bottom')}
            </Text>
            <Button
              title={t("Show Banner")}
              disabled={adsComponentType === e_AdsComponentType.BANNER}
              onPress={() => {setAdsComponentType(e_AdsComponentType.BANNER)}}
            />
            <Button
              title={t("Show Native Banner")}
              disabled={adsComponentType === e_AdsComponentType.NATIVE_BANNER}
              onPress={() => {setAdsComponentType(e_AdsComponentType.NATIVE_BANNER)}}
            />
            <Button
              title={t("Show Native Image")}
              disabled={adsComponentType === e_AdsComponentType.NATIVE_IMAGE}
              onPress={() => {setAdsComponentType(e_AdsComponentType.NATIVE_IMAGE)}}
            />
            <Button
              title={t("Show Native Video")}
              disabled={adsComponentType === e_AdsComponentType.NATIVE_VIDEO}
              onPress={() => {setAdsComponentType(e_AdsComponentType.NATIVE_VIDEO)}}
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

      {/** Ads Banner*/}
      {adsComponentType === e_AdsComponentType.BANNER && (
        <View style={[{}]}>
          <BannerAd
            unitId={TestIds.BANNER}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          />
        </View>
      )}
      {/** Ads Native Banner*/}
      {adsComponentType === e_AdsComponentType.NATIVE_BANNER && (
        <NativeBanner/>
      )}
      {/** Ads Native image*/}
      {adsComponentType === e_AdsComponentType.NATIVE_IMAGE && (
        <View style={[{}]}>
          <NativeImage/>
        </View>
      )}
      {/** Ads Native video*/}
      {adsComponentType === e_AdsComponentType.NATIVE_VIDEO && (
        <View style={[{}]}>
          <NativeVideo/>
        </View>
      )}
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
