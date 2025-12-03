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
import OnBoardingComponent from '~/components/onBoarding/OnBoardingComponent';
import {useModal} from 'react-native-modalfy';
import {statePremium} from '~/redux/slices/premiumSlice';
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
  const dotData = [{id: 0}, {id: 1}, {id: 2}];
  const isPre = useAppSelector(statePremium);
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
      swiper.current?.scrollBy(newIndex);
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
  };

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
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10,
        }}>
        <IconBack />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleGoToHome}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          backgroundColor: theme.colors.primary,
          borderRadius: 30,
          zIndex: 10,
          paddingHorizontal: 15,
          paddingVertical: 3,
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
      <View
        style={{
          flex: 1,
          width: '100%',
          gap: 15,
        }}>
        <View style={[{flex: 1}]}>
          <Swiper
            scrollEnabled={true}
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
            onPress={handlePressNextButton}
            style={[
              styles.button,
              {backgroundColor: theme.colors.primary},
            ]}>
            <Text
              style={[styles.buttonText, {color: theme.colors.text_white}]}>
              {t('Next')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
