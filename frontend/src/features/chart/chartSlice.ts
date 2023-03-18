import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

// Define a type for the slice state
interface chartState {
  symbol: string;
  market: string;
  viewing: string;
  focus: Focus;
  selectedData: { starting: number; ending: number };
}

type Focus = {
  min: number | null;
  max: number | null;
};
type SelectedData = {
  starting: number;
  ending: number;
};
// Define the initial state using that type
const initialState: chartState = {
  symbol: "AAPL",
  market: "US",
  viewing: "US market",
  focus: { min: null, max: null },
  selectedData: { starting: 0, ending: 0 },
};

export const chartSlice = createSlice({
  name: "chart",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateSymbol: (state, action: PayloadAction<string>) => {
      const split = action.payload.split(".");
      state.symbol = split[0];
      state.market = split[1];
    },
    updateViewing: (state, action: PayloadAction<string>) => {
      state.viewing = action.payload;
    },
    updateFocus: (state, action: PayloadAction<Focus>) => {
      state.focus = action.payload;
    },
    updateSelectedData: (state, action: PayloadAction<SelectedData>) => {
      state.selectedData = action.payload;
    },
  },
});

export const { updateSymbol, updateViewing, updateFocus,updateSelectedData } = chartSlice.actions;
// export const {updateViewing } = chartSlice.actions
// export const {updateMinMax } = chartSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectSymbol = (state: RootState) => state.chart.symbol;
export const selectMarket = (state: RootState) => state.chart.market;
export const selectViewing = (state: RootState) => state.chart.viewing;
export const selectFocus = (state: RootState) => state.chart.focus;
export const selectSelectedData = (state: RootState) => state.chart.selectedData;


export default chartSlice.reducer;
