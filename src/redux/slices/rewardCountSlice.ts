// rewardCountSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

// Define a type for the slice state
interface RewardCountState {
  value: number;
}

// Define the initial state using that type
const initialState: RewardCountState = {
  value: 2,
};

export const rewardCountSlice = createSlice({
  name: 'rewardCount',
  initialState,
  reducers: {
    incrementRewardCount: state => {
      state.value += 1;
    },
  },
});

export const {incrementRewardCount} = rewardCountSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const stateRewardCount = (state: RootState) => state.rewardCount.value;

export default rewardCountSlice.reducer;
