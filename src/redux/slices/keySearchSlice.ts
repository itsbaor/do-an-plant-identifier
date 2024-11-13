// nameSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

// Define a type for the slice state
interface KeySearchState {
  value: string;
}

// Define the initial state using that type
const initialState: KeySearchState = {
  value: 'AIzaSyDYPlxUycdl_ilszVkur9HtpAMQDLkKo-A',
};

export const keySearchSlice = createSlice({
  name: 'keySearch',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setStateKeySearch: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const {setStateKeySearch} = keySearchSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const stateKeySearch = (state: RootState) => state.keySearch.value;

export default keySearchSlice.reducer;
