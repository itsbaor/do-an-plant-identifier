import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from '~/resources/theme';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Alert,
  EmitterSubscription,
  SafeAreaView,
} from 'react-native';
import {
  purchaseErrorListener,
  purchaseUpdatedListener,
  RequestSubscription,
  requestSubscription,
} from 'react-native-iap';
import LinearGradient from 'react-native-linear-gradient';
import PurchaseSelectComponent, {
  PURCHASE,
} from '~/components/premium/PurchaseSelectComponent';
import {RootParamList} from '~/navigations/RootNavigation';
import IconClose from '~/resources/icons/IconClose';
import {useAppDispatch} from '~/hooks/useReduxStore';
import {setStateAdsOpen} from '~/redux/slices/adsOpenSlice';
import {setResetStateAdsRemote} from '~/redux/slices/adsRemoteSlice';
import {setStatePremium} from '~/redux/slices/premiumSlice';

const PremiumDetailScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppTheme();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'PremiumDetailScreen'>>();
  const route = useRoute<RouteProp<RootParamList, 'PremiumDetailScreen'>>();
  const purchaseType = route.params.purchaseType;
  const skusId = route.params.skusId;
  const price = route.params.price;
  const currency = route.params.currency;
  const offerToken = route.params.offerToken;

  console.log('offerToken: ', offerToken);
  console.log('skusId: ', skusId);

  const handlePurchaseProduct = () => {
    Platform.OS === 'android' &&
      Alert.alert(
        t('Confirm Your In-App Purchase'),
        t(`Do you want to buy this pro package ?`) as string | undefined,
        [
          {
            text: t('Cancel') as string | undefined,
            onPress: () => {
              console.log('Cancel Pressed');
            },
            style: 'cancel',
          },
          {
            text: t('Buy') as string | undefined,
            onPress: async () => {
              dispatch(setStateAdsOpen(false));
              try {
                const subscriptionOptions: RequestSubscription = {
                  subscriptionOffers: [
                    {sku: skusId as string, offerToken: offerToken as string},
                  ],
                };
                await requestSubscription(subscriptionOptions);
              } catch (error) {
                console.log('Failed to purchase. Error: ', error);
              }
            },
          },
        ],
      );
  };

  useEffect(() => {
    const purchaseUpdateSubscription = (Platform.OS === 'android' &&
      purchaseUpdatedListener(purchase => {
        // Handle successful purchase here
        console.log('Purchase Success----:', purchase);
        dispatch(setResetStateAdsRemote());
        dispatch(setStatePremium(true));
      })) as EmitterSubscription;

    const purchaseErrorSubscription = (Platform.OS === 'android' &&
      purchaseErrorListener(error => {
        console.log('Purchase Error-----', error);
      })) as EmitterSubscription;

    return () => {
      Platform.OS === 'android' && purchaseUpdateSubscription.remove();
      Platform.OS === 'android' && purchaseErrorSubscription.remove();
    };
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
            <TouchableOpacity>
              <Text
                style={{
                  color: theme.colors.text_white,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                {t('Restore')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
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
                paddingHorizontal: 40,
                marginTop: 100,
                paddingBottom: 10,
                justifyContent: 'flex-end',
                marginBottom: 30,
              }}>
              {purchaseType === PURCHASE.WEEKLY && (
                <PurchaseSelectComponent
                  content={`${currency} ${price} / ${t('weekly')}`}
                  onSelectPurchase={() => {}}
                  puchaseType={PURCHASE.WEEKLY}
                  selectedPurchase={purchaseType}
                  tagContent="Popular"
                  tagStartIcon={true}
                  info={t('Premium experience') as string}
                />
              )}
              {purchaseType === PURCHASE.YEARLY && (
                <PurchaseSelectComponent
                  content={`${currency} ${price} / ${t('yearly')}`}
                  onSelectPurchase={() => {}}
                  puchaseType={PURCHASE.YEARLY}
                  selectedPurchase={purchaseType}
                  tagContent="45% OFF"
                  info={t('Best Choice') as string}
                  tagStartIcon={true}
                />
              )}

              <Text
                style={{
                  color: theme.colors.text_white,
                  fontSize: 20,
                  lineHeight: 24,
                  fontWeight: '600',
                  marginTop: 20,
                  marginBottom: 9,
                }}>
                {t('Subscription and Payment')}
              </Text>

              <Text
                style={{
                  color: theme.colors.text_white,
                  fontSize: 14,
                  lineHeight: 17,
                  marginBottom: 15,
                  textAlign: 'left',
                }}>
                {t(
                  "When you subscribe to our app, your subscription starts immediately. You'll have full access to all features, and the first payment will be charged right away. The subscription is then billed monthly.",
                )}
              </Text>
              <View
                style={{
                  width: '100%',
                  paddingTop: 9,
                  paddingBottom: 15,
                  paddingHorizontal: 15,
                  borderRadius: 10,
                  backgroundColor: theme.colors.bg_box_selected_gray,
                }}>
                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.49)',
                    fontSize: 18,
                    lineHeight: 21,
                    fontWeight: '600',
                    marginBottom: 8,
                  }}>
                  {t('Cancellation')}
                </Text>
                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.49)',
                    fontSize: 12,
                    lineHeight: 14,
                    fontWeight: '400',
                    marginBottom: 8,
                  }}>
                  {t(
                    'You can cancel your subscription at any time. To cancel:',
                  )}
                </Text>

                {Platform.OS === 'android' && (
                  <Text
                    style={{
                      color: theme.colors.text_white,
                      fontSize: 12,
                      lineHeight: 14,
                      fontWeight: '400',
                      marginBottom: 8,
                    }}>
                    {t(
                      'Open the Play Store app, go to Subscriptions, and cancel your subscription for our app.',
                    )}
                  </Text>
                )}
                {Platform.OS === 'ios' && (
                  <Text
                    style={{
                      color: theme.colors.text_white,
                      fontSize: 12,
                      lineHeight: 14,
                      fontWeight: '400',
                      marginBottom: 8,
                    }}>
                    {t(
                      'Go to your iOS device Settings, tap your Apple ID, then Subscriptions, and cancel the subscription.',
                    )}
                  </Text>
                )}

                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.49)',
                    fontSize: 12,
                    lineHeight: 14,
                    fontWeight: '400',
                    marginBottom: 8,
                  }}>
                  {t(
                    'If you cancel, you can still use the app until the end of your current billing period. Let us know if you have any other questions at : ',
                  )}
                  <Text
                    style={{textDecorationLine: 'underline'}}
                    onPress={() => {
                      console.log('mail');
                    }}>
                    support@ichime.dev
                  </Text>
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  marginTop: 15,
                  width: '100%',
                  paddingVertical: 15,
                  backgroundColor: theme.colors.primary,
                  borderRadius: 5,
                  alignItems: 'center',
                }}
                onPress={() => {
                  handlePurchaseProduct();
                }}>
                <Text
                  style={{
                    color: theme.colors.text_white,
                    fontSize: 16,
                    lineHeight: 24,
                    fontWeight: '700',
                  }}>
                  {`${t('START NOW')}`}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
});

export default PremiumDetailScreen;
