// nameSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

export type t_AdsRemote = {
  isOn: boolean;
  id: string;
};

export type t_AdsRemoteState = {
  BANNER_HOME: t_AdsRemote;
  BANNER_SPLASH: t_AdsRemote;
  INTER_ADD_PLANT: t_AdsRemote;
  INTER_DIAGNOSE: t_AdsRemote;
  INTER_IDENTIFY: t_AdsRemote;
  INTER_LIGHT_METER: t_AdsRemote;
  INTER_SCAN: t_AdsRemote;
  INTER_SPLASH: t_AdsRemote;
  INTER_WATER_CACULATOR: t_AdsRemote;
  NATIVE_AI_PLANT_EXPERT: t_AdsRemote;
  NATIVE_CACULATOR: t_AdsRemote;
  NATIVE_COMMON_PROBLEMS: t_AdsRemote;
  NATIVE_LANGUAGE: t_AdsRemote;
  ONBOARDING_FULL: t_AdsRemote;
  NATIVE_ONBOARDING: t_AdsRemote;
  NATIVE_ONBOARDING_2: t_AdsRemote;
  NATIVE_ONBOARDING_3: t_AdsRemote;
  NATIVE_REMINDER: t_AdsRemote;
  NATIVE_SEARCH: t_AdsRemote;
  REWARD_AI_PLANT_EXPERT: t_AdsRemote;
  APP_OPEN: t_AdsRemote;
  //Ads more
  INTER_PROBLEM: t_AdsRemote;
  REWARD_CACULATOR: t_AdsRemote;
  REWARD_REMINDER: t_AdsRemote;
  REWARD_AI_BACK: t_AdsRemote;
  NATIVE_ITEM_HOME: t_AdsRemote;
  NATIVE_ITEM_CACULATOR: t_AdsRemote;
  NATIVE_ITEM_MY_GARDEN: t_AdsRemote;
  NATIVE_ITEM_REMINDER: t_AdsRemote;
  NATIVE_ITEM_PROBLEM: t_AdsRemote;
  NATIVE_ITEM_EXPLORE: t_AdsRemote;
};

// Define a type for the slice state
interface AdsRemoteState {
  value: t_AdsRemoteState;
}

// Define the initial state using that type
const initialState: AdsRemoteState = {
  value: {
    BANNER_HOME: {isOn: false, id: ''},
    BANNER_SPLASH: {isOn: false, id: ''},
    INTER_ADD_PLANT: {isOn: false, id: ''},
    INTER_DIAGNOSE: {isOn: false, id: ''},
    INTER_IDENTIFY: {isOn: false, id: ''},
    INTER_LIGHT_METER: {isOn: false, id: ''},
    INTER_SCAN: {isOn: false, id: ''},
    INTER_SPLASH: {isOn: false, id: ''},
    INTER_WATER_CACULATOR: {isOn: false, id: ''},
    NATIVE_AI_PLANT_EXPERT: {isOn: false, id: ''},
    NATIVE_CACULATOR: {isOn: false, id: ''},
    NATIVE_COMMON_PROBLEMS: {isOn: false, id: ''},
    NATIVE_LANGUAGE: {isOn: false, id: ''},
    ONBOARDING_FULL: {isOn: false, id: ''},
    NATIVE_ONBOARDING: {isOn: false, id: ''},
    NATIVE_ONBOARDING_2: {isOn: false, id: ''},
    NATIVE_ONBOARDING_3: {isOn: false, id: ''},
    NATIVE_REMINDER: {isOn: false, id: ''},
    NATIVE_SEARCH: {isOn: false, id: ''},
    REWARD_AI_PLANT_EXPERT: {isOn: false, id: ''},
    APP_OPEN: {isOn: false, id: ''},
    //Ads more
    INTER_PROBLEM: {isOn: false, id: ''},
    REWARD_CACULATOR: {isOn: false, id: ''},
    REWARD_REMINDER: {isOn: false, id: ''},
    REWARD_AI_BACK: {isOn: false, id: ''},
    NATIVE_ITEM_HOME: {isOn: false, id: ''},
    NATIVE_ITEM_CACULATOR: {isOn: false, id: ''},
    NATIVE_ITEM_MY_GARDEN: {isOn: false, id: ''},
    NATIVE_ITEM_REMINDER: {isOn: false, id: ''},
    NATIVE_ITEM_PROBLEM: {isOn: false, id: ''},
    NATIVE_ITEM_EXPLORE: {isOn: false, id: ''},
  },
};

export const adsRemoteSlice = createSlice({
  name: 'adsRemote',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setStateAdsRemote: (state, action: PayloadAction<t_AdsRemoteState>) => {
      state.value = {...action.payload};
    },
    setResetStateAdsRemote: state => {
      state.value = {
        BANNER_HOME: {isOn: false, id: ''},
        BANNER_SPLASH: {isOn: false, id: ''},
        INTER_ADD_PLANT: {isOn: false, id: ''},
        INTER_DIAGNOSE: {isOn: false, id: ''},
        INTER_IDENTIFY: {isOn: false, id: ''},
        INTER_LIGHT_METER: {isOn: false, id: ''},
        INTER_SCAN: {isOn: false, id: ''},
        INTER_SPLASH: {isOn: false, id: ''},
        INTER_WATER_CACULATOR: {isOn: false, id: ''},
        NATIVE_AI_PLANT_EXPERT: {isOn: false, id: ''},
        NATIVE_CACULATOR: {isOn: false, id: ''},
        NATIVE_COMMON_PROBLEMS: {isOn: false, id: ''},
        NATIVE_LANGUAGE: {isOn: false, id: ''},
        ONBOARDING_FULL: {isOn: false, id: ''},
        NATIVE_ONBOARDING: {isOn: false, id: ''},
        NATIVE_ONBOARDING_2: {isOn: false, id: ''},
        NATIVE_ONBOARDING_3: {isOn: false, id: ''},
        NATIVE_REMINDER: {isOn: false, id: ''},
        NATIVE_SEARCH: {isOn: false, id: ''},
        REWARD_AI_PLANT_EXPERT: {isOn: false, id: ''},
        APP_OPEN: {isOn: false, id: ''},
        //Ads more
        INTER_PROBLEM: {isOn: false, id: ''},
        REWARD_CACULATOR: {isOn: false, id: ''},
        REWARD_REMINDER: {isOn: false, id: ''},
        REWARD_AI_BACK: {isOn: false, id: ''},
        NATIVE_ITEM_HOME: {isOn: false, id: ''},
        NATIVE_ITEM_CACULATOR: {isOn: false, id: ''},
        NATIVE_ITEM_MY_GARDEN: {isOn: false, id: ''},
        NATIVE_ITEM_REMINDER: {isOn: false, id: ''},
        NATIVE_ITEM_PROBLEM: {isOn: false, id: ''},
        NATIVE_ITEM_EXPLORE: {isOn: false, id: ''},
      };
    },
  },
});

export const {setStateAdsRemote, setResetStateAdsRemote} =
  adsRemoteSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const stateAdsRemote = (state: RootState) => state.adsRemote.value;

export default adsRemoteSlice.reducer;
