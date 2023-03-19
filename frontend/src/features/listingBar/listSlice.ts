import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

// Define a type for the slice state
interface listState {
  categories: string[];
  clip: Clip[];
  selectedCategory: string;
}

type Clip = {
  symbol: string;
  starting: number;
  ending: number;
  market: string;
  category: string;
};

export type ResponseCategoriesArray = [
  {
    id: number;
    created_at: string;
    name: string;
    user_Id:string
  }
];

export type ResponseClipArray = {
  id: number;
  created_at: string;
  symbol: string;
  starting: number;
  ending: number;
  user_id: string;
  category: string;
  market: string;
};

// Define the initial state using that type
const initialState: listState = {
  categories: [],
  clip: [],
  selectedCategory:"US market"
};

export const listSlice = createSlice({
  name: "list",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    initClip: (state, action: PayloadAction<ResponseClipArray[]>) => {
      action.payload.forEach((el: ResponseClipArray) => {
        state.clip.push({
          symbol: el.symbol,
          starting: el.starting,
          ending: el.ending,
          category: el.category,
          market: el.market,
        });
      });
    },
    initCategories: (state, action: PayloadAction<ResponseCategoriesArray>) => {
      action.payload.forEach((el) => {
        state.categories.push(el.name);
      });
    },
    addCategories: (state, action: PayloadAction<string>) => {
      return { ...state, categories: [...state.categories, action.payload] };
    },
    removeCategories: (state, action: PayloadAction<string>) => {
      const newCategories = [...state.categories].filter(
        (c) => c !== action.payload
      );
      return { ...state, categories: newCategories };
    },
    addClip: (state, action: PayloadAction<Clip>) => {
      state.clip.push(action.payload)
    },
    changeCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
    },
  },
});

export const {
  addCategories,
  removeCategories,
  addClip,
  initCategories,
  initClip,
  changeCategory
} = listSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectClip = (state: RootState) => state.list.clip;
export const selectCategories = (state: RootState) => state.list.categories;
export const selectedCategory = (state: RootState) => state.list.selectedCategory;

export default listSlice.reducer;
