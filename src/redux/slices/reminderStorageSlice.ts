// nameSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';
import {t_Reminder} from './reminderSlice';

// Define a type for the slice state
interface reminderStorageState {
  value: t_Reminder[];
}

// Define the initial state using that type
const initialState: reminderStorageState = {
  value: [],
};

export const reminderStorageSlice = createSlice({
  name: 'reminderStorage',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setStateReminderStorage: (state, action: PayloadAction<t_Reminder[]>) => {
      state.value = action.payload;
    },
    actionAddReminderToStorage: (state, action: PayloadAction<t_Reminder>) => {
      state.value = [action.payload, ...state.value];
    },
  },
});

export const {setStateReminderStorage, actionAddReminderToStorage} =
  reminderStorageSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const stateReminderStorage = (state: RootState) =>
  state.reminderStorage.value;

export default reminderStorageSlice.reducer;
