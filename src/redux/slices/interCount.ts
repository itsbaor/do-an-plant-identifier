// interCountSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

// Define a type for the slice state
interface InterCountState {
  value: number;
}

// Define the initial state using that type
const initialState: InterCountState = {
  value: 0,
};

export const interCountSlice = createSlice({
  name: 'interCount',
  initialState,
  reducers: {
    incrementInterCount: state => {
      state.value += 1;
    },
  },
});

export const {incrementInterCount} = interCountSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const stateInterCount = (state: RootState) => state.interCount.value;

export default interCountSlice.reducer;
