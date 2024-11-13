import IconPrePlus from '~/resources/icons/premium/IconPrePlus';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Linking,
  SafeAreaView,
} from 'react-native';
import {initConnection, getSubscriptions, Subscription} from 'react-native-iap';
import LinearGradient from 'react-native-linear-gradient';
import PurchaseSelectComponent, {
  PURCHASE,
} from '~/components/premium/PurchaseSelectComponent';
import {RootParamList} from '~/navigations/RootNavigation';
import IconClose from '~/resources/icons/IconClose';
import IconPreChat from '~/resources/icons/premium/IconPreChat';
import IconLeafScan from '~/resources/icons/premium/IconLeafScan';
import IconPreIdentify from '~/resources/icons/premium/IconPreIdentify';
import IconPreMinus from '~/resources/icons/premium/IconPreMinus';
import IconPreWater from '~/resources/icons/premium/IconPreWater';
import {useModal} from 'react-native-modalfy';
import {useAppTheme} from '~/resources/theme';
import {t_Subcription, t_SubcriptionDetail} from '~/@types/premium';
import {Notifier, NotifierComponents} from 'react-native-notifier';

export const itemIdAndroid = {
  WEEKLY: 'com.ichime.plant.identifier.id.premium',
  YEARLY: 'com.ichime.plant.identifier.id.preyear',
};

