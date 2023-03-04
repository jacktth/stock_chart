import { configureStore } from '@reduxjs/toolkit'
import chartReducer from '../features/chart/chartSlice'
import authReducer from '../features/auth/authSlice'


export const store = configureStore({
  reducer: {
   chart:chartReducer,
   auth:authReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch