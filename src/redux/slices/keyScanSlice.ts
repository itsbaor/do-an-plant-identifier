// nameSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

// Define a type for the slice state
interface KeyScanState {
  value: string;
}

// Define the initial state using that type
const initialState: KeyScanState = {
  value: 'A43CKAKbQ4zjP6nZtLSKUOggQWGkg2NnhPeKFHSvK4LP5KUBOs',
};

export const keyScanSlice = createSlice({
  name: 'keyScan',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setStateKeyScan: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const {setStateKeyScan} = keyScanSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const stateKeyScan = (state: RootState) => state.keyScan.value;

export default keyScanSlice.reducer;
