// nameSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

export enum e_Task {
  NONE = '',
  WATERING = 'Watering',
  FERTILIZING = 'Fertilizing',
}
export enum e_Repeat {
  NONE = '',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
}
export type t_Reminder = {
  plantName: string;
  plantImage: string | NodeRequire;
  task: e_Task;
  repeat: e_Repeat;
  timeRepeate: string;
  createDate: string;
};

// Define a type for the slice state
interface reminderState {
  value: t_Reminder;
}

// Define the initial state using that type
const initialState: reminderState = {
  value: {
    plantName: '',
    plantImage: '',
    task: e_Task.NONE,
    repeat: e_Repeat.NONE,
    timeRepeate: '00:00:00',
    createDate: '',
  },
};

export const reminderSlice = createSlice({
  name: 'reminder',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setStateReminder: (state, action: PayloadAction<t_Reminder>) => {
      state.value = action.payload;
    },
    actionResetReminder: (state, action: PayloadAction<void>) => {
      state.value = {
        plantName: '',
        plantImage: '',
        task: e_Task.NONE,
        repeat: e_Repeat.NONE,
        timeRepeate: '00:00:00',
        createDate: '',
      };
    },
  },
});

export const {setStateReminder, actionResetReminder} = reminderSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const stateReminder = (state: RootState) => state.reminder.value;

export default reminderSlice.reducer;
