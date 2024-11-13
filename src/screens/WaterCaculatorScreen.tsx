import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {useAppTheme} from '~/resources/theme';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import {useModal} from 'react-native-modalfy';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {stateAdsRemote} from '~/redux/slices/adsRemoteSlice';
import {statePremium} from '~/redux/slices/premiumSlice';
import Config from 'react-native-config';
import HeaderWithBack from '~/components/HeaderWithBack';
import NativeBannerSmall from '~/components/ads/NativeBannerSmall';
import FlexDropdown from '~/components/FlexDropdown';
import DynamicallySelectedPicker from 'react-native-dynamically-selected-picker';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import TextInputComponent from '~/components/TextInputComponent';
import {statePlantStorage} from '~/redux/slices/plantStorageSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRewardedAd, TestIds} from 'react-native-google-mobile-ads';
import {setStateAdsOpen} from '~/redux/slices/adsOpenSlice';
import {ERROR_NOTI_TIME} from './bottom-tabs/ScanScreen';

enum DROPDOWN {
  NONE,
  POT,
  HUMIDITY,
  TEMPERATURE,
}

enum POT {
  VOLUME,
  SIZE,
}

const tempList = [
  {value: 0, label: '0°C'},
  {value: 10, label: '10°C'},
  {value: 20, label: '20°C'},
  {value: 30, label: '30°C'},
  {value: 40, label: '40°C'},
  {value: 50, label: '50°C'},
  {value: 60, label: '60°C'},
  {value: 70, label: '70°C'},
  {value: 80, label: '80°C'},
  {value: 90, label: '90°C'},
  {value: 100, label: '100°C'},
];

const humidityList = [
  {value: 0, label: '0%'},
  {value: 0.1, label: '10%'},
  {value: 0.2, label: '20%'},
  {value: 0.3, label: '30%'},
  {value: 0.4, label: '40%'},
  {value: 0.5, label: '50%'},
  {value: 0.6, label: '60%'},
  {value: 0.7, label: '70%'},
  {value: 0.8, label: '80%'},
  {value: 0.9, label: '90%'},
  {value: 1, label: '100%'},
];

export const WATE_STORAGE_KEY = '@water_caculation';

const MAX_DAY_TRIAL_CACULATION = 2;

export type t_DayTrial = {
  time: number;
  date: string; //dd/mm/yyyy
};

const WaterCaculatorScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const g_plantStorage = useAppSelector(statePlantStorage);
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'WaterCaculatorScreen'>>();
  const route = useRoute<RouteProp<RootParamList, 'WaterCaculatorScreen'>>();
  const [plantName, setPlantName] = useState<string>(
    String(route.params.plantName),
  );
  const {openModal, closeModals, closeAllModals} = useModal();
  const dropdownWidth = useMemo(() => SCREEN_WIDTH - 98, [SCREEN_WIDTH]);
  const adsRemote = useAppSelector(stateAdsRemote);
  const [potVolume, setPotVolume] = useState<string>('');
  const [potHeight, setPotHeight] = useState<string>('');
  const [potWidth, setPotWidth] = useState<string>('');
  const [humidity, setHumidity] = useState<string>('0');
  const [temperature, setTemperature] = useState<string>('0');
  const [checkValidation, setCheckValidation] = useState<boolean>(false);
  const isPre = useAppSelector(statePremium);
  const [waitingAds, setWaitingAds] = useState<boolean>(
    adsRemote.NATIVE_CACULATOR.isOn,
  );
  const ID_ADS_NATIVE = __DEV__ ? undefined : adsRemote.NATIVE_CACULATOR.id;
  const ID_ADS_REWARD = __DEV__
    ? TestIds.REWARDED
    : adsRemote.REWARD_CACULATOR.id;
  const theme = useAppTheme();
  const rewardAds = useRewardedAd(ID_ADS_REWARD);
  const [choosenDropdownIndex, setChoosenDropdownIndex] = useState<number>(
    DROPDOWN.NONE,
  );
  const [choosenPotIndex, setChoosenPotIndex] = useState<number>(POT.VOLUME);
  const getCurrentDateString = () => {
    const today = new Date();

    // Get day, month, and year from the current date
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = today.getFullYear();

    // Combine into the format dd/mm/yyyy
    return `${day}/${month}/${year}`;
  };
  const [trialWaterCaculation, setTrialWaterCaculation] = useState<t_DayTrial>({
    time: MAX_DAY_TRIAL_CACULATION,
    date: getCurrentDateString(),
  });

  const isToday = (dateString: string) => {
    // Split the input string to get day, month, and year
    const [day, month, year] = dateString.split('/').map(Number);

    // Get today's date
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1; // Months are zero-indexed, so add 1
    const todayYear = today.getFullYear();

    // Compare the parsed date with today's date
    return day === todayDay && month === todayMonth && year === todayYear;
  };

  const handleChooseDropdown = (index: number) => {
    index === choosenDropdownIndex
      ? setChoosenDropdownIndex(DROPDOWN.NONE)
      : setChoosenDropdownIndex(index);
  };

  const changeCaculatePlantName = (name: string) => {
    closeModals('ChoosePlantModal');
    setPlantName(name);
  };

  const handleTryAgain = () => {
    closeModals('InformWaterNeedModal', () => {
      openModal('ChoosePlantModal', {
        openModalAddPlant: () => {},
        plantList: g_plantStorage,
        navigateCaculator: changeCaculatePlantName,
      });
    });
  };

  const handleDone = () => {
    closeModals('InformWaterNeedModal');
    rewardAds.isLoaded &&
      dispatch(setStateAdsOpen(false)) &&
      !isPre &&
      rewardAds.show();
    navigation.goBack();
  };

  const handlePressCaculate = async () => {
    Keyboard.dismiss();
    if (!isPre) {
      //Check trial
      if (trialWaterCaculation.time == 0) {
        Notifier.showNotification({
          title: t('Oopss!'),
          duration: ERROR_NOTI_TIME,
          description: t(
            'You have reached the maximum number of trial caculation, please upgrade to premium!',
          ),
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: 'error',
          },
        });
        navigation.push('PremiumScreen', {appStart: false});
        return;
      }
    }
    setCheckValidation(true);
    if (!potVolume || !potWidth || !potHeight) {
      Notifier.showNotification({
        title: t('Invalid input'),
        description: t('Some required fields are missing'),
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: 'error',
        },
      });
      setChoosenDropdownIndex(DROPDOWN.POT);
      (!potHeight || !potWidth) && setChoosenPotIndex(POT.SIZE);
      !potVolume && setChoosenPotIndex(POT.VOLUME);
      return;
    }
    closeAllModals();
    const total = Math.round(Number(potHeight) * Number(potVolume) * 2.5);
    setChoosenDropdownIndex(DROPDOWN.NONE);
    openModal('InformWaterNeedModal', {
      amount: total,
      plantName: plantName,
      actionTryAgain: handleTryAgain,
      actionDone: handleDone,
    });
    //Tăng lượt khi ko premium
    if (!isPre) {
      const updatedWaterCaculationTime: t_DayTrial = {
        time: trialWaterCaculation.time - 1,
        date: trialWaterCaculation.date,
      };
      setTrialWaterCaculation({...updatedWaterCaculationTime});
      try {
        await AsyncStorage.setItem(
          WATE_STORAGE_KEY,
          JSON.stringify(updatedWaterCaculationTime),
        );
      } catch (error) {
        // Error saving data
        console.error(
          'Failed to save trial water caculation time to AsyncStorage',
          error,
        );
      }
    }
  };

  useEffect(() => {
    adsRemote.REWARD_CACULATOR.isOn && rewardAds.load();
  }, [rewardAds.load]);

  useEffect(() => {
    const getTrialWaterCaculation = async () => {
      try {
        let waterTime: t_DayTrial | string | null = await AsyncStorage.getItem(
          WATE_STORAGE_KEY,
        );
        if (waterTime !== null) {
          // The value exists, do something with it
          waterTime = JSON.parse(waterTime) as t_DayTrial;
          if (isToday(waterTime.date)) {
            //Check if current day is today
            setTrialWaterCaculation(waterTime);
          }
        } else {
          // The value does not exist
          console.log('No value found');
        }
      } catch (e) {
        // Error reading value
        console.error(
          'Failed to retrieve trial water caculation data from AsyncStorage',
          e,
        );
      }
    };
    getTrialWaterCaculation();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      <HeaderWithBack
        handleGoBack={() => navigation.goBack()}
        waitingAds={waitingAds}
        title={t('Water Calculator')}
      />
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <View style={[styles.contentContainer]}>
          <View>
            <FlexDropdown
              title="Plant"
              isDisableDropdown={true}
              value={plantName}
              onPress={() => {}}
              selectedIndex={choosenDropdownIndex}
            />
          </View>
          <View style={{marginTop: 14}}>
            <FlexDropdown
              title={t('Pot')}
              index={DROPDOWN.POT}
              onPress={handleChooseDropdown}
              selectedIndex={choosenDropdownIndex}
              value={`${potVolume || '_'} cm³/${potWidth || '_'} cm/${
                potHeight || '_'
              } cm`}
            />
          </View>
          {/* POT dropdown Selection */}
          {choosenDropdownIndex === DROPDOWN.POT && (
            <View style={[styles.dropdownContainer, {marginTop: 14}]}>
              <View style={[styles.potTitle]}>
                <TouchableOpacity
                  style={[
                    styles.potTitleButton,
                    choosenPotIndex === POT.VOLUME && {
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  onPress={() => setChoosenPotIndex(POT.VOLUME)}>
                  <Text
                    style={[
                      styles.potTitleText,
                      choosenPotIndex === POT.VOLUME && {
                        color: theme.colors.text_white,
                      },
                    ]}>
                    {t('Volume')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.potTitleButton,
                    choosenPotIndex === POT.SIZE && {
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  onPress={() => setChoosenPotIndex(POT.SIZE)}>
                  <Text
                    style={[
                      styles.potTitleText,
                      choosenPotIndex === POT.SIZE && {
                        color: theme.colors.text_white,
                      },
                    ]}>
                    {t('Size')}
                  </Text>
                </TouchableOpacity>
              </View>
              {choosenPotIndex === POT.VOLUME ? (
                <View style={[styles.potContent]}>
                  <TextInputComponent
                    placeHolder={'Volume'}
                    keyBoardType="numeric"
                    unit="cm³"
                    value={potVolume}
                    maxLength={7}
                    onChangeText={setPotVolume}
                    isInvalid={!potVolume && checkValidation}
                  />
                </View>
              ) : (
                <View style={[styles.potContent]}>
                  <TextInputComponent
                    placeHolder={'Height'}
                    keyBoardType="numeric"
                    unit="cm"
                    maxLength={5}
                    value={potHeight}
                    onChangeText={setPotHeight}
                    isInvalid={!potHeight && checkValidation}
                  />
                  <View style={{height: 8}}></View>
                  <TextInputComponent
                    placeHolder={'Width'}
                    keyBoardType="numeric"
                    unit="cm"
                    maxLength={5}
                    value={potWidth}
                    onChangeText={setPotWidth}
                    isInvalid={!potWidth && checkValidation}
                  />
                </View>
              )}
            </View>
          )}

          <View style={{marginTop: 14}}>
            <FlexDropdown
              title={t('Humidity')}
              index={DROPDOWN.HUMIDITY}
              value={(Number(humidity) * 100).toString() + '%'}
              onPress={handleChooseDropdown}
              selectedIndex={choosenDropdownIndex}
            />
          </View>
          {/* HUMIDITY dropdown Selection */}
          {choosenDropdownIndex === DROPDOWN.HUMIDITY && (
            <View style={[styles.dropdownContainer, {marginTop: 14}]}>
              <View
                style={[
                  styles.dropdownValueContainer,
                  {borderColor: theme.colors.primary},
                ]}>
                <DynamicallySelectedPicker
                  initialSelectedIndex={0}
                  items={humidityList}
                  height={150}
                  width={dropdownWidth}
                  fontSize={16}
                  transparentItemRows={2}
                  selectedItemBorderColor="rgba(227, 239, 222, 1)"
                  allItemsColor="rgba(75, 109, 78, 1)"
                  onScroll={(value: any) =>
                    setHumidity(String(humidityList[value.index].value))
                  }
                />
              </View>
            </View>
          )}

          <View style={{marginTop: 14}}>
            <FlexDropdown
              title={t('Temperature')}
              index={DROPDOWN.TEMPERATURE}
              onPress={handleChooseDropdown}
              value={Number(temperature).toString() + '°C'}
              selectedIndex={choosenDropdownIndex}
            />
          </View>
          {/* TEMPERATURE dropdown Selection */}
          {choosenDropdownIndex === DROPDOWN.TEMPERATURE && (
            <View style={[styles.dropdownContainer, {marginTop: 14}]}>
              <View
                style={[
                  styles.dropdownValueContainer,
                  {borderColor: theme.colors.primary},
                ]}>
                <DynamicallySelectedPicker
                  initialSelectedIndex={0}
                  items={[
                    {value: 0, label: '0°C'},
                    {value: 10, label: '10°C'},
                    {value: 20, label: '20°C'},
                    {value: 30, label: '30°C'},
                    {value: 40, label: '40°C'},
                    {value: 50, label: '50°C'},
                    {value: 60, label: '60°C'},
                    {value: 70, label: '70°C'},
                    {value: 80, label: '80°C'},
                    {value: 90, label: '90°C'},
                    {value: 100, label: '100°C'},
                  ]}
                  height={150}
                  width={dropdownWidth}
                  fontFamily="Nunito-Bold"
                  fontSize={16}
                  transparentItemRows={2}
                  selectedItemBorderColor="rgba(227, 239, 222, 1)"
                  allItemsColor="rgba(75, 109, 78, 1)"
                  onScroll={(value: any) =>
                    setTemperature(String(tempList[value.index].value))
                  }
                />
              </View>
            </View>
          )}
        </View>
        <View style={{}}>
          {adsRemote.NATIVE_CACULATOR.isOn && (
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                marginBottom: 9,
                marginTop: 10,
              }}>
              <Text
                style={{
                  color: 'rgba(0, 0, 0, 0.68)',
                  fontSize: 12,
                  fontWeight: '500',
                  lineHeight: 14.5,
                }}>
                {`${t('You have')} ${MAX_DAY_TRIAL_CACULATION} ${t(
                  'water calculations per day',
                )}`}
              </Text>
            </View>
          )}
          {/* Button */}
          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.colors.primary}]}
            onPress={handlePressCaculate}>
            <Text style={styles.buttonText}>{`${t('Caculate')} ${
              adsRemote.NATIVE_CACULATOR.isOn
                ? `(${trialWaterCaculation.time}/${MAX_DAY_TRIAL_CACULATION})`
                : ''
            }`}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {adsRemote.NATIVE_CACULATOR.isOn && (
        <NativeBannerSmall adId={ID_ADS_NATIVE} setWaitAds={setWaitingAds} />
      )}
    </SafeAreaView>
  );
};

export default WaterCaculatorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  potContentText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
  },
  headerText: {
    fontFamily: 'Inter-Regular',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 32,
  },
  contentContainer: {
    flex: 1,
  },
  dropdownValueContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  button: {
    borderRadius: 5,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 170,
    alignSelf: 'center',
    opacity: 1,
    marginBottom: 25,
  },
  buttonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  dropdownContainer: {
    paddingHorizontal: 13,
  },
  potTitle: {
    height: 52,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    backgroundColor: 'rgba(227, 239, 222, 1)',
    marginBottom: 14,
    padding: 7,
  },
  potTitleButton: {
    flex: 1,
    height: '100%',
    width: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  potTitleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    lineHeight: 26,
    color: 'rgba(0, 0, 0, 0.65)',
  },
  potContent: {
    gap: 4,
    width: '100%',
  },
});
