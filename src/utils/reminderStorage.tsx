import AsyncStorage from '@react-native-async-storage/async-storage';
import {e_Task, t_Reminder} from '~/redux/slices/reminderSlice';
import {KEY_REMINDER_LIST} from '~/screens/bottom-tabs/garden/top-tabs/Reminder';
import notifee from '@notifee/react-native';

export const addReminderToStorage = async (reminder: t_Reminder) => {
  const data = await AsyncStorage.getItem(KEY_REMINDER_LIST);
  let currentReminderList: t_Reminder[] = [];
  if (data) {
    currentReminderList = JSON.parse(data);
    //Check if the plant exists in currentReminderList
    if (
      currentReminderList.find(
        item =>
          item.plantName === reminder.plantName && item.task === reminder.task,
      )
    ) {
      return {success: false};
    }
  }
  await AsyncStorage.setItem(
    KEY_REMINDER_LIST,
    JSON.stringify([reminder, ...currentReminderList]),
  );
  return {success: true, updateList: [reminder, ...currentReminderList]};
};

export const removeReminderFromStorage = async (
  plantName: string,
  task: e_Task,
) => {
  const data = await AsyncStorage.getItem(KEY_REMINDER_LIST);
  let currentReminderList: t_Reminder[] = [];
  if (data) {
    currentReminderList = JSON.parse(data);
    currentReminderList = currentReminderList.filter(
      item => item.plantName !== plantName || item.task !== task,
    );
    if (currentReminderList.length === 0) {
      await AsyncStorage.removeItem(KEY_REMINDER_LIST);
    } else {
      await AsyncStorage.setItem(
        KEY_REMINDER_LIST,
        JSON.stringify(currentReminderList),
      );
    }
  }
  return currentReminderList;
};

export const removeAllReminderFromStorage = async () => {
  //get add itme with key KEY_REMINDER_LIST in asyncstorage
  const data = await AsyncStorage.getItem(KEY_REMINDER_LIST);
  if (data) {
    AsyncStorage.removeItem(KEY_REMINDER_LIST);
    const currentReminderList: t_Reminder[] = JSON.parse(data);
    for (const item of currentReminderList) {
      notifee.deleteChannel(item.task + item.plantName);
    }
  }
};
