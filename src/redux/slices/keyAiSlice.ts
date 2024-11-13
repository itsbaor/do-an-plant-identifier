// nameSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

// Define a type for the slice state
interface KeyAiState {
  value: string;
}

// Define the initial state using that type
const initialState: KeyAiState = {
  value: 'AIzaSyAyyFtLkv3DJtprYnuejtlYe2qAkJCm8wE',
};

export const keyAiSlice = createSlice({
  name: 'keyAi',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setStateKeyAi: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const {setStateKeyAi} = keyAiSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const stateKeyAi = (state: RootState) => state.keyAi.value;

export default keyAiSlice.reducer;
