import {
  BackHandler,
  Image,
  ImageBackground,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {useAppTheme} from '~/resources/theme';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import IconDetail from '~/resources/icons/bottom-tabs/setting/IconDetail';
import IconFeedback from '~/resources/icons/bottom-tabs/setting/IconFeedback';
import IconPolicy from '~/resources/icons/bottom-tabs/setting/IconPolicy';
import IconLanguage from '~/resources/icons/bottom-tabs/setting/IconLanguage';
import IconRate from '~/resources/icons/bottom-tabs/setting/IconRate';
import {stateLang} from '~/redux/slices/langSlices';
import {langList} from '~/data/languageData';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import IconBlink from '~/resources/icons/bottom-tabs/home/IconBlink';
import {logout, getUserData} from '~/services/authService';
import {Alert} from 'react-native';

const SettingScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'BottomTabNavigation'>>();
  const route = useRoute();
  const lang = useAppSelector(stateLang);
  const curLangObject = useMemo(
    () => langList.find(ele => ele.id === lang),
    [lang],
  );
  const curLang = String(curLangObject?.name);
  const theme = useAppTheme();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Load user data on mount
  React.useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setUserEmail(userData.email);
      }
    };
    loadUserData();
  }, []);

  const handleChooseLanguage = () => {
    navigation.push('LanguageScreen');
  };

  const handleRateUs = () => {
    Platform.OS === 'android' &&
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.ichime.plant.identifier.id',
      );
    Platform.OS === 'ios' && console.log('Open App Store');
  };

  const handleFeedback = () => {
    Platform.OS === 'android' &&
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.ichime.plant.identifier.id',
      );
    Platform.OS === 'ios' && console.log('Open App Store');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://www.ichime.dev/policy');
    // Navigate to the privacy policy screen
  };

  const handleLogout = () => {
    Alert.alert(
      t('Logout'),
      t('Are you sure you want to logout?'),
      [
        {
          text: t('Cancel'),
          style: 'cancel',
        },
        {
          text: t('Logout'),
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          },
        },
      ],
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      const curLangObject = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      <Text style={[styles.title, {color: theme.colors.primary_dark}]}>
        {t('Profile')}
      </Text>
      <View style={{flex: 1, paddingHorizontal: 15}}>
        {/* User Info Section */}
        {userEmail && (
          <View style={styles.userInfoContainer}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{userEmail.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.userEmail}>{userEmail}</Text>
              <Text style={styles.userStatus}>{t('Logged in')}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.itemMenu}
          onPress={handleChooseLanguage}>
          <View style={{flexDirection: 'row'}}>
            <IconLanguage style={{marginRight: 8}} />
            <Text style={styles.textMenu}>{t('Language')}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: 'rgba(130, 130, 139, 1)', marginRight: 8}}>
              {t(curLang)}
            </Text>
            <IconDetail />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemMenu} onPress={handleRateUs}>
          <View style={{flexDirection: 'row'}}>
            <IconRate style={{marginRight: 8}} />
            <Text style={styles.textMenu}>{t('Rate Us')}</Text>
          </View>
          <IconDetail />
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemMenu} onPress={handleFeedback}>
          <View style={{flexDirection: 'row'}}>
            <IconFeedback style={{marginRight: 8}} />
            <Text style={styles.textMenu}>{t('Feedback')}</Text>
          </View>
          <IconDetail />
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemMenu} onPress={handlePrivacyPolicy}>
          <View style={{flexDirection: 'row'}}>
            <IconPolicy style={{marginRight: 8}} />
            <Text style={styles.textMenu}>{t('Privacy Policy')}</Text>
          </View>
          <IconDetail />
        </TouchableOpacity>

        {/* Logout Button */}
        {userEmail && (
          <TouchableOpacity style={[styles.itemMenu, styles.logoutItem]} onPress={handleLogout}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.logoutIcon, {marginRight: 8}]}>🚪</Text>
              <Text style={[styles.textMenu, {color: theme.colors.text_error}]}>{t('Logout')}</Text>
            </View>
          </TouchableOpacity>
        )}

        <View
          style={{
            marginTop: 20,
            position: 'relative',
            width: '100%',
            height: 150,
          }}>
          <Image
            source={require('~/resources/images/plantSetting.png')}
            style={{
              position: 'absolute',
              top: '10%',
              left: SCREEN_WIDTH > 400 ? '5%' : '2%',
              zIndex: 3,
              height: 300,
              width: 150,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 4,
              width: '100%',
              height: '100%',
              flex: 1,
              padding: 20,
              paddingTop: 7,
              flexDirection: 'row',
            }}>
            <View style={{flex: 0.5}}></View>
            <View
              style={{
                flex: 0.5,
                // justifyContent: 'space-between',
                gap: 3,
                alignItems: 'flex-start',
              }}>
              <Text
                numberOfLines={2}
                style={{
                  textAlign: 'center',
                  color: theme.colors.text_white,
                  elevation: 5,
                  fontSize: SCREEN_WIDTH > 400 ? 18 : 16,
                  fontWeight: '700',
                  // lineHeight: SCREEN_WIDTH > 400 ? 20 : 18,
                  textShadowColor: 'rgba(0, 0, 0, 0.50)',
                  textShadowOffset: {width: 2, height: 2},
                  textShadowRadius: 5,
                }}>
                {t('Upgrade to')}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  textAlign: 'center',
                  color: theme.colors.text_white,
                  elevation: 5,
                  fontSize: SCREEN_WIDTH > 400 ? 32 : 29,
                  fontWeight: '700',
                  // lineHeight: SCREEN_WIDTH > 400 ? 42 : 38,
                  textShadowColor: 'rgba(0, 0, 0, 0.50)',
                  textShadowOffset: {width: 2, height: 2},
                  textShadowRadius: 5,
                }}>
                {t('Premium')}
              </Text>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: theme.colors.primary}]}
                onPress={() => {
                  navigation.push('PremiumScreen', {appStart: false});
                }}>
                <Text
                  numberOfLines={2}
                  style={[styles.buttonText, {color: theme.colors.text_white}]}>
                  {t('Try it now')}
                </Text>
                <IconBlink />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              borderRadius: 10, // Set the desired borderRadius here
              overflow: 'hidden', // Ensure the image corners are clipped
            }}>
            <ImageBackground
              source={require('~/resources/images/premium/bgPremium.png')}
              style={{
                flex: 1,
                padding: 10,
                flexDirection: 'row',
              }}></ImageBackground>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  textMenu: {
    color: 'black',
    fontSize: 14,
  },
  itemMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    flexDirection: 'row',
    borderRadius: 10,
    gap: 5,
    paddingHorizontal: 17,
    paddingVertical: 8,
    alignItems: 'center',
    // width: SCREEN_WIDTH * 0.4,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    maxWidth: SCREEN_WIDTH * 0.3,
    textAlign: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#32A05F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 12,
    color: '#6b7280',
  },
  logoutItem: {
    borderColor: '#E51818',
  },
  logoutIcon: {
    fontSize: 18,
  },
});
