// nameSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

// Define a type for the slice state
interface NameState {
  value: string;
}

// Define the initial state using that type
const initialState: NameState = {
  value: "hihi",
};

export const nameSlice = createSlice({
  name: 'name',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setStateName: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const {setStateName} = nameSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const stateName = (state: RootState) => state.name.value;

export default nameSlice.reducer;
