
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { CommonSlice } from './reducers/commonSlice'
import { AdminSlice } from './reducers/AdminSlice'


const main = combineReducers({
  Common: CommonSlice.reducer,
  Admin: AdminSlice.reducer
})

export default configureStore({
  reducer: {
    main: main,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  }),
})