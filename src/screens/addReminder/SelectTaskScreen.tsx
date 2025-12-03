import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import {statePremium} from '~/redux/slices/premiumSlice';
import Config from 'react-native-config';
import HeaderWithBack from '~/components/HeaderWithBack';
import {statePlantStorage} from '~/redux/slices/plantStorageSlice';
import PlantItem from '~/components/search/PlantItem';
import {
  e_Task,
  setStateReminder,
  stateReminder,
} from '~/redux/slices/reminderSlice';

const SelectTaskScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'SelectTaskScreen'>>();
  const route = useRoute<RouteProp<RootParamList>>();
  const {openModal, closeModals} = useModal();
  const isPre = useAppSelector(statePremium);
  const g_plantStorage = useAppSelector(statePlantStorage);
  const g_reminder = useAppSelector(stateReminder);

  const theme = useAppTheme();

  const handleChooseTask = (task: e_Task) => {
    dispatch(setStateReminder({...g_reminder, task}));
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      <HeaderWithBack
        handleGoBack={() => navigation.goBack()}
        title={t('Select a task')}
      />
      <View style={{flex: 1, paddingHorizontal: 20, gap: 15}}>
        <Text style={{fontSize: 18, color: theme.colors.text_black}}>
          {t('Select the type of reminder you want to create')}
        </Text>
        <View style={{flex: 1, gap: 10}}>
          <TouchableOpacity
            onPress={() => {
              handleChooseTask(e_Task.WATERING);
            }}
            style={{
              width: '100%',
              borderRadius: 5,
              borderWidth: 1,
              backgroundColor:
                g_reminder.task == e_Task.WATERING
                  ? theme.colors.primary
                  : theme.colors.bg_white,
              borderColor:
                g_reminder.task == e_Task.WATERING
                  ? theme.colors.primary
                  : theme.colors.primary_dark,
              alignItems: 'center',
              paddingVertical: 15,
              gap: 5,
              position: 'relative',
            }}>
            <View
              style={{
                position: 'absolute',
                height: '120%',
                aspectRatio: 74 / 58,
                bottom: 0,
                right: 10,
              }}>
              <Image
                source={require('~/resources/images/garden/waterReminder.png')}
                resizeMode="cover"
                style={{
                  height: '100%',
                  aspectRatio: 74 / 58,
                }}
              />
            </View>
            <Text
              style={{
                color:
                  g_reminder.task == e_Task.WATERING
                    ? theme.colors.text_white
                    : theme.colors.text_black,
                fontSize: 16,
                fontWeight: '700',
              }}>
              {t('Watering')}
            </Text>
            <Text
              style={{
                color:
                  g_reminder.task == e_Task.WATERING
                    ? theme.colors.text_white
                    : theme.colors.text_black,
                fontSize: 10,
                fontWeight: '400',
              }}>
              {t('Remind to water you plant regularly!!')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleChooseTask(e_Task.FERTILIZING);
            }}
            style={{
              width: '100%',
              borderRadius: 5,
              borderWidth: 1,
              backgroundColor:
                g_reminder.task == e_Task.FERTILIZING
                  ? theme.colors.primary
                  : theme.colors.bg_white,
              borderColor:
                g_reminder.task == e_Task.FERTILIZING
                  ? theme.colors.primary
                  : theme.colors.primary_dark,
              alignItems: 'center',
              paddingVertical: 15,
              gap: 5,
              position: 'relative',
            }}>
            <View
              style={{
                position: 'absolute',
                height: '120%',
                aspectRatio: 74 / 58,
                bottom: 0,
                right: 10,
              }}>
              <Image
                source={require('~/resources/images/garden/fertilizeReminder.png')}
                resizeMode="cover"
                style={{
                  height: '100%',
                  aspectRatio: 74 / 58,
                }}
              />
            </View>
            <Text
              style={{
                color:
                  g_reminder.task == e_Task.FERTILIZING
                    ? theme.colors.text_white
                    : theme.colors.text_black,
                fontSize: 16,
                fontWeight: '700',
              }}>
              {t('Fertilizing')}
            </Text>
            <Text
              style={{
                color:
                  g_reminder.task == e_Task.FERTILIZING
                    ? theme.colors.text_white
                    : theme.colors.text_black,
                fontSize: 10,
                fontWeight: '400',
              }}>
              {t('Remind you to fertilize you plant')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelectTaskScreen;

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
