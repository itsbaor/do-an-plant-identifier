import {
  Alert,
  AppState,
  BackHandler,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  interpolate,
} from 'react-native-reanimated';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {useAppTheme} from '~/resources/theme';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import {useModal} from 'react-native-modalfy';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {stateAdsRemote} from '~/redux/slices/adsRemoteSlice';
import {statePremium} from '~/redux/slices/premiumSlice';
import Config from 'react-native-config';
import {
  Camera,
  CameraRuntimeError,
  useCameraDevice,
} from 'react-native-vision-camera';
import {useCameraPermissions} from '~/hooks/useCamera';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {setStateAdsOpen, stateAdsOpen} from '~/redux/slices/adsOpenSlice';
import IconLightning from '~/resources/icons/scan/IconLightning';
import IconClose from '~/resources/icons/IconClose';
import IconGallery from '~/resources/icons/scan/IconGallery';
import IconIdentifyActive from '~/resources/icons/scan/IconIdentifyActive';
import IconDiagnoseActive from '~/resources/icons/scan/IconDiagnoseActive';
import IconDiagnoseInactive from '~/resources/icons/scan/IconDiagnoseInactive';
import IconIdentifyInactive from '~/resources/icons/scan/IconIdentifyInactive';
import {
  getPromtDiagnose,
  getPromtIdentify,
  getPromtIdentifyPremium,
} from '~/resources/prompts';
import firestore, {
  enablePersistentCacheIndexAutoCreation,
} from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  findGreatestKeyValue,
  findSmallestKeyValue,
  incrementMapValue,
} from '../SplashScreen';
import {setStateKeyScan, stateKeyScan} from '~/redux/slices/keyScanSlice';
import {AI_MODEL, docGenAi, docGenImage} from './home/HomeScreen';
import {TestIds, useInterstitialAd} from 'react-native-google-mobile-ads';
import {uploadApiWithApiKey} from '~/utils/axios';
import RNFS from 'react-native-fs';
import IconNoCamera from '~/resources/icons/scan/IconNoCamera';
import {GoogleGenerativeAI} from '@google/generative-ai';
import {setStateKeyAi, stateKeyAi} from '~/redux/slices/keyAiSlice';
import {
  keySearchSlice,
  setStateKeySearch,
  stateKeySearch,
} from '~/redux/slices/keySearchSlice';
import {
  getDiagnoseResultByImageFile,
  getIdentifyResultByPromtImage,
  getScanImage,
  resolveResponseFromAi,
  saveDataToStoSuccess,
  showNotification,
} from '~/utils';
import {stateLang} from '~/redux/slices/langSlices';
import {ERROR_MSG} from '~/data/errorCode';
import {t_PlantFromScan} from '../IdentifyResultScreen';

export enum e_CamFunc {
  IDENTIFY,
  DIAGNOSE,
}

export const IDENTIFY_STORAGE_KEY = '$ichime_ident';
export const DIAGNOSE_STORAGE_KEY = '$ichime_diag';
export const FILE_PREFIX: string = 'file://';

const API_IDENTIFY = Config.API_IDENTIFY;
const API_DIAGNOSE = Config.API_DIAGNOSE;

export const ERROR_NOTI_TIME = 5000;

type t_DayTrial = {
  time: number;
  date: string; //dd/mm/yyyy
};

type t_PlantIdentify = {
  name: string;
  image: string;
};

type t_PlantDiagnose = {
  name: string;
  probability: number;
  similar_images: any[];
};

const MAX_TRIAL_CAMERA_TIME = 1;

type t_TorchMode = 'on' | 'off' | undefined;

const TIME_OUT_DURATION = 12000;

export const convertImageToBase64 = async (path: string) => {
  const base64Data = await RNFS.readFile(path, 'base64');
  return base64Data;
};

