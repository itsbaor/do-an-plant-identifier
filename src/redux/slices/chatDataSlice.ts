// nameSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';
import {CHAT, t_Chat} from '~/@types/chat';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CHAT_KEY = '$key_ai_chat';

// Define a type for the slice state
interface ChatState {
  value: t_Chat[];
}

// Define the initial state using that type
const initialState: ChatState = {
  value: [
    {
      type: CHAT.AI,
      content:
        "I'm here to help your plants grow and stay healthy! Struggling with a sick plant? I can diagnose the issue and give you the perfect treatment. No more guesswork - I'll be by your side to revive even the most neglected houseplants.",
    },
  ],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setStateChat: (state, action: PayloadAction<t_Chat[]>) => {
      state.value = action.payload;
      //Save action.payload to AsyncStorage with key CHAT_KEY
      AsyncStorage.setItem(CHAT_KEY, JSON.stringify(action.payload))
        .then(() => console.log('Chat saved to AsyncStorage'))
        .catch(error =>
          console.error('Error saving chat to AsyncStorage', error),
        );
    },
    setAppendChat: (state, action: PayloadAction<t_Chat>) => {
      state.value.push(action.payload);
    },
  },
});

export const {setStateChat} = chatSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const stateChat = (state: RootState) => state.chat.value;

export default chatSlice.reducer;
