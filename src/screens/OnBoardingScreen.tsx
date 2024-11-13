import {
  BackHandler,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {useAppTheme} from '~/resources/theme';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {onBoardingData} from '~/data/onBoardingData';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import Swiper from 'react-native-swiper';
import NativeBanner from '~/components/ads/NativeBanner';
import Config from 'react-native-config';
import OnBoardingComponent from '~/components/onBoarding/OnBoardingComponent';
import {useModal} from 'react-native-modalfy';
import {stateAdsRemote} from '~/redux/slices/adsRemoteSlice';
import {statePremium} from '~/redux/slices/premiumSlice';
import NativeFull from '~/components/ads/NativeFull';
import IconBack from '~/resources/icons/IconBack';

const OnBoardingScreen = () => {
  const {t} = useTranslation();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'OnBoardingScreen'>>();
  const theme = useAppTheme();
  const scrollX = useRef(new Animated.Value(0)).current; //Animate for scrolling
  const {width: windowWidth} = useWindowDimensions(); //Animate for scrolling
  const swiper = useRef<Swiper>(null);
  const [index, setIndex] = useState(0);
  const {openModal, closeModals} = useModal();
  const adsRemote = useAppSelector(stateAdsRemote);
  const dotData = adsRemote.ONBOARDING_FULL?.isOn
    ? [{id: 0}, {id: 1}, {id: 2}, {id: 3}]
    : [{id: 0}, {id: 1}, {id: 2}];
  const isPre = useAppSelector(statePremium);
  const [waitingAds, setWaitingAds] = useState<boolean>(
    adsRemote.NATIVE_ONBOARDING?.isOn,
  );
  const [errorLoadAdsFull, setErrorLoadAdsFull] = useState<boolean>(false);

  const ID_NATIVE_FULL = useMemo(
    () => (__DEV__ ? undefined : adsRemote.ONBOARDING_FULL.id),
    [adsRemote],
  );
  const ID_OB = useMemo(
    () => (__DEV__ ? undefined : adsRemote.NATIVE_ONBOARDING.id),
    [adsRemote],
  );
  const ID_OB_2 = useMemo(
    () => (__DEV__ ? undefined : adsRemote.NATIVE_ONBOARDING_2.id),
    [adsRemote],
  );
  const ID_OB_3 = useMemo(
    () => (__DEV__ ? undefined : adsRemote.NATIVE_ONBOARDING_3.id),
    [adsRemote],
  );
  const trans = [
    t('Smart Plants Diagnosis & Identification'),
    t('Nurture Your Greenery'),
    t('Ask Expert For Instant Answers'),
  ];

  const handlePressNextButton = () => {
    if (index === dotData.length - 1) {
      handleGoToHome();
    } else {
      let newIndex = index + 1;
      if (adsRemote.ONBOARDING_FULL?.isOn) {
        swiper.current?.scrollBy(newIndex == 1 ? index : newIndex);
      } else {
        swiper.current?.scrollBy(newIndex);
      }
      handleOnIndexChange(newIndex);
    }
  };

  const handleGoToHome = () => {
    openModal('LoadingModal', {
      message: t('Hang on! We are setting up for you'),
    });
    //Clear onboarding content
    setTimeout(() => {
      closeModals('LoadingModal');
      !isPre && navigation.navigate('PremiumScreen', {appStart: true});
      isPre &&
        navigation.navigate('BottomTabNavigation', {screen: 'HomeScreen'});
    }, 2500);
  };

  const handleOnIndexChange = (item: number) => {
    setIndex(item);
    if (dotData.length == 3) {
      item == 0 && setWaitingAds(adsRemote.NATIVE_ONBOARDING.isOn);
      item == 1 && setWaitingAds(adsRemote.NATIVE_ONBOARDING_2.isOn);
      item == 2 && setWaitingAds(adsRemote.NATIVE_ONBOARDING_3.isOn);
    } else {
      item == 0 && setWaitingAds(adsRemote.NATIVE_ONBOARDING.isOn);
      item == 1 && setWaitingAds(adsRemote.ONBOARDING_FULL.isOn);
      item == 2 && setWaitingAds(adsRemote.NATIVE_ONBOARDING_2.isOn);
      item == 3 && setWaitingAds(adsRemote.NATIVE_ONBOARDING_3.isOn);
    }
  };

  useEffect(() => {
    if (errorLoadAdsFull) {
      handlePressNextButton();
      setErrorLoadAdsFull(false);
    }
  }, [errorLoadAdsFull]);

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
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_white}]}>
      {((index !== 1 && adsRemote.ONBOARDING_FULL?.isOn) ||
        !adsRemote.ONBOARDING_FULL?.isOn) && (
        <>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            disabled={waitingAds}
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              zIndex: 10,
              opacity: waitingAds ? 0.5 : 1,
            }}>
            <IconBack />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleGoToHome}
            disabled={waitingAds}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              backgroundColor: theme.colors.primary,
              borderRadius: 30,
              zIndex: 10,
              paddingHorizontal: 15,
              paddingVertical: 3,
              opacity: waitingAds ? 0.5 : 1,
            }}>
            <Text
              style={{
                color: theme.colors.text_white,
                fontSize: 16,
                fontWeight: '600',
              }}>
              {t('Skip')}
            </Text>
          </TouchableOpacity>
        </>
      )}
      <View
        style={{
          flex: 1,
          width: '100%',
          gap: 15,
        }}>
        <View style={[{flex: 1}]}>
          <Swiper
            scrollEnabled={!waitingAds}
            showsButtons={false}
            loop={false}
            ref={swiper}
            showsPagination={false}
            onIndexChanged={index => {
              handleOnIndexChange(index);
            }}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: scrollX,
                    },
                  },
                },
              ],
              {useNativeDriver: false},
            )}
            autoplay={false}
            removeClippedSubviews={true}
            key={onBoardingData.length}>
            <View key={index} style={{flex: 1, justifyContent: 'flex-start'}}>
              <OnBoardingComponent
                title={t(onBoardingData[0].title)}
                image={onBoardingData[0].image}
              />
            </View>
            {adsRemote.ONBOARDING_FULL?.isOn && (
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  },
                ]}>
                {index === 1 && (
                  <NativeFull
                    adId={ID_NATIVE_FULL}
                    setWaitAds={setWaitingAds}
                    setAdsLoadError={setErrorLoadAdsFull}
                  />
                )}
              </View>
            )}
            <View key={index} style={{flex: 1, justifyContent: 'flex-start'}}>
              <OnBoardingComponent
                title={t(onBoardingData[1].title)}
                image={onBoardingData[1].image}
              />
            </View>
            <View key={index} style={{flex: 1, justifyContent: 'flex-start'}}>
              <OnBoardingComponent
                title={t(onBoardingData[2].title)}
                image={onBoardingData[2].image}
              />
            </View>
          </Swiper>
        </View>
        {((index !== 1 && adsRemote.ONBOARDING_FULL?.isOn) ||
          !adsRemote.ONBOARDING_FULL?.isOn) && (
          <>
            {/* Dot */}
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                gap: 15,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                {dotData.map((item, mIndex) => {
                  const width = scrollX.interpolate({
                    inputRange: [
                      windowWidth * (item.id - 1),
                      windowWidth * item.id,
                      windowWidth * (item.id + 1),
                    ],
                    outputRange: [9, 25, 9],
                    extrapolate: 'clamp',
                  });
                  const backgroundColor = scrollX.interpolate({
                    inputRange: [
                      windowWidth * (item.id - 1),
                      windowWidth * item.id,
                      windowWidth * (item.id + 1),
                    ],
                    outputRange: ['#D9D9D9', '#4B6D4E', '#D9D9D9'],
                    extrapolate: 'clamp',
                  });
                  return (
                    <Animated.View
                      key={mIndex}
                      style={[styles.normalDot, {width, backgroundColor}]}
                    />
                  );
                })}
              </View>
            </View>
            {/* Next button */}
            <View style={[styles.buttonContainer]}>
              <TouchableOpacity
                disabled={waitingAds}
                onPress={handlePressNextButton}
                style={[
                  styles.button,
                  {backgroundColor: theme.colors.primary},
                  waitingAds && {opacity: 0.5},
                ]}>
                <Text
                  style={[styles.buttonText, {color: theme.colors.text_white}]}>
                  {t('Next')}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      {adsRemote.NATIVE_ONBOARDING.isOn && index == 0 && (
        <NativeBanner adId={ID_OB} setWaitAds={setWaitingAds} />
      )}
      {adsRemote.NATIVE_ONBOARDING_2.isOn &&
        index == 1 &&
        dotData.length == 3 && (
          <NativeBanner adId={ID_OB_2} setWaitAds={setWaitingAds} />
        )}
      {adsRemote.NATIVE_ONBOARDING_2.isOn &&
        index == 2 &&
        dotData.length == 4 && (
          <NativeBanner adId={ID_OB_2} setWaitAds={setWaitingAds} />
        )}
      {adsRemote.NATIVE_ONBOARDING_3.isOn && index == dotData.length - 1 && (
        <NativeBanner adId={ID_OB_3} setWaitAds={setWaitingAds} />
      )}
    </SafeAreaView>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 44,
    fontWeight: '600',
  },
  normalDot: {
    width: 9,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginLeft: 4,
  },
});
