import { configureStore } from '@reduxjs/toolkit'
import chartReducer from '../features/chart/chartSlice'
import authReducer from '../features/auth/authSlice'
import listReducer from '../features/listingBar/listSlice'
import pageReducer from '../features/Page/pageSlice'
import topBarReducer from '../features/topBar/topBarSlice'




export const store = configureStore({
  reducer: {
   chart:chartReducer,
   auth:authReducer,
   list:listReducer,
   page:pageReducer,
   topBar:topBarReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch