// nameSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';
import { t_Lang } from '~/@types/language';

// Define a type for the slice state
interface LangState {
  value: t_Lang;
}

// Define the initial state using that type
const initialState: LangState = {
  value: "en",
};

export const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setStateLang: (state, action: PayloadAction<t_Lang>) => {
      state.value = action.payload;
    },
  },
});

export const {setStateLang} = langSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const stateLang = (state: RootState) => state.lang.value;

export default langSlice.reducer;
