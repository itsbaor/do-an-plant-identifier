import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useMemo, useState} from 'react';
import {
  BackHandler,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HomeScreen from '~/screens/bottom-tabs/home/HomeScreen';
import SettingScreen from '~/screens/bottom-tabs/setting/SettingScreen';
import DiagnoseScreen from '~/screens/bottom-tabs/diagnose/DiagnoseScreen';
import GardenScreen, {
  TopTabParamList,
} from '~/screens/bottom-tabs/garden/GardenScreen';
import {useAppTheme} from '~/resources/theme';
import {
  NavigatorScreenParams,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import IconHome from '~/resources/icons/bottom-tabs/IconHome';
import IconSetting from '~/resources/icons/bottom-tabs/IconSetting';
import TemplateScreen from '~/screens/TemplateScreen';
import IconScan from '~/resources/icons/bottom-tabs/IconScan';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from './RootNavigation';
import IconDiagnose from '~/resources/icons/bottom-tabs/IconDiagnose';
import IconGarden from '~/resources/icons/bottom-tabs/IconGarden';
import {useAppSelector} from '~/hooks/useReduxStore';
import {statePremium} from '~/redux/slices/premiumSlice';
import {e_CamFunc} from '~/screens/bottom-tabs/ScanScreen';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';

export type BottomTabParamList = {
  HomeScreen: undefined;
  SettingScreen: undefined;
  DiagnoseScreen: undefined;
  GardenScreen: NavigatorScreenParams<TopTabParamList>;
  TemplateScreen: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();
//COMPONENT
const BottomTabNavigation = () => {
  const theme = useAppTheme();
  const {t} = useTranslation();
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const isPre = useAppSelector(statePremium);
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'BottomTabNavigation'>>();
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      setShowBanner(true);
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        setShowBanner(false);
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );
  return (
    <>
      <Tab.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 65,
            paddingTop: 20,
            borderTopLeftRadius: Platform.OS === 'android' ? 20 : 0,
            borderTopRightRadius: Platform.OS === 'android' ? 20 : 0,
          },
          tabBarItemStyle: {},
        }}>
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={[styles.tabBtn]}>
                <IconHome
                  colors={
                    focused ? theme.colors.tabFocus : theme.colors.tabNotFocus
                  }
                />
                <Text
                  numberOfLines={2}
                  style={[
                    styles.tabText,
                    {
                      color: focused
                        ? theme.colors.tabFocus
                        : theme.colors.tabNotFocus,
                    },
                  ]}>
                  {t('Home')}
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="DiagnoseScreen"
          component={DiagnoseScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={[styles.tabBtn]}>
                <IconDiagnose
                  colors={
                    focused ? theme.colors.tabFocus : theme.colors.tabNotFocus
                  }
                />
                <Text
                  numberOfLines={2}
                  style={[
                    styles.tabText,
                    {
                      color: focused
                        ? theme.colors.tabFocus
                        : theme.colors.tabNotFocus,
                    },
                  ]}>
                  {t('Diagnose')}
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="TemplateScreen"
          component={TemplateScreen}
          options={{
            tabBarButton: props => <TouchableOpacity disabled {...props} />,
            tabBarIcon: ({focused}) => (
              <TouchableOpacity
                style={[styles.tabCenter]}
                onPress={() =>
                  navigation.navigate('ScanScreen', {type: e_CamFunc.IDENTIFY})
                }>
                <IconScan />
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen
          name="GardenScreen"
          component={GardenScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={[styles.tabBtn]}>
                <IconGarden
                  colors={
                    focused ? theme.colors.tabFocus : theme.colors.tabNotFocus
                  }
                />
                <Text
                  numberOfLines={2}
                  style={[
                    styles.tabText,
                    {
                      color: focused
                        ? theme.colors.tabFocus
                        : theme.colors.tabNotFocus,
                    },
                  ]}>
                  {t('Garden')}
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="SettingScreen"
          component={SettingScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={[styles.tabBtn]}>
                <IconSetting
                  colors={
                    focused ? theme.colors.tabFocus : theme.colors.tabNotFocus
                  }
                />
                <Text
                  numberOfLines={2}
                  style={[
                    styles.tabText,
                    {
                      color: focused
                        ? theme.colors.tabFocus
                        : theme.colors.tabNotFocus,
                    },
                  ]}>
                  {t('Profile')}
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  tabCenter: {
    top: -45,
  },
  tabBtn: {
    height: 65,
    alignItems: 'center',
    gap: 1,
  },
  tabText: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
    width: SCREEN_WIDTH / 5.3,
    textAlign: 'center',
  },
});

export default BottomTabNavigation;
