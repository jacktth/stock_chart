import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

// Define a type for the slice state
interface authState {
  id?: string;
  createdAt?: string;
  email?: string;
  lastSignInAt?: string;
}

// Define the initial state using that type
const initialState: authState = {
  id: "",
  createdAt: "",
  email: "",
  lastSignInAt: "",
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateAuth: (state, action: PayloadAction<authState>) => {
        const { id,createdAt,email,lastSignInAt} = action.payload
        Object.assign(state, { id,createdAt,email,lastSignInAt} )
    },
  },
});

export const { updateAuth } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
