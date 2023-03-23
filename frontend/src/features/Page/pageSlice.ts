import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

// Define a type for the slice state
interface pageState {
  page: Page;
}

type Page = "chartPage" | "apiPage";

// Define the initial state using that type
const initialState: pageState = {
  page: "chartPage",
};

export const pageSlice = createSlice({
  name: "page",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    changePage: (state, action: PayloadAction<Page>) => {
      state.page = action.payload;
    },
  },
});

export const { changePage } = pageSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPage = (state: RootState) => state.page.page;

export default pageSlice.reducer;
