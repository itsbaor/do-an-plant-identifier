import {
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {useAppTheme} from '~/resources/theme';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import {useModal} from 'react-native-modalfy';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {statePremium} from '~/redux/slices/premiumSlice';
import IconBack from '~/resources/icons/IconBack';
import {AI_MODEL, docGenAi} from './bottom-tabs/home/HomeScreen';
import {t_Chat, CHAT} from '~/@types/chat';
import {setStateChat, stateChat} from '~/redux/slices/chatDataSlice';
import {setStateStartChat, stateStartChat} from '~/redux/slices/startChatSlice';
import TypewriterText from '~/components/TypeWriterText';
import {DotIndicator} from 'react-native-indicators';
import IconSendMessage from '~/resources/icons/IconSendMessage';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getPromtAi} from '~/resources/prompts';
import {findSmallestKeyValue, incrementMapValue} from './SplashScreen';
import {setStateKeyAi, stateKeyAi} from '~/redux/slices/keyAiSlice';
import {GoogleGenerativeAI} from '@google/generative-ai';
import {ERROR_NOTI_TIME} from './bottom-tabs/ScanScreen';
import {t_Lang} from '~/@types/language';
import {stateLang} from '~/redux/slices/langSlices';
import Config from 'react-native-config';

export const AI_CHAT_STORAGE_KEY = '$ai_chat';

const MAX_TRIAL_CHAT_TIME = 2;

const AI_DENIED: string = '*!*';

const AiChatScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const route = useRoute<RouteProp<RootParamList>>();
  const {openModal, closeModals} = useModal();
  const isPre = useAppSelector(statePremium);
  const g_aiKey = useAppSelector(stateKeyAi);
  const g_lang = useAppSelector(stateLang);
  const isStartChat = useAppSelector(stateStartChat);
  const chatData = useAppSelector(stateChat);
  const [isAskedAi, setIsAskedAi] = useState<boolean>(false);
  const [trialChatTime, setTrialChatTime] =
    useState<number>(MAX_TRIAL_CHAT_TIME);
  const [isAiAnswering, setIsAiAnswering] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);
  const theme = useAppTheme();
  const trans = t(
    `I'm here to help your plants grow and stay healthy! Struggling with a sick plant? I can diagnose the issue and give you the perfect treatment. No more guesswork - I'll be by your side to revive even the most neglected houseplants.`,
  );

  const handleScrollEnd = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 1);
  };

  const getTrialChatTime = async () => {
    try {
      const value = await AsyncStorage.getItem(AI_CHAT_STORAGE_KEY);
      if (value !== null) {
        // The value exists, do something with it
        setTrialChatTime(parseInt(value));
      } else {
        // The value does not exist
        console.log('No value found');
      }
    } catch (e) {
      // Error reading value
      console.error('Failed to retrieve trial chat data from AsyncStorage', e);
    }
  };

  const handleResolveAiAnswer = async (question: string, lang: t_Lang) => {
    setIsAiAnswering(true);
    try {
      // Send question to AI and get response
      // Wait AI resolve answer
      const curKey = Config.API_KEY_GENAI; // Use .env API key directly
      const genAi = new GoogleGenerativeAI(curKey);
      const model = genAi.getGenerativeModel({model: AI_MODEL});
      // Firebase tracking removed - using .env key directly
      const result = await model.generateContent([getPromtAi(lang), question]);
      setIsAiAnswering(false);
      const aiAnswer = result.response.text();
      dispatch(
        setStateChat([
          ...chatData,
          // {type: CHAT.USER, content: question},
          {type: CHAT.AI, content: aiAnswer},
        ]),
      );
      if (!aiAnswer.includes(AI_DENIED) && !isPre) {
        //Chỉ tăng lượt khi câu hỏi liên quan đến caay
        //Tăng lượt khi ko premium
        const increaseTrialTime = trialChatTime - 1;
        setTrialChatTime(increaseTrialTime);
        try {
          await AsyncStorage.setItem(
            AI_CHAT_STORAGE_KEY,
            increaseTrialTime.toString(),
          );
        } catch (error) {
          // Error saving data
          console.error(
            'Failed to save trial chat time to AsyncStorage',
            error,
          );
        }
      }
    } catch (error) {
      setIsAiAnswering(false);
      console.error('Dev defined error in recieving AI response:----', error);
      Notifier.showNotification({
        title: 'Oopss!',
        description: t('Something went wrong! Please try again later.'),
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: 'error',
        },
      });
    }
  };

  const askAiQuestion = async (question: string) => {
    //Close Keyboard
    setIsAskedAi(true);
    Keyboard.dismiss();
    dispatch(setStateChat([...chatData, {type: CHAT.USER, content: question}]));
    //reset input
    setInputValue('');
    scrollViewRef.current?.scrollToEnd({animated: true});
    setIsAiAnswering(true);
    if (!isPre) {
      //Check trial
      if (trialChatTime == 0) {
        setIsAiAnswering(false);
        navigation.push('PremiumScreen', {appStart: false});
        Notifier.showNotification({
          title: 'Oopss!',
          duration: ERROR_NOTI_TIME,
          description: t(
            'You have reached the maximum number of trial chats, please upgrade to premium to get more chat options!',
          ),
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: 'error',
          },
        });
        return;
      } else {
        handleResolveAiAnswer(question, g_lang);
      }
    } else {
      //Resolve for premium
      handleResolveAiAnswer(question, g_lang);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({animated: true});
    return () => {
      setIsAskedAi(false);
    };
  }, []);

  useEffect(() => {
    getTrialChatTime();
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

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      <View
        style={[
          styles.ph_20,
          {
            marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}>
        <TouchableOpacity
          onPress={handleGoBack}>
          <IconBack />
        </TouchableOpacity>
        <Text style={[styles.header, {color: theme.colors.primary_dark}]}>
          {t('AI Plant Expert')}
        </Text>
        <View style={{width: 32}}></View>
      </View>
      <View style={{flex: 1}}>
        {isStartChat ? (
          // Chat Screen
          <View
            style={{
              flex: 1,
              marginBottom: 23,
            }}>
            {/* Chat content */}
            <View
              style={{
                flex: 1,
                marginTop: 23,
                marginBottom: 15,
              }}>
              <ScrollView style={{}} ref={scrollViewRef}>
                {chatData.map((data, index) => (
                  <View key={index} style={{marginHorizontal: 20}}>
                    {data.type === CHAT.AI ? (
                      //Ai
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          gap: 6,
                          paddingRight: 10,
                        }}>
                        <View>
                          <Image
                            style={{width: 40, height: 40}}
                            source={require('~/resources/images/diagnose/askAiExpert.png')}
                          />
                        </View>
                        <View style={{gap: 3, flex: 1, paddingRight: 10}}>
                          <Text
                            style={{
                              fontSize: 18,
                              color: '#000000',
                              fontWeight: '700',
                            }}>
                            {t('AI Plant Expert')}
                          </Text>
                          {index === chatData.length - 1 &&
                          chatData.length > 1 &&
                          isAskedAi ? (
                            <View>
                              <TypewriterText
                                text={data.content}
                                speed={1}
                                onScrollToEnd={handleScrollEnd}
                              />
                            </View>
                          ) : (
                            <Text
                              style={{
                                fontSize: 15,
                                color: '#000000',
                                textAlign: 'left',
                                lineHeight: 18,
                              }}>
                              {t(data.content)}
                            </Text>
                          )}
                        </View>
                      </View>
                    ) : (
                      //User
                      <View
                        style={[
                          {
                            alignItems: 'flex-end',
                            marginBottom: 15,
                            paddingLeft: 15,
                          },
                          index === 1 && {marginTop: 15},
                        ]}>
                        <View
                          style={{
                            backgroundColor: 'rgba(50, 160, 95, 1)',
                            alignItems: 'flex-end',
                            paddingHorizontal: 15,
                            paddingVertical: 8,
                            borderRadius: 5,
                          }}>
                          <Text
                            style={{
                              fontSize: 15,
                              lineHeight: 18,
                              color: '#FFFFFF',
                            }}>
                            {data.content}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                ))}
                {/* Suggesttion */}
                {chatData.length === 1 && (
                  <View style={{marginTop: 16, gap: 7, paddingHorizontal: 20}}>
                    <TouchableOpacity
                      style={[styles.suggestBtn, {}]}
                      onPress={() => {
                        askAiQuestion('Care tips');
                      }}>
                      <Text style={[styles.suggestText, {}]}>
                        {t('Care tips')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.suggestBtn, {}]}
                      onPress={() => {
                        askAiQuestion('When does it flower?');
                      }}>
                      <Text style={[styles.suggestText, {}]}>
                        {t('When does it flower?')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.suggestBtn, {}]}
                      onPress={() => {
                        askAiQuestion('Disease and pest treatment');
                      }}>
                      <Text style={[styles.suggestText, {}]}>
                        {t('Disease and pest treatment')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.suggestBtn, {}]}
                      onPress={() => {
                        askAiQuestion('Recommend an easy-care plant');
                      }}>
                      <Text style={[styles.suggestText, {}]}>
                        {t('Recommend an easy-care plant')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            </View>

            {/* Chat input */}
            <View style={{paddingHorizontal: 20}}>
              {isAiAnswering ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 10,
                    marginBottom: 3,
                  }}>
                  <Text style={{color: 'gray', fontSize: 12}}>
                    {t('AI is answering')}
                  </Text>
                  <View style={[styles.loading]}>
                    <DotIndicator color="gray" count={3} size={5} />
                  </View>
                </View>
              ) : (
                //Premium logic
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 10,
                    marginBottom: 3,
                  }}>
                  {!isPre && (
                    <Text style={{color: 'gray', fontSize: 12}}>
                      {`${t('You have')} ${MAX_TRIAL_CHAT_TIME} ${t(
                        'free questions',
                      )} (${trialChatTime}/${MAX_TRIAL_CHAT_TIME})`}
                    </Text>
                  )}
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: 130,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: 'rgba(75, 109, 78, 0.3)',
                  paddingHorizontal: 18,
                  gap: 5,
                }}>
                <TextInput
                  style={{
                    fontSize: 16,
                    color: '#000000',
                    flex: 1,
                    alignSelf: 'flex-start',
                  }}
                  multiline
                  placeholder={t('Write your question...') as string}
                  placeholderTextColor="rgba(160, 160, 160, 1)"
                  value={inputValue}
                  onChangeText={setInputValue}
                  editable={!isAiAnswering}
                />
                <TouchableOpacity
                  style={{marginTop: 12}}
                  onPress={() => {
                    askAiQuestion(inputValue);
                  }}
                  disabled={!inputValue}>
                  <IconSendMessage opacity={inputValue ? 1 : 0.5} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <Image
              style={{width: 205, height: 205, marginTop: 98}}
              source={require('~/resources/images/diagnose/askAiExpert.png')}
            />
            <Text
              style={{
                fontSize: 18,
                lineHeight: 22,
                fontFamily: 'Inter-Regular',
                color: '#000000',
                marginTop: 35,
              }}>
              {t('Hi! Get a consultation from AI')}
            </Text>
            <TouchableOpacity
              style={{
                paddingVertical: 12,
                paddingHorizontal: 48,
                backgroundColor: theme.colors.primary,
                borderRadius: 5,
                marginTop: 21,
              }}
              onPress={() => {
                dispatch(setStateStartChat(true));
              }}>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: 18,
                  lineHeight: 22,
                  color: '#FFFFFF',
                }}>
                {t('Ask AI')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AiChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
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
  scrollViewStyle: {
    paddingHorizontal: 18,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  suggestBtn: {
    borderColor: 'rgba(75, 109, 78, 1)',
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 9,
  },
  suggestText: {fontSize: 15, color: '#000000', alignSelf: 'center'},
  loading: {paddingTop: 4},
});
