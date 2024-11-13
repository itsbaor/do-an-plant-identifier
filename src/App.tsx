/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import {PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import {store} from './redux/store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import TestScreen from './screens/TestScreen';
import AppOpenAdsProvider from './contexts/AppOpenAdsProvider';
import InternetCheckerProvider from './contexts/InternetCheckerProvider';
import {theme} from './resources/theme';
import NavigationProvider from './navigations/NavigationProvider';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import crashlytics from '@react-native-firebase/crashlytics';
import {ModalProvider, createModalStack} from 'react-native-modalfy';
import NetInfo from '@react-native-community/netinfo';
import RootNavigation from './navigations/RootNavigation';
import NoInternetScreen from './screens/NoInternetScreen';
import LoadingModal from './components/modals/LoadingModals';
import {NotifierWrapper} from 'react-native-notifier';
import AddPlantModal from './components/modals/AddPlantModal';
import RemoveAllModal from './components/modals/RemoveAllModal';
import RemoveSinglePlantModal from './components/modals/RemoveSinglePlantModal';
import ChoosePlantModal from './components/modals/ChoosePlantModal';
import InformWaterNeedModal from './components/modals/InformWaterNeedModal';
import RemoveSingleReminderModal from './components/modals/RemoveSingleReminderModal';

export const TIME_DELAY = 2000;

if (Platform.OS === 'android') {
  SystemNavigationBar.stickyImmersive();
}

function App(): React.JSX.Element {
  const modalConfig = {
    LoadingModal,
    AddPlantModal,
    RemoveAllModal,
    RemoveSinglePlantModal,
    ChoosePlantModal,
    InformWaterNeedModal,
    RemoveSingleReminderModal
  };
  const defaultOptions = {backdropOpacity: 0.4};
  const stack = createModalStack(modalConfig, defaultOptions);
  const [connectInternet, setConnectInternet] = useState<boolean>(true);

  useEffect(() => {
    crashlytics().recordError;
  }, []);

  useEffect(() => {
    crashlytics().log('App mounted.');
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        setConnectInternet(false);
      } else {
        setConnectInternet(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  //Change this value to true if you want to test smt
  const devTest = false;

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <StoreProvider store={store}>
        <PaperProvider theme={theme}>
          <NavigationProvider>
            <GestureHandlerRootView style={{flex: 1}}>
              <NotifierWrapper>
                <ModalProvider stack={stack}>
                  <BottomSheetModalProvider>
                    {connectInternet ? (
                      <>
                        <AppOpenAdsProvider />
                        {devTest ? <TestScreen /> : <RootNavigation />}
                      </>
                    ) : (
                      <NoInternetScreen />
                    )}
                  </BottomSheetModalProvider>
                </ModalProvider>
              </NotifierWrapper>
            </GestureHandlerRootView>
          </NavigationProvider>
        </PaperProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