export const decrementMapValue = async (docId: string, mapKey: string) => {
  try {
    // Reference to the document
    const docRef = firestore().collection('PlantIdent').doc(docId);
    // Fetch the document to get the current value
    const documentSnapshot = await docRef.get();
    if (documentSnapshot.exists) {
      const currentData = documentSnapshot.data();
      // Get the current map value using the mapKey
      const currentValue = currentData?.[mapKey];
      if (typeof currentValue === 'number') {
        // Subtract 1 from the current value
        const updatedValue = currentValue - 1;
        // Update the specific key in the Map using dot notation
        await docRef.update({
          [`${mapKey}`]: updatedValue,
        });
      }
    } else {
      console.log('Document does not exist');
    }
  } catch (error) {
    console.error('Error updating map value:', error);
  }
};

const ScanScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'ScanScreen'>>();
  const route = useRoute<RouteProp<RootParamList, 'ScanScreen'>>();
  const {openModal, closeModals} = useModal();
  const adsRemote = useAppSelector(stateAdsRemote);
  const isPre = useAppSelector(statePremium);
  const keyScan = useAppSelector(stateKeyScan);
  const g_searchImageKey = useAppSelector(stateKeySearch);
  const g_aiKey = useAppSelector(stateKeyAi);
  const g_lang = useAppSelector(stateLang);
  const theme = useAppTheme();
  const FUNCTION_TEXT = {
    0: t('Identify'),
    1: t('Diagnose'),
  };
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const [torchMode, setTorchMode] = useState<t_TorchMode>('off');
  const [camFunc, setCamFunc] = useState<e_CamFunc>(route.params.type);
  const [isCamActive, setIsCamActive] = useState<boolean>(true);
  const top = useSharedValue(0);
  const [boxHeight, setBoxHeight] = useState(0);
  const textFunction = useMemo(() => FUNCTION_TEXT[camFunc], [camFunc]);
  const {hasCamPermission, updateCamPermissions, refreshCamPermissions} =
    useCameraPermissions();

  const ID_SCAN = __DEV__ ? TestIds.INTERSTITIAL : adsRemote.INTER_SCAN.id;

  const ID_IDENTIFY = __DEV__
    ? TestIds.INTERSTITIAL
    : adsRemote.INTER_IDENTIFY.id;

  const ID_DIAGNOSE = __DEV__
    ? TestIds.INTERSTITIAL
    : adsRemote.INTER_DIAGNOSE.id;

  const interIdentify = useInterstitialAd(ID_IDENTIFY);
  const interDiagnose = useInterstitialAd(ID_DIAGNOSE);
  const interScan = useInterstitialAd(ID_SCAN);

  const getCurrentDateString = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const [trialScanTime, setTrialScanTime] = useState<t_DayTrial>({
    time: MAX_TRIAL_CAMERA_TIME,
    date: getCurrentDateString(),
  });
  const [trialDiagnoseTime, setTrialDiagnoseTime] = useState<t_DayTrial>({
    time: MAX_TRIAL_CAMERA_TIME,
    date: getCurrentDateString(),
  });

  const handleSwitchTorch = () => {
    torchMode === 'on' ? setTorchMode('off') : setTorchMode('on');
  };

  const onError = useCallback((error: CameraRuntimeError) => {
    error && console.log('Camera error!!!');
  }, []);

  const getImageFromCamera = async () => {
    try {
      if (cameraRef.current) {
        //If camera available
        cameraRef.current
          ?.takeSnapshot({
            quality: 100,
          })
          .then(capturedImg => {
            const imgUri = FILE_PREFIX + capturedImg?.path;
            //Identify
            if (camFunc === e_CamFunc.IDENTIFY) {
              !isPre && identifyPlant(getPromtIdentify(g_lang), imgUri);
              isPre &&
                identifyPlantPremium(getPromtIdentifyPremium(g_lang), imgUri);
            }
            //Diagnose
            if (camFunc === e_CamFunc.DIAGNOSE) {
              !isPre && diagnosePlant(imgUri);
              isPre && diagnosePlantPremium(imgUri);
            }
          })
          .catch();
      }
    } catch (error) {
      Alert.alert('Error', 'You need to provide camera permission!');
      console.error('Dev defined error in get image from camera:---\n', error);
    }
  };

  const getImageFromLibrary = async () => {
    try {
      dispatch(setStateAdsOpen(false));
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.9,
      });
      if (result.assets) {
        const imgUri = result.assets[0].uri as string;
        //Identify
        if (camFunc === e_CamFunc.IDENTIFY) {
          !isPre && identifyPlant(getPromtIdentify(g_lang), imgUri);
          isPre &&
            identifyPlantPremium(getPromtIdentifyPremium(g_lang), imgUri);
        }
        //Diagnose
        if (camFunc === e_CamFunc.DIAGNOSE) {
          !isPre && diagnosePlant(imgUri);
          isPre && diagnosePlantPremium(imgUri);
        }
        return;
      }
    } catch (error) {
      dispatch(setStateAdsOpen(true));
      console.error('Dev define Error in get image from gallery:---\n', error);
    }
  };

  const identifyPlantPremium = async (prompt: string, imageUri: string) => {
    const idenKeyNow = keyScan;
    const base64Image = await convertImageToBase64(imageUri);
    openModal('LoadingModal', {
      message: t('Identifying...'),
    });
    let timeoutId = setTimeout(() => {
      Notifier.showNotification({
        title: 'Oopss!',
        description: t('Request time out! Please try again later!'),
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: 'error',
        },
      });
      closeModals('LoadingModal');
    }, TIME_OUT_DURATION);
    try {
      //Get response from plantId API
      const formData = new FormData();
      formData.append('images', [base64Image]);
      formData.append('similar_images', true);
      const response = await uploadApiWithApiKey(
        API_IDENTIFY,
        formData,
        idenKeyNow,
      );
      //Justify response from Identify API, only take max 3 results
      const plantIdIdentResults: any[] =
        response.result.classification.suggestions.length > 3
          ? response.result.classification.suggestions.slice(0, 3)
          : response.result.classification.suggestions;
      const modifiedPlantIdentResults: t_PlantIdentify[] =
        plantIdIdentResults.map((item, index) => {
          const plantIdentScan: t_PlantIdentify = {
            name: item.name,
            image: item.similar_images ? item.similar_images[0].url : '',
          };
          return plantIdentScan;
        });
      //Then asked AI with promt to fill some specific information
      const curAiKey = g_aiKey;
      const genAi = new GoogleGenerativeAI(curAiKey);
      const model = genAi.getGenerativeModel({model: AI_MODEL});
      incrementMapValue(docGenAi, curAiKey);
      const result = await model.generateContent([
        prompt,
        JSON.stringify(modifiedPlantIdentResults),
      ]);
      const indexOfOpen = result.response.text().indexOf('[');
      clearTimeout(timeoutId);
      closeModals('LoadingModal');
      decrementMapValue('key', idenKeyNow);
      //Navigate to result screen
      navigation.navigate('IdentifyResultScreen', {
        scannedImage: imageUri,
        resultList:
          indexOfOpen == 0
            ? JSON.parse(result.response.text())
            : JSON.parse(
                result.response
                  .text()
                  .substring(7, result.response.text().length - 3),
              ),
      });
    } catch (error) {
      closeModals('LoadingModal');
      clearTimeout(timeoutId);
      console.error('Dev defined error in identify:----', error);
      showNotification(
        t('Oopss!'),
        t('Something went wrong, please try again later.'),
        'error',
      );
    }
  };

  const identifyPlant = async (prompt: string, imageUri: string) => {
    const aiKeyNow = g_aiKey;
    const searchImageKeyNow = g_searchImageKey;
    //check trial identify
    if (trialScanTime.time == 0) {
      showNotification(
        t('Oopss!'),
        t(
          'You have reached the maximum number of trial identify, please upgrade to premium!',
        ),
        'error',
      );
      navigation.push('PremiumScreen', {appStart: false});
      return;
    } else {
      //Load inter ads
      if (adsRemote.INTER_IDENTIFY.isOn) {
        dispatch(setStateAdsOpen(false));
        interIdentify.load();
      }
    }
    const base64Image = await convertImageToBase64(imageUri); //Base64 image
    openModal('LoadingModal', {
      message: t('Identifying...'),
    });
    let timeoutId = setTimeout(() => {
      showNotification(
        t('Oopss!'),
        t('Request time out! Please try again later!'),
        'error',
      );
      closeModals('LoadingModal');
    }, TIME_OUT_DURATION);
    const response = await getIdentifyResultByPromtImage(
      aiKeyNow,
      prompt,
      base64Image,
    );
    clearTimeout(timeoutId);
    closeModals('LoadingModal');
    //Update scan time
    if (response.isSuccess) {
      incrementMapValue(docGenAi, aiKeyNow);
      const updatedScanTime: t_DayTrial = {
        time: trialScanTime.time - 1,
        date: trialScanTime.date,
      };
      const saveSuccess = await saveDataToStoSuccess(
        IDENTIFY_STORAGE_KEY,
        JSON.stringify(updatedScanTime),
      );
      if (saveSuccess) {
        setTrialScanTime({...updatedScanTime});
      } else {
        showNotification(
          t('Oopss!'),
          t('Something went wrong, please try again later.'),
          'error',
        );
        return;
      }
      //Get image
      const imgRes = await getScanImage(
        searchImageKeyNow,
        response.data.name,
        'Plant_Image',
      );
      incrementMapValue(docGenImage, searchImageKeyNow);
      response.data.image = imgRes.data ?? null;
      //Navigate to result screen
      navigation.navigate('IdentifyResultScreen', {
        scannedImage: imageUri,
        resultList: [response.data],
      });
    } else {
      response.message === ERROR_MSG.AI_SERVER_DOWN &&
        showNotification(t('Oopss!'), t(response.message), 'error');
      response.message === ERROR_MSG.BAD_IMAGE &&
        showNotification(t('Bad Image'), t(response.message), 'warn');
    }
  };

  const diagnosePlantPremium = async (imageUri: string) => {
    const diagKeyNow = keyScan;
    //check trial diagnose
    const base64Image = await convertImageToBase64(imageUri);
    openModal('LoadingModal', {
      message: t('Diagnosing...'),
    });
    let timeoutId = setTimeout(() => {
      Notifier.showNotification({
        title: 'Oopss!',
        description: t(
          'Waiting time too long for diagnose plant! Try again later!',
        ),
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: 'error',
        },
      });
      closeModals('LoadingModal');
    }, TIME_OUT_DURATION);
    try {
      //Call PlantId API to get plant disease on given plants
      const formData = new FormData();
      formData.append('images', [base64Image]);
      formData.append('similar_images', true);
      const response = await uploadApiWithApiKey(
        API_DIAGNOSE,
        formData,
        diagKeyNow,
      );
      const plantIdDiagnoseResults: any[] =
        response.result.disease.suggestions.length > 3
          ? response.result.disease.suggestions.slice(0, 3)
          : response.result.disease.suggestions;
      const modifiedPlantIdDiagnoseResults = plantIdDiagnoseResults.map(
        (item, index) => {
          const plantDiagnoseScan: t_PlantDiagnose = {
            name: item.name,
            probability: item.probability,
            similar_images: item.similar_images,
          };
          return plantDiagnoseScan;
        },
      );
      clearTimeout(timeoutId);
      closeModals('LoadingModal');
      decrementMapValue('key', diagKeyNow);
      //Navigate to result screen
      navigation.navigate('DiagnoseResultScreen', {
        scannedImage: imageUri,
        resultList: modifiedPlantIdDiagnoseResults,
      });
    } catch (error) {
      closeModals('LoadingModal');
      clearTimeout(timeoutId);
      console.error('Dev defined error in diagnose:----', error);
      //Show inform dialog
      Notifier.showNotification({
        title: 'Oopss!',
        description: t('Something went wrong, please try again later.'),
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: 'error',
        },
      });
    }
  };

  const diagnosePlant = async (imageUri: string) => {
    const aiKeyNow = g_aiKey;
    const searchImageKeyNow = g_searchImageKey;
    //check trial diagnose
    if (trialDiagnoseTime.time == 0) {
      showNotification(
        t('Oopss!'),
        t(
          'You have reached the maximum number of trial identify, please upgrade to premium!',
        ),
        'error',
      );
      navigation.push('PremiumScreen', {appStart: false});
      return;
    } else {
      //Load inter ads
      if (adsRemote.INTER_DIAGNOSE.isOn) {
        dispatch(setStateAdsOpen(false));
        interDiagnose.load();
      }
    }
    const base64Image = await convertImageToBase64(imageUri);
    openModal('LoadingModal', {
      message: t('Diagnosing...'),
    });
    let timeoutId = setTimeout(() => {
      showNotification(
        t('Oopss!'),
        t('Request time out! Please try again later!'),
        'error',
      );
      closeModals('LoadingModal');
    }, TIME_OUT_DURATION);
    const response = await getDiagnoseResultByImageFile(
      aiKeyNow,
      getPromtDiagnose(),
      base64Image,
    );
    clearTimeout(timeoutId);
    closeModals('LoadingModal');
    //Update scan time
    if (response.isSuccess) {
      incrementMapValue(docGenAi, aiKeyNow);
      const updatedDiagnoseTime: t_DayTrial = {
        time: trialDiagnoseTime.time - 1,
        date: trialDiagnoseTime.date,
      };
      const saveSuccess = await saveDataToStoSuccess(
        DIAGNOSE_STORAGE_KEY,
        JSON.stringify(updatedDiagnoseTime),
      );
      if (response.message == ERROR_MSG.HEALTHY_PLANT) {
        showNotification(
          t('Congratulations!'),
          t('You have found a healthy plant!'),
          'success',
        );
        return;
      }
      if (saveSuccess) {
        setTrialDiagnoseTime({...updatedDiagnoseTime});
      } else {
        showNotification(
          t('Oopss!'),
          t('Something went wrong, please try again later.'),
          'error',
        );
        return;
      }
      //Get image
      const imgRes = await getScanImage(
        searchImageKeyNow,
        response.data.name,
        'Disease_in_Plant',
      );
      incrementMapValue(docGenImage, searchImageKeyNow);
      console.log('image', imgRes.data);
      response.data.similar_images = imgRes.data ? [{url: imgRes.data}] : [];
      //Navigate to result screen
      navigation.navigate('DiagnoseResultScreen', {
        scannedImage: imageUri,
        resultList: [response.data],
      });
    } else {
      response.message === ERROR_MSG.AI_SERVER_DOWN &&
        showNotification(t('Oopss!'), t(response.message), 'error');
      response.message === ERROR_MSG.BAD_IMAGE &&
        showNotification(t('Bad Image'), t(response.message), 'warn');
    }
  };

  //Animation
  useEffect(() => {
    if (boxHeight > 0) {
      top.value = withRepeat(
        withTiming(1, {duration: 2000}),
        -1, // Infinite loop
        true, // Reverse direction
      );
    }
  }, [boxHeight]);

  const animatedStyle = useAnimatedStyle(() => {
    const topInterpolate = interpolate(top.value, [0, 1], [0, boxHeight]);
    return {
      top: topInterpolate,
    };
  });

  const isToday = (dateString: string) => {
    const [day, month, year] = dateString.split('/').map(Number);
    // Get today's date
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1; // Months are zero-indexed, so add 1
    const todayYear = today.getFullYear();

    // Compare the parsed date with today's date
    return day === todayDay && month === todayMonth && year === todayYear;
  };

  useEffect(() => {
    if (adsRemote.INTER_SCAN.isOn) {
      openModal('LoadingModal', {
        message: t('Loading AI Modal...'),
      });
      interScan.load();
    }
  }, [interScan.load]);

  useEffect(() => {
    if (interScan.isLoaded) {
      dispatch(setStateAdsOpen(false));
      interScan.show();
      closeModals('LoadingModal');
    }
  }, [interScan.isLoaded]);

  useEffect(() => {
    interScan.error && closeModals('LoadingModal');
  }, [interScan.error]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('PlantIdent')
      .doc('key') // Replace with your document ID
      .onSnapshot(
        documentSnapshot => {
          if (documentSnapshot.exists) {
            const key = findGreatestKeyValue(documentSnapshot.data());
            dispatch(setStateKeyScan(key));
          }
        },
        error => {
          console.error('Error fetching real-time updates:', error);
        },
      );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('PlantIdent')
      .doc('keySearchImage') // Replace with your document ID
      .onSnapshot(
        documentSnapshot => {
          if (documentSnapshot.exists) {
            const key = findSmallestKeyValue(documentSnapshot.data());
            dispatch(setStateKeySearch(key));
          }
        },
        error => {
          console.error('Error fetching real-time updates:', error);
        },
      );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('PlantIdent')
      .doc('keyGenAi') // Replace with your document ID
      .onSnapshot(
        documentSnapshot => {
          if (documentSnapshot.exists) {
            const key = findSmallestKeyValue(documentSnapshot.data());
            dispatch(setStateKeyAi(key));
          }
        },
        error => {
          console.error('Error fetching real-time updates:', error);
        },
      );

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getDayTrialCameraTime = async () => {
      try {
        let scanTime: t_DayTrial | string | null = await AsyncStorage.getItem(
          IDENTIFY_STORAGE_KEY,
        );
        let diagnoseTime: t_DayTrial | string | null =
          await AsyncStorage.getItem(DIAGNOSE_STORAGE_KEY);
        if (scanTime !== null) {
          scanTime = JSON.parse(scanTime) as t_DayTrial;
          if (isToday(scanTime.date)) {
            //Check if current day is today
            setTrialScanTime(scanTime);
          }
        }
        if (diagnoseTime !== null) {
          diagnoseTime = JSON.parse(diagnoseTime) as t_DayTrial;
          if (isToday(diagnoseTime.date)) {
            //Check if current day is today
            setTrialDiagnoseTime(diagnoseTime);
          }
        }
      } catch (e) {
        // Error reading value
        console.error(
          'Failed to retrieve trial scan data from AsyncStorage',
          e,
        );
      }
    };
    getDayTrialCameraTime();
  }, []);

  useEffect(() => {
    if (!hasCamPermission) {
      dispatch(setStateAdsOpen(false));
      refreshCamPermissions();
    }
  }, [refreshCamPermissions]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      setIsCamActive(true);
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (nextAppState === 'active') {
          setIsCamActive(true);
          updateCamPermissions();
        }
        if (nextAppState.match(/inactive|background/)) {
          setIsCamActive(false);
        }
      });
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        setIsCamActive(false);
        subscription.remove();
      };
    }, []),
  );

  return (
    <SafeAreaView style={[styles.container, {}]}>
      {hasCamPermission ? (
        device ? ( //Main View
          <View
            style={{flex: 1, justifyContent: 'center', position: 'relative'}}>
            {/* Camera */}
            <Camera
              device={device}
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              isActive={isCamActive}
              preview={true}
              photo={true}
              torch={torchMode}
              enableZoomGesture={true}
              onError={onError}
            />

            {/* Button bottom */}
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  position: 'absolute',
                  zIndex: 3,
                  paddingTop: 20,
                },
              ]}>
              {/* Top: Flash, Delete Button, Scan reactangle */}
              <View style={{flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                  }}>
                  <TouchableOpacity onPress={handleSwitchTorch}>
                    <IconLightning torch={torchMode} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.goBack();
                    }}>
                    <IconClose color={theme.colors.text_white} />
                  </TouchableOpacity>
                </View>
                {/* Scan Animation */}
                <View
                  style={{
                    height: '65%',
                    paddingHorizontal: 55,
                    marginTop: 80,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      position: 'relative',
                      height: '100%',
                      justifyContent: 'space-between',
                    }}
                    onLayout={event => {
                      const {height} = event.nativeEvent.layout;
                      setBoxHeight(height - 2);
                    }}>
                    {/* Scan bar */}
                    <Animated.View
                      style={[
                        {
                          position: 'absolute',
                          height: 2,
                          width: '100%',
                          left: 0,
                          backgroundColor: 'rgba(223, 222, 222, 0.7)',
                        },
                        animatedStyle,
                      ]}></Animated.View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={[
                          styles.edge,
                          {borderTopWidth: 3, borderLeftWidth: 3},
                        ]}></View>
                      <View
                        style={[
                          styles.edge,
                          {borderTopWidth: 3, borderRightWidth: 3},
                        ]}></View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={[
                          styles.edge,
                          {borderBottomWidth: 3, borderLeftWidth: 3},
                        ]}></View>
                      <View
                        style={[
                          styles.edge,
                          {borderBottomWidth: 3, borderRightWidth: 3},
                        ]}></View>
                    </View>
                  </View>
                </View>
              </View>
              {/* Bottom screen */}
              <View style={[styles.footerContainer]}>
                {/* Functional */}
                {camFunc === e_CamFunc.IDENTIFY && (
                  <View style={[styles.functionType, {marginBottom: 20}]}>
                    <TouchableOpacity
                      onPress={() => {
                        setCamFunc(e_CamFunc.DIAGNOSE);
                      }}>
                      <IconDiagnoseInactive />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}}>
                      <IconIdentifyActive />
                    </TouchableOpacity>
                  </View>
                )}
                {camFunc === e_CamFunc.DIAGNOSE && (
                  <View style={[styles.functionType, {marginBottom: 20}]}>
                    <TouchableOpacity onPress={() => {}}>
                      <IconDiagnoseActive />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setCamFunc(e_CamFunc.IDENTIFY);
                      }}>
                      <IconIdentifyInactive />
                    </TouchableOpacity>
                  </View>
                )}
                {!isPre && (
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      marginBottom: 9,
                    }}>
                    <Text
                      style={{
                        color: 'rgba(0, 0, 0, 0.68)',
                        fontSize: 12,
                        fontWeight: '500',
                        lineHeight: 14.5,
                      }}>
                      {camFunc === e_CamFunc.IDENTIFY
                        ? `${t('You have ')}${MAX_TRIAL_CAMERA_TIME}${t(
                            ' plant scans per day',
                          )}`
                        : `${t('You have ')}${MAX_TRIAL_CAMERA_TIME}${t(
                            ' diagnose scans per day',
                          )}`}
                    </Text>
                  </View>
                )}
                {/* GetImage from lib */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 25,
                    paddingHorizontal: 20,
                  }}>
                  <TouchableOpacity onPress={getImageFromLibrary}>
                    <IconGallery />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={getImageFromCamera}
                    style={styles.capture}>
                    <Text
                      style={{
                        fontSize: 18,
                        lineHeight: 21,
                        fontWeight: '700',
                        color: 'rgba(75, 109, 78, 1)',
                        alignSelf: 'center',
                      }}>
                      {`${textFunction} ${
                        !isPre
                          ? `(${
                              camFunc === e_CamFunc.IDENTIFY
                                ? trialScanTime.time
                                : trialDiagnoseTime.time
                            }/${MAX_TRIAL_CAMERA_TIME})`
                          : ''
                      }`}
                    </Text>
                  </TouchableOpacity>
                  <View style={{width: 62.67}}></View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          //View if device not support back camera
          <View
            style={{
              flex: 1,
              backgroundColor: '#000000CC',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              numberOfLines={2}
              style={{
                textAlign: 'center',
                color: theme.colors.text_white,
                fontSize: 18,
                fontWeight: '600',
              }}>
              {t('Your device has no back camera.')}
            </Text>
          </View>
        )
      ) : (
        //View without camera permission
        <View
          style={{
            flex: 1,
            backgroundColor: '#000000CC',
          }}>
          <View style={{paddingHorizontal: 20, paddingTop: 20}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <IconClose color={theme.colors.bg_white} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20,
              paddingHorizontal: 30,
            }}>
            <View>
              <IconNoCamera />
            </View>
            <View>
              <Text
                numberOfLines={2}
                style={{
                  textAlign: 'center',
                  color: theme.colors.text_white,
                  fontSize: 18,
                  fontWeight: '600',
                }}>
                {t('Access the camera to scan plant.')}
              </Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => Linking.openSettings()}
                style={{
                  borderRadius: 100,
                  backgroundColor: theme.colors.text_gray_home,
                  paddingVertical: 15,
                  paddingHorizontal: 40,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: theme.colors.text_white,
                    fontSize: 18,
                    fontWeight: '600',
                  }}>
                  {t('Open Setting')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '700',
    alignSelf: 'center',
  },
  ph_20: {
    paddingHorizontal: 20,
  },
  footerContainer: {
    justifyContent: 'flex-end',
    marginBottom: 50,
  },
  edge: {
    width: '33%',
    aspectRatio: 1,
    borderColor: '#FFFFFF',
  },
  functionType: {
    flexDirection: 'row',
    gap: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capture: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 15,
  },
});
