import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Platform, Text, View} from 'react-native';
import NativeAdView, {
  AdManager,
  CallToActionView,
  HeadlineView,
  IconView,
  NativeMediaView,
  TaglineView,
  TestIds,
} from 'react-native-admob-native-ads';
import ShimmerPlaceholder from '../loading/ShimmerPlaceholder';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';

const NativeVideo = React.memo(({adId}: {adId?: string}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const nativeAdRef = useRef<NativeAdView>(null);
  const adMediaId = adId ?? TestIds.Video;

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
        width: '100%',
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
          width: '100%',
          paddingTop: 15,
          paddingBottom: 8,
          paddingHorizontal: 28,
          backgroundColor: '#f8f8f8',
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.2)',
          gap: 6,
        }}>
        {/** Absolute parts */}

        {/** Shimmer place holder and error */}
        {!loading && (
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
              height={250}
              style={{borderTopLeftRadius: 12, borderTopRightRadius: 12}}
            />
          </View>
        )}
        {error && <Text style={{color: '#a9a9a9'}}>:-(</Text>}

        <View
          style={{
            position: 'absolute',
            backgroundColor: '#32A05F',
            padding: 3,
            paddingHorizontal: 5,
          }}>
          <Text style={{color: '#FFF', fontSize: 9}}>AD</Text>
        </View>

        <View
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
              numberOfLines={2}
              style={{
                fontSize: 10,
                color: '#000',
              }}
            />
          </View>
        </View>

        <NativeMediaView
          style={{
            width: '100%',
            height: 120,
            borderRadius: 8,
          }}
           muted={true}
        />

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
                  backgroundColor: '#32A05F',
                  borderRadius: 16,
                }
              : {},
          ]}
          buttonAndroidStyle={{
            backgroundColor: '#32A05F',
            borderRadius: 16,
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
    </NativeAdView>
  );
});
export default NativeVideo;