import {
  Alert,
  Linking,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import {useAppTheme} from '~/resources/theme';
import { useTranslation } from 'react-i18next';
const { WifiSettingsModule } = NativeModules;

const NoInternetScreen = () => {
  const {t } = useTranslation();
  const theme = useAppTheme();

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:root=WIFI'); // Opens iOS settings
    } else {
      // Linking.openSettings(); // Opens Android settings
      WifiSettingsModule.openWifiSettings();
    }
  };
  return (
    <SafeAreaView style={[styles.container]}>
      <LottieView
        source={require('../resources/animations/lost_internet.json')}
        autoPlay
        loop
        style={{width: 250, height: 250}}
      />
      <Text
        style={{
          color: theme.colors.primary,
          fontSize: 24,
          fontWeight: '700',
        }}>
        {t('Internet Connection Error!')}
      </Text>
      <TouchableOpacity
        onPress={openSettings}
        style={{
          borderRadius: 100,
          paddingHorizontal: 20,
          backgroundColor: theme.colors.primary,
        }}>
        <Text
          style={{
            color: theme.colors.text_white,
            fontSize: 18,
            fontWeight: '700',
            lineHeight: 40,
          }}>
          {t('Fix Internet Problems')}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default NoInternetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    gap: 20
  },
});