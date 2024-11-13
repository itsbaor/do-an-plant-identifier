import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Platform, Text, View} from 'react-native';
import NativeAdView, {
  AdManager,
  CallToActionView,
  HeadlineView,
  IconView,
  TaglineView,
  TestIds,
} from 'react-native-admob-native-ads';
import ShimmerPlaceholder from '../loading/ShimmerPlaceholder';
import {useAppTheme} from '~/resources/theme';

const NativeBanner = React.memo(
  ({
    adId,
    setWaitAds,
  }: {
    adId?: string;
    setWaitAds?: React.Dispatch<React.SetStateAction<boolean>>;
  }): JSX.Element => {
    const theme = useAppTheme();
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const nativeAdRef = useRef<NativeAdView>(null);
    const [isVisiable, setIsVisible] = useState(true);
    const adBannerImageId = adId ?? TestIds.Image;

    AdManager.registerRepository({
      adUnitId: adBannerImageId,
      numOfAds: 1,
      expirationPeriod: 4000,
      mediationEnabled: true,
    }).then(result => {
      console.log('Registered: ', result);
    });

    const onAdFailedToLoad = (event: any) => {
      setError(true);
      setLoading(false);
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
            refreshInterval={3000}
            enableSwipeGestureOptions={{}}
            style={{
              width: '100%',
            }}
            videoOptions={{
              customControlsRequested: true,
            }}
            mediationOptions={{
              nativeBanner: true,
            }}
            adUnitID={adBannerImageId} // Use loadedAdId if available, otherwise fallback to ID_Native
          >
            <View
              style={{
                minHeight: 160,
                backgroundColor: '#f8f8f8',
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.2)',
              }}>
              {!loaded ? (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ShimmerPlaceholder
                    width={Dimensions.get('window').width}
                    height="100%"
                    style={{borderRadius: 8}}
                  />
                </View>
              ) : (
                <>
                  <View
                    style={{
                      backgroundColor: theme.colors.primary,
                      alignSelf: 'flex-start',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: 3,
                    }}>
                    <Text
                      style={{
                        color: '#FFF',
                        fontSize: 8,
                        fontWeight: '600',
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                      }}>
                      AD
                    </Text>
                  </View>
                  <View style={{flex: 1, paddingBottom: 15, paddingHorizontal: 15}}>
                    <View
                      style={{
                        flex: 1,
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 7,
                        marginTop: 28
                      }}>
                      <IconView
                        style={{
                          width: 40,
                          height: 40,
                        }}
                      />

                      <View
                        style={{
                          paddingHorizontal: 8,
                          flex: 1,
                        }}>
                        <HeadlineView
                          numberOfLines={2}
                          style={{
                            fontWeight: '500',
                            color: '#000',
                            marginBottom: 4,
                            fontSize: 12,
                          }}
                        />
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                          }}>
                          <View style={{}}>
                            <TaglineView
                              numberOfLines={2}
                              style={{
                                fontSize: 10,
                                color: '#000',
                              }}
                            />
                          </View>
                        </View>
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
                              borderRadius: 20,
                            }
                          : {},
                      ]}
                      buttonAndroidStyle={{
                        backgroundColor: theme.colors.primary,
                        borderRadius: 20,
                      }}
                      allCaps
                      textStyle={{
                        fontSize: 14,
                        fontWeight: '500',
                        flexWrap: 'wrap',
                        color: 'white',
                      }}
                    />
                  </View>
                </>
              )}
            </View>
          </NativeAdView>
        )}
      </>
    );
  },
);

export default NativeBanner;
