
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { CommonSlice } from './reducers/commonSlice'


const main = combineReducers({
  Common: CommonSlice.reducer,
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