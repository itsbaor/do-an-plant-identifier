// nameSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

// Define a type for the slice state
interface startChatState {
  value: boolean;
}

// Define the initial state using that type
const initialState: startChatState = {
  value: false,
};

export const startChatSlice = createSlice({
  name: 'startChat',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setStateStartChat: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const {setStateStartChat} = startChatSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const stateStartChat = (state: RootState) => state.startChat.value;

export default startChatSlice.reducer;
