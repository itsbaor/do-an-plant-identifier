declare module 'react-native-config' {
  export interface NativeConfig {
    ENVIRONMENT: string;
    API_DIAGNOSE: string;
    API_IDENTIFY: string;
    API_KEY_PLANTID: string;
    API_KEY_GENAI: string;
    AI_MODEL: string;

    ANDROID_INTER_SPLASH: string;
    ANDROID_BANNER_SPLASH: string;
    ANDROID_NATIVE_LANGUAGE: string;
    ANDROID_NATIVE_ONBOARDING: string;
    ANDROID_NATIVE_ONBOARDING_2: string;
    ANDROID_NATIVE_ONBOARDING_3: string;
    ANDROID_BANNER_HOME: string;
    ANDROID_INTER_LIGHT_METER: string;
    ANDROID_INTER_WATER_CACULATOR: string;
    ANDROID_INTER_ADD_PLANT: string;
    ANDROID_NATIVE_CACULATOR: string;
    ANDROID_NATIVE_SEARCH: string;
    ANDROID_NATIVE_REMINDER: string;
    ANDROID_NATIVE_COMMON_PROBLEMS: string;
    ANDROID_NATIVE_AI_PLANT_EXPERT: string;
    ANDROID_REWARD_AI_PLANT_EXPERT: string;
    ANDROID_INTER_SCAN: string;
    ANDROID_INTER_IDENTIFY: string;
    ANDROID_INTER_DIAGNOSE: string;
    ANDROID_APP_OPEN: string;

    IOS_INTER_SPLASH: string;
    IOS_BANNER_SPLASH: string;
    IOS_NATIVE_LANGUAGE: string;
    IOS_NATIVE_ONBOARDING: string;
    IOS_NATIVE_ONBOARDING_2: string;
    IOS_NATIVE_ONBOARDING_3: string;
    IOS_BANNER_HOME: string;
    IOS_INTER_LIGHT_METER: string;
    IOS_INTER_WATER_CACULATOR: string;
    IOS_INTER_ADD_PLANT: string;
    IOS_NATIVE_CACULATOR: string;
    IOS_NATIVE_SEARCH: string;
    IOS_NATIVE_REMINDER: string;
    IOS_NATIVE_COMMON_PROBLEMS: string;
    IOS_NATIVE_AI_PLANT_EXPERT: string;
    IOS_REWARD_AI_PLANT_EXPERT: string;
    IOS_INTER_SCAN: string;
    IOS_INTER_IDENTIFY: string;
    IOS_INTER_DIAGNOSE: string;
    IOS_APP_OPEN: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
