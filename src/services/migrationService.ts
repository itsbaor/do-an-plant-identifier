/**
 * Migration Service
 *
 * Handles one-time migration of plant and reminder data from AsyncStorage to backend
 *
 * Features:
 * - Check migration status to prevent duplicate migrations
 * - Migrate plants from AsyncStorage to backend
 * - Migrate reminders from AsyncStorage to backend
 * - Track migration statistics
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {t_PlantType} from '~/@types/plant';
import {t_Reminder} from '~/redux/slices/reminderSlice';
import {bulkUploadPlants} from './plantService';
import {bulkUploadReminders} from './reminderService';

const MIGRATION_STATUS_KEY = '@migration_status';
const PLANT_LIST_KEY = '@plant_list';
const REMINDER_LIST_KEY = '@keyReminderList';

export interface MigrationStatus {
  migrated: boolean;
  migratedAt?: string;
  plantsMigrated: number;
  remindersMigrated: number;
}

/**
 * Check if migration has already been completed
 */
export const getMigrationStatus = async (): Promise<MigrationStatus | null> => {
  try {
    const statusData = await AsyncStorage.getItem(MIGRATION_STATUS_KEY);
    return statusData ? JSON.parse(statusData) : null;
  } catch (error) {
    console.error('Error reading migration status:', error);
    return null;
  }
};

/**
 * Save migration status
 */
const saveMigrationStatus = async (status: MigrationStatus): Promise<void> => {
  try {
    await AsyncStorage.setItem(MIGRATION_STATUS_KEY, JSON.stringify(status));
  } catch (error) {
    console.error('Error saving migration status:', error);
  }
};

/**
 * Migrate AsyncStorage data to backend
 * This should be called on first login after app update
 */
export const migrateDataToBackend = async (): Promise<{
  success: boolean;
  error?: string;
  plantsMigrated?: number;
  remindersMigrated?: number;
}> => {
  try {
    // Check if already migrated
    const migrationStatus = await getMigrationStatus();
    if (migrationStatus?.migrated) {
      console.log('Data already migrated, skipping...');
      return {
        success: true,
        plantsMigrated: migrationStatus.plantsMigrated,
        remindersMigrated: migrationStatus.remindersMigrated,
      };
    }

    console.log('Starting data migration from AsyncStorage to backend...');

    // 1. Migrate Plants
    let plantsMigrated = 0;
    const plantData = await AsyncStorage.getItem(PLANT_LIST_KEY);
    if (plantData) {
      const plants: t_PlantType[] = JSON.parse(plantData);
      if (plants.length > 0) {
        const plantResult = await bulkUploadPlants(plants);
        if (!plantResult.success) {
          throw new Error(`Plant migration failed: ${plantResult.error}`);
        }
        plantsMigrated = plantResult.data?.inserted || 0;
        console.log(
          `Migrated ${plantsMigrated} plants (${plantResult.data?.skipped || 0} skipped as duplicates)`,
        );
      }
    }

    // 2. Migrate Reminders
    let remindersMigrated = 0;
    const reminderData = await AsyncStorage.getItem(REMINDER_LIST_KEY);
    if (reminderData) {
      const reminders: t_Reminder[] = JSON.parse(reminderData);
      if (reminders.length > 0) {
        const reminderResult = await bulkUploadReminders(reminders);
        if (!reminderResult.success) {
          throw new Error(`Reminder migration failed: ${reminderResult.error}`);
        }
        remindersMigrated = reminderResult.data?.inserted || 0;
        console.log(
          `Migrated ${remindersMigrated} reminders (${reminderResult.data?.skipped || 0} skipped as duplicates)`,
        );
      }
    }

    // 3. Save migration status
    const status: MigrationStatus = {
      migrated: true,
      migratedAt: new Date().toISOString(),
      plantsMigrated,
      remindersMigrated,
    };
    await saveMigrationStatus(status);

    // 4. Keep AsyncStorage data as backup (don't delete)
    // Users can manually clear if needed

    console.log('Migration completed successfully!');
    return {success: true, plantsMigrated, remindersMigrated};
  } catch (error: any) {
    console.error('Migration failed:', error);
    return {success: false, error: error.message || 'Migration failed'};
  }
};

/**
 * Reset migration status (for testing purposes)
 */
export const resetMigrationStatus = async (): Promise<void> => {
  await AsyncStorage.removeItem(MIGRATION_STATUS_KEY);
  console.log('Migration status reset');
};
