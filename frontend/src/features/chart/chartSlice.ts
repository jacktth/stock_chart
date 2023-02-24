import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

// Define a type for the slice state
interface chartState {
  symbol: string
}

// Define the initial state using that type
const initialState: chartState = {
    symbol: "AAPLa"
}

export const chartSlice = createSlice({
  name: 'chart',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateSymbol: (state,action:PayloadAction<string>) => {
      state.symbol = action.payload
    },
  }
})

export const {updateSymbol } = chartSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectSymbol = (state: RootState) => state.chart.symbol

export default chartSlice.reducer