import AsyncStorage from '@react-native-async-storage/async-storage';
import {e_Task, t_Reminder} from '~/redux/slices/reminderSlice';
import {KEY_REMINDER_LIST} from '~/screens/bottom-tabs/garden/top-tabs/Reminder';
import notifee from '@notifee/react-native';
import {
  addReminderToBackend,
  removeReminderFromBackend,
  fetchRemindersFromBackend,
} from '~/services/reminderService';
import {getAuthToken, getUserData} from '~/services/authService';

/**
 * Add reminder - syncs to backend if user is authenticated
 */
export const addReminderToStorage = async (reminder: t_Reminder) => {
  try {
    const token = await getAuthToken();

    if (token) {
      // User is authenticated - use backend
      const result = await addReminderToBackend(reminder);

      if (!result.success) {
        return {success: false, error: result.error};
      }

      // Fetch updated list from backend
      const remindersResult = await fetchRemindersFromBackend();
      if (remindersResult.success && remindersResult.data) {
        return {success: true, updateList: remindersResult.data};
      }

      return {success: true};
    } else {
      // User not authenticated - fallback to AsyncStorage (legacy)
      const data = await AsyncStorage.getItem(KEY_REMINDER_LIST);
      let currentReminderList: t_Reminder[] = [];
      if (data) {
        currentReminderList = JSON.parse(data);
        if (
          currentReminderList.find(
            item =>
              item.plantName === reminder.plantName &&
              item.task === reminder.task,
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
    }
  } catch (error) {
    console.error('Error adding reminder:', error);
    return {success: false, error: 'Failed to add reminder'};
  }
};

/**
 * Remove reminder - syncs to backend if user is authenticated
 * IMPORTANT: Now uses userId in notification channel ID
 */
export const removeReminderFromStorage = async (
  plantName: string,
  task: e_Task,
) => {
  try {
    const token = await getAuthToken();

    if (token) {
      // User is authenticated - use backend
      const result = await removeReminderFromBackend(plantName, task);

      if (result.success && result.data?.notificationChannelId) {
        // Delete notification channel with userId-based ID
        await notifee.deleteChannel(result.data.notificationChannelId);
      }

      // Fetch updated list from backend
      const remindersResult = await fetchRemindersFromBackend();
      if (remindersResult.success && remindersResult.data) {
        return remindersResult.data;
      }

      return [];
    } else {
      // User not authenticated - fallback to AsyncStorage (legacy)
      const data = await AsyncStorage.getItem(KEY_REMINDER_LIST);
      let currentReminderList: t_Reminder[] = [];
      if (data) {
        currentReminderList = JSON.parse(data);
        currentReminderList = currentReminderList.filter(
          item => item.plantName !== plantName || item.task !== task,
        );

        // Delete old-format notification channel
        const userData = await getUserData();
        const channelId = userData
          ? `${task}_${plantName}_${userData.id}`
          : `${task}${plantName}`;
        await notifee.deleteChannel(channelId);

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
    }
  } catch (error) {
    console.error('Error removing reminder:', error);
    return [];
  }
};

/**
 * Fetch reminders - checks backend first if authenticated
 */
export const fetchReminders = async (): Promise<t_Reminder[]> => {
  try {
    const token = await getAuthToken();

    if (token) {
      // User is authenticated - fetch from backend
      const result = await fetchRemindersFromBackend();

      if (result.success && result.data) {
        return result.data;
      }

      console.error('Failed to fetch reminders from backend:', result.error);
      return [];
    } else {
      // User not authenticated - fallback to AsyncStorage (legacy)
      const data = await AsyncStorage.getItem(KEY_REMINDER_LIST);
      return data ? JSON.parse(data) : [];
    }
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return [];
  }
};

/**
 * Remove all reminders from AsyncStorage (legacy function)
 * IMPORTANT: Now uses userId in notification channel ID
 */
export const removeAllReminderFromStorage = async () => {
  const data = await AsyncStorage.getItem(KEY_REMINDER_LIST);
  if (data) {
    AsyncStorage.removeItem(KEY_REMINDER_LIST);
    const currentReminderList: t_Reminder[] = JSON.parse(data);
    const userData = await getUserData();

    for (const item of currentReminderList) {
      // Use new format with userId if available, fallback to old format
      const channelId = userData
        ? `${item.task}_${item.plantName}_${userData.id}`
        : `${item.task}${item.plantName}`;
      await notifee.deleteChannel(channelId);
    }
  }
};
