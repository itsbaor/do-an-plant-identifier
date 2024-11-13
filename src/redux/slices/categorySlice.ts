// nameSlice.js
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';
import {
  CATEGORY,
  CYCLE,
  GROWTH,
  SUN,
  t_CategoryChecklist,
  WATERING,
} from '~/@types/category';
import {e_CategoryLabel} from '~/data/categoryData';

export type t_CategoryState = {
  categoryChecklist: t_CategoryChecklist[];
  sun: SUN;
  watering: WATERING;
  growth: GROWTH;
  cycle: CYCLE;
};

// Define a type for the slice state
interface CategoryState {
  value: t_CategoryState;
}

// Define the initial state using that type
const initialState: CategoryState = {
  value: {
    categoryChecklist: [
      {category: e_CategoryLabel.OUTDOOR, isChecked: false},
      {category: e_CategoryLabel.INDOOR, isChecked: false},
      {category: e_CategoryLabel.MEDICINAL, isChecked: false},
      {category: e_CategoryLabel.RARE, isChecked: false},
      {category: e_CategoryLabel.FRUITS, isChecked: false},
      {category: e_CategoryLabel.FLOWERS, isChecked: false},
      {category: e_CategoryLabel.POISONOUS, isChecked: false},
      {category: e_CategoryLabel.EDIBLE, isChecked: false},
    ],
    sun: SUN.NONE,
    cycle: CYCLE.NONE,
    growth: GROWTH.NONE,
    watering: WATERING.NONE,
  },
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setStateCategory: (state, action: PayloadAction<t_CategoryState>) => {
      state.value = {...action.payload};
    },
    setStateCategoryChecklist: (
      state,
      action: PayloadAction<t_CategoryChecklist[]>,
    ) => {
      state.value = {...state.value, categoryChecklist: action.payload};
    },
    setStateCategorySun: (state, action: PayloadAction<SUN>) => {
      state.value = {...state.value, sun: action.payload};
    },
    setStateCategoryWatering: (state, action: PayloadAction<WATERING>) => {
      state.value = {...state.value, watering: action.payload};
    },
    setStateCategoryGrowth: (state, action: PayloadAction<GROWTH>) => {
      state.value = {...state.value, growth: action.payload};
    },
    setStateCategoryCycle: (state, action: PayloadAction<CYCLE>) => {
      state.value = {...state.value, cycle: action.payload};
    },
    setUpdateCategoryChecklist: (
      state,
      action: PayloadAction<{field: e_CategoryLabel; value: boolean}>,
    ) => {
      const updatedCategoryList = state.value.categoryChecklist.map(item =>
        item.category === action.payload.field
          ? {...item, isChecked: action.payload.value}
          : item,
      );
      state.value = {...state.value, categoryChecklist: updatedCategoryList};
    },
    setResetStateCategory: state => {
      state.value = {
        categoryChecklist: [
          {category: e_CategoryLabel.OUTDOOR, isChecked: false},
          {category: e_CategoryLabel.INDOOR, isChecked: false},
          {category: e_CategoryLabel.MEDICINAL, isChecked: false},
          {category: e_CategoryLabel.RARE, isChecked: false},
          {category: e_CategoryLabel.FRUITS, isChecked: false},
          {category: e_CategoryLabel.FLOWERS, isChecked: false},
          {category: e_CategoryLabel.POISONOUS, isChecked: false},
          {category: e_CategoryLabel.EDIBLE, isChecked: false},
        ],
        sun: SUN.NONE,
        cycle: CYCLE.NONE,
        growth: GROWTH.NONE,
        watering: WATERING.NONE,
      };
    },
  },
});

export const {
  setStateCategory,
  setResetStateCategory,
  setStateCategoryChecklist,
  setStateCategorySun,
  setStateCategoryCycle,
  setStateCategoryGrowth,
  setStateCategoryWatering,
  setUpdateCategoryChecklist,
} = categorySlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const stateCategory = (state: RootState) => state.category.value;

export default categorySlice.reducer;
