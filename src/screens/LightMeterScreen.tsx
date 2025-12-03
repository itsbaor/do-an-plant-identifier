import {
  AppState,
  BackHandler,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
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
import Config from 'react-native-config';
import IconClose from '~/resources/icons/IconClose';
import IconWarning from '~/resources/icons/IconWarning';
import IconSun from '~/resources/icons/IconSun';
import {SensorName, useSensors} from '@serserm/react-native-turbo-sensors';
import {useCameraPermissions} from '~/hooks/useCamera';
import {useAppDispatch} from '~/hooks/useReduxStore';
import {Camera, useCameraDevice} from 'react-native-vision-camera';

const PERFECT_LUX = 500;

const LightMeterScreen = () => {
  const {t} = useTranslation();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'LightMeterScreen'>>();
  const dispatch = useAppDispatch();
  const [luxNumber, setLuxNumber] = useState<number | undefined>(0);
  const device = useCameraDevice('back');
  const [isEnoughLight, setIsEnoughLight] = useState<boolean>(false);
  const [isCamActive, setIsCamActive] = useState<boolean>(true);
  const theme = useAppTheme();
  const {hasCamPermission, updateCamPermissions, refreshCamPermissions} =
    useCameraPermissions();
  const sensors = useSensors({
    onChanged,
  });

  useEffect(() => {
    sensors
      .isAvailable(SensorName.light)
      .then(isAvailable => {
        isAvailable && sensors.startSensor(SensorName.light);
      })
      .catch(err => console.log(err));
    return () => {
      sensors.stopSensor(SensorName.light);
    };
  }, []);

  function onChanged(event: any) {
    if (event.name === 'light') {
      setLuxNumber(event.data);
      setIsEnoughLight(event.data >= PERFECT_LUX);
    }
  }

  useEffect(() => {
    if (!hasCamPermission) {
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
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_black}]}>
      {/* close button */}
      <View style={[styles.closeButtonWrapper, {}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconClose color={theme.colors.text_white} width={28} height={28} />
        </TouchableOpacity>
      </View>

      {/* Circle Scan */}
      <View style={[styles.scanContainer]}>
        <View
          style={[
            styles.circleView,
            isEnoughLight ? {borderColor: '#EEB72A'} : {borderColor: '#DF0E0E'},
          ]}>
          {device && (
            <Camera
              device={device}
              style={StyleSheet.absoluteFill}
              isActive={isCamActive}
              preview={true}
              enableZoomGesture={false}
            />
          )}

          {/* <Image
            resizeMode="cover"
            style={{height: '100%', aspectRatio: 1}}
            source={require('~/resources/images/home/lightMeterPlant.png')}
          /> */}
        </View>
      </View>

      {/* Inform */}
      <View style={[]}>
        {isEnoughLight ? (
          <Text style={[styles.text, {textAlign: 'center'}]}>
            {' '}
            {t('Best grow lights')}{' '}
          </Text>
        ) : (
          <View style={[styles.informWarningContainer]}>
            <IconWarning />
            <Text style={[styles.text]}>
              {t('Not enough light for growing plant')}
            </Text>
          </View>
        )}
      </View>

      {/* Scan Result */}
      <View style={[styles.resultContainer]}>
        <IconSun />
        <Text style={[styles.text]}>
          {t('Measuring')}: {luxNumber} LUX
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LightMeterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
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
  closeButtonWrapper: {
    width: '100%',
    alignItems: 'flex-end',
  },
  text: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  informWarningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  resultContainer: {
    flexDirection: 'row',
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(217, 217, 217, 0.7)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 60,
  },
  resultIcon: {
    height: 20,
    width: 20,
  },
  luxWarning: {
    height: 28,
    width: 28,
  },
  scanContainer: {
    position: 'relative',
    marginTop: 105,
    width: '100%',
    aspectRatio: 1,
    padding: 18,
  },
  circleView: {
    width: '100%',
    height: '100%',
    borderRadius: 2000,
    borderWidth: 3,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
});
