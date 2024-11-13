import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {useAppTheme} from '~/resources/theme';
import {
  NavigationHelpers,
  ParamListBase,
  Route,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Explore from './top-tabs/Explore';
import MyGarden from './top-tabs/MyGarden';
import Reminder from './top-tabs/Reminder';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
} from '@react-navigation/material-top-tabs';
import {TabBarIndicator, TabBarItem} from 'react-native-tab-view';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import IconRemove from '~/resources/icons/garden/IconRemove';
import {stateRoute} from '~/redux/slices/routeSlice';
import {removeAllPlantsFromStorage} from '~/utils/plantStorage';
import {
  setStatePlantStorage,
  statePlantStorage,
} from '~/redux/slices/plantStorageSlice';
import {useModal} from 'react-native-modalfy';
import {setStateReminderStorage, stateReminderStorage} from '~/redux/slices/reminderStorageSlice';
import { removeAllReminderFromStorage } from '~/utils/reminderStorage';

const Tab = createMaterialTopTabNavigator<TopTabParamList>();

export type TopTabParamList = {
  'My Garden': undefined;
  Reminder: undefined;
  Explore: undefined;
};

const GardenScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {openModal, closeModals} = useModal();
  const [selectItemIndex, setSelectItemIndex] = useState(0);
  const navigationTopTab =
    useNavigation<
      NavigationHelpers<ParamListBase, MaterialTopTabNavigationEventMap>
    >();
  const g_route = useAppSelector(stateRoute);
  // const route = useRoute<RouteProp<RootParamList, 'BottomTabNavigation'>>();
  const g_plantStorage = useAppSelector(statePlantStorage);
  const g_reminderStorage = useAppSelector(stateReminderStorage);
  const theme = useAppTheme();
  const labelTrans = [t('My Garden'), t('Reminder'), t('Explore')];
  const tag = ['My Garden', 'Reminder', 'Explore'];

  const CustomTabBar = ({navigation}: {navigation: any}) => (
    <View
      style={{
        backgroundColor: theme.colors.bg_white,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        padding: 5,
      }}>
      {tag.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            navigation.navigate(tag[index]);
            // setSelectItemIndex(index);
          }}
          style={{
            width: (SCREEN_WIDTH - 40) / 3.1,
            backgroundColor:
              index === selectItemIndex
                ? theme.colors.primary
                : theme.colors.bg_white,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
          }}>
          <Text
            numberOfLines={2}
            style={{
              textAlign: 'center',
              fontSize: 14,
              // marginTop: 2,
              fontWeight: '500',
              color:
                index === selectItemIndex
                  ? theme.colors.text_white
                  : theme.colors.text_black,
            }}>
            {t(item)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const handleDeleteAllPlants = () => {
    closeModals('RemoveAllModal');
    removeAllPlantsFromStorage();
    dispatch(setStatePlantStorage([]));
  };

  const handleDeleteAllReminders = () => {
    closeModals('RemoveAllModal');
    removeAllReminderFromStorage();
    dispatch(setStateReminderStorage([]));
  };

  const openConfirmDetelePlants = () => {
    openModal('RemoveAllModal', {
      title: 'Remove All Plants',
      actionDelete: handleDeleteAllPlants,
      message: 'This action cannot be undone',
    });
  };

  const openConfirmDeteleReminders = () => {
    openModal('RemoveAllModal', {
      title: 'Remove All Reminders',
      actionDelete: handleDeleteAllReminders,
      message: 'This action cannot be undone',
    });
  };

  useEffect(() => {
    g_route === 'My Garden' && setSelectItemIndex(0);
    g_route === 'Reminder' && setSelectItemIndex(1);
    g_route === 'Explore' && setSelectItemIndex(2);
  }, [g_route]);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      <View
        style={{
          width: '100%',
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 20,
        }}>
        <View style={{width: 20}}></View>
        <Text style={[styles.header, {color: theme.colors.primary_dark}]}>
          {t('Garden')}
        </Text>
        {g_route === 'My Garden' &&
          (g_plantStorage.length ? (
            <TouchableOpacity style={{}} onPress={openConfirmDetelePlants}>
              <IconRemove width={20} height={24} />
            </TouchableOpacity>
          ) : (
            <View style={{width: 20}}></View>
          ))}
        {g_route === 'Reminder' &&
          (g_reminderStorage.length ? (
            <TouchableOpacity style={{}} onPress={openConfirmDeteleReminders}>
              <IconRemove width={20} height={24} />
            </TouchableOpacity>
          ) : (
            <View style={{width: 20}}></View>
          ))}
        {g_route === 'Explore' && <View style={{width: 20}}></View>}
      </View>
      <View style={[styles.ph_20, {flex: 1}]}>
        <Tab.Navigator
          tabBar={props => <CustomTabBar {...props} />}
          screenOptions={{
            swipeEnabled: true,
            tabBarPressColor: theme.colors.primary,
            lazy: true,
            tabBarStyle: {
              backgroundColor: theme.colors.bg_white,
              borderRadius: 5,
            },
            tabBarActiveTintColor: theme.colors.primary,
          }}>
          <Tab.Screen name={'My Garden'} component={MyGarden} />
          <Tab.Screen name={'Reminder'} component={Reminder} />
          <Tab.Screen name={'Explore'} component={Explore} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default GardenScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: 15,
  },
  ph_20: {
    paddingHorizontal: 20,
  },
});
