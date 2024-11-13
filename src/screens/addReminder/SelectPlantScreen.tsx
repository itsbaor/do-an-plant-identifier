import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {useAppTheme} from '~/resources/theme';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import {useModal} from 'react-native-modalfy';
import {Notifier} from 'react-native-notifier';
import {stateAdsRemote} from '~/redux/slices/adsRemoteSlice';
import {statePremium} from '~/redux/slices/premiumSlice';
import Config from 'react-native-config';
import HeaderWithBack from '~/components/HeaderWithBack';
import NativeBannerSmall from '~/components/ads/NativeBannerSmall';
import PlantItem from '~/components/search/PlantItem';
import {statePlantStorage} from '~/redux/slices/plantStorageSlice';
import {setStateReminder, stateReminder} from '~/redux/slices/reminderSlice';

const SelectPlantScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'SelectPlantScreen'>>();
  const {openModal, closeModals} = useModal();
  const adsRemote = useAppSelector(stateAdsRemote);
  const isPre = useAppSelector(statePremium);
  const g_plantStorage = useAppSelector(statePlantStorage);
  const g_reminder = useAppSelector(stateReminder);
  const [waitingAds, setWaitingAds] = useState<boolean>(
    adsRemote.NATIVE_REMINDER.isOn,
  );
  const ID_ADS = __DEV__ ? undefined : adsRemote.NATIVE_REMINDER.id;

  const theme = useAppTheme();

  const handleChoosePlantReminder = (
    plantName: string,
    plantImage: string | NodeRequire,
  ) => {
    dispatch(setStateReminder({...g_reminder, plantName, plantImage}));
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      <HeaderWithBack
        handleGoBack={() => navigation.goBack()}
        title={t('Select a plant')}
        waitingAds={waitingAds}
      />
      <View style={{flex: 1, paddingHorizontal: 20, gap: 15}}>
        <Text style={{fontSize: 18, color: theme.colors.text_black}}>
          {t('Select the type of reminder you want to create')}
        </Text>
        <View style={{flex: 1}}>
          <ScrollView>
            {g_plantStorage.map((plant, index) => (
              <PlantItem
                key={index}
                plant={plant}
                handleOpenDetails={() =>
                  handleChoosePlantReminder(plant.name, plant.image)
                }
                isDisable={waitingAds}
              />
            ))}
          </ScrollView>
        </View>
      </View>
      {adsRemote.NATIVE_REMINDER.isOn && (
        <NativeBannerSmall adId={ID_ADS} setWaitAds={setWaitingAds} />
      )}
    </SafeAreaView>
  );
};

export default SelectPlantScreen;

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
});
