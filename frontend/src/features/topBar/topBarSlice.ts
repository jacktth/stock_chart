import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

// Define a type for the slice state
interface topBarState {
    startTutorial: boolean;
}

// Define the initial state using that type
const initialState: topBarState = {
    startTutorial: false,
};

export const topBarSlice = createSlice({
  name: "topBar",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    startTutorial: (state, action: PayloadAction<boolean>) => {
      state.startTutorial = action.payload;
    },
  },
});

export const { startTutorial } = topBarSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectTopBar = (state: RootState) => state.topBar;

export default topBarSlice.reducer;