const PremiumScreen = () => {
  const {t} = useTranslation();
  const {openModal, closeModals} = useModal();
  const theme = useAppTheme();
  const [selectedPurchase, setSelectedPurchase] = useState<PURCHASE>(
    PURCHASE.NONE,
  );
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [selectedSkus, setSelectedSkus] = useState<string | undefined>('');
  const [price, setPrice] = useState<string | undefined>('');
  const [currency, setCurrency] = useState<string | undefined>('');
  const [weekly, setWeekly] = useState<t_SubcriptionDetail>();
  const [yearly, setYearly] = useState<t_SubcriptionDetail>();
  const [offerToken, setOfferToken] = useState<string | undefined>('');
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'PremiumScreen'>>();
  const route = useRoute<RouteProp<RootParamList, 'PremiumScreen'>>();
  const appStart = route.params.appStart;

  useEffect(() => {
    const handleGetProducts = async () => {
      try {
        openModal('LoadingModal', {
          message: t('Loading...'),
        });
        await initConnection().then(async () => {
          await getSubscriptions({
            skus: [itemIdAndroid.WEEKLY, itemIdAndroid.YEARLY],
          }).then(item => {
            const weeklyItem = item[0] as t_Subcription;
            const yearlyItem = item[1] as t_Subcription;
            setWeekly(weeklyItem.subscriptionOfferDetails[0]);
            setYearly(yearlyItem.subscriptionOfferDetails[0]);
          });
        });
        closeModals('LoadingModal');
      } catch (error) {
        closeModals('LoadingModal');
        Notifier.showNotification({
          title: 'Oopss!',
          description: t('Error when getting subs! Please try again later.'),
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: 'error',
          },
        });
        navigation.goBack();
      }
    };
    Platform.OS === 'android' && handleGetProducts();
  }, []);

  useEffect(() => {
    setIsDisabled(selectedPurchase == PURCHASE.NONE);
  }, [selectedPurchase]);

  useEffect(() => {
    Platform.OS === 'android' && StatusBar.setBackgroundColor('transparent');
  }, []);
  return (
    <SafeAreaView style={[styles.container, {}]}>
      <ImageBackground
        source={require('~/resources/images/premium/bgPremium.png')}
        style={{width: '100%', height: '100%'}}>
        <ImageBackground
          source={require('~/resources/images/premium/handPremium.png')}
          style={{
            width: 500,
            height: 600,
            transform: [{rotate: '0deg'}],
            position: 'absolute',
            left: -50,
          }}></ImageBackground>
        <View style={[styles.contentContainer]}>
          {/* Header */}
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                Platform.OS === 'android' &&
                  Linking.openURL(
                    'https://play.google.com/store/apps/details?id=com.ichime.plant.identifier.id',
                  );
                Platform.OS === 'ios' && console.log('Open App Store');
              }}>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                {t('Restore')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                appStart &&
                  navigation.navigate('BottomTabNavigation', {
                    screen: 'HomeScreen',
                  });
                !appStart && navigation.goBack();
              }}>
              <IconClose width={24} height={24} />
            </TouchableOpacity>
          </View>
          {/* Content */}
          <LinearGradient
            colors={[
              'rgba(0, 0, 0 , 0)',
              'rgba(0, 0, 0 , 0.9)',
              'rgba(0, 0, 0 , 1)',
            ]}
            style={[
              {
                height: '100%',
                width: '100%',
              },
            ]}>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 25,
                marginTop: 100,
                paddingBottom: 10,
                justifyContent: 'flex-end',
                marginBottom: 30,
              }}>
              <View style={{gap: 12, width: '100%'}}>
                <View style={[styles.contentRows, {gap: 5, paddingLeft: 0}]}>
                  <IconLeafScan />
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text
                      style={{
                        color: 'rgba(50, 160, 95, 1)',
                        fontWeight: '700',
                        fontSize: 25,
                      }}
                      numberOfLines={2}>
                      {t('Upgrade to Premium')}
                    </Text>
                  </View>
                </View>
                <View style={[styles.contentRows]}>
                  <IconPreIdentify />
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={styles.contentRowsText} numberOfLines={2}>
                      {t('Unlimited Plant Identification')}
                    </Text>
                  </View>
                </View>
                <View style={[styles.contentRows]}>
                  <IconPrePlus />
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={styles.contentRowsText} numberOfLines={2}>
                      {t('Unlimited Plant Disease Diagnosis')}
                    </Text>
                  </View>
                </View>
                <View style={[styles.contentRows]}>
                  <IconPreChat />
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={styles.contentRowsText} numberOfLines={2}>
                      {t('Unlimited Chat with AI Plant Experts')}
                    </Text>
                  </View>
                </View>
                <View style={[styles.contentRows]}>
                  <IconPreWater />
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={styles.contentRowsText} numberOfLines={2}>
                      {t('Comprehensive Plant Watering Guidance')}
                    </Text>
                  </View>
                </View>
                <View style={[styles.contentRows]}>
                  <IconPreMinus />
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      paddingLeft: 5,
                    }}>
                    <Text style={styles.contentRowsText} numberOfLines={2}>
                      {t('Ad-free Experience')}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{paddingHorizontal: 15}}>
                <View style={{gap: 8, marginTop: 25}}>
                  <PurchaseSelectComponent
                    content={
                      Platform.OS === 'android'
                        ? `${
                            weekly?.pricingPhases.pricingPhaseList.find(
                              (phase: any) => phase.recurrenceMode === 1,
                            )?.priceCurrencyCode
                          } ${
                            weekly?.pricingPhases.pricingPhaseList.find(
                              (phase: any) => phase.recurrenceMode === 1,
                            )?.formattedPrice
                          } / ${t('weekly')}`
                        : `${weekly?.currency} ${weekly?.price} / ${t(
                            'weekly',
                          )}`
                    }
                    // {`${weekly?.currency} ${weekly?.price} / weekly`}
                    onSelectPurchase={() => {
                      setSelectedPurchase(PURCHASE.WEEKLY);
                      setSelectedSkus(itemIdAndroid.WEEKLY);
                      setPrice(
                        weekly?.pricingPhases.pricingPhaseList.find(
                          (phase: any) => phase.recurrenceMode === 1,
                        )?.formattedPrice,
                      );
                      setCurrency(
                        weekly?.pricingPhases.pricingPhaseList.find(
                          (phase: any) => phase.recurrenceMode === 1,
                        )?.priceCurrencyCode,
                      );
                      setOfferToken(weekly?.offerToken);
                    }}
                    puchaseType={PURCHASE.WEEKLY}
                    selectedPurchase={selectedPurchase}
                    tagContent={t('Popular')}
                    tagStartIcon={true}
                    info={t('Premium experience') as string}
                  />
                  <PurchaseSelectComponent
                    content={
                      Platform.OS === 'android'
                        ? `${
                            yearly?.pricingPhases.pricingPhaseList.find(
                              (phase: any) => phase.recurrenceMode === 1,
                            )?.priceCurrencyCode
                          } ${
                            yearly?.pricingPhases.pricingPhaseList.find(
                              (phase: any) => phase.recurrenceMode === 1,
                            )?.formattedPrice
                          } / ${t('yearly')}`
                        : `${yearly?.currency} ${yearly?.price} / ${t(
                            'yearly',
                          )}`
                    }
                    onSelectPurchase={() => {
                      setSelectedPurchase(PURCHASE.YEARLY);
                      setSelectedSkus(itemIdAndroid.YEARLY);
                      setPrice(
                        yearly?.pricingPhases.pricingPhaseList.find(
                          (phase: any) => phase.recurrenceMode === 1,
                        )?.formattedPrice,
                      );
                      setCurrency(
                        yearly?.pricingPhases.pricingPhaseList.find(
                          (phase: any) => phase.recurrenceMode === 1,
                        )?.priceCurrencyCode,
                      );
                      setOfferToken(yearly?.offerToken);
                    }}
                    puchaseType={PURCHASE.YEARLY}
                    selectedPurchase={selectedPurchase}
                    tagContent="45% OFF"
                    info={t('Best Choice') as string}
                    tagStartIcon={true}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    marginTop: 15,
                    width: '100%',
                    paddingVertical: 15,
                    backgroundColor: 'rgba(50, 160, 95, 1)',
                    borderRadius: 5,
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    navigation.navigate('PremiumDetailScreen', {
                      purchaseType: selectedPurchase,
                      skusId: selectedSkus,
                      price: price,
                      currency: currency,
                      offerToken: offerToken,
                    });
                  }}
                  accessibilityState={{disabled: isDisabled}}
                  disabled={isDisabled}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 16,
                      lineHeight: 24,
                      fontWeight: '700',
                      opacity: selectedPurchase === PURCHASE.NONE ? 0.5 : 1,
                    }}>
                    {`${t('Continue')} ->`}
                  </Text>
                </TouchableOpacity>
                <View style={{marginTop: 15}}>
                  <Text
                    style={{
                      textAlign: 'justify',
                      fontSize: 9,
                      color: 'rgba(158, 155, 155, 1)',
                    }}>
                    {t(
                      `Your payment for the premium plan will be charged at the time you confirm the purchase. Your subscription period will begin immediately upon completing the payment. The subscription will automatically renew, unless you cancel at least 24 hours prior to the end of the current trial or billing cycle. Your account will be charged the renewal fee within 24 hours before the end of the current period. You can manage and cancel your subscription through the App store settings. For more information, please refer to our`,
                    )}{' '}
                    <Text style={{color: 'rgba(50, 160, 95, 1)'}}>
                      {t('Privacy Policy')}
                    </Text>
                    !
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRows: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 20,
    paddingLeft: 15,
    width: '100%',
  },
  contentRowsText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 17,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  text: {
    color: '#000000',
  },
});

export default PremiumScreen;
