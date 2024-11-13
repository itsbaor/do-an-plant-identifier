// nameSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

// Define a type for the slice state
interface AdsOpenState {
  value: boolean;
}

// Define the initial state using that type
const initialState: AdsOpenState = {
  value: false,
};

export const adsOpenSlice = createSlice({
  name: 'adsOpen',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setStateAdsOpen: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const {setStateAdsOpen} = adsOpenSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const stateAdsOpen = (state: RootState) => state.adsOpen.value;

export default adsOpenSlice.reducer;
