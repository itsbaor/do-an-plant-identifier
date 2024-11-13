import {useEffect, useState} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const InternetCheckerProvider = () => {

  const handleNoConnection = () => {
    Alert.alert(
      'No Internet Connection',
      'You are not connected to the internet. Would you like to open settings?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Open Settings',
          onPress: () => openSettings(),
        },
      ],
    );
  };

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:root=WIFI'); // Opens iOS settings
    } else {
      Linking.openSettings(); // Opens Android settings
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        handleNoConnection();
      } else {
        console.log("---Internet connected---");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return null;
};

export default InternetCheckerProvider;
