import {AppState, Platform, SafeAreaView} from 'react-native';
import {useEffect, useState} from 'react';
import {AdEventType, AppOpenAd, TestIds} from 'react-native-google-mobile-ads';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {stateAdsOpen} from '~/redux/slices/adsOpenSlice';
import {setStateAdsOpen} from '~/redux/slices/adsOpenSlice';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {statePremium} from '~/redux/slices/premiumSlice';
import { stateAdsRemote } from '~/redux/slices/adsRemoteSlice';
import Config from 'react-native-config';

let appOpenAd: AppOpenAd;
let isAppOpenAdLoaded = false;

const ID_ADS = __DEV__
  ? TestIds.APP_OPEN
  : Platform.OS === 'android'
  ? Config.ANDROID_APP_OPEN
  : Config.IOS_APP_OPEN;

const AppOpenAdsProvider = () => {
  const dispatch = useAppDispatch();
  const adsOpen = useAppSelector(stateAdsOpen);
  const [showBg, setShowBg] = useState<boolean>(false);
  const isPre = useAppSelector(statePremium);
  const adsRemote = useAppSelector(stateAdsRemote);

  const loadAppOpenAd = () => {
    appOpenAd = AppOpenAd.createForAdRequest(ID_ADS, {
      requestNonPersonalizedAdsOnly: true,
    });
    appOpenAd.load();
    appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      isAppOpenAdLoaded = true;
    });
    appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
      setShowBg(false);
      !isPre && loadAppOpenAd();
    });
  };

  const showAppOpenAd = () => {
    if (!isPre && isAppOpenAdLoaded) {
      setShowBg(true);
      appOpenAd.show();
      isAppOpenAdLoaded = false; // Reset the flag after showing the ad
    }
  };

  useEffect(() => {
    !isPre && loadAppOpenAd();
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // Show the ad when the app is brought back to the foreground
        adsOpen && adsRemote.APP_OPEN.isOn && isAppOpenAdLoaded && showAppOpenAd();
        dispatch(setStateAdsOpen(true));
      }
    });
    return () => {
      // Clean up the subscription
      subscription.remove();
    };
  }, [adsOpen]);
  return (
    <>
      {showBg ? (
        <SafeAreaView
          style={{
            // ...StyleSheet.absoluteFillObject,
            height: SCREEN_HEIGHT,
            width: SCREEN_WIDTH,
            // flex: 1,
            backgroundColor: '#FFFFFF',
          }}></SafeAreaView>
      ) : null}
    </>
  );
};

export default AppOpenAdsProvider;
