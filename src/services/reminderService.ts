/**
 * Reminder Service
 *
 * Handles reminder data synchronization with backend API
 *
 * Features:
 * - Fetch reminders from backend
 * - Add/remove reminders with backend sync
 * - Bulk upload for migration
 * - Notification channel management
 */

import {Platform} from 'react-native';
import {getAuthToken} from './authService';
import {t_Reminder} from '~/redux/slices/reminderSlice';

const getApiBaseUrl = (): string => {
  const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL as string;
  if (envBaseUrl) return envBaseUrl;
  return Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';
};

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetch all reminders from backend
 */
export const fetchRemindersFromBackend = async (): Promise<
  ApiResponse<t_Reminder[]>
> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {success: false, error: 'Not authenticated'};
    }

    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/reminders`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || 'Failed to fetch reminders',
      };
    }

    const data = await response.json();

    // Transform backend format to frontend format
    const reminders: t_Reminder[] = data.reminders.map((reminder: any) => ({
      plantName: reminder.plant_name,
      plantImage: reminder.plant_image,
      task: reminder.task,
      repeat: reminder.repeat_frequency,
      timeRepeate: reminder.time_repeat,
      createDate: reminder.create_date,
    }));

    return {success: true, data: reminders};
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return {success: false, error: 'Network error'};
  }
};

/**
 * Add reminder to backend
 */
export const addReminderToBackend = async (
  reminder: t_Reminder,
  deviceToken?: string,
): Promise<ApiResponse<{reminderId: number; notificationChannelId: string}>> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {success: false, error: 'Not authenticated'};
    }

    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/reminders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plantName: reminder.plantName,
        plantImage: reminder.plantImage,
        task: reminder.task,
        repeat: reminder.repeat,
        timeRepeate: reminder.timeRepeate,
        createDate: reminder.createDate,
        deviceToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || 'Failed to add reminder',
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        reminderId: data.reminderId,
        notificationChannelId: data.notificationChannelId,
      },
    };
  } catch (error) {
    console.error('Error adding reminder:', error);
    return {success: false, error: 'Network error'};
  }
};

/**
 * Remove reminder from backend
 */
export const removeReminderFromBackend = async (
  plantName: string,
  task: string,
): Promise<ApiResponse<{notificationChannelId: string}>> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {success: false, error: 'Not authenticated'};
    }

    const baseUrl = getApiBaseUrl();
    const response = await fetch(
      `${baseUrl}/api/reminders/${encodeURIComponent(plantName)}/${encodeURIComponent(task)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || 'Failed to remove reminder',
      };
    }

    const data = await response.json();
    return {success: true, data: {notificationChannelId: data.notificationChannelId}};
  } catch (error) {
    console.error('Error removing reminder:', error);
    return {success: false, error: 'Network error'};
  }
};

/**
 * Bulk upload reminders (for migration)
 */
export const bulkUploadReminders = async (
  reminders: t_Reminder[],
): Promise<ApiResponse<{inserted: number; skipped: number}>> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {success: false, error: 'Not authenticated'};
    }

    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/reminders/bulk`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({reminders}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || 'Failed to upload reminders',
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: {inserted: data.inserted, skipped: data.skipped},
    };
  } catch (error) {
    console.error('Error bulk uploading reminders:', error);
    return {success: false, error: 'Network error'};
  }
};
