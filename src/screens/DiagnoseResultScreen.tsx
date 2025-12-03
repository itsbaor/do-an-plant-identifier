import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {useAppTheme} from '~/resources/theme';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import {useModal} from 'react-native-modalfy';
import {Notifier} from 'react-native-notifier';
import {statePremium} from '~/redux/slices/premiumSlice';
import Config from 'react-native-config';
import useInAppReview from '~/hooks/useInAppReview';
import CircularProgress from 'react-native-circular-progress-indicator';
import IconClose from '~/resources/icons/IconClose';

const ID_ADS = __DEV__
  ? undefined
  : Platform.OS === 'android'
  ? Config.ANDROID_NATIVE_SEARCH
  : Config.IOS_NATIVE_SEARCH;

const DiagnoseResultScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {openInAppReview} = useInAppReview();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'DiagnoseResultScreen'>>();
  const route = useRoute<RouteProp<RootParamList, 'DiagnoseResultScreen'>>();
  const imageScanned = route.params.scannedImage;
  const dataLists = route.params.resultList;
  // const dataLists: any[] = [];
  const {openModal, closeModals} = useModal();
  const isPre = useAppSelector(statePremium);
  const theme = useAppTheme();

  useEffect(() => {
    openInAppReview();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      <ImageBackground
        source={{uri: imageScanned}}
        resizeMode="cover"
        style={styles.imageBg}>
        <View style={{alignItems: 'flex-end', paddingHorizontal: 20}}>
          <TouchableOpacity
            style={{borderWidth: 1, borderColor: theme.colors.primary_dark}}
            onPress={() => navigation.goBack()}>
            <IconClose color={theme.colors.bg_white} />
          </TouchableOpacity>
        </View>
        {dataLists.length > 0 ? (
          <View style={[styles.resultContainer]}>
            {dataLists.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                {/* probability */}
                <View
                  style={{
                    width: '30%',
                    aspectRatio: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View style={{width: '100%', height: '100%'}}>
                    <CircularProgress
                      value={
                        item.probability > 1
                          ? item.probability
                          : item.probability * 100
                      }
                      radius={50}
                      duration={1000}
                      progressValueColor={'#fff'}
                      activeStrokeColor={'#75E00A'}
                      inActiveStrokeWidth={10}
                      activeStrokeWidth={10}
                      inActiveStrokeOpacity={0.8}
                      valueSuffix={'%'}
                      titleStyle={{fontWeight: 'bold'}}
                    />
                  </View>
                </View>
                {/* Text data */}
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontFamily: 'Inter-Regular',
                      fontSize: 16,
                      fontWeight: '700',
                      lineHeight: 28,
                      color: '#FFFFFF',
                    }}
                    numberOfLines={1}>
                    {t(item.name)}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Inter-Regular',
                      fontSize: 14,
                      lineHeight: 20,
                      color: 'rgba(119, 124, 126, 1)',
                      marginBottom: 8,
                    }}>
                    {t('Similar images')}
                  </Text>
                  <ScrollView horizontal={true}>
                    {item.similar_images.map((items: any, indexs: any) => (
                      <View
                        key={indexs}
                        style={{width: 140, aspectRatio: 2, marginRight: 12}}>
                        <Image
                          source={{uri: items.url}}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 8,
                          }}
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: theme.colors.bg_white,
                height: '10%',
                width: '80%',
                borderWidth: 3,
                borderRadius: 10,
                borderColor: theme.colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: 24,
                  fontWeight: '700',
                }}>
                {t('Your plant is healthy!')}
              </Text>
            </View>
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default DiagnoseResultScreen;

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
  imageBg: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  resultContainer: {
    paddingHorizontal: 15,
    gap: 14,
    paddingBottom: 35,
  },
  itemContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: 'rgba(38, 38, 38, 0.9)',
    padding: 13,
    alignItems: 'center',
    width: '100%',
    minHeight: 100,
    gap: 15,
  },
});
