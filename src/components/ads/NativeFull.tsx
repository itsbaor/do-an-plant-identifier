import React, {useEffect, useRef, useState} from 'react';
import {
  BackHandler,
  Platform,
  Text,
  View,
} from 'react-native';
import NativeAdView, {
  AdManager,
  CallToActionView,
  HeadlineView,
  IconView,
  ImageView,
  TaglineView,
  TestIds,
} from 'react-native-admob-native-ads';
import {useAppTheme} from '~/resources/theme';
import {useFocusEffect} from '@react-navigation/native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import {BarIndicator, MaterialIndicator} from 'react-native-indicators';

const NativeFull = React.memo(
  ({
    adId,
    setAdsHigh,
    setAdsLoadError,
    setWaitAds,
    closeAds,
  }: {
    adId?: string;
    setAdsHigh?: React.Dispatch<React.SetStateAction<boolean>>;
    setAdsLoadError?: React.Dispatch<React.SetStateAction<boolean>>;
    setWaitAds?: React.Dispatch<React.SetStateAction<boolean>>;
    closeAds?: () => void;
  }): JSX.Element => {
    const theme = useAppTheme();
    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const nativeAdRef = useRef<NativeAdView>(null);
    const adMediaId = adId ?? TestIds.Image;
    const {t} = useTranslation();

    // AdManager.registerRepository({
    //   adUnitId: adMediaId,
    //   numOfAds: 1,
    //   expirationPeriod: 4000,
    //   mediationEnabled: true,
    // }).then(result => {
    //   console.log('Registered: ', result);
    // });

    const onAdFailedToLoad = (event: any) => {
      setError(true);
      setLoading(false);
      setWaitAds && setWaitAds(false);
      setAdsHigh && setAdsHigh(false);
      setAdsLoadError && setAdsLoadError(true);
      console.log('AD', 'FAILED', event);
    };

    const onAdLoaded = () => {
      console.log('AD', 'LOADED', 'Ad has loaded successfully');
    };

    const onAdClicked = () => {
      console.log('AD', 'CLICK', 'User has clicked the Ad');
    };

    const onAdImpression = () => {
      console.log('AD', 'IMPRESSION', 'Ad impression recorded');
      setWaitAds && setWaitAds(false);
    };

    const onNativeAdLoaded = (event: any) => {
      console.log('AD', 'RECIEVED', 'Unified ad  Recieved', event);
      setLoading(false);
      setLoaded(true);
      setError(false);
    };

    const onAdLeftApplication = () => {
      console.log('AD', 'LEFT', 'Ad left application');
    };

    useEffect(() => {
      if (!loaded) {
        nativeAdRef.current?.loadAd();
      } else {
        console.log('AD', 'LOADED ALREADY');
      }
    }, [loaded]);

    useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
          return true;
        };
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }, []),
    );

    return (
      <NativeAdView
        ref={nativeAdRef}
        onAdLoaded={onAdLoaded}
        onAdFailedToLoad={onAdFailedToLoad}
        onAdLeftApplication={onAdLeftApplication}
        onAdClicked={onAdClicked}
        onAdImpression={onAdImpression}
        onNativeAdLoaded={onNativeAdLoaded}
        enableSwipeGestureOptions={{}}
        refreshInterval={60000}
        style={{
          flex: 1,
        }}
        videoOptions={{
          customControlsRequested: true,
        }}
        mediationOptions={{
          nativeBanner: true,
        }}
        adUnitID={adMediaId}>
        <View
          style={{
            height: '100%',
            width: SCREEN_WIDTH,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.2)',
            backgroundColor: '#000',
            paddingBottom: 30,
          }}>
          {loaded ? (
            <View
              style={{
                flex: 1,
                gap: 6,
                position: 'relative',
              }}>
              <View style={{width: '100%', height: 50}}>
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: theme.colors.primary,
                    left: 0,
                    top: 0,
                    padding: 3,
                    paddingHorizontal: 5,
                  }}>
                  <Text style={{color: '#FFF', fontSize: 9}}>AD</Text>
                </View>
              </View>
              {/* Image */}
              <View style={{flex: 1}}>
                <ImageView
                  resizeMode="contain"
                  style={{
                    width: SCREEN_WIDTH,
                    height: '100%',
                    borderRadius: 8,
                  }}
                />
              </View>

              <View style={{width: SCREEN_WIDTH, paddingHorizontal: 12}}>
                <HeadlineView
                  style={{
                    fontWeight: '500',
                    color: '#FFF',
                    marginBottom: 4,
                    fontSize: 12,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 60,
                  }}>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <IconView
                      style={{
                        width: 40,
                        height: 40,
                      }}
                    />
                    <TaglineView
                      numberOfLines={2}
                      style={{
                        fontSize: 10,
                        color: '#fff',
                      }}
                    />
                  </View>
                  <CallToActionView
                    style={[
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 10,
                        height: 40,
                        minWidth: 80,
                      },
                      Platform.OS === 'ios'
                        ? {
                            backgroundColor: theme.colors.primary,
                            borderRadius: 10,
                          }
                        : {},
                    ]}
                    buttonAndroidStyle={{
                      backgroundColor: theme.colors.primary,
                      borderRadius: 10,
                    }}
                    allCaps
                    textStyle={{
                      fontSize: 16,
                      fontWeight: '500',
                      flexWrap: 'wrap',
                      textAlign: 'center',
                      color: 'white',
                    }}
                  />
                </View>
              </View>

              {/* <View
              style={{
                width: '100%',
                flexDirection: 'row',
                opacity: loading || error || !loaded ? 0 : 1,
              }}>
              <IconView
                style={{
                  width: 40,
                  height: 40,
                }}
              />

              <View
                style={{
                  paddingHorizontal: 12,
                  flexShrink: 1,
                }}>
                <HeadlineView
                  style={{
                    fontWeight: '500',
                    color: '#000',
                    marginBottom: 4,
                    fontSize: 12,
                  }}
                />
                <TaglineView
                  numberOfLines={1}
                  style={{
                    fontSize: 10,
                    color: '#000',
                  }}
                />
              </View>
            </View>

            <CallToActionView
              style={[
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 10,
                  height: 40,
                  width: '100%',
                },
                Platform.OS === 'ios'
                  ? {
                      backgroundColor: theme.colors.primary,
                      borderRadius: 10,
                    }
                  : {},
              ]}
              buttonAndroidStyle={{
                backgroundColor: theme.colors.primary,
                borderRadius: 10,
              }}
              allCaps
              textStyle={{
                fontSize: 16,
                fontWeight: '500',
                flexWrap: 'wrap',
                textAlign: 'center',
                color: 'white',
              }}
            /> */}
            </View>
          ) : (
            // Loadiing Screen
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 15,
              }}>
              <View style={{height: 20, width: 20}}>
                <MaterialIndicator color="#fff" size={20} />
              </View>
              <Text style={{color: '#fff', fontSize: 16}}>
                {t('Loading ads...')}
              </Text>
            </View>
          )}
        </View>
      </NativeAdView>
    );
  },
);
export default NativeFull;
