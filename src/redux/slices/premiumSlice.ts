// nameSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

// Define a type for the slice state
interface premiumState {
  value: boolean;
}

// Define the initial state using that type
const initialState: premiumState = {
  value: false,
};

export const premiumSlice = createSlice({
  name: 'premium',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setStatePremium: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const {setStatePremium} = premiumSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const statePremium = (state: RootState) => state.premium.value;

export default premiumSlice.reducer;
