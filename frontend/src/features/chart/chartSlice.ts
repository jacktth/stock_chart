import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

// Define a type for the slice state
interface chartState {
  symbol: string
  market: string
}

// Define the initial state using that type
const initialState: chartState = {
    symbol: "AAPL",
    market:"US"
}

export const chartSlice = createSlice({
  name: 'chart',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateSymbol: (state,action:PayloadAction<string>) => {
      const split = action.payload.split('.')
      state.symbol = split[0]
      state.market = split[1]
    },
  }
})

export const {updateSymbol } = chartSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectSymbol = (state: RootState) => state.chart.symbol
export const selectMarket = (state: RootState) => state.chart.market


export default chartSlice.reducer