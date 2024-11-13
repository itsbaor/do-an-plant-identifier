// nameSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';
import {t_PlantType} from '~/@types/plant';

// Define a type for the slice state
interface plantStorageState {
  value: t_PlantType[];
}

// Define the initial state using that type
const initialState: plantStorageState = {
  value: [],
};

export const plantStorageSlice = createSlice({
  name: 'plantStorage',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setStatePlantStorage: (state, action: PayloadAction<t_PlantType[]>) => {
      state.value = action.payload;
    },
    actionAddPlant: (state, action: PayloadAction<t_PlantType>) => {
      state.value = [action.payload, ...state.value];
    },
  },
});

export const {setStatePlantStorage, actionAddPlant} = plantStorageSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const statePlantStorage = (state: RootState) => state.plantStorage.value;

export default plantStorageSlice.reducer;
