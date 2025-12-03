import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {useAppTheme} from '~/resources/theme';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import {useModal} from 'react-native-modalfy';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {statePremium} from '~/redux/slices/premiumSlice';
import Config from 'react-native-config';
import HeaderWithBack from '~/components/HeaderWithBack';
import FlexDropdown from '~/components/FlexDropdown';
import {
  actionResetReminder,
  e_Repeat,
  e_Task,
  setStateReminder,
  stateReminder,
  t_Reminder,
} from '~/redux/slices/reminderSlice';
import {TimerPickerModal} from 'react-native-timer-picker';
import {actionAddReminderToStorage} from '~/redux/slices/reminderStorageSlice';
import {addReminderToStorage} from '~/utils/reminderStorage';
import notifee, {
  TimestampTrigger,
  TriggerType,
  AndroidImportance,
  RepeatFrequency,
} from '@notifee/react-native';
import {PermissionsAndroid} from 'react-native';

async function requestNotificationPermission() {
  let isAllowed = false;
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Notification Permission',
        message: 'This app needs access to show notifications.',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      isAllowed = true;
    } else {
      console.log('Notification permission denied');
    }
    return isAllowed;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

async function scheduleNotification(reminderObj: t_Reminder) {
  const channelId = reminderObj.task + reminderObj.plantName;
  // Create a channel (required for Android)
  await notifee.createChannel({
    id: channelId,
    name: `${reminderObj.repeat} Notifications`,
    importance: AndroidImportance.HIGH,
  });
  const date = new Date(Date.now());
  const [hour, min, sec] = reminderObj.timeRepeate.split(':');
  date.setHours(Number(hour), Number(min), Number(sec), 0);
  // if (date.getTime() < Date.now()) {
  //   date.setDate(date.getDate() + 1);
  // }
  // Create the trigger
  const freq =
    reminderObj.repeat == e_Repeat.DAILY
      ? RepeatFrequency.DAILY
      : reminderObj.repeat == e_Repeat.WEEKLY
      ? RepeatFrequency.WEEKLY
      : RepeatFrequency.HOURLY;
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
    repeatFrequency: freq, // Repeat daily
  };
  // Schedule the notification
  await notifee.createTriggerNotification(
    {
      title: reminderObj.task,
      body: `Your ${reminderObj.plantName} needs to be ${reminderObj.task}`,
      android: {
        channelId: channelId,
        smallIcon: 'ic_launcher', // Ensure this icon is in your Android resources
      },
    },
    trigger,
  );
}

const AddReminderScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const route = useRoute<RouteProp<RootParamList>>();
  const {openModal, closeModals} = useModal();
  const g_reminder = useAppSelector(stateReminder);
  const [isNoti, setIsNoti] = useState(false);
  const isPre = useAppSelector(statePremium);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const theme = useAppTheme();

  const formatTime = ({
    hours,
    minutes,
    seconds,
  }: {
    hours?: number;
    minutes?: number;
    seconds?: number;
  }) => {
    const timeParts = [];
    if (hours !== undefined) {
      timeParts.push(hours.toString().padStart(2, '0'));
    }
    if (minutes !== undefined) {
      timeParts.push(minutes.toString().padStart(2, '0'));
    }
    if (seconds !== undefined) {
      timeParts.push(seconds.toString().padStart(2, '0'));
    }
    return timeParts.join(':');
  };

  const handlePressSetReminder = async () => {
    const dateString = new Date().toISOString();
    const reminderObj = g_reminder;
    reminderObj.createDate = dateString;
    try {
      const res = await addReminderToStorage(reminderObj);
      if (res.success) {
        Notifier.showNotification({
          title: t('Success'),
          description: t('Add reminder successfully.'),
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: 'success',
          },
        });
        isNoti && scheduleNotification(reminderObj);
        dispatch(actionAddReminderToStorage(reminderObj));
        navigation.goBack();
      } else {
        Notifier.showNotification({
          title: t('Duplicate'),
          description: t(
            'The reminder for this plant in this task has already been setup!',
          ),
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: 'error',
          },
        });
      }
    } catch (error) {
      Notifier.showNotification({
        title: t('Error'),
        description: t('Failed to set reminder! Try again later!'),
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: 'error',
        },
      });
    }
  };

  //Refresh global state in reminder
  useEffect(() => {
    dispatch(actionResetReminder());
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const getPermission = async () => {
        const isPermit = await requestNotificationPermission();
        setIsNoti(isPermit);
      };
      getPermission();
      return () => {};
    }, []),
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      <TimerPickerModal
        visible={showTimePicker}
        setIsVisible={setShowTimePicker}
        onConfirm={pickedDuration => {
          dispatch(
            setStateReminder({
              ...g_reminder,
              timeRepeate: formatTime(pickedDuration),
            }),
          );
          setShowTimePicker(false);
        }}
        modalTitle="Select time"
        onCancel={() => setShowTimePicker(false)}
        closeOnOverlayPress
        use12HourPicker
        styles={{
          theme: 'light',
        }}
      />
      <HeaderWithBack
        handleGoBack={() => navigation.goBack()}
        title={t('Add Reminder')}
      />
      <View style={{flex: 1, gap: 15, paddingHorizontal: 20}}>
        <FlexDropdown
          title={t('Plant')}
          value={t(g_reminder.plantName || 'Select a plant')}
          onPress={() => navigation.navigate('SelectPlantScreen')}
        />
        <FlexDropdown
          title={t('Remind me about')}
          value={t(g_reminder.task || 'Select a task')}
          onPress={() => navigation.navigate('SelectTaskScreen')}
        />
        <FlexDropdown
          title={t('Repeat')}
          value={t(g_reminder.repeat || 'Select a repeat')}
          onPress={() => navigation.navigate('SelectScheduleScreen')}
        />
        <FlexDropdown
          title={t('Time')}
          value={g_reminder.timeRepeate}
          onPress={() => setShowTimePicker(true)}
        />
        <TouchableOpacity
          onPress={handlePressSetReminder}
          disabled={
            g_reminder.plantName == '' ||
            g_reminder.repeat == e_Repeat.NONE ||
            g_reminder.task == e_Task.NONE
          }
          style={{
            width: '100%',
            borderRadius: 5,
            backgroundColor: theme.colors.primary,
            marginTop: 30,
            opacity:
              g_reminder.plantName == '' ||
              g_reminder.repeat == e_Repeat.NONE ||
              g_reminder.task == e_Task.NONE
                ? 0.5
                : 1,
          }}>
          <Text
            style={{
              fontSize: 18,
              paddingVertical: 15,
              fontWeight: '600',
              color: theme.colors.text_white,
              textAlign: 'center',
            }}>
            {t('Set Reminder')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddReminderScreen;

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
