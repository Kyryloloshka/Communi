import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices';
import { searchReducer } from './slices/search';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
  },
});