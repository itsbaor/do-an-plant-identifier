import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, Dimensions, Platform, Text, View} from 'react-native';
import NativeAdView, {
  AdManager,
  CallToActionView,
  HeadlineView,
  IconView,
  ImageView,
  TaglineView,
  TestIds,
} from 'react-native-admob-native-ads';
import ShimmerPlaceholder from '../loading/ShimmerPlaceholder';
import {useAppTheme} from '~/resources/theme';
import {useFocusEffect} from '@react-navigation/native';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';

const NativeItemExplore = React.memo(
  ({
    adId,
    setAdsHigh,
    setWaitAds,
    isAdsSmall = false,
  }: {
    adId?: string;
    setAdsHigh?: React.Dispatch<React.SetStateAction<boolean>>;
    setWaitAds?: React.Dispatch<React.SetStateAction<boolean>>;
    isAdsSmall?: boolean;
  }): JSX.Element => {
    const theme = useAppTheme();
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [isVisiable, setIsVisible] = useState(true);
    const nativeAdRef = useRef<NativeAdView>(null);
    const adMediaId = adId ?? TestIds.Image;

    AdManager.registerRepository({
      adUnitId: adMediaId,
      numOfAds: 1,
      expirationPeriod: 4000,
      mediationEnabled: true,
    }).then(result => {
      console.log('Registered: ', result);
    });

    const onAdFailedToLoad = (event: any) => {
      setError(true);
      setLoading(false);
      setAdsHigh && setAdsHigh(false);
      setIsVisible(false);
      setWaitAds && setWaitAds(false);
      console.log('AD', 'FAILED', event);
    };

    const onAdLoaded = () => {
      console.log('AD', 'LOADED', 'Ad has loaded successfully');
    };

    const onAdClicked = () => {
      console.log('AD', 'CLICK', 'User has clicked the Ad');
    };

    const onAdImpression = () => {
      setWaitAds && setWaitAds(false);
      console.log('AD', 'IMPRESSION', 'Ad impression recorded');
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
      <>
        {isVisiable && (
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
            style={[
              {
                width: isAdsSmall ? SCREEN_WIDTH / 2.5 : SCREEN_WIDTH - 40,
              },
              !isAdsSmall && {height: 250},
              isAdsSmall ? {marginRight: 10} : {marginBottom: 15},
            ]}
            videoOptions={{
              customControlsRequested: true,
            }}
            mediationOptions={{
              nativeBanner: true,
            }}
            adUnitID={adMediaId}>
            <View
              style={{
                // paddingHorizontal: 28,
                backgroundColor: '#f8f8f8',
                borderWidth: 1,
                borderColor: theme.colors.primary,
                borderRadius: 10,
              }}>
              {/** Absolute parts */}

              {/** Shimmer place holder and error */}
              {!loaded ? (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: !loading && !error && loaded ? 0 : 1,
                  }}>
                  <ShimmerPlaceholder
                    width={Dimensions.get('window').width}
                    height="100%"
                    style={{borderTopLeftRadius: 12, borderTopRightRadius: 12}}
                  />
                </View>
              ) : (
                <View
                  style={{
                    padding: isAdsSmall ? 5 : 8,
                    width: '100%',
                    height: '100%',
                    gap: isAdsSmall ? 5 : 8,
                    position: 'relative',
                  }}>
                  <ImageView
                    style={{
                      flex: 1,
                      borderRadius: 8,
                      resizeMode: 'cover',
                    }}
                  />

                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      opacity: loading || error || !loaded ? 0 : 1,
                    }}>
                    {!isAdsSmall && (
                      <IconView
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      />
                    )}

                    <View
                      style={{
                        paddingHorizontal: isAdsSmall ? 0 : 9,
                        flexShrink: 1,
                        justifyContent: 'space-between',
                      }}>
                      <View style={{flexDirection: 'row', gap: 5}}>
                        <View
                          style={{
                            backgroundColor: theme.colors.primary,
                            paddingHorizontal: 5,
                            borderRadius: 4,
                            justifyContent: 'center',
                          }}>
                          <Text style={{color: '#FFF', fontSize: 8}}>AD</Text>
                        </View>
                        <HeadlineView
                          style={{
                            fontWeight: '500',
                            color: '#000',
                            fontSize: 10,
                          }}
                        />
                      </View>
                      <TaglineView
                        numberOfLines={1}
                        style={{
                          fontSize: 9,
                          color: '#000',
                        }}
                      />
                    </View>
                  </View>

                  {loaded && (
                    <CallToActionView
                      style={[
                        {
                          justifyContent: 'center',
                          alignItems: 'center',
                          elevation: 10,
                          width: '100%',
                          paddingVertical: 15,
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
                        borderRadius: 5,
                      }}
                      allCaps
                      textStyle={{
                        fontSize: 12,
                        fontWeight: '500',
                        flexWrap: 'wrap',
                        textAlign: 'center',
                        color: 'white',
                      }}
                    />
                  )}
                </View>
              )}
            </View>
          </NativeAdView>
        )}
      </>
    );
  },
);
export default NativeItemExplore;
