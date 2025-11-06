import BottomTabNavigation, {BottomTabParamList} from './BottomTabNavigation';
import {NavigatorScreenParams} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import TestScreen from '~/screens/TestScreen';
import ScanScreen, {e_CamFunc} from '~/screens/bottom-tabs/ScanScreen';
import LanguageScreen from '~/screens/LanguageScreen';
import SplashScreen from '~/screens/SplashScreen';
import OnBoardingScreen from '~/screens/OnBoardingScreen';
import PremiumScreen from '~/screens/premium/PremiumScreen';
import PremiumDetailScreen from '~/screens/premium/PremiumDetailScreen';
import AiChatScreen from '~/screens/AiChatScreen';
import {PURCHASE} from '~/components/premium/PurchaseSelectComponent';
import ExploreDetailScreen from '~/screens/ExploreDetailScreen';
import SearchScreen from '~/screens/SearchScreen';
import FilterScreen from '~/screens/FilterScreen';
import PlantDetailScreen from '~/screens/PlantDetailScreen';
import {
  t_CareGuideDetail,
  t_PlantDetail,
  t_ProblemDetail,
} from '~/@types/plant';
import CareGuideDetailScreen from '~/screens/CareGuideDetailScreen';
import CareGuideScreen from '~/screens/CareGuideScreen';
import CommonProblemScreen from '~/screens/CommonProblemScreen';
import CommonProblemDetailScreen from '~/screens/CommonProblemDetailScreen';
import IdentifyResultScreen from '~/screens/IdentifyResultScreen';
import DiagnoseResultScreen from '~/screens/DiagnoseResultScreen';
import LightMeterScreen from '~/screens/LightMeterScreen';
import WaterCaculatorScreen from '~/screens/WaterCaculatorScreen';
import AddReminderScreen from '~/screens/addReminder/AddReminderScreen';
import SelectPlantScreen from '~/screens/addReminder/SelectPlantScreen';
import SelectTaskScreen from '~/screens/addReminder/SelectTaskScreen';
import SelectScheduleScreen from '~/screens/addReminder/SelectScheduleScreen';
import Login from '~/screens/authen/login';

//Type for RootParamList, contains param pass through each screen
export type RootParamList = {
  BottomTabNavigation: NavigatorScreenParams<BottomTabParamList>;
  TestScreen: undefined;
  ScanScreen: {type: e_CamFunc};
  LanguageScreen: undefined;
  AddReminderScreen: undefined;
  SelectPlantScreen: undefined;
  SelectTaskScreen: undefined;
  SelectScheduleScreen: undefined;
  SplashScreen: undefined;
  OnBoardingScreen: undefined;
  PremiumScreen: {appStart: boolean};
  IdentifyResultScreen: {scannedImage: string; resultList: any[]};
  DiagnoseResultScreen: {scannedImage: string; resultList: any[]};
  PremiumDetailScreen: {
    purchaseType: PURCHASE;
    skusId: string | undefined;
    price: string | undefined;
    currency: string | undefined;
    offerToken: string | undefined;
  };
  AiChatScreen: undefined;
  CareGuideScreen: undefined;
  CommonProblemScreen: undefined;
  CommonProblemDetailScreen: t_ProblemDetail;
  SearchScreen: {searchValue: string | undefined};
  FilterScreen: undefined;
  Login: undefined;
  PlantDetailScreen: t_PlantDetail;
  CareGuideDetailScreen: t_CareGuideDetail;
  ExploreDetailScreen: {
    id: string;
    image: string;
    title: string;
    content: string;
  };
  LightMeterScreen: undefined;
  WaterCaculatorScreen: {plantName: string};
};

//Stack navigation options
const Stack = createStackNavigator<RootParamList>();
const screenOptions = {headerShown: false};

//Root component
const RootNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName="SplashScreen">
      <Stack.Screen
        name="BottomTabNavigation"
        component={BottomTabNavigation}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="ScanScreen"
        component={ScanScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="AddReminderScreen"
        component={AddReminderScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="SelectTaskScreen"
        component={SelectTaskScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="SelectPlantScreen"
        component={SelectPlantScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="SelectScheduleScreen"
        component={SelectScheduleScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="WaterCaculatorScreen"
        component={WaterCaculatorScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="LanguageScreen"
        component={LanguageScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="IdentifyResultScreen"
        component={IdentifyResultScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="FilterScreen"
        component={FilterScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="DiagnoseResultScreen"
        component={DiagnoseResultScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="TestScreen"
        component={TestScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="PremiumScreen"
        component={PremiumScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="PlantDetailScreen"
        component={PlantDetailScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="PremiumDetailScreen"
        component={PremiumDetailScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="OnBoardingScreen"
        component={OnBoardingScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="CareGuideDetailScreen"
        component={CareGuideDetailScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="ExploreDetailScreen"
        component={ExploreDetailScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="AiChatScreen"
        component={AiChatScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="CommonProblemScreen"
        component={CommonProblemScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="CommonProblemDetailScreen"
        component={CommonProblemDetailScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="LightMeterScreen"
        component={LightMeterScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="CareGuideScreen"
        component={CareGuideScreen}
        options={{gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
};

export default RootNavigation;
