// routeSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

// Define a type for the slice state
interface RouteState {
  value: string;
}

// Define the initial state using that type
const initialState: RouteState = {
  value: '',
};

export const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setStateRoute: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const {setStateRoute} = routeSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const stateRoute = (state: RootState) => state.route.value;

export default routeSlice.reducer;
