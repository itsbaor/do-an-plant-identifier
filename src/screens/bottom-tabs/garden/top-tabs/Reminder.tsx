import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {useAppTheme} from '~/resources/theme';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import IconClock from '~/resources/icons/IconClock';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import {statePlantStorage} from '~/redux/slices/plantStorageSlice';
import {useModal} from 'react-native-modalfy';
import {e_CamFunc} from '../../ScanScreen';
import {
  setStateReminderStorage,
  stateReminderStorage,
} from '~/redux/slices/reminderStorageSlice';
import IconRemove from '~/resources/icons/garden/IconRemove';
import {e_Task} from '~/redux/slices/reminderSlice';
import IconWater from '~/resources/icons/garden/IconWater';
import IconFertilize from '~/resources/icons/garden/IconFertilize';
import {
  removeAllReminderFromStorage,
  removeReminderFromStorage,
} from '~/utils/reminderStorage';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import notifee from '@notifee/react-native';

export const KEY_REMINDER_LIST = '@keyReminderList';

const Reminder = () => {
  const {t} = useTranslation();
  const {openModal, closeModals} = useModal();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const route = useRoute();
  const g_plantStorage = useAppSelector(statePlantStorage);
  const g_reminderStorage = useAppSelector(stateReminderStorage);
  const theme = useAppTheme();

  const handleOpenIdentCam = () => {
    navigation.navigate('ScanScreen', {type: e_CamFunc.IDENTIFY});
    closeModals('AddPlantModal');
  };
  const handleOpenSearch = () => {
    navigation.navigate('SearchScreen', {searchValue: undefined});
    closeModals('AddPlantModal');
  };

  const handleOpenAddPlantModal = () => {
    openModal('AddPlantModal', {
      openIdentCam: handleOpenIdentCam,
      openSearch: handleOpenSearch,
    });
  };

  const openConfirmModal = (plantName: string, task: e_Task) => {
    openModal('RemoveSingleReminderModal', {
      actionDelete: () => handleDeteleReminder(plantName, task),
    });
  };

  const handleDeteleReminder = async (plantName: string, task: e_Task) => {
    try {
      await notifee.deleteChannel(task + plantName); // Replace with your actual channel ID
      console.log('Notification channel deleted successfully');
      closeModals('RemoveSingleReminderModal');
      const res = await removeReminderFromStorage(plantName, task);
      dispatch(setStateReminderStorage(res));
      Notifier.showNotification({
        title: t('Success'),
        description: t('Remove reminders successfully.'),
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: 'success',
        },
      });
    } catch (error) {
      console.log('Error deleting notification channel:', error);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      {g_plantStorage.length ? (
        g_reminderStorage.length ? (
          <View style={{flex: 1, width: '100%'}}>
            <TouchableOpacity
              style={{
                width: '100%',
                paddingVertical: 8,
                borderRadius: 5,
                backgroundColor: theme.colors.primary,
                marginBottom: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 5,
              }}
              onPress={() => navigation.navigate('AddReminderScreen')}>
              <IconClock />
              <Text
                style={{
                  color: theme.colors.text_white,
                  fontWeight: '600',
                  fontSize: 18,
                }}>
                {t('Add Reminder')}
              </Text>
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <ScrollView>
                {g_reminderStorage.map((reminder, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      key={index}
                      disabled
                      style={{
                        width: '100%',
                        height: 90,
                        borderRadius: 5,
                        backgroundColor: theme.colors.bg_white,
                        borderColor: theme.colors.primary_dark,
                        borderWidth: 1,
                        marginBottom: 10,
                        padding: 10,
                        flexDirection: 'row',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 0.6,
                          alignItems: 'center',
                          gap: 10,
                          justifyContent: 'flex-start',
                        }}>
                        <Image
                          source={
                            (typeof reminder.plantImage == 'string'
                              ? {uri: reminder.plantImage}
                              : reminder.plantImage) as unknown as ImageSourcePropType
                          }
                          resizeMode="cover"
                          style={{
                            aspectRatio: 1,
                            height: '100%',
                            borderRadius: 5,
                          }}
                        />
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: 12,
                            color: theme.colors.text_black,
                          }}>
                          {reminder.plantName}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0.4,
                          alignItems: 'flex-end',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            gap: 10,
                          }}>
                          <Text
                            style={{
                              color: theme.colors.text_black,
                              fontSize: 12,
                              fontWeight: '600',
                            }}>
                            {t(reminder.task)}
                          </Text>
                          {reminder.task === e_Task.WATERING && <IconWater />}
                          {reminder.task === e_Task.FERTILIZING && (
                            <IconFertilize />
                          )}
                        </View>
                        <TouchableOpacity
                          style={{}}
                          onPress={() =>
                            openConfirmModal(reminder.plantName, reminder.task)
                          }>
                          <IconRemove height={16} width={12} />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        ) : (
          <>
            <Text
              style={[
                styles.title,
                {color: theme.colors.primary_dark, marginTop: 100},
              ]}>
              {t('No reminders')}
            </Text>
            <Text style={[styles.title2, {color: theme.colors.text_black}]}>
              {t('Tap to add your first reminder')}
            </Text>
            <TouchableOpacity
              style={[
                {
                  borderRadius: 5,
                  backgroundColor: theme.colors.primary,
                  paddingVertical: 12,
                  paddingHorizontal: 30,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                },
              ]}
              onPress={() => navigation.navigate('AddReminderScreen')}>
              <IconClock />
              <Text style={[styles.btnText, {color: theme.colors.text_white}]}>
                {t('Add Reminder')}
              </Text>
            </TouchableOpacity>
          </>
        )
      ) : (
        <>
          <Image
            style={[{height: 227, aspectRatio: 330 / 227, marginTop: 50}]}
            resizeMode="contain"
            source={require('~/resources/images/garden/backgroudgarden.png')}></Image>
          <Text style={[styles.title, {color: theme.colors.primary_dark}]}>
            {t("You don't have any plants")}
          </Text>
          <Text style={[styles.title2, {color: theme.colors.text_black}]}>
            {t('Add your first plants and start caring for it')}
          </Text>
          <TouchableOpacity
            style={[
              {
                borderRadius: 5,
                backgroundColor: theme.colors.primary,
                paddingVertical: 12,
                paddingHorizontal: 50,
              },
            ]}
            onPress={handleOpenAddPlantModal}>
            <Text style={[styles.btnText, {color: theme.colors.text_white}]}>
              {t('Add Plant')}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Reminder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 15,
  },
  title: {
    marginBottom: 5,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  title2: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
